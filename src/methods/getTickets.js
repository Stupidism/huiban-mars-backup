import { wxRequest, ticketList } from '@/apis';

export default async (query) => {
  try {
    const tickets = await wxRequest(ticketList(query));
    return tickets;
  } catch (e) {
    console.error(e.statusCode, e.data, e);
    throw e;
  }
};
