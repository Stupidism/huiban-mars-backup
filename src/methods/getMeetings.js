import { wxRequest, meetingList } from '@/apis';

export default async () => {
  try {
    const meetings = await wxRequest(meetingList());
    return meetings;
  } catch (e) {
    console.error(e.statusCode, e.data, e);
    throw e;
  }
};
