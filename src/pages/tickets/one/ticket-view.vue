<template>
  <scroll-view class="page ticket-view">
    <div v-if="ticket" class="ticket-info-container background-image-container">
      <image class="background-image" :src="typeImageUrl" mode="widthFix" />
      <div class="info-white-background"></div>
      <div class="background-image-content ticket-info">
        <div class="text large">{{ticket.gradeType}}</div>
        <div>(价值 <cash :amount="ticket.price" /> 元)</div>
        <image class="buyer-avatar" :src="ticket.buyer.wechatAvatar" />
        <div class="buyer-name text default small">{{ticket.buyer.name}} 花钱请你一起参加</div>
        <div class="meeting-topic text primary centered">
          <div>{{ticket.meeting.topic}}</div>
          <div>主讲人: {{ticket.meeting.mainSpeaker}}</div>
        </div>
        <image class="invitation-card" :src="ticket.invitationCardImg" mode="aspectFit" />
        <div class="invitation-card-helper-text text secondary centered">
          <div>长按识别二维码领取门票</div>
          <div>和小伙伴结伴参会</div>
        </div>
        <div class="invitation-card-security-hint text primary">此二维码已安全认证，可以放心扫码</div>
        <image class="logo-and-slogan" src="/static/ticket/logo-and-slogan-white.png" mode="aspectFit" />
      </div>
    </div>
  </scroll-view>
</template>

<script>
import { mapGetters } from 'vuex';

import Cash from '@/modules/Cash';
import getTicket from '@/methods/getTicket';

export default {
  data() {
    return {
      ticket: null,
    };
  },
  computed: {
    typeImageUrl() {
      return this.ticket &&
        `/static/ticket/${this.ticket.gradeTypeColor || 'blue'}-large.png`;
    },
    ...mapGetters(['currentUser']),
  },
  methods: {
  },
  components: {
    Cash,
  },
  async mounted() {
    this.ticket = await getTicket(this.$root.$mp.query.id || 1);
  },
};
</script>

<style scoped lang="less">
.ticket-view {
  height: calc(100vh - 100px);
  min-height: 0;
  padding: 50px;

  .ticket-info-container {
    width: 100%;
    height: 400px;

    .info-white-background {
      position: absolute;
      top: 105px;
      left: 15px;
      right: 15px;
      height: 250px;

      background: white;
      border-radius: 5px;
    }

    .ticket-info {
      padding: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .buyer-avatar {
        margin-top: 15px;
        width: 50px;
        height: 50px;
        border-radius: 25px;
      }

      .buyer-name,
      .meeting-topic {
        margin-top: 10px;
      }

      .invitation-card {
        margin-top: 10px;
        width: 70px;
        height: 70px;
      }

      .invitation-card-helper-text {
        margin-top: 6px;
      }

      .invitation-card-security-hint {
        margin-top: 4px;
      }

      .logo-and-slogan {
        margin-top: 19px;
        height: 20px;
      }

    }
  }
}
</style>
