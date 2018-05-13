<template>
  <scroll-view class="page share-result">
    <div class="container">
      <div class="section ticket-section">
        <ticket-item :ticket="sharedTicket" />
        <div class="result-desc text large success">已赠送</div>
      </div>
      <div class="section actions">
        <button class="primary" @click="onFinish">完成</button>
        <button class="primary" @click="onContinue">继续送票</button>
      </div>
    </div>
  </scroll-view>
</template>

<script>
import { mapState } from 'vuex';
import TicketItem from '@/components/TicketItem';
import goToPersonalCenter from '@/pages/users/me/goToPersonalCenter';

export default {
  computed: mapState('runtime', ['sharedTicket']),
  methods: {
    onFinish: goToPersonalCenter,
    onContinue() {
      wx.navigateBack();
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

  .actions {
    display: flex;
  }
}
</style>
