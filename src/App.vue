<script>
import { wxRequest } from '@/apis';
import { getAuthHeader } from '@/methods/auth';
import getCurrentUser from '@/methods/getCurrentUser';
import store from './store';

wxRequest.setOptions({ getAuthHeader });

const promptAuthenticateError = error => wx.showModal({
  title: '无法认证用户信息',
  content: `${error.statusCode}: ${error.message}`,
  showCancel: false,
  success(res) {
    if (res.confirm) {
      console.info('user clicked confirm');
    }
  },
});

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
        promptAuthenticateError(e);
      }
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
