import { wxRequest, ticketGet } from '@/apis';

export default async (id) => {
  try {
    const ticket = await wxRequest(ticketGet(id));
    return ticket;
  } catch (e) {
    console.error(e.statusCode, e.data, e);
    throw e;
  }
};
