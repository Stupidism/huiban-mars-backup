export default (ticket, user) => user.id && user.id.toString() === ticket.buyerId;
