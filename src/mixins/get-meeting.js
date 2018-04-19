import { wxRequest, meetingGet } from '@/apis';
import { example as meetingExample } from '@/apis/meetings/get';

const colors = ['blue', 'green', 'orange', 'purple', 'black'];

const addTypeColorForTicketGrades = ticketGrades => ticketGrades.map(
  (ticketGrade, index) => ({
    ...ticketGrade,
    typeColor: colors[Math.round(index * ((colors.length - 1) / (ticketGrades.length - 1)))]
  })
);

export default {
  methods: {
    async getMeeting(id) {
      try {
        this.meeting = meetingExample;
        const res = await wxRequest(meetingGet(id));
        this.meeting = res.meeting || res;
        this.meeting.ticketGrades = addTypeColorForTicketGrades(this.meeting.ticketGrades);
      } catch (e) {
        if (e.errMsg === 'request:fail url not in domain list') {
          this.meeting = meetingExample;
        } else {
          console.error(e.statusCode, e.data);
          throw e;
        }
      }
    },
  }
};
