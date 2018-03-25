import { wxRequest, meetingGet } from '@/apis';
import { example as meetingExample } from '@/apis/meetings/getOne';

export default {
  methods: {
    async getMeeting(id) {
      try {
        this.meeting = meetingExample;
        const res = await wxRequest(meetingGet(id));
        this.meeting = res.meeting || res;
      } catch (e) {
        if (e.errMsg === 'request:fail url not in domain list') {
          this.meeting = meetingExample;
        } else {
          throw e;
        }
      }
    },
  }
};