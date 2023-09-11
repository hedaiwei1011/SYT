<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <h1>挂号订单</h1>
      </div>
    </template>
    <!-- 用户选择的下拉菜单 -->
    <el-form ref="form" :model="form" label-width="80px" :inline="true">
      <el-form-item label="就诊人">
        <el-select
          placeholder="请选择就诊人"
          v-model="patientId"
          @change="changeUser"
        >
          <el-option label="请选择全部就诊人" value=""></el-option>
          <el-option
            v-for="item in allUser"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select
          v-model="orderStatus"
          placeholder="请选择订单状态"
          @change="changeUser"
        >
          <el-option label="全部订单" value=""></el-option>
          <el-option
            v-for="(state, index) in orderState"
            :key="index"
            :label="state.comment"
            :value="state.status"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 表格展示订单的数据 -->
    <el-table :data="allOrderArr" border style="margin: 10px 0px">
      <el-table-column
        label="就诊时间"
        prop="reserveDate"
        width="110"
      ></el-table-column>
      <el-table-column prop="hosname" label="医院"></el-table-column>
      <el-table-column prop="depname" label="科室"></el-table-column>
      <el-table-column prop="title" label="医生"></el-table-column>
      <el-table-column
        prop="amount"
        label="挂号费"
        width="67px"
      ></el-table-column>
      <el-table-column prop="patientName" label="就诊人"></el-table-column>
      <el-table-column
        prop="param.orderStatusString"
        label="订单状态"
        width="137px"
      ></el-table-column>
      <el-table-column prop="prop" label="操作" width="60px">
        <template #="{ row }">
          <el-button type="text" @click="goDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout=" prev, pager, next, jumper ,->, sizes,total"
      :total="total"
      @current-change="handleChange"
      @size-change="handleSizeChange"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type {
  UserOrderInfoResponseData,
  Records,
  AllUser,
  AllUserResponseData,
  AllOrderState,
  AllOrderStateResponseData,
} from '@/api/user/type.ts'
import {
  reqUserOrderInfo,
  reqAllUser,
  reqOrderState,
} from '@/api/user/index.ts'
import { useRouter } from 'vue-router'
let $router = useRouter()
//当前分页器页码
let pageNo = ref<number>(1)
//展示几条数据
let pageSize = ref<number>(20)
//收集就诊人的id
let patientId = ref<string>('')
//收集订单状态
let orderStatus = ref<string>('')
//存储全部的订单
let allOrderArr = ref<Records>([])
//存储订单的总个数
let total = ref<number>(0)
//就诊人
let allUser = ref<AllUser>([])
//状态
let orderState = ref<AllOrderState>([])
onMounted(() => {
  getOrderInfo()
  //获取就诊人和订单状态
  getData()
})
const getOrderInfo = async () => {
  let reslut: UserOrderInfoResponseData = await reqUserOrderInfo(
    pageNo.value,
    pageSize.value,
    patientId.value,
    orderStatus.value
  )
  if (reslut.code == 200) {
    allOrderArr.value = reslut.data.records
    total.value = reslut.data.total
  }
}

const getData = async () => {
  //就诊人
  const user: AllUserResponseData = await reqAllUser()
  //订单状态
  const state: AllOrderStateResponseData = await reqOrderState()
  allUser.value = user.data
  orderState.value = state.data
}

//详情按钮
const goDetail = (row: any) => {
  $router.push({ path: '/user/order', query: { orderId: row.id } })
}

//分页器换页
const handleChange = (pager: number) => {
  pageNo.value = pager
  getOrderInfo()
}

//下拉菜单换页
const handleSizeChange = (pageSizes: number) => {
  pageSize.value = pageSizes
  getOrderInfo()
}

//就诊人下拉框
const changeUser = () => {
  getOrderInfo()
}
</script>

<style scoped lang="scss">
.box-card {
  .card-header {
    color: #7f7f7f;
    font-weight: 450;
    font-size: 20px;
    line-height: 50px;
  }
}
</style>
