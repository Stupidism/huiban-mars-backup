<template>
  <div class="serial-number">{{number}}</div>
</template>
<script>
export default {
  props: ['number'],
};
</script>
<style lang="less">
.serial-number {
  @size: 17px;
  width: @size;
  height: @size;
  line-height: @size - 1px;
  border-width: 0;
  border-radius: @size / 2;
  display: inline-block;
  text-align: center;
  background: #92c8f7;
  color: white;
  font-size: 12px;
}
</style>
