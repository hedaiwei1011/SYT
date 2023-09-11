<template>
  <div class="container">
    <!-- 顶部全局组件 -->
    <HospitalTop></HospitalTop>
    <!-- 展示路由组件 -->
    <div class="content">
      <!-- 展示路由组件的区域 -->
      <router-view></router-view>
    </div>
    <!-- <div class="bottom">123123</div> -->
    <HospitalBottom />
    <!-- 登陆 -->
    <Login v-if="userStore.visiable" />
  </div>
</template>

<script setup lang="ts">
/* import request from '@/utils/request'
import { onMounted } from 'vue'
onMounted(() => {
  request.get('/hosp/hospital/1/10').then((res) => {
    console.log('APP', res)
  })
}) */
//引入用户仓库
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column; /* 竖着浮动 */
  align-items: center;
  .content {
    margin-top: 70px;
    width: 1200px;
    min-height: 700px; /* 最小高度 */
  }
  /* .bottom {
    width: 100%;
    height: 50px;
    background: blue;
  } */
}
</style>
