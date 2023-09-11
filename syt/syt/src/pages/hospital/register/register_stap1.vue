<template>
  <div class="wrap">
    <!-- 顶部结构 -->
    <div class="top">
      <div class="hosname">{{ workData.baseMap?.hosname }}</div>
      <div class="line"></div>
      <div>{{ workData.baseMap?.bigname }}</div>
      <div class="dot">.</div>
      <div class="hosdeparment">{{ workData.baseMap?.depname }}</div>
    </div>
    <!-- 排班时间 是否有号 -->
    <div class="center">
      <h1>{{ workData.baseMap?.workDateString }}</h1>
      <div class="container">
        <div
          class="item"
          :class="{
            active: item.status == -1 || item.availableNumber == -1,
            cur: item.workDate == workTime.workDate,
          }"
          v-for="item in workData.bookingScheduleList"
          :key="item"
          @click="changeTime(item)"
        >
          <div class="top1">{{ item.workDate }}-{{ item.dayOfWeek }}</div>
          <div class="bottom">
            <div v-if="item.status == -1">停止挂号</div>
            <div v-if="item.status == 0">
              {{
                item.availableNumber == -1
                  ? '已约满'
                  : `有号(${item.availableNumber})`
              }}
            </div>
            <div v-if="item.status == 1">即将放号</div>
          </div>
        </div>
      </div>
      <el-pagination
        v-model:current-page="pageNo"
        layout="prev, pager, next"
        :total="workData.total"
        @current-change="fetchWorkdata"
      />
    </div>
    <!-- 展示医生 -->
    <div class="bottom">
      <!-- 即将放号的展示 -->
      <div class="will" v-if="workTime.status == 1">
        <span class="time">shijian</span>
        <span class="willTest">放号</span>
      </div>
      <!-- 展示医生 -->
      <div class="doctor" v-else>
        <!-- 上午 -->
        <div class="morning">
          <!-- 文字提示 -->
          <div class="tip">
            <svg
              t="1693536590210"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2383"
              width="32"
              height="32"
            >
              <path
                d="M904.101037 676.946871H118.670712c-15.461511 0-28.105271-12.535384-28.105271-28.033021 0-15.461511 12.643759-28.105271 28.105271-28.10527h785.430325c15.461511 0 28.105271 12.643759 28.105271 28.10527s-12.607634 28.033021-28.105271 28.033021z m-56.029916-324.980738c-11.018133 10.945883-28.719396 10.945883-39.665279 0-11.018133-10.945883-11.018133-28.755521 0-39.665279l39.665279-39.665279a27.97522 27.97522 0 0 1 39.593029 0 27.93187 27.93187 0 0 1 0 39.665279l-39.593029 39.665279z m-62.279545 212.776406c-26.082269-128.027094-138.683977-224.444789-274.441826-224.44479-135.649474 0-248.287307 96.417696-274.369576 224.44479H177.915755c21.602766-158.263741 162.454244-280.583081 333.433995-280.583081 171.088125 0 311.903478 122.31934 333.506244 280.583081h-59.064418z m-274.441826-336.612997c-15.461511 0-28.033021-12.535384-28.033021-28.10527V143.95823c0-15.461511 12.535384-28.105271 28.033021-28.10527 15.569886 0 28.105271 12.643759 28.10527 28.10527v56.029916c0 15.606011-12.535384 28.141396-28.10527 28.141396zM174.700628 351.966133L135.035349 312.264729c-10.945883-10.945883-10.945883-28.755521 0-39.665279 11.018133-10.945883 28.719396-10.945883 39.665279 0l39.665279 39.665279a27.93187 27.93187 0 0 1 0 39.665279c-10.909758 10.982008-28.647146 10.982008-39.665279 0.036125z m-28.033021 381.119029h729.40041c15.497636 0 28.033021 12.535384 28.03302 28.03302a28.033021 28.033021 0 0 1-28.03302 28.033021H146.667607c-15.497636 0-28.033021-12.535384-28.03302-28.033021 0.036125-15.497636 12.571509-28.033021 28.03302-28.03302z m84.171312 112.168207h561.093911c15.497636 0 28.033021 12.535384 28.033021 28.033021 0 15.569886-12.535384 28.105271-28.033021 28.10527H230.838919c-15.497636 0-28.033021-12.535384-28.03302-28.10527 0-15.497636 12.535384-28.033021 28.03302-28.033021z"
                fill="#7dc5eb"
                p-id="2384"
              ></path>
            </svg>
            <span>上午号源</span>
          </div>
          <!-- 每一个医生信息展示 -->
          <div class="doc_info" v-for="doctor in morningArr" :key="doctor.id">
            <!-- 名字+技能 -->
            <div class="left">
              <!-- 职位+名字 -->
              <div class="info">
                <span>{{ doctor.title }}</span>
                <span>|</span>
                <span>{{ doctor.docname }}</span>
              </div>
              <!-- 技能 -->
              <div class="skill">{{ doctor.skill }}</div>
            </div>
            <!-- 挂号费+号数 -->
            <div class="right">
              <div class="money">¥ {{ doctor.amount }}</div>
              <el-button type="primary" @click="goStep2(doctor)"
                >剩余({{ doctor.availableNumber }})</el-button
              >
            </div>
          </div>
        </div>
        <!-- 下午 -->
        <div class="morning">
          <!-- 文字提示 -->
          <div class="tip">
            <svg
              t="1693536590210"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2383"
              width="32"
              height="32"
            >
              <path
                d="M904.101037 676.946871H118.670712c-15.461511 0-28.105271-12.535384-28.105271-28.033021 0-15.461511 12.643759-28.105271 28.105271-28.10527h785.430325c15.461511 0 28.105271 12.643759 28.105271 28.10527s-12.607634 28.033021-28.105271 28.033021z m-56.029916-324.980738c-11.018133 10.945883-28.719396 10.945883-39.665279 0-11.018133-10.945883-11.018133-28.755521 0-39.665279l39.665279-39.665279a27.97522 27.97522 0 0 1 39.593029 0 27.93187 27.93187 0 0 1 0 39.665279l-39.593029 39.665279z m-62.279545 212.776406c-26.082269-128.027094-138.683977-224.444789-274.441826-224.44479-135.649474 0-248.287307 96.417696-274.369576 224.44479H177.915755c21.602766-158.263741 162.454244-280.583081 333.433995-280.583081 171.088125 0 311.903478 122.31934 333.506244 280.583081h-59.064418z m-274.441826-336.612997c-15.461511 0-28.033021-12.535384-28.033021-28.10527V143.95823c0-15.461511 12.535384-28.105271 28.033021-28.10527 15.569886 0 28.105271 12.643759 28.10527 28.10527v56.029916c0 15.606011-12.535384 28.141396-28.10527 28.141396zM174.700628 351.966133L135.035349 312.264729c-10.945883-10.945883-10.945883-28.755521 0-39.665279 11.018133-10.945883 28.719396-10.945883 39.665279 0l39.665279 39.665279a27.93187 27.93187 0 0 1 0 39.665279c-10.909758 10.982008-28.647146 10.982008-39.665279 0.036125z m-28.033021 381.119029h729.40041c15.497636 0 28.033021 12.535384 28.03302 28.03302a28.033021 28.033021 0 0 1-28.03302 28.033021H146.667607c-15.497636 0-28.033021-12.535384-28.03302-28.033021 0.036125-15.497636 12.571509-28.033021 28.03302-28.03302z m84.171312 112.168207h561.093911c15.497636 0 28.033021 12.535384 28.033021 28.033021 0 15.569886-12.535384 28.105271-28.033021 28.10527H230.838919c-15.497636 0-28.033021-12.535384-28.03302-28.10527 0-15.497636 12.535384-28.033021 28.03302-28.033021z"
                fill="#7dc5eb"
                p-id="2384"
              ></path>
            </svg>
            <span>下午号源</span>
          </div>
          <!-- 每一个医生信息展示 -->
          <div class="doc_info" v-for="doctor in afterArr" :key="doctor.id">
            <!-- 名字+技能 -->
            <div class="left">
              <!-- 职位+名字 -->
              <div class="info">
                <span>{{ doctor.title }}</span>
                <span>|</span>
                <span>{{ doctor.docname }}</span>
              </div>
              <!-- 技能 -->
              <div class="skill">{{ doctor.skill }}</div>
            </div>
            <!-- 挂号费+号数 -->
            <div class="right">
              <div class="money">¥ {{ doctor.amount }}</div>
              <el-button type="primary" @click="goStep2(doctor)">
                剩余({{ doctor.availableNumber }})</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { reqHospitalWork, reqHospitalDoctor } from '@/api/hospital/index.ts'
import type {
  HospitalWordData,
  DoctorResponseData,
  DocArr,
  Doctor,
} from './type.ts'
import { useRoute, useRouter } from 'vue-router'
let $route = useRoute()
let $router = useRouter()
//
let pageNo = ref<number>(1)
let limit = ref<number>(6)
//挂号数据
let workData = ref<any>({})
//排班日期
let workTime: any = ref({})
//排班医生数据
let docArr = ref<DocArr>([])
onMounted(() => {
  fetchWorkdata()
})
//发请求 每天日期是否有号
const fetchWorkdata = async () => {
  let result: HospitalWordData = await reqHospitalWork(
    pageNo.value,
    limit.value,
    $route.query.hoscode,
    $route.query.depcode
  )
  if (result.code == 200) {
    workData.value = result.data
    //需要获得第一天的时间 点开就要展示第一天的数据
    workTime.value = workData.value.bookingScheduleList[0]
    //获取一次医生的数据
    getDoctorWorkData()
  }
}

//获取某一天医生排班的数据
const getDoctorWorkData = async () => {
  let result: DoctorResponseData = await reqHospitalDoctor(
    $route.query.hoscode,
    $route.query.depcode,
    workTime.value.workDate
  )
  if (result.code == 200) {
    docArr.value = result.data
  }
}

//点击时间触发
const changeTime = (item: any) => {
  //存储用户选择的那一天的数据
  workTime.value = item
  //再发请求 获取医生排班数据
  getDoctorWorkData()
}

//计算出上午排班的数据
let morningArr = computed(() => {
  return docArr.value.filter((doc: Doctor) => {
    return doc.workTime == 0
  })
})
//计算出下午排班的数据
let afterArr = computed(() => {
  return docArr.value.filter((doc: Doctor) => {
    return doc.workTime == 1
  })
})

//路由跳转进入到选择就医人
const goStep2 = (doctor: any) => {
  /* console.log(doctor) */
  $router.push({
    path: '/hospital/register_step2',
    query: { docId: doctor.id },
  })
}
</script>

<style scoped lang="scss">
.wrap {
  .top {
    display: flex;
    color: #7f7f7f;
    .line {
      width: 2px;
      height: 15px;
      background-color: #7f7f7f;
      margin: 0px 9px;
    }
    .dot {
      margin: 0px 10px;
    }
  }
  .center {
    margin: 20px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    h1 {
      font-weight: 900;
    }
    .container {
      width: 100%;
      display: flex;
      margin: 30px 0px;
      color: #7f7f7f;
      .item {
        flex: 1;
        border: 1px solid skyblue;
        margin: 0px 5px;

        &.active {
          border: 1px solid #ccc;
          .top1 {
            background: #ccc;
          }
        }
        &.cur {
          transform: scale(1.1); /* 点击放大缩小 */
        }
        .top1 {
          background-color: #e8f2ff;
          height: 30px;
          width: 100%;
          text-align: center;
          line-height: 30px;
        }
        .bottom {
          width: 100%;
          height: 60px;
          text-align: center;
          line-height: 60px;
        }
      }
    }
  }
  .bottom {
    .will {
      text-align: center;
      font-size: 20px;
      font-weight: 900;
      .time {
        color: skyblue;
      }
      .willTest {
        color: #7f7f7f;
        margin-left: 5px;
      }
    }
    .doctor {
      .morning {
        .tip {
          display: flex;
          align-items: center; /* 侧轴上居中 */
          span {
            color: #7f7f7f;
            font-size: 16px;
            font-weight: bold;
            margin-left: 3px;
          }
        }
        .doc_info {
          display: flex;
          justify-content: space-between; /* 主轴 */
          margin: 10px 0px;
          border-bottom: 1px solid #ccc;
          .left {
            .info {
              color: skyblue;
              margin: 10px 0px;
              span {
                margin: 0px 8px;
                font-size: 18px;
                font-weight: 900;
              }
            }
            .skill {
              margin: 10px 0px;
              color: #7f7f7f;
            }
          }
          .right {
            width: 150px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .money {
              color: #7f7f7f;
              font-weight: 700;
            }
          }
        }
      }
    }
  }
}
</style>
