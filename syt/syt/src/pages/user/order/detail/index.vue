<template>
  <div>
    <el-card class="box-card">
      <!-- 插槽 -->
      <template #header>
        <div class="detail">挂号详情</div>
      </template>
      <!-- 身体部分的顶部结构 -->
      <div class="top">
        <el-tag class="ml-2" type="success">
          <!-- 左侧标签 -->
          <div class="tag">
            <svg
              t="1693812628311"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="12931"
              width="16"
              height="16"
            >
              <path
                d="M512 170.666667a341.333333 341.333333 0 0 0-290.133333 521.216 42.666667 42.666667 0 0 1-72.533334 45.013333A424.874667 424.874667 0 0 1 85.333333 512C85.333333 276.352 276.352 85.333333 512 85.333333s426.666667 191.018667 426.666667 426.666667-191.018667 426.666667-426.666667 426.666667a424.874667 424.874667 0 0 1-234.666667-70.314667 42.666667 42.666667 0 1 1 46.933334-71.210667A341.333333 341.333333 0 1 0 512 170.666667z m222.165333 264.832a42.666667 42.666667 0 0 0-60.330666-60.330667L469.333333 579.669333l-119.168-119.168a42.666667 42.666667 0 0 0-60.330666 60.330667l149.333333 149.333333a42.666667 42.666667 0 0 0 60.330667 0l234.666666-234.666666z"
                fill="#2cc737"
                p-id="12932"
              ></path>
            </svg>
            <span>{{ orderInfo.param?.orderStatusString }}</span>
          </div>
        </el-tag>
        <!-- 右侧 二维码+信息 -->
        <div class="right_info">
          <img src="../../../../assets/images/code_login_wechat.png" alt="" />
          <div class="info">
            <p>微信关注“北京112预约挂号”</p>
            <p>“快速预约挂号”</p>
          </div>
        </div>
      </div>
      <!-- 订单详情底部的结构 -->
      <div class="bottom">
        <div class="left">
          <!-- 描述列表   左侧展示订单详情信息 -->
          <el-descriptions class="margin-top" :column="1" border>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">就诊人信息</div>
              </template>
              {{ orderInfo.patientName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">就诊日期</div>
              </template>
              {{ orderInfo.reserveDate }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">就诊医院</div>
              </template>
              {{ orderInfo.hosname }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">就诊科室</div>
              </template>
              {{ orderInfo.depname }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">医生职称</div>
              </template>
              {{ orderInfo.title }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">医生挂号费</div>
              </template>
              {{ orderInfo.amount }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">挂号单号</div>
              </template>
              {{ orderInfo.outTradeNo }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">挂号时间</div>
              </template>
              {{ orderInfo.createTime }}
            </el-descriptions-item>
          </el-descriptions>
          <div
            class="btn"
            v-if="orderInfo.orderStatus == 0 || orderInfo.orderStatus == 1"
          >
            <el-popconfirm title="确定取消预约?" @confirm="cancel">
              <template #reference>
                <el-button>取消预约</el-button>
              </template>
            </el-popconfirm>
            <el-button
              type="primary"
              v-if="orderInfo.orderStatus == 0"
              @click="openDialog"
              >支付</el-button
            >
          </div>
        </div>
        <div class="right">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>注意事项</span>
              </div>
            </template>
            <p>
              1.请确认就诊人信息是否准确，若填写错误将无法取号就诊，损失由本人承担；
            </p>
            <p style="color: red">
              2.【取号】就诊当天需在{{ orderInfo.fetchTime }}前
              在医院取号，未取号视为爽约，该号不退不换；
            </p>
            <p>
              3.【退号】在{{ orderInfo.quitTime }}前可在线退号
              ，逾期将不可办理退号退费；
            </p>
            <p>
              4.北京114预约挂号支持自费患者使用身份证预约，同时支持北京市医保患者使用北京社保卡在平台预约挂号。请于就诊当日，携带预约挂号所使用的有效身份证件到院取号；
            </p>
            <p>5.请注意北京市医保患者在住院期间不能使用社保卡在门诊取号。</p>
          </el-card>
        </div>
      </div>
    </el-card>
    <!-- 支付二维码结构 -->
    <!-- 对话框是通过v-model控制显示与隐藏的 true：展示 false：隐藏-->
    <div>
      <el-dialog
        @close="close"
        v-model="dialogTableVisible"
        title="微信支付"
        width="400px"
      >
        <!-- 支付二维码 -->

        <div class="qrcode">
          <img :src="imgUrl" alt="" />
          <p>请使用微信扫一扫</p>
          <p>扫描二维码支付</p>
        </div>

        <template #footer>
          <div>
            <el-button type="primary" @click="closeDialog">关闭窗口</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  reqOrderInfo,
  reqCancelOrder,
  reqQrcode,
  reqQueryPayState,
} from '@/api//user/index.ts'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type {
  OrderResponseData,
  OrderInfo,
  QrCode,
  PayReslt,
} from '@/api/user/type.ts'
import { ElMessage } from 'element-plus'
//生成二维码
import QRCode from 'qrcode'
let $route = useRoute()
//控制对话框显示与隐藏的数据
let dialogTableVisible = ref<boolean>(false)
//微信二维码路径
let imgUrl = ref<string>('')
//存储定时器的引用
let timer = ref<any>()
//存储请求到的订单信息
let orderInfo = ref<OrderInfo>({})
onMounted(() => {
  getOrderInfo()
})
const getOrderInfo = async () => {
  let result: OrderResponseData = await reqOrderInfo($route.query.orderId)
  if (result.code == 200) {
    orderInfo.value = result.data
  }
}
//取消订单  订单状态有三种orderStatus -1:订单被取消了  0:预约未支付 1:预约支付成功
const cancel = async () => {
  //alert(123)
  try {
    //
    await reqCancelOrder($route.query.orderId)
    //再次获取订单详情的数据
    getOrderInfo()
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '取消预约失败',
    })
  }
}

//点击支付按钮的回调
const openDialog = async () => {
  dialogTableVisible.value = true
  //获取支付需要使用二维码信息
  let result: QrCode = await reqQrcode($route.query.orderId)
  //console.log(result)
  //根据服务器返回二维码信息生成二维码图片
  imgUrl.value = await QRCode.toDataURL(result.data.codeUrl)
  //console.log(imgUrl)
  //询问服务器支付情况--长轮询
  //只要二维码出来，每隔几秒就要询问一次
  timer.value = setInterval(async () => {
    let result: PayReslt = await reqQueryPayState($route.query.orderId)
    //如果服务器返回的数据data：true 代表支付成功
    if (result.data) {
      //关闭对话框
      dialogTableVisible.value = false
      //提示信息
      ElMessage({
        type: 'success',
        message: '支付成功',
      })
      //清除定时器
      clearInterval(timer.value)
      //再次获得订单详情
      getOrderInfo()
    }
  }, 2000)
}
//关闭窗口
const closeDialog = () => {
  dialogTableVisible.value = false
  clearInterval(timer.value)
}
//对话框右上角关闭的回调
const close = () => {
  clearInterval(timer.value)
}
</script>

<style scoped lang="scss">
.box-card {
  .detail {
    color: #7f7f7f;
    font-weight: 450;
    font-size: 20px;
    line-height: 50px;
  }
  .top {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    padding: 10px;
    .tag {
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        margin-left: 5px;
      }
    }
    .right_info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
      }
      .info {
        margin-left: 8px;
        p {
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
  .bottom {
    display: flex;
    margin-top: 20px;
    .left {
      flex: 4;
      .btn {
        margin: 10px 0px;
      }
    }
    .right {
      margin-left: 20px;
      flex: 6;
      p {
        line-height: 30px;
      }
    }
  }
}
::v-deep(.el-dialog__body) {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.qrcode {
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    line-height: 30px;
  }
}
</style>
