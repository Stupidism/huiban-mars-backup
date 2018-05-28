import { wxRequest, userPut } from '@/apis';

export default user => wxRequest(userPut(user));
