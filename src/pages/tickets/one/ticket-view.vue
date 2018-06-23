<template>
  <scroll-view class="page ticket-view">
    <div v-if="ticket" class="ticket-info-container background-image-container">
      <image class="background-image" :src="typeBackgroundImageUrl" mode="widthFix" />
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
    <div class="footer">
      <button
        class="large check-ticket-btn"
        @click="goToCheckTicket(ticket.id)"
        :disabled="isParticipantSomeoneElse"
      >
        验票
      </button>
      <button
        v-if="ticket && !ticket.participantId"
        class="primary large share-with-friend-btn"
        open-type="share"
      >
        赠送朋友
      </button>
    </div>
  </scroll-view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import Cash from '@/modules/Cash';
import getTicket from '@/methods/getTicket';

import goToShareResult from '@/pages/tickets/share-result/goToShareResult';
import goToCheckTicket from '@/pages/tickets/one/check/goToCheckTicket';
import goToAcquireTicket from '@/pages/tickets/one/acquire/goToAcquireTicket';
import goToPersonalCenter from '@/pages/users/me/goToPersonalCenter';

export default {
  data() {
    return {
      ticket: null,
    };
  },
  computed: {
    isParticipantSomeoneElse() {
      return this.ticket &&
        this.currentUser &&
        this.ticket.participantId &&
        this.ticket.participantId !== this.currentUser.id;
    },
    typeBackgroundImageUrl() {
      return this.ticket &&
        `/static/ticket/${this.ticket.gradeTypeColor || 'blue'}-large.png`;
    },
    ...mapGetters(['currentUser']),
  },
  methods: {
    goToCheckTicket,
    ...mapMutations('runtime', ['setRuntime']),
  },
  components: {
    Cash,
  },
  async mounted() {
    const ticketId = this.$root.$mp.query.id || 1;
    const currentUserId = this.currentUser.id;
    // 如果没登录, 跳到领取页面
    if (!currentUserId) {
      goToAcquireTicket(ticketId);
      return;
    }

    try {
      const ticket = await getTicket(ticketId);

      // 如果非购买者本人且没有参会人, 跳到领取页面
      if (ticket.buyerId !== this.currentUser.id) {
        if (!ticket.participantId) {
          goToAcquireTicket(ticketId);
          return;
        }
      }

      this.ticket = ticket;
    } catch (e) {
      goToPersonalCenter();
      wx.openModal({
        title: '对不起,您无权访问此门票',
      });
      return;
    }

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
.ticket-view {
  height: 100vh;
  min-height: 0;
  padding: 0;

  .ticket-info-container {
    width: calc(100% - 100px);
    height: 400px;
    margin: 50px;

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

  .check-ticket-btn {
    flex: 1;
  }

  .share-with-friend-btn {
    width: calc(100% - 150px);
  }
}
</style>