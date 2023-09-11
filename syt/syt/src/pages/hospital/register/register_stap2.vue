<template>
  <div class="container">
    <h1 class="tip">确认挂号信息</h1>
    <!-- 就诊人 -->
    <el-card class="box-card">
      <!-- 卡片头部 -->
      <template #header>
        <div class="card-header">
          <span>请点击选择就诊人</span>
          <el-button type="primary" size="default" :icon="User" @click="goUser"
            >添加就诊人</el-button
          >
        </div>
      </template>
      <!-- 卡片的身体部分 -->
      <div class="user">
        <Visitor
          @click="changIndex(index)"
          class="item"
          v-for="(user, index) in userArr"
          :key="user.id"
          :user="user"
          :index="index"
          :currentIndex="currentIndex"
        />
      </div>
    </el-card>
    <!-- 医生信息 -->
    <el-card class="box-card">
      <!-- 头 -->
      <template #header>
        <div class="card-header">
          <span>挂号信息</span>
        </div>
      </template>
      <!-- 身体 -->
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">就诊日期:</div>
          </template>
          {{ docInfo.workDate }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">就诊医院:</div>
          </template>
          {{ docInfo.param?.hosname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">就诊科室:</div>
          </template>
          {{ docInfo.param?.depname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">医生姓名:</div>
          </template>
          {{ docInfo.docname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">医生职称:</div>
          </template>
          {{ docInfo.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">医生专长:</div>
          </template>
          {{ docInfo.skill }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">医生挂号费:</div>
          </template>
          <span style="color: red">¥ {{ docInfo.amount }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <!--  确定挂号按钮 -->
    <div class="btn">
      <el-button
        type="primary"
        size="large"
        :disabled="currentIndex == -1 ? true : false"
        @click="submitOrder"
      >
        确认挂号
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from '@element-plus/icons-vue'

import { reqGetUser, reqDoctorInfo } from '@/api/hospital/index.ts'
import { reqSubmitOrder } from '@/api/user/index.ts'
import type { SubmitOrder } from '@/api/user/type.ts'
import { onMounted, ref } from 'vue'
import type {
  UserResponseData,
  UserArr,
  DoctorInfoData,
  Doctor,
} from './type.ts'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
let $route = useRoute()
let $router = useRouter()
//存储就诊人的索引值
let currentIndex = ref<number>(-1)
//存储就诊人信息
let userArr = ref<UserArr>([])

//医生信息
let docInfo = ref(<Doctor>[])

//挂载完毕 请求数据
onMounted(() => {
  fetchUserData()
  fetchDoctorInfo()
})

//获取就诊人信息
const fetchUserData = async () => {
  let result: UserResponseData = await reqGetUser()
  /* console.log(result) */
  if (result.code == 200) {
    userArr.value = result.data
  }
}
//获取挂号医生信息
const fetchDoctorInfo = async () => {
  let scheduleId: string = $route.query.docId
  let result: DoctorInfoData = await reqDoctorInfo(scheduleId)
  /* console.log(result) */
  if (result.code == 200) {
    docInfo.value = result.data
  }
}

//点击就诊人子组件的回调
const changIndex = (index: number) => {
  currentIndex.value = index
}

//确定挂号的回调
const submitOrder = async () => {
  //医院编号
  let hoscode: string = docInfo.value.hoscode
  let scheduleId: string = docInfo.value.id
  let patientId: string = userArr.value[currentIndex.value].id
  //console.log(hoscode, scheduleId, patientId)
  let result: SubmitOrder = await reqSubmitOrder(hoscode, scheduleId, patientId)
  //console.log(result)
  if (result.code == 200) {
    $router.push({ path: '/user/order', query: { orderId: result.data } })
  } else {
    ElMessage({
      type: 'error',
      message: result.message,
    })
  }
}
//预约挂号添加就诊人
const goUser = () => {
  $router.push({ path: '/user/patient', query: { type: 'add' } })
}
</script>

<style scoped lang="scss">
.container {
  .tip {
    font-weight: 900;
    color: #7f7f7f;
    font-size: 20px;
    margin-top: 40px;
  }
  .box-card {
    margin-top: 20px;
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .user {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 32%;
        margin: 5px;
      }
    }
  }
  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0px;
  }
}
</style>
