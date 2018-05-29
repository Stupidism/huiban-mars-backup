<script>
import { wxRequest } from '@/apis';
import { getAuthHeader } from '@/methods/auth';
import getCurrentUser from '@/methods/getCurrentUser';
import store from './store';

wxRequest.setOptions({ getAuthHeader });

export default {
  store,
  methods: {
    async getCurrentUser() {
      console.info('getCurrentUser start');
      try {
        const user = await getCurrentUser();
        console.info('getCurrentUser succeed', user);
        this.$store.commit('setCurrentUser', user);
      } catch (e) {
        console.error('getCurrentUser fail', e);
      }
    },
    getUserInfo() {
      console.info('getUserInfo start');
      wx.getUserInfo({
        success: (res) => {
          console.info('getUserInfo success', res.userInfo);
          this.$store.commit('setWechatUserInfo', res.userInfo);
        },
        fail(error) {
          console.info('getUserInfo fail', error);
        },
      });
    },
  },
  created() {
    console.info('app created');
    this.getCurrentUser();
    this.getUserInfo();
  },
};
</script>

<style>
</style>
