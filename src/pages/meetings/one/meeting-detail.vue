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
      return `https://imeetingu.com/phobos/#/page/${this.id}`;
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
