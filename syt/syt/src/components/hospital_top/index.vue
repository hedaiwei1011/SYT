<template>
  <div class="top">
    <div class="content">
      <!-- 左侧 -->
      <div class="left" @click="goHome">
        <img src="../../assets/images/logo.png" alt="" />
        <p>尚医通 预约挂号统一平台</p>
      </div>
      <div class="right">
        <p class="help">帮助中心</p>
        <!-- 登陆后要变 -->
        <p class="login" @click="login" v-if="!userStore.userInfo.name">
          登录/注册
        </p>
        <el-dropdown v-else>
          <span class="el-dropdown-link">
            {{ userStore.userInfo.name }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goUser('/user/certification')"
                >实名认证</el-dropdown-item
              >
              <el-dropdown-item @click="goUser('/user/order')"
                >挂号订单</el-dropdown-item
              >
              <el-dropdown-item @click="goUser('/user/patient')"
                >就诊人管理</el-dropdown-item
              >
              <el-dropdown-item @click="logout">退出登陆</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user.ts'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

let userStore = useUserStore()

let $router = useRouter()
//点击图标返回首页
const goHome = () => {
  $router.push({ path: '/home' })
}
//点击的时候弹出登陆对话框
const login = () => {
  userStore.visiable = true
}
//退出登陆
const logout = () => {
  /* console.log(123) */
  //通知pinia仓库清空用户相关信息
  userStore.logout()
  //跳转首页
  $router.push({ path: '/home' })
}
//跳转到会员中心
const goUser = (path: string) => {
  /*  console.log(path) */
  $router.push({ path: path })
}
</script>

<style scoped lang="scss">
.top {
  position: fixed; /* 固定定位 */
  z-index: 999;
  width: 100%;
  height: 70px;
  background: #fff;
  display: flex;
  justify-content: center; /* 在主轴上局中 */
  .content {
    width: 1200px;
    height: 70px;
    background: white;
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
      p {
        font-size: 20px;
        color: #55a6fe;
      }
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #bbb;
      .help {
        margin-right: 10px;
      }
    }
  }
}
</style>
