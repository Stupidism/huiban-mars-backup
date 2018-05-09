<template>
  <div class="ticket-notes container">
    <div class="ticket-notes-title section-single-line">购票须知</div>
    <div class="ticket-notes-content section">
      <div class="note-item">
        <serial-number number="1" />
        <div class="note-content">下单区域固定在页面底端，</div>
      </div>
      <div class="note-item">
        <serial-number number="2" />
        <div class="note-content">《购票须知》、《服务协议》支持点击，点击后在当前页以浮层样式打开，详见下方图例</div>
      </div>
    </div>
  </div>
</template>
<script>
import SerialNumber from '@/modules/SerialNumber';

export default {
  props: ['onClose'],
  components: {
    SerialNumber,
  },
};
</script>
<style scoped lang="less">
.ticket-notes {
  .ticket-notes-title {
    text-align: center;
    font-weight: bold;
  }

  .ticket-notes-content {
    .note-item {
      display: flex;
      margin-bottom: 10px;

      .note-content {
        flex: 1;
        display: inline;
        margin-left: 6px;
        font-size: 12px;
        line-height: 16px;
        color: #8A9299;
      }
    }
  }

  .ticket-notes-close-btn {
    color: #2692F0;
    line-height: 50px;
    text-align: center;
  }
}
</style>
