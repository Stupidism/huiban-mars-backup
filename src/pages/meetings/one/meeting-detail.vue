<template>
  <web-view :src="meetingPageUrl">
  </web-view>
</template>

<script>
import getMeeting from '@/methods/getMeeting';

export default {
  data() {
    return {
      meeting: [],
      id: 1,
    };
  },
  computed: {
    meetingPageUrl() {
      return `http://localhost:9370/page/3#/page/${this.id}`;
    },
  },
  methods: {
  },
  async onShow() {
    this.id = this.$root.$mp.query.id || 1;
    this.meeting = await getMeeting(this.id);
  },
};
</script>
