<template>
  <div class="location-row section-single-line" @click="showInMap">
    <span class="location-content">
      <image class="icon small marker" src="/static/icons/marker.png" />
      <span class="place">{{place}}</span>
    </span>
    <image class="icon small" src="/static/icons/right-arrow.png" />
  </div>
</template>

<script>
export default {
  props: ['latitude', 'longitude', 'place', 'address'],
  methods: {
    showInMap() {
      const { latitude, longitude, place, address } = this;
      wx.openLocation({
        latitude,
        longitude,
        scale: 28,
        name: place,
        address,
      });
    },
  },
};
</script>

<style scoped lang="less">
.location-row {
  font-size: 14px;
  color: #17181A;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .location-content {
    display: flex;
    align-items: center;

    .marker {
      margin: 0 2.5px;
    }

    .place {
      margin: 0 10px;
    }
  }
}
</style>
