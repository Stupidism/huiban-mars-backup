<template>
  <div class="meeting-intro weui-flex" :class="{ mini: mini }">
    <img class="meeting-cover" src="/static/default-cover.png" alt="封面图片" />
    <div class="meeting-info weui-flex__item">
      <div class="meeting-topic">{{meeting.topic}}</div>
      <div v-if="!mini" class="meeting-info-centent">
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
      <div v-if="mini" class="meeting-info-centent">
        <div>
          {{startAt}} {{meeting.address}}
        </div>
        <div>
          {{meeting.host}}发布
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toDate from '@/utils/filters/date';

export default {
  props: ['meeting', 'mini'],
  computed: {
    startAt() {
      return toDate(this.meeting.startAt);
    },
  },
};
</script>

<style>
.meeting-intro {
  padding-bottom: 15px;
}

.meeting-cover {
  width: 100px;
  height: 150px;
  margin-right: 15px;
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

.meeting-intro.mini .meeting-cover {
  width: 66px;
  height: 99px;
}

.meeting-intro.mini .meeting-info-centent {
  margin-top: 5px;
}

</style>
