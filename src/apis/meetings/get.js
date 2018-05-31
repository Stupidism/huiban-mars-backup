import addMinutes from 'date-fns/add_minutes';

export const example = {
  id: 1,
  topic: '2018第六届全球云计算大会',
  englishTopic: 'Cloud Connect China 2018',
  holdAt: new Date(),
  mainSpeaker: '李大钊',
  host: '上海亚德科技有限公司',
  place: '梅赛德斯奔驰中心',
  address: '上海市浦东新区世博大道1200号',
  latitude: 31.1892897,
  longitude: 121.4931109,
  bannerImg: '/static/default-meeting-banner.png',
  coverImg: 'https://ss0.bdstatic.com/-0U0bnSm1A5BphGlnYG/tam-ogel/be976635f1487600fd5ef83822421686_121_121.jpg',
  status: 'enrolling',
  statusDesc: '报名中',
  enrollEndAt: addMinutes(new Date(), 15),
  ticketGrades: [{
    id: 0,
    type: '早鸟票',
    typeColor: 'blue',
    price: 19000,
    desc: '早起的鸟儿有虫吃，限量低价票尽在此刻，赶紧下手吧',
    amount: 100,
    restAmount: 61,
  }, {
    id: 1,
    type: 'VIP票',
    typeColor: 'orange',
    price: 39000,
    desc: '坐前排，视线好，离得近，互动好，摘掉眼镜，竖起耳朵，做好笔记',
    amount: 100,
    restAmount: 33,
  }, {
    id: 2,
    type: '贵宾票',
    typeColor: 'purple',
    price: 129000,
    desc: '想坐第一排，想和嘉宾握手合影，想...还想什么，点按钮啊→_→',
    amount: 100,
    restAmount: 4,
  }, {
    id: 3,
    type: '卖完票',
    typeColor: 'black',
    price: 200,
    desc: '我就测一测卖完了什么样',
    amount: 100,
    restAmount: 0,
  }],
};

export default id => ({
  url: `/meetings/${id}`,
});
