import { wxRequest, meetingList } from '@/apis';
import { example as meetingsExample } from '@/apis/meetings/list';

export default async () => {
  try {
    const meetings = await wxRequest(meetingList());
    return meetings;
  } catch (e) {
    if (e.errMsg === 'request:fail url not in domain list') {
      return meetingsExample;
    }

    console.error(e.statusCode, e.data, e);
    throw e;
  }
};
