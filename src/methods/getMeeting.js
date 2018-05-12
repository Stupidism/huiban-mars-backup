import { wxRequest, meetingGet } from '@/apis';
import { example as meetingExample } from '@/apis/meetings/get';

const colors = ['blue', 'green', 'orange', 'purple', 'black'];

const addTypeColorForTicketGrades = ticketGrades => ticketGrades.map(
  (ticketGrade, index) => ({
    ...ticketGrade,
    typeColor: colors[Math.round(index * ((colors.length - 1) / (ticketGrades.length - 1)))],
  })
);

export default async function getMeeting(id) {
  try {
    const meeting = await wxRequest(meetingGet(id));
    meeting.ticketGrades = addTypeColorForTicketGrades(meeting.ticketGrades);
    return meeting;
  } catch (e) {
    if (e.errMsg === 'request:fail url not in domain list') {
      return {
        ...meetingExample,
        id,
      };
    }

    console.error(e.statusCode, e.data);
    throw e;
  }
};
