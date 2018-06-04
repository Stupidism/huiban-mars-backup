<template>
  <div
    class="ticket-row section-single-line"
    :class="{disabled: ticket.status === 'has_participant'}"
  >
    <div class="ticket-row-content">
      <div class="ticket-info">
        <image class="icon small ticket-info-icon" :src="ticketGradeIcon" />
        {{ticket.gradeType}} 价值 <cash :amount="ticket.price" />
      </div>
    </div>
    <div>
      <button v-if="ticket.status === 'no_participant'" class="small bordered" @click="goToView">赠送</button>
      <div v-else>
        {{ticket.participant && ticket.participant.name}}已领取
      </div>
    </div>
  </div>
</template>

<script>
import MyOwnTicketRow from './MyOwnTicketRow';

export default {
  extends: MyOwnTicketRow,
};
</script>

<style lang="less">
</style>
