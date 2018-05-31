import { wxRequest, ticketGet } from '@/apis';
import { example as ticketExample } from '@/apis/tickets/get';

export default async (id) => {
  try {
    const ticket = await wxRequest(ticketGet(id));
    return ticket.buyer ? ticket : ticketExample;
  } catch (e) {
    if (e.errMsg === 'request:fail url not in domain list') {
      return ticketExample;
    }
    console.error(e.statusCode, e.data, e);
    throw e;
  }
};
