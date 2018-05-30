export default (ticket) => {
  const participantId = ticket.participantId;

  return {
    url: `/tickets/${ticket.id}`,
    method: 'PUT',
    data: JSON.stringify({ participantId }),
  };
};
