export const example = {
  topic: '会议名称会议名称会议名议名称会议名称最多两行，超出截断加...',
  startAt: new Date(),
  host: '上海亚德科技有限公司',
  address: '梅赛德斯奔驰中心',
  coverImg: '',
  ticketGrades: [{
    id: 0,
    type: '早鸟票',
    price: 19000,
    desc: '早起的鸟儿有虫吃，限量低价票尽在此刻，赶紧下手吧',
    amount: 100,
    restAmount: 61,
  }, {
    id: 1,
    type: 'VIP票',
    price: 39000,
    desc: '坐前排，视线好，离得近，互动好，摘掉眼镜，竖起耳朵，做好笔记',
    amount: 100,
    restAmount: 33,
  }, {
    id: 2,
    type: '贵宾票',
    price: 129000,
    desc: '想坐第一排，想和嘉宾握手合影，想...还想什么，点按钮啊→_→',
    amount: 100,
    restAmount: 4,
  }, {
    id: 3,
    type: '卖完票',
    price: 200,
    desc: '我就测一测卖完了什么样',
    amount: 100,
    restAmount: 0,
  }],
};

export default id => ({
  url: `/meetings/${id}`,
});
