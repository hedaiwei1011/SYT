//vue3框架提供的方法createapp方法 可以用来创建应用实例方法
import { createApp } from 'vue'
//引入清除默认样式
import '@/style/reset.scss'

//引入根组件app
import App from '@/App.vue'
//引入全局组件--顶部、底部
import HospitalTop from '@/components/hospital_top/index.vue'
import HospitalBottom from '@/components/hospital_bottom/index.vue'
import Login from '@/components/login/index.vue'
import Visitor from '@/components/visitor/visitor.vue'
//引入vue-router核心插件并安装
import router from '@/router'
//引入element-plus插件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//中文
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//引入仓库
import pinia from '@/store/index.ts'
//引入路由守卫
import './permisstion.ts'
//利用createapp方法去创建应用实例，且将应用实例挂载到挂在点上
//createApp(App).mount('#app')
const app = createApp(App);
app.component('HospitalTop',HospitalTop)
app.component('HospitalBottom',HospitalBottom)
app.component('Login',Login)
app.component('Visitor',Visitor)
//安装vue-router
app.use(router)
//安装element-plus
app.use(ElementPlus, {
  locale: zhCn,
})
//安装pinia仓库
app.use(pinia)
//挂载
app.mount('#app') 