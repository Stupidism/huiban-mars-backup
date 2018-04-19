<template>
  <scroll-view class="page new-order">
    <div v-if="isCompleted" class="bordered content-vertical">
      支付成功
      <div class="helper-text">门票信息已通过短信发送至151***7372，请注意查收</div>
    </div>
    <div v-else class="bordered content-vertical">
      支付失败
      <div class="helper-text">请检查订单状态，并尽快在15分钟内完成支付</div>
    </div>
    <div class="divider margined-vertical" />
    <div class="title margined-bottom">
      结伴计划    <span class="sub-title">好会议 结伴行</span>
    </div>
    <div class="bordered content-vertical">
      买一赠一
      <div class="helper-text content-vertical">
        <div>找到身边相同的圈子，赠送门票</div>
        <div>邀请你的小伙伴一起结伴参会</div>
      </div>
    </div>
    <div class="divider margined-vertical" />
    <div class="title margined-bottom">
      可赠送的门票    <span class="sub-title">长按保存图片，分享给好友、群、票圈</span>
    </div>
    <submit-footer :buttonName="`查看${isCompleted ? '门票' : '订单'}`" no-summary="true" :onSubmit="onSubmit" />
  </scroll-view>
</template>

<script>
import getOrder from '@/mixins/get-order';
import SubmitFooter from '@/components/SubmitFooter';

export default {
  data: {
    order: {},
  },
  computed: {
    isCompleted() {
      return this.order.status === 'completed';
    }
  },
  methods: {
    onSubmit() {
      wx.navigateTo({
        url: this.isCompleted
          ? `/pages/tickets/main?order=${this.order.id}`
          : `/pages/orders/one/main?id=${this.order.id}`,
      });
    },
  },
  mixins: [getOrder],
  components: { SubmitFooter },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '支付结果',
    });
    await this.getOrder(this.$root.$mp.query.order || 1);

    // Mock navigate to new-order page
    // this.onSubmit();
    // TODO: remove mock code above
  },
};
</script>

<style scoped>
</style>
