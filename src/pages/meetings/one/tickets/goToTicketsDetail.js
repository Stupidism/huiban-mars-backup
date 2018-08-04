import buildUrl from 'build-url';
import _ from 'lodash';

export default (meetingIdOrQuery, method = 'navigateTo') => {
  const queryParams = _.isObject(meetingIdOrQuery)
    ? _.pick(meetingIdOrQuery, [
      'meetingId',
      'orderId',
    ])
    : {
      meetingId: meetingIdOrQuery,
    };

  wx[method]({
    url: buildUrl({
      path: '/pages/meetings/one/tickets/main',
      queryParams,
    }),
  });
};

