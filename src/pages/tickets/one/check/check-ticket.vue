<template>
  <scroll-view class="page check-ticket">
    <div v-if="ticket" class="ticket-info-container container">
      <div v-if="ticket.meeting" class="meeting-topic text default centered">
        <div>{{ticket.meeting.topic}}</div>
        <div>主讲人: {{ticket.meeting.mainSpeaker}}</div>
      </div>
      <image class="adminssion-qr-code" :src="ticket.adminssionQrCode" mode="aspectFit" />
      <div class="ticket-grade-info background-image-container">
        <image class="background-image" :src="typeLaceImageUrl" mode="aspectFit" />
        <div class="background-image-content flex aligned justified-centered">
          <div class="text">{{ticket.gradeType}}价值 <cash :amount="ticket.price" /> 元</div>
        </div>
      </div>
      <image class="slogan" src="/static/ticket/slogan.png" mode="aspectFit" />
    </div>
  </scroll-view>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';

import Cash from '@/modules/Cash';
import getTicket from '@/methods/getTicket';

import goToShareResult from '@/pages/tickets/share-result/goToShareResult';

export default {
  data() {
    return {
      ticket: null,
    };
  },
  computed: {
    typeLaceImageUrl() {
      return this.ticket &&
        `/static/ticket/lace-${this.ticket.gradeTypeColor || 'blue'}.png`;
    },
    ...mapGetters(['currentUser']),
  },
  methods: {
    ...mapMutations('runtime', ['setRuntime']),
  },
  components: {
    Cash,
  },
  async onShow() {
    this.ticket = await getTicket(this.$root.$mp.query.id || 1);
    this.setRuntime({ sharedTicket: this.ticket });
  },
  onShareAppMessage() {
    return {
      success: goToShareResult,
      fail(error) {
        // 转发失败
        console.error('share failed', error);
      },
    };
  },
};
</script>

<style scoped lang="less">
.check-ticket {
  height: 100vh;
  min-height: 0;
  padding: 0;

  .ticket-info-container {
    width: calc(100% - 130px);
    height: 320px;
    margin: 50px;
    padding: 20px 15px;
    border-radius: 5px;

    display: flex;
    flex-direction: column;
    align-items: center;

    .adminssion-qr-code {
      margin-top: 20px;
      width: 160px;
      height: 160px;
    }

    .ticket-grade-info {
      margin-top: 20px;
      width: calc(100% + 50px);
      height: 40px;

      image.background-image {
        background: transparent;
      }
    }

    .slogan {
      margin-top: 17px;
      height: 30px;
    }
  }
}
</style>
