import {defineStore} from 'pinia'
import {reqHospitalDetail,reqHospitalDepartment} from '@/api/hospital/index.ts'
import type {HospitalDetail,DeparmentResponseData} from '@/api/hospital/type.ts'
import type {DetailState} from './interface/index.ts'
//pinia仓库有两种写法：组合式API、选择式API

//以下为组合式API的写法
const useDetailStore = defineStore('Detail',{
  state:():DetailState=>{
    return{
      //医院数据
      hospitalInfo:({} as HospitalDetail),
      depatmentArr:[]
    }
  },
  actions:{
    async getHospital(hoscode:string){
      /* console.log(hoscode) */
      let result:HospitalDetail = await reqHospitalDetail(hoscode)
      /* console.log(result) */
      if(result.code == 200){
        this.hospitalInfo = result.data
      }
    },
    //获取医院科室
    async getDepartment(hoscode:string){
      let result:DeparmentResponseData = await reqHospitalDepartment(hoscode)
      /* console.log(result) */
      if(result.code==200){
        this.depatmentArr= result.data
      }
    }
  },
  getters:{

  }
});

//对外暴露
export default useDetailStore