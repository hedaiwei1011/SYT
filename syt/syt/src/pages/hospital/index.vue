<template>
  <div class="hospital">
    <!-- 左侧导航区域 -->
    <div class="menu">
      <div class="top">
        <el-icon><HomeFilled /></el-icon>
        <span>/ 医院信息</span>
      </div>
      <el-menu :default-active="$route.path" class="el-menu-vertical-demo">
        <el-menu-item
          index="/hospital/register"
          @click="changeActive('/hospital/register')"
        >
          <el-icon><icon-menu /></el-icon>
          <span>预约挂号</span>
        </el-menu-item>
        <el-menu-item
          index="/hospital/detail"
          @click="changeActive('/hospital/detail')"
        >
          <el-icon><document /></el-icon>
          <span>医院详情</span>
        </el-menu-item>
        <el-menu-item
          index="/hospital/notice"
          @click="changeActive('/hospital/notice')"
        >
          <el-icon><setting /></el-icon>
          <span>预约通知</span>
        </el-menu-item>
        <el-menu-item
          index="/hospital/close"
          @click="changeActive('/hospital/close')"
        >
          <el-icon><InfoFilled /></el-icon>
          <span>停诊信息</span>
        </el-menu-item>
        <el-menu-item
          index="/hospital/search"
          @click="changeActive('/hospital/search')"
        >
          <el-icon><Search /></el-icon>
          <span>查询/取消</span>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 右侧内容区域 -->
    <div class="content">
      <!-- 子组件展示结构地方 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useDetailStore from '@/store/modules/hospitalDetail.ts'
import {
  Document,
  Menu as IconMenu,
  InfoFilled,
  Setting,
  Search,
  HomeFilled,
} from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
//获取仓库对象
let detailStore = useDetailStore()
let $router = useRouter()
//获取当前路由的信息
let $route = useRoute()

const changeActive = (path: string) => {
  /* console.log(path) */
  $router.push({ path, query: { hoscode: $route.query.hoscode } })
}
//组件挂载完毕：通知pinia仓库发请求获取医院详情的数据
onMounted(() => {
  //获取医院列表
  detailStore.getHospital($route.query.hoscode as string)
  //获取医院科室
  detailStore.getDepartment($route.query.hoscode as string)
})
</script>

<style scoped lang="scss">
.hospital {
  display: flex;
  .menu {
    flex: 2; /* 占两份 */
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
