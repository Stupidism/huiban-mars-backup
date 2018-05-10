<template>
  <scroll-view class="page">
    <div class="container">
      <meeting-card v-if="meeting"  :meeting="meeting" />
      <div v-if="ticket" class="section-single-line">
        <div class="flex aligned text warning">
          {{buyer && buyer.name}}送您 {{ticket.gradeType}}1张，价值 <cash :amount="ticket.price" /> 元
        </div>
      </div>
    </div>
  </scroll-view>
</template>
<script>
import MeetingCard from '@/components/MeetingCard';
import Cash from '@/modules/Cash';

import getTicket from '@/methods/getTicket';

export default {
  data() {
    return {
      ticket: null,
    };
  },
  computed: {
    meeting() {
      return this.ticket && this.ticket.meeting;
    },
    buyer() {
      return this.ticket && this.ticket.buyer;
    },
  },
  components: {
    MeetingCard,
    Cash,
  },
  async mounted() {
    this.ticket = await getTicket(this.$root.$mp.query.id || 1);
  },
};
</script>

<style scoped lang="less">

</style>
