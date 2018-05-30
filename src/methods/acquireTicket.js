import { wxRequest, ticketPut } from '@/apis';

export default async (ticket) => {
  try {
    const newTicket = await wxRequest(ticketPut(ticket));
    return newTicket;
  } catch (e) {
    throw e;
  }
};
