import qs from 'query-string';
import _ from 'lodash';

export default (meetingIdOrQuery) => {
  const query = _.isObject(meetingIdOrQuery)
    ? _.pick(meetingIdOrQuery, [
      'meetingId',
      'orderId',
    ])
    : {
      meetingId: meetingIdOrQuery,
    };

  wx.navigateTo({
    url: `/pages/meetings/one/tickets/main?${qs.stringify(query)}`,
  });
};

