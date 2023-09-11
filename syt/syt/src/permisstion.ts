//路由鉴权---路由能不能被访问到的权限设置-》全局守卫完成

//引入路由器
import router from './router'
//引入进度条
import NProgress from 'nprogress'
//引入进度条的样式
import 'nprogress/nprogress.css'
//进度条不要小圆圈
NProgress.configure({ showSpinner: false });
//引入大仓库
import pinia from '@/store'
import useUserStore from './store/modules/user';
let userStore = useUserStore(pinia)
//存储用户未登录可以访问路由得路径
let whiteList = ["/home", '/hospital/register', '/hospital/detail', '/hospital/notice', '/hospital/close', '/hospital/search'];
//添加相应的全局守卫
//前置守卫
router.beforeEach((to,from,next)=>{
  //访问路由组件之前，进度条开始动
  NProgress.start();
  //动态设置网页左上角标题
  document.title=`尚医通-${to.meta.title}`

  //判断用户是否登录-token
  let token= userStore.userInfo.token;
  if(token){
    //用户登陆
    next()
  }else{
    //用户未登录
    if(whiteList.includes(to.path)){
      next()
    }else{
      //登录组件显示不来
      userStore.visiable = true;
      next({ path: '/home', query: { redirect: to.fullPath } })
    }
  }
  
})
//后置守卫
router.afterEach((to,from)=>{
  //访问路由组件成功，进度条消失
  NProgress.done();
})