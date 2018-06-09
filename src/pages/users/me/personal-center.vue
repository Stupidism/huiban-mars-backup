<template>
  <scroll-view class="page personal-center">
    <user-card :user="currentUser" :onAvatarClick="openGetUserInfoModal" />
    <div class="container">
      <div class="list-title section-single-line" @click="goToMyTickets">
        <div>我的门票</div>
        <div class="sub-title">共{{sharableTickets.length}}张门票可赠送</div>
      </div>
      <div v-if="recentTicket" class="section-no-padding" @click="goToTicketsDetail(recentTicket.meetingId)">
        <tickets-card :tickets="ticketsOfRecentMeeting" :meeting="recentMeeting" />
      </div>
    </div>
    <div class="container">
      <div class="list-title section-single-line" @click="goToMyOrders">
        <div>我的订单</div>
        <div class="sub-title">查看全部</div>
      </div>
      <div v-if="recentOrder" class="section-no-padding" @click="goToOrderDetail(recentOrder.id)" >
        <order-card :order="recentOrder" />
      </div>
    </div>
    <div v-if="getUserInfoModalOpen" class="modal get-user-info-modal">
      <div class="container get-user-info-container">
        <div class="section-single-line text large centered primary">
          请求授权
        </div>
        <div class="section grow text large centered">
          允许会伴获得用户信息
        </div>
        <div class="get-user-info-actions section-no-padding">
          <button class="reject-btn large" @click="rejectGetUserInfo">拒绝</button>
          <button
            class="get-user-info-btn large"
            open-type="getUserInfo"
            @getuserinfo="handleGetUserInfo"
          >
            允许
          </button>
        </div>
      </div>
    </div>
  </scroll-view>
</template>

<script>
import { mapGetters } from 'vuex';

import UserCard from '@/components/UserCard';
import TicketsCard from '@/components/TicketsCard';
import OrderCard from '@/components/OrderCard';

import { isAuthing, waitForAuth } from '@/methods/auth';
import getTickets from '@/methods/getTickets';
import updateUser from '@/methods/updateUser';
import getOrders from '@/methods/getOrders';
import getWechatUserInfo from '@/methods/wechat/getUserInfo';

import goToMyTickets from '@/pages/tickets/goToMyTickets';
import goToMyOrders from '@/pages/orders/goToMyOrders';
import goToOrderDetail from '@/pages/orders/one/goToOrderDetail';
import goToTicketsDetail from '@/pages/meetings/one/tickets/goToTicketsDetail';
import { onModalOpen, onModalClose } from '@/utils/navbar';

export default {
  data() {
    return {
      getUserInfoModalOpen: false,
      tickets: [],
      orders: [],
    };
  },
  computed: {
    sharableTickets() {
      return this.tickets.filter(({ status }) => status === 'no_participant');
    },
    recentTicket() {
      if (!this.tickets.length) return null;
      return this.tickets[0];
    },
    recentMeeting() {
      return this.recentTicket && this.recentTicket.meeting;
    },
    ticketsOfRecentMeeting() {
      if (!this.tickets.length || !this.recentMeeting) return [];
      return this.tickets.filter(ticket => ticket.meetingId === this.recentMeeting.id);
    },
    recentOrder() {
      if (!this.orders.length) return null;
      return this.orders[0];
    },
    ...mapGetters(['currentUser']),
  },
  methods: {
    goToMyTickets,
    goToMyOrders,
    goToOrderDetail,
    goToTicketsDetail,
    async tryToGetUserInfo() {
      if (wx.getStorageSync('getUserInfoAllowed')) {
        const res = await getWechatUserInfo();
        if (res && res.userInfo) {
          this.onGetUserInfo(res.userInfo);
          return;
        }
      }

      if (!wx.getStorageSync('getUserInfoRejected')) {
        this.openGetUserInfoModal();
      }
    },
    openGetUserInfoModal() {
      this.getUserInfoModalOpen = true;
      onModalOpen();
    },
    closeGetUserInfoModal() {
      this.getUserInfoModalOpen = false;
      onModalClose();
    },
    rejectGetUserInfo() {
      wx.setStorageSync('getUserInfoAllowed', false);
      wx.setStorageSync('getUserInfoRejected', true);
      this.closeGetUserInfoModal();
    },
    allowGetUserInfo() {
      wx.setStorageSync('getUserInfoAllowed', true);
      wx.setStorageSync('getUserInfoRejected', false);
      this.closeGetUserInfoModal();
    },
    handleGetUserInfo({ mp: { detail } }) {
      if (detail.errMsg === 'getUserInfo:ok') {
        this.allowGetUserInfo();
        this.onGetUserInfo(detail.userInfo);
      } else {
        this.rejectGetUserInfo();
      }
    },
    onGetUserInfo({ avatarUrl, nickName, city, province, ...userInfo }) {
      const user = {
        ...userInfo,
        name: nickName,
        wechatAvatar: avatarUrl,
        wechatName: nickName,
        wechatCity: city,
        wechatProvince: province,
        ...this.currentUser,
      };

      updateUser(user);
      this.$store.commit('setCurrentUser', user);
    },
  },
  components: {
    UserCard,
    TicketsCard,
    OrderCard,
  },
  async mounted() {
    if (isAuthing()) {
      await waitForAuth();
    }
    if (!this.currentUser.id) {
      wx.navigateTo({
        url: '/pages/users/new/main',
      });
      return;
    }


    if (!this.currentUser.wechatName) {
      this.tryToGetUserInfo();
    }


    this.tickets = await getTickets();
    this.orders = await getOrders();
  },
};
</script>

<style scoped lang="less">
.personal-center {
  .list-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > .sub-title {
      color: #2692F0;
    }
  }

  .get-user-info-modal {
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    .get-user-info-container {
      position: relative;
      width: 80%;
      height: 40%;
      border-radius: 3px;
      display: flex;
      flex-direction: column;

      .get-user-info-actions {
        display: flex;

        .reject-btn {
          color: #17181A;
        }

        .reject-btn,
        .get-user-info-btn {
          width: 50%;
          font-size: 16px;
        }

        button:not(:first-child) {
          border-left: solid 0.5px #EAEAEA;
        }
      }

    }
  }
}
</style>
