<template>
  <scroll-view class="page payment-result">
    <div v-if="isCompleted" class="container">
      <div class="section content-vertical">
        <image class="icon huge" src="/static/icons/check-circle.png" />
        <div class="result-desc text large success">支付成功</div>
        <div class="text secondary">门票信息已通过短信发送至{{protectedCurrentUserPhone}}</div>
        <div class="text secondary">请注意查收</div>
      </div>
    </div>
    <div v-else class="container">
      <div class="section content-vertical">
        <image class="icon huge" src="/static/icons/close-circle.png" />
        <div class="result-desc text large warning">支付失败</div>
        <div class="text secondary">请检查订单状态</div>
        <div class="text secondary">并尽快在15分钟内完成支付</div>
      </div>
    </div>
    <div class="divider margined-vertical" />
    <div class="title margined-bottom">
      可赠送的门票    <span class="sub-title">长按保存图片，分享给好友、群、票圈</span>
    </div>
    <div class="image-container">
      <image src="/static/coupons/buy-one-get-one-free.png" mode="widthFix" />
    </div>
    <submit-footer :buttonName="`查看${isCompleted ? '门票' : '订单'}`" no-summary :onSubmit="onSubmit" />
  </scroll-view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import getOrder from '@/mixins/get-order';
import SubmitFooter from '@/components/SubmitFooter';

export default {
  data: {
    order: {},
  },
  computed: {
    ...mapState({
      user: 'userInfo',
    }),
    ...mapGetters(['protectedCurrentUserPhone']),
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

<style scoped lang="less">
.payment-result {
  .result-desc {
    margin: 12px 0;
  }
}

</style>
