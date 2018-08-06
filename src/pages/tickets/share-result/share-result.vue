<template>
  <scroll-view class="page share-result">
    <div class="container">
      <div class="section ticket-section">
        <ticket-item :ticket="sharedTicket" />
        <div class="result-desc text large success">已赠送</div>
      </div>
      <div class="action-buttons section flex justified">
        <button class="primary" @click="onFinish">完成</button>
        <button class="primary" @click="onContinue">继续送票</button>
      </div>
    </div>
  </scroll-view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import buildUrl from 'build-url';

import TicketItem from '@/components/TicketItem';
import goToPersonalCenter from '@/pages/users/me/goToPersonalCenter';
import goToRecentMeetings from '@/pages/meetings/goToRecentMeetings';

export default {
  computed: mapState('runtime', ['sharedTicket']),
  methods: {
    ...mapMutations('runtime', ['setRuntime']),
    onFinish: goToPersonalCenter,
    onContinue() {
      this.setRuntime({
        nextType: 'immediate',
        nextPage: buildUrl({
          path: '/pages/meetings/one/tickets/main',
          queryParams: {
            orderId: this.sharedTicket.orderId,
          },
        }),
      });
      goToRecentMeetings();
    },
  },
  components: {
    TicketItem,
  },
};
</script>

<style scoped lang="less">
.share-result {
  .ticket-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px;

    .result-desc {
      margin-top: 20px;
    }
  }

  .action-buttons {
    padding-left: 30px;
    padding-right: 30px;
  }
}
</style>
