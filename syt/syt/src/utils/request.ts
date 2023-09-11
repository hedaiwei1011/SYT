//对axios函数进行二次封装
import axios from "axios";
//引入用户相关的仓库
import useUserStore from '@/store/modules/user.ts'
import { ElMessage } from "element-plus";
//利用axios.create方法创建一个axios实例：可以设置基础路径、超时的时间的设置
const request = axios.create({
  baseURL:'/api',//请求基础路径的设置
  timeout:5000//超时时间设置，超出5秒就是失败
})
//请求拦截器
request.interceptors.request.use((config)=>{
  //config 请求拦截器回调注入的对象（配置对象）,配置对象的身上最重要的一件事情header属性
  //可以通过请求头携带公共参数--token
  //获取用户仓库
  let userStore = useUserStore()
  if(userStore.userInfo.token){
    //token在用户登陆后 需要携带
    config.headers.token = userStore.userInfo.token
  }
  return config
})
//相应拦截器 有两个回调 一个是成功一个是失败
request.interceptors.response.use((response)=>{
    //响应拦截器成功的回调，一般会进行简化数据
    //response 就是服务器返回的数组
    return response.data
},(error)=>{
  //处理http网络错误
  let status = error.response.status
  switch(status){
    case 404:
      ElMessage({
        type:'error',
        message:'请求失败路径出现问题'
      })
      break
    case 500|501|502|503|504|505:
      ElMessage({
        type:'error',
        message:'服务器挂了'
      })
      break
  }
  return Promise.reject(new Error(error.message))
})

//务必对外暴露axios
export default request 