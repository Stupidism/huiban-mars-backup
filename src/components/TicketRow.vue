<template>
  <div class="ticket-row section-single-line">
    <div class="ticket-row-content">
      <div class="ticket-info">
        <image class="icon small ticket-info-icon" :src="ticketGradeIcon" />
        {{ticket.gradeType}} 价值 <cash :amount="ticket.price" />
      </div>
      <div v-if="!showShareInfo" class="participate-info">
        <div v-if="participatedBySelf">
          <div v-if="boughtBySelf" class="warning">本人参会</div>
          <div v-else="boughtBySelf">接受{{ticket.buyerName}}邀请参加</div>
        </div>
        <div v-else>
          <div v-if="ticket.status === 'has_participant'">{{ticket.participantName}}已确认参加</div>
          <div v-else>本人购买</div>
        </div>
      </div>
    </div>
    <div v-if="ticket.showShareInfo">
      <button v-if="ticket.status === 'has_participant'" class="small">赠送</button>
    </div>
    <div v-else>
      <button v-if="ticket.status === 'no_participant'" class="primary small">确认参会</button>
      <button v-else-if="participatedBySelf" class="warning small">检票</button>
      <button v-else :style="{background: '#C4C8CC'}" class="primary small">确认参会</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Cash from '@/modules/Cash';

export default {
  props: {
    ticket: {},
    showShareInfo: {
      type: Boolean,
    },
  },
  computed: {
    ticketGradeIcon() {
      return `/static/icons/ticket-grade/${this.ticket.gradeTypeColor}.png`;
    },
    boughtBySelf() {
      return this.ticket.buyerId === this.currentUser.id;
    },
    participatedBySelf() {
      return this.ticket.participantId === this.currentUser.id;
    },
    ...mapState(['currentUser']),
  },
  components: { Cash },
};
</script>

<style lang="less">
.ticket-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

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

  .ticket-action {

  }
}
</style>
