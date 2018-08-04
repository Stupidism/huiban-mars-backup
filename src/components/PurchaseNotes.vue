<template>
  <div class="purchase-notes container flex vertically">
    <div class="purchase-notes-title section-single-line">会伴《购票须知》</div>
    <div class="purchase-notes-content section">
      <h1 class="title">
        《会伴科技票务服务条款》
      </h1>
      <div class="note-content">
        会伴科技为您提供项目订票服务（项目包括会议、活动、聚会等形式），请您阅读并同意《会伴科技票务服务条款》（以下简称 “本条款”）。当您点击“同意”后，本条款将自动在您和会伴之间达成契约并具备法律效力。
        如对本条款内容有异议，您有权立即停止订购并拒绝接受会伴提供的订票服务。
      </div>
      <div class="note">
        <h2 class="note-title">
          一、本订票条款的成立、生效与取消
        </h2>
        <div class="note-item">
          <serial-number number="1" />
          <div class="note-content">会伴通过展示页向您提供项目的基本信息，一般情况下包括：项目名称、时间、地点、费用及权益、注意事项、QA等关键信息；</div>
        </div>
        <div class="note-item">
          <serial-number number="2" />
          <div class="note-content">在您下单或支付费用后，双方将默认您已经仔细阅读、理解、认同了展示页中的全部信息；</div>
        </div>
        <div class="note-item">
          <serial-number number="3" />
          <div class="note-content">在您下单并支付费用前，建议您再次确认所订购项目门票是否有误，如有问题请放弃支付。若您在成功提交订单后的规定时间内（一般是15分钟内）未能完成付款，系统将自动取消该订单，双方均无需承担任何责任。</div>
        </div>
        <div class="note-item">
          <serial-number number="4" />
          <div class="note-content">为保护会伴用户利益，对于异常订购行为，会伴有权单方面取消异常订单，异常订购行为包括但不限于以下情形：（1）相同用户ID订购门票超出限额；（2）经验证为虚假消费的订单，比如通过批量、相同、相似、虚拟的支付宝账号、姓名、手机号等下的订单。</div>
        </div>
      </div>
      <div class="note">
        <h2 class="note-title">
          二、门票发送及其他
        </h2>
        <div class="note-item">
          <serial-number number="1" />
          <div class="note-content">在您成功订购项目门票后，订票信息将通过短信发送给您，同时也可在会伴小程序“我的门票”查看项目电子门票；</div>
        </div>
        <div class="note-item">
          <serial-number number="2" />
          <div class="note-content">购买门票的发票凭证，将由各项目主办方承诺是否提供，会伴不提供任何发票凭证，请认真阅读项目详情页中相关信息提示，或者直接联系咨询主办方；</div>
        </div>
        <div class="note-item">
          <serial-number number="3" />
          <div class="note-content">主办方要求入场凭证包括但不限于：本人身份证、电子门票凭证（可通过会伴小程序获取）、购票短信通知等，请注意查看相关提示信息并提前做好准备，以确保正常出席。</div>
        </div>
      </div>
      <div class="note">
        <h2 class="note-title">
          三、项目延迟或取消
        </h2>
        <div class="note-content">
          由于社会因素、自然因素等不可抗力影响，项目被取消或延迟举办的，会伴将尽快向主办方寻求解决方案，并承担转达、通知的义务；如涉及退费问题，将统一由主办方点对点完成退款。
        </div>
      </div>
      <div class="note">
        <h2 class="note-title">
          四、用户自身原因退票、换票
        </h2>
        <div class="note-content">
          门票是否可退、可换兼由项目主办方承诺，购票前请仔细阅读项目展示信息的相关说明，如无明确说明的您需要和主办方协商决定；对于主办方承诺可退票的情况，主办方将通过点对点方式退回约定数量相关款项；对于不支持退票的，您将有权自行决定该门票的处理方式。
        </div>
      </div>
      <br />
      <div class="note-content">
        (所有条款最终解释权归会伴所有)
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
<style lang="less">
.purchase-notes {
  max-height: 100%;

  .purchase-notes-title {
    text-align: center;
    font-weight: bold;
  }

  .purchase-notes-content {
    flex: 1;
    overflow-y: scroll;

    .title {
      font-size: 20px;
      margin: 16px 0;
      text-align: center;
    }

    .note {
      .note-title {
        margin: 10px 0;
      }

      .note-item {
        display: flex;
        margin-bottom: 10px;
      }

      .serial-number {
        margin-right: 6px;
      }
    }

    .note-content {
      flex: 1;
      display: inline;
      font-size: 12px;
      line-height: 16px;
      color: #8A9299;
    }
  }
}
</style>
