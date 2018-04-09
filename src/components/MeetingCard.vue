<template>
  <div class="meeting-intro weui-flex" :class="{ mini: mini }">
    <img class="meeting-cover" src="/static/default-meeting-cover.png" alt="封面图片" />
    <div class="meeting-info weui-flex__item">
      <div class="meeting-topic topic">{{meeting.topic}}</div>
      <div v-if="!mini" class="meeting-info-centent">
        <div>
          时间: <date :time="meeting.holdAt" />
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
          <date :time="meeting.holdAt" /> {{meeting.address}}
        </div>
        <div>
          {{meeting.host}}发布
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Date from '@/modules/Date';

export default {
  props: ['meeting', 'mini'],
  components: { Date },
};
</script>

<style scoped>
.meeting-intro {
  padding-bottom: 15px;
}

.meeting-cover {
  width: 100px;
  height: 150px;
  margin-right: 15px;
}

.meeting-topic {
  font-size: 16px;
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
