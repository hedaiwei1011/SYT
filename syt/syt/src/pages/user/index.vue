<template>
  <div class="user">
    <div class="menu">
      <div class="top">
        <el-icon><HomeFilled /></el-icon>
        <span>/ 会员中心</span>
      </div>
      <el-menu :default-active="$route.path" class="el-menu-vertical-demo">
        <el-menu-item
          index="/user/certification"
          @click="goUser('/user/certification')"
        >
          <el-icon><Postcard /></el-icon>
          <span>实名认证</span>
        </el-menu-item>
        <el-menu-item index="/user/order" @click="goUser('/user/order')">
          <el-icon><Memo /></el-icon>
          <span>挂号订单</span>
        </el-menu-item>
        <el-menu-item index="/user/patient" @click="goUser('/user/patient')">
          <el-icon><User /></el-icon>
          <span>就诊人管理</span>
        </el-menu-item>
        <el-menu-item index="/user/profile" @click="goUser('/user/profile')">
          <el-icon><document /></el-icon>
          <span>账号信息</span>
        </el-menu-item>
        <el-menu-item index="/user/feedback" @click="goUser('/user/feedback')">
          <el-icon><ChatLineSquare /></el-icon>
          <span>意见反馈</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  User,
  Memo,
  Postcard,
  Document,
  HomeFilled,
  ChatLineSquare,
} from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
let $router = useRouter()
//获取当前路由的信息
let $route = useRoute()

const goUser = (path: string) => {
  /* console.log(path) */
  $router.push({ path: path })
}
</script>

<style scoped lang="scss">
.user {
  display: flex;
  .menu {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    .top {
      color: #7f7f7f;
      margin-bottom: 10px;
    }
  }
  .content {
    flex: 8;
  }
}
</style>
