import { wxRequest, ticketList } from '@/apis';
import { example as ticketsExample } from '@/apis/tickets/list';

export default async (query) => {
  try {
    const tickets = await wxRequest(ticketList(query));
    return tickets;
  } catch (e) {
    if (e.errMsg === 'request:fail url not in domain list') {
      return ticketsExample;
    }
    console.error(e.statusCode, e.data, e);
    throw e;
  }
};
