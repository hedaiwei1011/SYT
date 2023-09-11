<template>
  <div>
    <!-- 首页轮播图结构 -->
    <Carousel />
    <!-- 首页搜索医院的表单区域 -->
    <Search />
    <!-- 底部展示医院的结构 -->
    <el-row gutter="20">
      <el-col :span="20">
        <!-- 等级子组件 -->
        <Level @getLevel="getLevel" />
        <!-- 地区 -->
        <Region @getRegion="getRegion" />
        <!-- 展示医院的结构 -->
        <div class="hospital" v-if="hasHospitalArr.length > 0">
          <Card
            class="item"
            v-for="(item, index) in hasHospitalArr"
            :key="item.id"
            :hospitalInfo="item"
          />
        </div>
        <el-empty v-else description="暂无数据" />
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :background="true"
          layout="prev, pager, next, jumper,->, sizes,total "
          :total="total"
          @current-change="currentChange"
          @size-change="sizeChange"
        />
      </el-col>
      <!-- 首页右侧 -->
      <el-col :span="4">
        <Tip />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
//引入组合式API函数
import { onMounted, ref } from 'vue'
import { reqHospital } from '@/api/home/index.ts'
//引入首页轮播图组件
import Carousel from './carousel/index.vue'
//首页搜索组件
import Search from './search/index.vue'
//首页等级
import Level from './level/index.vue'
//地区
import Region from './region/index.vue'
//医院展示
import Card from './card/index.vue'
//右侧
import Tip from './tip/index.vue'

import { Content, HospitalResponseData } from '@/api/home/type.ts'

//分页器当前页码  ts声明变量是要约束变量的数据类型
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(10)
//存储已有的医院的数据
let hasHospitalArr = ref<Content>([])
//存储已有医院的总个数
let total = ref<number>(0)
//存储医院的等级相应数据
let hostype = ref<string>('')
//存储医院的地区
let districtCode = ref<string>('')

//组件挂载完毕发一次请求
onMounted(() => {
  getHospitalInfo()
})

//获取已有的医院的数据
const getHospitalInfo = async () => {
  //获取医院的数据：默认获取第一页,一页10个
  let result: HospitalResponseData = await reqHospital(
    pageNo.value,
    pageSize.value,
    hostype.value,
    districtCode.value
  )
  /* console.log(result) */
  if (result.code == 200) {
    //存储已有的数据
    hasHospitalArr.value = result.data.content
    total.value = result.data.totalElements
  }
}

//分页器页码发生变化时的回调
const currentChange = () => {
  getHospitalInfo()
}

//分页器下拉菜单发生变化的时候会触发
const sizeChange = () => {
  getHospitalInfo()
}

//子组件自定义事件 ：获取儿子给父组件传递过来的等级参数
const getLevel = (level: string) => {
  /* console.log(level) */
  //收集等级的参数
  hostype.value = level
  //再次发请求
  getHospitalInfo()
}

const getRegion = (item: string) => {
  districtCode.value = item
  getHospitalInfo()
}
</script>

<style scoped lang="scss">
.hospital {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .item {
    width: 48%;
    margin: 10px 0px;
  }
}
</style>
