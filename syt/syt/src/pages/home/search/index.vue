<template>
  <div class="search">
    <el-autocomplete
      clearable
      @select="goDetail"
      :trigger-on-focus="false"
      placeholder="请输入医院名称"
      v-model="hosname"
      :fetch-suggestions="fetchData"
    />
    <el-button type="primary" size="default" :icon="Search">搜索</el-button>
  </div>
</template>

<script setup lang="ts">
//引入elemen-plus 提供图标
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
//引入请求
import { reqHospitalInfo } from '@/api/home/index.ts'
import type { HospitalInfo } from '@/api/home/type.ts'
//创建路由器对象
let $router = useRouter()
//收集搜索的关键字（医院名字）
let hosname = ref<string>('')
//顶部组件的回调
const fetchData = async (keyword: string, cb: any) => {
  //当用户输入完关键字此函数会执行一次
  let result: HospitalInfo = await reqHospitalInfo(keyword)
  /* console.log(result.data) */
  //整理数据，变成组件需要的格式
  let showData = result.data.map((item) => {
    return {
      value: item.hosname, //医院名字
      hoscode: item.hoscode, //医院编码
    }
  })
  //给组件提供展示的数组
  cb(showData)
}
//点击某一个推荐项
const goDetail = (item: any) => {
  /* console.log(item) */
  //点击推荐项进入医院的详情页 将来需要携带query参数（医院编码）
  $router.push({ path: '/hospital/register', query: { hoscode: item.hoscode } })
}
</script>
<script lang="ts">
export default {
  name: 'Search',
}
</script>

<style scoped lang="scss">
.search {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0px;

  /* 深度选择器 */
  /* >>>   /deep/   ::v-deep */
  ::v-deep(.el-input__wrapper) {
    width: 600px;
    margin-right: 10px;
  }
}
</style>
