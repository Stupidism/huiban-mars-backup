import urlParse from 'url-parse';
import qs from 'qs';
import { mapState, mapMutations } from 'vuex';

import { isAuthing, waitForAuth } from '@/methods/auth';
import goToAcquireTicket from '@/pages/tickets/one/acquire/goToAcquireTicket';
import isTicketViewable from '@/pages/tickets/one/isTicketViewable';

export default {
  computed: {
    ...mapState(['currentUser']),
    ...mapState('runtime', ['nextType', 'nextPage']),
  },
  methods: {
    ...mapMutations('runtime', ['setRuntime']),
    async handleViewOrAcquireTicket(nextPage) {
      if (isAuthing()) {
        await waitForAuth();
      }

      const url = urlParse(nextPage);
      const ticketInfo = qs.parse(url.query, {
        ignoreQueryPrefix: true,
      });

      if (!isTicketViewable(ticketInfo, this.currentUser)) {
        goToAcquireTicket(ticketInfo);
        return;
      }
      wx.navigateTo({
        url: nextPage,
      });
    },
    async handleNextPage(nextType, nextPage) {
      if (nextType === 'view_or_acquire_ticket') {
        this.handleViewOrAcquireTicket(nextPage);
      }

      if (nextType === 'immediate') {
        wx.navigateTo({
          url: nextPage,
        });
      }
    },
  },
  onLoad() {
    const query = this.$root.$mp.query;
    if (query.nextPage) {
      this.handleNextPage(query.nextType, decodeURIComponent(query.nextPage));
    } else if (this.nextType) {
      this.handleNextPage(this.nextType, this.nextPage);
      this.setRuntime({ nextType: 'handled' });
    }
  },
};
