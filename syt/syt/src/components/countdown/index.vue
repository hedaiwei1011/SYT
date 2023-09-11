<template>
  <div>
    <span>获取验证码({{ time }}s)</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
//倒计时事件
let time = ref<number>(5)
//接收父组件传递过来的props（flag）：用于控制计数器组件的显示与隐藏
let props = defineProps(['flag'])
//
let $emit = defineEmits(['getFlag'])
//监听父组件传递过来props数据变化
watch(
  () => props.flag,
  () => {
    /* console.log(123) */
    //开启定时器--实现定时调用的函数，可按照指定的周期（以毫秒计）来调用函数或计算表达式
    let timer = setInterval(() => {
      time.value--
      if (time.value == 0) {
        //通知父组件 隐藏倒计时
        $emit('getFlag', false)
        //清除定时器
        clearInterval(timer)
      }
    }, 1000)
  },
  {
    immediate: true,
  }
)
</script>

<style></style>
