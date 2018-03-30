<script>
import store from './store';

export default {
  store,
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    checkSession() {
      console.info('checkSession start');
      wx.checkSession({
        success: () => {
          console.info('checkSession success');
          this.getUserInfo();
        },
        fail: () => {
          console.info('checkSession fail');
          this.login();
        },
      });
    },

    login() {
      console.info('login start');
      wx.login({
        success: ({ code }) => {
          console.info('login success', code);
          this.getUserInfo();
        },
        fail() {
          console.info('login fail');
        },
      });
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
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    console.info('app created');
    this.checkSession();
  },
};
</script>

<style>
</style>
