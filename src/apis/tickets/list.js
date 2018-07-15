import _ from 'lodash';

export default (query = {}) => ({
  url: '/tickets',
  query: _.pick(query, ['meetingId', 'orderId', 'populate', 'status']),
});
