<script>
import { wxRequest, userCurrentGet, tokensPost } from '@/apis';
import { example as userExample } from '@/apis/users/current';
import store from './store';

wxRequest.setOptions({
  getAuthHeader: () => ({
    Authorization: `Bearer ${wx.getStorageSync('access_token')}`,
  }),
});

const setAccessToken = accessToken => wx.setStorageSync('access_token', accessToken);

const checkSession = () => new Promise((resolve, reject) => {
  console.info('checkSession start');
  wx.checkSession({
    success: () => {
      console.info('checkSession success');
      resolve();
    },
    fail: () => {
      console.info('checkSession fail');
      reject();
    },
  });
});

const loginToWechat = () => new Promise((resolve, reject) => {
  console.info('login start');
  wx.login({
    success: ({ code }) => {
      console.info('login success', code);
      resolve(code);
    },
    fail() {
      console.info('login fail');
      reject();
    },
  });
});

const getCurrentUser = async () => {
  try {
    await checkSession();
    const user = await wxRequest(userCurrentGet());
    return user;
  } catch (e) {
    const wechatCode = await loginToWechat();
    const {
      access_token: accessToken = 'mock_access_token_never_expires',
    } = await wxRequest(tokensPost({ wechatCode }));

    console.info('TODO: use real accessToken instead');

    setAccessToken(accessToken);
    return wxRequest(userCurrentGet());
  }
};

export default {
  store,
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    async getCurrentUser() {
      console.info('getCurrentUser start');
      try {
        const user = await getCurrentUser();
        console.info('getCurrentUser succeed', user);
        this.$store.commit('setCurrentUser', user);
      } catch (e) {
        if (e.errMsg === 'request:fail url not in domain list') {
          console.info('getCurrentUser succeed', userExample);
          this.$store.commit('setCurrentUser', userExample);
          return;
        }
        console.error('getCurrentUser fail', e);
        wx.showModal({
          title: '网络异常',
          content: '无法登录',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.info('user clicked confirm');
            }
          },
        });
      }
    },
    getUserInfo() {
      console.info('getUserInfo start');
      wx.getUserInfo({
        success: (res) => {
          console.info('getUserInfo success');
          this.$store.commit('setUserInfo', res.userInfo);
        },
        fail(error) {
          console.info('getUserInfo fail', error);
          wx.openSetting();
        },
      });
    },
  },
  created() {
    console.info('app created');
    this.getCurrentUser();
  },
};
</script>

<style>
</style>
