import { wxRequest, smsCodesPost } from '@/apis';

export default phone => wxRequest(smsCodesPost(phone));
