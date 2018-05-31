import _ from 'lodash';
import { example as tickets } from './list';

export const example = tickets[0];

export default (id, query) => ({
  url: `/tickets/${id}`,
  query: _.pick(query, ['populate']),
});
