<template>
  <div class="user-card container background-image-container">
    <image class="background-image" :src="user.wechatAvatar" mode="aspectFill" />
    <div v-if="user.wechatAvatar" class="user-card-content background-image-content">
      <div class="user-info">
        <div class="user-info-title">
          <div class="user-name">{{user.name}}</div>
          <div v-if="user.company" class="dot-divider">·</div>
          <div class="user-company">{{user.company}}</div>
        </div>
        <div class="user-info-content">
          <div class="user-info-content-item">
            <image class="icon tiny info-icon" src="/static/icons/position.svg" />
            <span>{{user.position || '暂未填写'}}</span>
          </div>
          <div class="user-info-content-item">
            <image class="icon tiny info-icon" src="/static/icons/phone.svg" />
            <span>{{user.phone || '暂未填写'}}</span>
          </div>
          <div class="user-info-content-item">
            <image class="icon tiny info-icon" src="/static/icons/marker-white.svg" />
            <span>{{user.city || '暂未填写'}}</span>
          </div>
        </div>
      </div>
      <image
        class="user-avatar"
        :src="user.wechatAvatar"
      />
    </div>
    <div v-else class="user-card-content background-image-content no-wechat-info">
      <div class="user-info-only-phone">
        {{user.phone}}
      </div>
      <image
        class="user-avatar"
        @click="onAvatarClick"
        src="/static/default-avatar.png"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ['user', 'onAvatarClick'],
};
</script>

<style scoped lang="less">
.user-card {
  height: 120px;
  width: 100%;
  overflow: hidden;

  & > .background-image {
    height: 120px;
    width: 100%;
    filter: blur(10px);
  }

  .user-card-content {
    background: rgba(38,146,240,0.30);
    color: white;
    padding: 15px;

    display: flex;
    align-items: stretch;
    justify-content: space-between;

    &.no-wechat-info {
      background: white;
      color: #17181A;
    }

    .user-info {
      flex: 1;

      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .user-info-title {
        display: flex;
        align-items: center;

        .user-name {
          font-size: 16px;
        }

        .dot-divider {
          margin: 0 5px;
        }

        .user-company {
          line-height: 14px;
        }
      }

      .user-info-content {
        font-size: 12px;
        line-height: 12px;

        .user-info-content-item {
          display: flex;
          align-items: center;

          &:not(:first-child) {
            margin-top: 8px;
          }

          .info-icon {
            margin-right: 10px;
          }
        }
      }
    }

    .user-info-only-phone {
      display: flex;
      align-items: center;
      font-size: 16px;
    }

    .user-avatar {
      margin-top: 10px;
      width: 70px;
      height: 70px;
      border-radius: 35px;
    }
  }
}
</style>

