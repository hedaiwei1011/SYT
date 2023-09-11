import request from "@/utils/request";
import type {SubmitOrder,OrderResponseData,QrCode,PayReslt,UseringoResponseData,CertationTypeResponseData,UserParams,UserOrderInfoResponseData,AllUserResponseData,AllOrderStateResponseData,AddOrUpdateUser} from './type.ts'
//
enum API{
  //创建订单，获取订单号码接口 /api/order/orderInfo/auth/submitOrder/{hoscode}/{scheduleId}/{patientId}
  SUBMITORDER_URL='/order/orderInfo/auth/submitOrder/',
  //获取订单详情 /api/order/orderInfo/auth/getOrderInfo/{id}
  GETORDERINFO_URL='/order/orderInfo/auth/getOrderInfo/',
  //取消预约 /api/order/orderInfo/auth/cancelOrder/{orderId},
  ORDERCANCEL_URL='/order/orderInfo/auth/cancelOrder/',
  //生成二维码 /api/order/weixin/createNative/{orderId}
  QRCODE_URL='/order/weixin/createNative/',
  //查询订单支付结果 /api/order/weixin/queryPayStatus/{orderId},
  REYRESULT_URL='/order/weixin/queryPayStatus/',
  //会员信息 /api/user/auth/getUserInfo
  USERINFO_URL='/user/auth/getUserInfo',
  //获取证件类型 /api/cmn/dict/findByDictCode/{dictCode}
  CERTIFICATIONTYPR_URL='/cmn/dict/findByDictCode/',
  //用户认证的接口 /api/user/auth/userAuah
  USERCERTATION_URL='/user/auth/userAuah',
  //订单分页列表 /api/order/orderInfo/auth/{page}/{limit}
  USERORDERINFO_URL='/order/orderInfo/auth/',
  //获取全部就诊人信息 /api/user/patient/auth/findAll
  ALLUSER_URL='/user/patient/auth/findAll',
  //获取全部订单状态 /api/order/orderInfo/auth/getStatusList
  ORDERSTATE_URL='/order/orderInfo/auth/getStatusList',
  //获取中国城市数据 /api/cmn/dict/findByParentId/{parentId}
  CITY_URL='/cmn/dict/findByParentId/',
  //新增就诊人 /api/user/patient/auth/save
  ADDUSER_URL='/user/patient/auth/save',
  //修改就诊人/api/user/patient/auth/update
  UPDATEUSER_URL='/user/patient/auth/update',
  //删除就诊人信息 /api/user/patient/auth/remove/{id}
  DELETEUSER_URL='/user/patient/auth/remove/'
}

//提交订单
export const reqSubmitOrder = (hoscode:string,scheduleId:string,patientId:string)=>request.post<any,SubmitOrder>(API.SUBMITORDER_URL+`${hoscode}/${scheduleId}/${patientId}`)
//获取订单详情
export const reqOrderInfo= (id:string)=>request.get<any,OrderResponseData>(API.GETORDERINFO_URL+`${id}`)
//取消预约
export const reqCancelOrder = (id:string)=>request.get<any,any>(API.ORDERCANCEL_URL+`${id}`)
//微信二维码
export const reqQrcode = (orderId:string)=>request.get<any,QrCode>(API.QRCODE_URL+`${orderId}`)
//查询订单支付的结果
export const reqQueryPayState=(orderId:string)=>request.get<any,PayReslt>(API.REYRESULT_URL+`${orderId}`)
//获取当前用户信息的接口
export const reqUserInfo=()=>request.get<any,UseringoResponseData>(API.USERINFO_URL)
//获取证件类型
export const reqCertationType=(CertificatesType = 'CertificatesType')=>request.get<any,CertationTypeResponseData>(API.CERTIFICATIONTYPR_URL+CertificatesType )
//用户认证
export const reqUserCertation = (data:UserParams)=>request.post<any,any>(API.USERCERTATION_URL,data)
//用户所有订单数据展示
export const reqUserOrderInfo=(page:number,limit:number,patientId:string,orderStatus:string)=>request.get<any,UserOrderInfoResponseData>(API.USERORDERINFO_URL+`${page}/${limit}?patientId=${patientId}&orderStatus=${orderStatus}`)
//获取全部就诊人的信息
export const reqAllUser = () =>request.get<any,AllUserResponseData>(API.ALLUSER_URL)
//获取全部订单状态
export const reqOrderState = ()=>request.get<any,AllOrderStateResponseData>(API.ORDERSTATE_URL)
//获取全部城市
export const reqCity = (parentId:string)=>request.get<any,any>(API.CITY_URL+`${parentId}`)
//新增与修改就诊人的接口
export const reqAddOrUpdateUser=(data:AddOrUpdateUser)=>{
  if(data.id){
    return request.put<any,any>(API.UPDATEUSER_URL,data)
  }else{
    return request.post<any,any>(API.ADDUSER_URL,data)
  }
}
//删除某一个就诊人的id
export const reqRemoveUser=(id:number)=>request.delete<any,any>(API.DELETEUSER_URL+`${id}`)