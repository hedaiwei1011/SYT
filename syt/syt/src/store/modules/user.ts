//定义用户相关的仓库
import {defineStore} from 'pinia'
//引入获取验证码的请求方法
import { reqCode,reqUserLogin } from '@/api/hospital'
import type {LoginData,UserLoginResponseData,UserInfo} from './type.ts'
import type {UserState} from './interface/index.ts'
import {SET_TOKEN,GET_TOKEN,REMOVE_TOKEN} from '@/utils/user.ts'

const useUserStore =defineStore('User',{
  state:():UserState=>{
    return{
      visiable:false,//用于控制登陆组件的显示与隐藏
      code:'',//存储验证码
      userInfo:JSON.parse(GET_TOKEN() as string)||{}
    }
  },
  actions:{
    //获取验证码的方法
    async getCode(phone:string){
      /* console.log(phone) */
      let result:any = await reqCode(phone)
      /* console.log(result) */
      if(result.code==200){
        this.code = result.data
        return 'ok'
      }else{
        return Promise.reject(new Error(result.message))
      }
    },
    //用户手机登录
    async userLogin(loginParam:LoginData){
      let result:UserLoginResponseData=await reqUserLogin(loginParam)
      /* console.log(result) */
      if(result.code==200){
        this.userInfo=result.data
        //本地存储持久化存储用户信息
        /* localStorage.setItem('USERINFO',JSON.stringify(this.userInfo)) */
        SET_TOKEN(JSON.stringify(this.userInfo))
        return "ok"
      }else{
        return Promise.reject(new Error(result.message))
      }
    },
    logout(){
      //清空仓库
      this.userInfo={name:'',token:''}
      //清空本地存储
      /* localStorage.removeItem('USERINFO') */
      REMOVE_TOKEN()
    },
    //查询微信扫码的接口
    queryState(){
      //定时器--查是否有定时信息
      let timer = setInterval(()=>{
        if(localStorage.getItem('USERINFO')){
          this.visiable=false
          this.userInfo=JSON.parse(GET_TOKEN() as string)
          clearInterval(timer)
        }
      },1000)
    }
  },
  getters:{

  }
})

export default useUserStore