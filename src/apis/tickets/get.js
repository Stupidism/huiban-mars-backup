import _ from 'lodash';

export default (id, query) => ({
  url: `/tickets/${id}`,
  query: _.pick(query, ['populate']),
});
