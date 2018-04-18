<template>
  <div class="ticket-notes-root">
    <div class="ticket-notes-container">
      <div class="ticket-notes-title">购票须知</div>
      <div class="divider solid" />
      <div class="ticket-notes-content">
        <div class="note-item">
          <serial-number number="1" />
          <div class="note-content">下单区域固定在页面底端，</div>
        </div>
        <div class="note-item">
          <serial-number number="2" />
          <div class="note-content">《购票须知》、《服务协议》支持点击，点击后在当前页以浮层样式打开，详见下方图例</div>
        </div>
      </div>
      <div class="divider solid" />
      <div class="ticket-notes-close-btn" @click="onClose">关闭</div>
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
.ticket-notes-root {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0,0,0,0.60);

  .ticket-notes-container {
    position: absolute;
    bottom: 0;
    background: white;
  }

  .ticket-notes-title {
    line-height: 45px;
    text-align: center;
    font-weight: bold;
  }

  .ticket-notes-content {
    padding: 15px;

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
