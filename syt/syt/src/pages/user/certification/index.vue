<template>
  <!-- 实名认证结构 -->
  <el-card class="box-card">
    <template #header>
      <!-- 卡片头部 -->
      <div class="card-header">
        <h1>实名信息</h1>
      </div>
    </template>
    <!-- 实名认证的提示部分 -->
    <div class="tip">
      <p style="color: #7f7f7f">
        <el-icon>
          <InfoFilled />
        </el-icon>
        完成实名认证后才能添加就诊人，正常进行挂号，为了不影响后续步骤，建议提前实名认证。
      </p>
    </div>
    <!-- 卡片身体的底部：认证成功结构（描述列表）/未认证结构 -->
    <!-- 认证成功 -->
    <el-descriptions
      v-if="userInfo.authStatus == 1"
      class="margin-top"
      :column="1"
      border
    >
      <el-descriptions-item label-align="center" width="2">
        <template #label>
          <div class="cell-item">用户姓名</div>
        </template>
        {{ userInfo.name }}
      </el-descriptions-item>
      <el-descriptions-item label-align="center">
        <template #label>
          <div class="cell-item">证件类型</div>
        </template>
        {{ userInfo.certificatesType == 10 ? '身份证' : '户口本' }}
      </el-descriptions-item>
      <el-descriptions-item label-align="center">
        <template #label>
          <div class="cell-item">证件号码</div>
        </template>
        {{ userInfo.certificatesNo }}
      </el-descriptions-item>
    </el-descriptions>
    <!-- 用户未验证的结构 -->
    <el-form
      ref="form"
      :model="params"
      :rules="rules"
      style="width: 40%; margin: 20px auto"
      label-width="80"
      v-else
    >
      <el-form-item label="用户姓名" prop="name">
        <el-input placeholder="请输入用户姓名" v-model="params.name"></el-input>
      </el-form-item>
      <el-form-item label="证件类型" prop="certificatesType">
        <el-select
          placeholder="请选择证件类型"
          style="width: 100%"
          v-model="params.certificatesType"
        >
          <!-- <el-option label="身份证"></el-option>
          <el-option label="户口本"></el-option> -->
          <el-option
            :label="item.name"
            :value="item.value"
            v-for="(item, index) in typeArr"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号码" prop="certificatesNo">
        <el-input
          placeholder="请输入证件号码"
          v-model="params.certificatesNo"
        ></el-input>
      </el-form-item>
      <el-form-item label="上传照片" prop="certificatesUrl">
        <!-- action:upload组件向服务器提交图片路径
             limit:照片墙约束图片个数
             on-exceed:超出约束数量的钩子
        -->
        <el-upload
          ref="upload"
          list-type="picture-card"
          action="/api/oss/file/fileUpload?fileHost=userAuah"
          :limit="1"
          :on-exceed="exceedhandler"
          :on-success="successhandler"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <img
            style="width: 100%; height: 100%"
            src="../../../assets/images/auth_example.png"
            alt=""
          />
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img
            w-full
            v-if="params.certificatesUrl"
            style="width: 100%; height: 100%"
            :src="params.certificatesUrl"
            alt="Preview Image"
          />
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">重写</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'
import {
  reqUserInfo,
  reqCertationType,
  reqUserCertation,
} from '@/api/user/index.ts'
import type {
  UseringoResponseData,
  CertationArr,
  CertationTypeResponseData,
} from '@/api/user/type.ts'
import { onMounted, ref, reactive } from 'vue'
//@ts-ignore
import { ElMessage } from 'element-plus'

let userInfo: any = ref({})
let typeArr: CertationArr = ref([])
//收集表单数据
let params = reactive({
  certificatesNo: '',
  certificatesType: '',
  certificatesUrl: '',
  name: '',
})
//获取form组件
let form = ref()
let upload = ref()
//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)

onMounted(() => {
  getUserInfo()
  //获取证件类型
  getType()
})

const getUserInfo = async () => {
  let result: UseringoResponseData = await reqUserInfo()
  if (result.code == 200) {
    userInfo.value = result.data
  }
}
//获取证件类型
const getType = async () => {
  let result: CertationTypeResponseData = await reqCertationType()
  if (result.code == 200) {
    typeArr.value = result.data
  }
}

//超出数量的钩子
const exceedhandler = () => {
  ElMessage({
    type: 'error',
    message: '图片只能上传一张图片',
  })
}
//图片上传成功的钩子
const successhandler = (response: any) => {
  //如果图片上传成功校验结果清除
  form.value.clearValidate('certificatesUrl')
  //收集上传成功图片地址
  //response:上传图片请求服务器返回的数据
  //uploadFile上传文件对象
  params.certificatesUrl = response.data
}

//照片墙预览的钩子
const handlePictureCardPreview = () => {
  //触发预览的钩子的时候，对话框显示
  dialogVisible.value = true
}

//照片墙删除图片的钩子
const handleRemove = () => {
  params.certificatesUrl = ''
}

//重写数据
const reset = () => {
  //清除文件上传的列表
  upload.value.clearFiles()
  //清除数据
  Object.assign(params, {
    certificatesNo: '',
    certificatesType: '',
    certificatesUrl: '',
    name: '',
  })
}

//提交按钮的回调
const submit = async () => {
  await form.value.validate()
  try {
    await reqUserCertation(params)
    ElMessage({
      type: 'success',
      message: '认证失败',
    })
    //认证成功之后还要再次获取用户信息进行展示
    getUserInfo()
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '认证失败',
    })
  }
}

//自定义校验规则姓名的方法
const validateName = (rule: any, value: any, callback: any) => {
  //callback放行
  const reg =
    /^[\u00B7\u3007\u3400-\u4DBF\u4E00-\u9FFF\uE000-\uF8FF\uD840-\uD8C0\uDC00-\uDFFF\uF900-\uFAFF]+$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确姓名'))
  }
}
//证件类型校验方法
const validateType = (rule: any, value: any, callback: any) => {
  if (value == '10' || value == '20') {
    callback()
  } else {
    callback(new Error('请选择证件类型'))
  }
}
//证件号码校验规则
const validateNo = (rule: any, value: any, callback: any) => {
  const sfz =
    /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[Xx\d]$/
  const hkb = /^[a-zA-Z0-9]{3,21}$/
  if (sfz.test(value) || hkb.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确证件号码'))
  }
}
//证件照图片地址
const validateUrl = (rule: any, value: any, callback: any) => {
  if (value.length) {
    callback()
  } else {
    callback(new Error('请上传照片'))
  }
}
//表单校验规则
const rules = {
  name: [
    {
      required: true,
      validator: validateName,
    },
  ],
  certificatesType: [
    {
      required: true,
      validator: validateType,
    },
  ],
  certificatesNo: [
    {
      required: true,
      validator: validateNo,
    },
  ],
  certificatesUrl: [
    {
      required: true,
      validator: validateUrl,
    },
  ],
}
</script>

<style scoped lang="scss">
.box-card {
  .card-header {
    color: #7f7f7f;
    font-weight: 450;
    font-size: 20px;
    line-height: 50px;
  }
  .tip {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    margin-bottom: 20px;
  }
}
</style>
