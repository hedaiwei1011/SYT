<template>
  <div class="region">
    <div class="content">
      <div class="left">地区:</div>
      <ul>
        <li :class="{ active: RegionFlag == '' }" @click="changeRegion('')">
          全部
        </li>
        <li
          v-for="item in RegionArr"
          :key="item.value"
          :class="{ active: RegionFlag == item.value }"
          @click="changeRegion(item.value)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reqHospitalLevelAndRegion } from '@/api/home/index.ts'
import { onMounted, ref } from 'vue'
import type {
  HospitalLevelAndRegionResponseData,
  HospitalLevelAndRegionArr,
} from '@/api/home/type.ts'

//存储地区的数据
let RegionArr = ref<HospitalLevelAndRegionArr>([])
//地区高亮的响应式数据
let RegionFlag = ref<string>('')

//
onMounted(() => {
  getRegion()
})

//获取地区的数据
const getRegion = async () => {
  let result: HospitalLevelAndRegionResponseData =
    await reqHospitalLevelAndRegion('Beijin')
  /* console.log(result) */
  if (result.code == 200) {
    RegionArr.value = result.data
  }
}

const changeRegion = (item: string) => {
  RegionFlag.value = item
  $emit('getRegion', item)
}

let $emit = defineEmits(['getRegion'])
</script>

<style scoped lang="scss">
.region {
  color: #7f7f7f;
  margin-top: 10px;
  .content {
    display: flex;
    .left {
      margin-right: 10px;
      width: 50px;
    }
    ul {
      display: flex;
      flex-wrap: wrap; /* 一行放不下就换行 */
      li {
        margin-right: 10px;
        margin-bottom: 10px;
        &.active {
          color: #55a6fe;
        }
      }
      li:hover {
        color: #55a6fe;
        cursor: pointer; /* 移到上面变成小手 */
      }
    }
  }
}
</style>
