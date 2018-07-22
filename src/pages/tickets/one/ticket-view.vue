<template>
  <scroll-view class="page ticket-view">
    <div v-if="ticket" class="ticket-info-container background-image-container">
      <image class="background-image" :src="typeBackgroundImageUrl" mode="widthFix" />
      <div class="info-white-background"></div>
      <div class="background-image-content ticket-info">
        <div class="text large">{{ticket.gradeType}}</div>
        <div>(价值 <cash :amount="ticket.price" /> 元)</div>
        <image v-if="ticket.buyer" class="buyer-avatar" :src="ticket.buyer.wechatAvatar" />
        <div v-if="ticket.buyer" class="buyer-name text default small">{{ticket.buyer.name}} 花钱请你一起参加</div>
        <div v-if="ticket.meeting" class="meeting-topic text primary centered">
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
import { isAuthing, waitForAuth } from '@/methods/auth';

import goToShareResult from '@/pages/tickets/share-result/goToShareResult';
import goToCheckTicket from '@/pages/tickets/one/check/goToCheckTicket';
import goToAcquireTicket from '@/pages/tickets/one/acquire/goToAcquireTicket';
import buildTicketShareOptions from '@/methods/buildTicketShareOptions';

import promptAcquireFail from './acquire/promptAcquireFail';
import isTicketViewable from './isTicketViewable';

export default {
  data() {
    return {
      ticket: null,
      query: {},
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
  async onShow() {
    if (isAuthing()) {
      await waitForAuth();
    }

    const query = this.$root.$mp.query;

    const ticketId = this.$root.$mp.query.id || 1079;
    const meetingId = this.$root.$mp.query.meetingId || 3;

    // 如果这个门票对当前用户不可见, 则跳转到门票领取页面
    if (query.buyerId && !isTicketViewable(query, this.currentUser)) {
      goToAcquireTicket(query);
      return;
    }

    try {
      this.ticket = await getTicket(ticketId);
    } catch (e) {
      if (e.statusCode === 403) {
        promptAcquireFail(meetingId, {
          content: '您已经拥有一张此会议的门票',
        });
      } else {
        promptAcquireFail(meetingId);
      }
      return;
    }

    this.setRuntime({ sharedTicket: this.ticket });
  },
  onShareAppMessage() {
    return buildTicketShareOptions({
      user: this.currentUser,
      ticket: this.ticket,
      success: goToShareResult,
    });
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
