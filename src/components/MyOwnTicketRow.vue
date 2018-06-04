<template>
  <div class="ticket-row section-single-line">
    <div class="ticket-row-content">
      <div class="ticket-info">
        <image class="icon small ticket-info-icon" :src="ticketGradeIcon" />
        {{ticket.gradeType}} 价值 <cash :amount="ticket.price" />
      </div>
      <div class="participate-info">
        <div v-if="isParticipantSelf" class="warning">
          <div v-if="boughtBySelf">本人参会</div>
          <div v-else>接受{{ticket.buyer && ticket.buyer.name}}邀请参加</div>
        </div>
        <div v-else>
          <div v-if="ticket.status === 'has_participant'">
            {{ticket.participant && ticket.participant.name}}已确认参加
          </div>
          <div v-else>本人购买</div>
        </div>
      </div>
    </div>
    <div v-if="selfParticipatingMeeting">
      <button v-if="isParticipantSelf" class="warning small"  @click="goToCheck">验票</button>
      <button v-else-if="ticket.status === 'no_participant'" class="bordered small" @click="goToView">赠送</button>
      <button v-else :style="{background: '#C4C8CC', color: 'white'}" disabled class="small">赠送</button>
    </div>
    <div class="flex" v-else>
      <button v-if="ticket.status === 'no_participant'" class="small primary" @click="">确认参会</button>
      <button v-if="ticket.status === 'no_participant'" class="small bordered share-btn" @click="goToView">赠送</button>
      <button v-else :style="{background: '#C4C8CC', color: 'white'}" disabled class="small">赠送</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Cash from '@/modules/Cash';

import goToCheckTicket from '@/pages/tickets/one/check/goToCheckTicket';
import goToTicketView from '@/pages/tickets/one/goToTicketView';

export default {
  props: {
    ticket: {},
    selfParticipatingMeeting: Boolean,
  },
  computed: {
    ticketGradeIcon() {
      return `/static/icons/ticket-grade/${this.ticket.gradeTypeColor || 'blue'}.png`;
    },
    boughtBySelf() {
      return this.currentUser.id && this.ticket.buyerId === this.currentUser.id;
    },
    isParticipantSelf() {
      return this.currentUser.id && this.ticket.participantId === this.currentUser.id;
    },
    ...mapState(['currentUser']),
  },
  methods: {
    goToView() {
      goToTicketView(this.ticket.id);
    },
    goToCheck() {
      goToCheckTicket(this.ticket.id);
    },
  },
  components: { Cash },
};
</script>

<style lang="less">
.ticket-row {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.disabled::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.6);
    z-index: 1;
  }

  .ticket-row-content {
    flex: 1;

    .ticket-info {
      display: flex;
      align-items: center;

      .ticket-info-icon {
        margin-right: 10px;
      }
    }

    .participate-info {
      font-size: 12px;
      color: #8A9299;
      margin-left: 25px;
    }
  }

  .share-btn {
    margin-left: 10px;
  }
}
</style>
