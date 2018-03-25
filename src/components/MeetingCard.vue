<template>
  <div class="meeting-intro weui-flex" :class="['meeting-intro', 'weui-flex']">
    <img class="meeting-cover weui-flex__item" src="/static/default-cover.png" alt="封面图片" />
    <div class="meeting-info weui-flex__item">
      <div class="meeting-topic">{{meeting.topic}}</div>
      <div class="meeting-info-centent">
        <div>
          时间: {{startAt}}
        </div>
        <div>
          地点: {{meeting.address}}
        </div>
        <div>
          发布方: {{meeting.host}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toDate from '@/utils/filters/date';

export default {
  props: ['meeting'],
  computed: {
    startAt() {
      return toDate(this.meeting.startAt);
    },
  },
  methods: {
    click(e) {
      if (!this.disabled) {
        this.$emit('select', e);
      }
    },
  },
};
</script>

<style>

.red {
  color: red;
}

.meeting-intro {
  border-bottom: dashed 1px #bbb;
  padding-bottom: 15px;
}

.meeting-cover {
  flex: 1;
  height: 150px;
  margin-right: 15px;
}

.meeting-info {
  flex: 2;
}

.meeting-topic {
  font-weight: bolder;
  font-size: 16px;

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  padding-right: 10px;
}

.meeting-info-centent {
  margin-top: 30px;
  font-size: 14px;
}

</style>
