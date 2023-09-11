//引入二次封装的axios
import request from "@/utils/request";
import type {HospitalDetail,DeparmentResponseData,LoginData,UserLoginResponseData,WXLoginResponseData,HospitalWordData,DoctorResponseData,UserResponseData,DoctorInfoData} from './type.ts'

enum API{
  ///api/hosp/hospital/{hoscode}
  HOSPITALDETAIL_URL='/hosp/hospital/',
  //获取某一医院的科室的数据 /api/hosp/hospital/department/{hoscode}
  HOSPITALDEPARTMENT_URL='/hosp/hospital/department/',
  //获取验证码接口 /api/sms/send/{phone}
  GETUSERCODE_URL='/sms/send/',
  //用户登陆 /api/user/login
  USERLOGIN_URL='/user/login',
  //微信登陆 /api/user/weixin/getLoginParam
  WXLOGIN_URL="/user/weixin/getLoginParam",
  //可预约排班数据 /api/hosp/hospital/auth/getBookingScheduleRule/{page}/{limit}/{hoscode}/{depcode}
  HOSPITALWORK_URL="/hosp/hospital/auth/getBookingScheduleRule/",
  //每天排班数据 /api/hosp/hospital/auth/findScheduleList/{hoscode}/{depcode}/{workDate}
  HOSPITALDOCTOR_URL='/hosp/hospital/auth/findScheduleList/',
  //获取每一个账号下 就诊人信息 /api/user/patient/auth/findAll
  GETUSER_URL = '/user/patient/auth/findAll',
  //获取挂号医生的信息 /api/hosp/hospital/getSchedule/{scheduleId}
  GETDOCTOR_URL='/hosp/hospital/getSchedule/'
}

//获取医院详情的接口
export const reqHospitalDetail = (hoscode:string)=>request.get<any,HospitalDetail>(API.HOSPITALDETAIL_URL+hoscode)
//科室数据
export const reqHospitalDepartment = (hoscode:string)=>request.get<any,DeparmentResponseData>(API.HOSPITALDEPARTMENT_URL+hoscode)
//用户验证码
export const reqCode = (phone:string)=>request.get<any,any>(API.GETUSERCODE_URL+phone)
//用户登陆
export const reqUserLogin = (data:LoginData)=>request.post<any,UserLoginResponseData>(API.USERLOGIN_URL,data)
//微信扫码登陆
export const reqWxlogin=(wxRedirectUri: string)=>request.get<any,WXLoginResponseData>(API.WXLOGIN_URL+ `?wxRedirectUri=${wxRedirectUri}`)
//预约挂号数据
export const reqHospitalWork = (page:number,limit:number,hoscode:string,depcode:string)=>request.get<any,HospitalWordData>(API.HOSPITALWORK_URL+`${page}/${limit}/${hoscode}/${depcode}`)
//某天某科室排班医生数据
export const reqHospitalDoctor = (hoscode:string,depcode:string,workDate:string)=>request.get<any,DoctorResponseData>(API.HOSPITALDOCTOR_URL+`${hoscode}/${depcode}/${workDate}`)
//获取某一个账号下就诊人信息
export const reqGetUser = ()=>request.get<any,UserResponseData>(API.GETUSER_URL)
//获得挂号医生的信息
export const reqDoctorInfo=(scheduleId:string)=>request.get<any,DoctorInfoData>(API.GETDOCTOR_URL+`${scheduleId}`)