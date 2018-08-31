import { wxRequest, meetingGet } from '@/apis';

const colors = ['blue', 'green', 'orange', 'purple', 'black'];

export const addTypeColorForTicketGrades = (ticketGrades = []) => ticketGrades.map(
  (ticketGrade, index) => ({
    ...ticketGrade,
    typeColor: ticketGrade.typeColor
      || colors[Math.round(index * ((colors.length - 1) / (ticketGrades.length - 1)))],
  })
);

export default async function getMeeting(id) {
  try {
    const meeting = await wxRequest(meetingGet(id));
    meeting.ticketGrades = addTypeColorForTicketGrades(meeting.ticketGrades);
    return meeting;
  } catch (e) {
    console.error(e.statusCode, e.data);
    throw e;
  }
};
