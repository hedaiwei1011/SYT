<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>就诊人管理</span>
        <el-button class="button" type="success" :icon="User" @click="addUser"
          >添加就诊人</el-button
        >
      </div>
    </template>
    <!-- 展示当前账号已有就诊人信息 -->
    <div class="user" v-if="scene == 0">
      <Visitor
        class="item"
        v-for="(user, index) in allUser"
        :key="index"
        :user="user"
        :index="index"
        @changeScene="changeScene"
        @removeUser="removeUser"
      />
    </div>
    <!-- 添加就诊人｜修改已有的就诊人信息的结构 -->
    <div class="form" v-if="scene == 1">
      <!-- 分割线 就诊人信息 -->
      <el-divider content-position="left">就诊人信息</el-divider>
      <el-form ref="form" :model="form" style="width: 50%; margin: 10px auto">
        <el-form-item label="用户姓名">
          <el-input
            placeholder="请输入用户姓名"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="证件类型">
          <el-select
            placeholder="请选择证件类型"
            style="width: 100%"
            v-model="userParams.certificatesType"
          >
            <el-option
              v-for="item in typeArr"
              :key="item.id"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码">
          <el-input
            placeholder="请输入证件号码"
            v-model="userParams.certificatesNo"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户性别">
          <el-radio-group v-model="userParams.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="userParams.birthdate"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="请选择日期"
          />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input
            placeholder="请输入用户手机号码"
            v-model="userParams.phone"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 分割线 建档信息 -->
      <el-divider content-position="left"
        >建档信息（完善后部分医院首次就诊不排队建档）
      </el-divider>
      <el-form style="width: 50%; margin: 10px auto">
        <el-form-item label="婚姻状况">
          <el-radio-group v-model="userParams.isMarry">
            <el-radio :label="0">未婚</el-radio>
            <el-radio :label="1">已婚</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自费/医保">
          <el-radio-group v-model="userParams.isInsure">
            <el-radio :label="1">自费</el-radio>
            <el-radio :label="0">医保</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="当前住址">
          <el-cascader :props="props" v-model="userParams.addressSelected" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input
            placeholder="请输入详细地址"
            v-model="userParams.address"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 分割线 联系人信息（选填） -->
      <el-divider content-position="left">联系人信息（选填）</el-divider>
      <el-form
        ref="form"
        style="width: 50%; margin: 10px auto"
        label-width="80px"
      >
        <el-form-item label="用户姓名">
          <el-input
            placeholder="请输入用户姓名"
            v-model="userParams.contactsName"
          ></el-input>
        </el-form-item>
        <el-form-item label="证件类型">
          <el-select
            placeholder="请选择证件类型"
            style="width: 100%"
            v-model="userParams.contactsCertificatesType"
          >
            <el-option
              v-for="item in typeArr"
              :key="item.id"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码">
          <el-input
            placeholder="请输入证件号码"
            v-model="userParams.contactsCertificatesNo"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input
            placeholder="请输入用户手机号码"
            v-model="userParams.contactsPhone"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="reset">重写</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { User } from '@element-plus/icons-vue'
import { reqGetUser } from '@/api/hospital/index.ts'
import { UserResponseData, UserArr } from '@/api/hospital/type.ts'
import {
  reqCertationType,
  reqCity,
  reqAddOrUpdateUser,
} from '@/api/user/index.ts'
import { onMounted, ref, reactive, watch } from 'vue'
import type { CascaderProps } from 'element-plus'
import type {
  CertationArr,
  CertationTypeResponseData,
  AddOrUpdateUser,
} from '@/api/user/type.ts'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
let $route = useRoute()
let $router = useRouter()
//就诊人信息
let allUser: UserArr = ref([])
//证件类型
let typeArr: CertationArr = ref([])
//定义响应式数据 决定展示结构
let scene = ref<number>(0)
//收集新增就诊人的数据
let userParams = reactive<AddOrUpdateUser>({
  name: '',
  certificatesType: '',
  certificatesNo: '',
  sex: 0,
  birthdate: '',
  phone: '',
  isMarry: 0,
  isInsure: 0,
  addressSelected: [],
  address: '',
  contactsName: '',
  contactsCertificatesType: '',
  contactsCertificatesNo: '',
  contactsPhone: '',
})
onMounted(() => {
  getAllUser()
  //获取证件类型
  getCertationType()
  //判断当前这个路由组件是不是从挂号组件而来
  //从挂号来 路径上携带了 query
  if ($route.query.type == 'add') {
    scene.value = 1
  }
  if ($route.query.type == 'edit') {
    scene.value = 1
  }
})

const getAllUser = async () => {
  let result: UserResponseData = await reqGetUser()
  //console.log(result)
  if (result.code == 200) {
    allUser.value = result.data
  }
}
//获取证件类型
const getCertationType = async () => {
  let result: CertationTypeResponseData = await reqCertationType()
  if (result.code == 200) {
    typeArr.value = result.data
  }
}

//添加就诊人按钮的回调
const addUser = () => {
  //清空上一次的数据
  reset()
  //切换场景
  scene.value = 1
}
//清空
const reset = () => {
  Object.assign(userParams, {
    id: null,
    name: '',
    certificatesType: '',
    certificatesNo: '',
    sex: 0,
    birthdate: '',
    phone: '',
    isMarry: 0,
    isInsure: 0,
    addressSelected: [],
    address: '',
    contactsName: '',
    contactsCertificatesType: '',
    contactsCertificatesNo: '',
    contactsPhone: '',
  })
}

//就诊人子组件自定义事件的回调
const changeScene = (user: AddOrUpdateUser) => {
  scene.value = 1
  //console.log(user) user:子组件回传给父组件的信息
  Object.assign(userParams, user)
}

//级联选择器的数据（城市）
const props: CascaderProps = {
  lazy: true,
  //加载级联选择器数据的方法
  async lazyLoad(node: any, resolve: any) {
    let result: any = await reqCity(node.data.id || '86')

    //整理数据
    let showData = result.data.map((item: any) => ({
      id: item.id,
      lable: item.name,
      value: item.value,
      leaf: !item.hasChildren,
    }))
    resolve(showData)
  },
}

//提交按钮的方法的回调
const submit = async () => {
  try {
    //要么新增/要么更新
    await reqAddOrUpdateUser(userParams)
    //提示文字
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '新增成功',
    })
    //如果是从挂号跳转过来 提交后应跳转回去
    //切换场景为0
    if ($route.query.type) {
      $router.back() //返回
    } else {
      scene.value = 0
    }

    //再获取全部就诊人的信息
    getAllUser()
  } catch (error) {
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新失败' : '新增失败',
    })
  }
}

//监听全部就诊人的数据
watch(
  () => allUser.value,
  () => {
    //挂号来的修改
    if ($route.query.type == 'edit') {
      //根据传过来的query中的id 找到要更新的就诊人
      let user = allUser.value.find((item: any) => {
        return item.id == $route.query.id
      })
      console.log(allUser)
      Object.assign(userParams, user)
    }
  }
)

//子组件删除按钮的自定义事件
const removeUser = () => {
  getAllUser()
}
</script>

<style scoped lang="scss">
.box-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      color: #7f7f7f;
      font-weight: 450;
      font-size: 20px;
      line-height: 50px;
    }
  }
  .user {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 32%;
      margin: 5px;
    }
  }
}
</style>
