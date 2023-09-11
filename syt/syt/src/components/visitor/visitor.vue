<template>
  <!-- 就诊人信息展示 -->
  <div class="visitor">
    <div class="top">
      <div class="left">
        <span class="free">{{ user.isInsure == 1 ? '医保' : '自费' }}</span>
        <span class="username">{{ user.name }}</span>
      </div>
      <div class="right">
        <el-button
          circle
          type="primary"
          :icon="Edit"
          @click="handler"
        ></el-button>

        <el-popconfirm
          @confirm="removeUser"
          :title="`你确定要删除${user.name}?`"
          width="200px"
        >
          <template #reference>
            <el-button
              v-if="$route.path == '/user/patient'"
              circle
              type="danger"
              :icon="Delete"
            ></el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <div class="bottom">
      <p>证件类型：{{ user.param.certificatesTypeString }}</p>
      <p>证件号码：{{ user.contactsCertificatesNo }}</p>
      <p>用户性别：{{ user.sex == 0 ? '女' : '男' }}</p>
      <p>出生日期：{{ user.birthdate }}</p>
      <p>手机号码：{{ user.phone }}</p>
      <p>婚姻状况：{{ user.isMerry == 0 ? '未婚' : '已婚' }}</p>
      <p>当前住址：{{ user.param.cityString }}</p>
      <p>详细地址：{{ user.param.fullAddress }}</p>
      <!-- 红色已选择盒子 -->
      <div class="confirm" v-if="index == currentIndex">已选择</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit, Delete } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { reqRemoveUser } from '@/api/user/index.ts'
import { ElMessage } from 'element-plus'
let $route = useRoute()
let $router = useRouter()
//接收父组件传过来的就诊人信息
let props = defineProps(['user', 'currentIndex', 'index'])
let $emit = defineEmits(['changeScene', 'removeUser'])

//就诊人组件修改按钮的回调
const handler = () => {
  //判断是从挂号还是就诊人管理点击的
  if ($route.path == '/user/patient') {
    $emit('changeScene', props.user)
  } else {
    //路由跳转携带参数
    $router.push({
      path: '/user/patient',
      query: { type: 'edit', id: props.user.id },
    })
  }
}

//删除某一个用户
const removeUser = async () => {
  try {
    //
    await reqRemoveUser(props.user.id)
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    $emit('removeUser')
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
</script>

<style scoped lang="scss">
.visitor {
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  .top {
    height: 60px;
    background: #e5e5e5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      .free {
        margin-left: 10px;
        background: white;
        padding: 3px;
        font-size: 10px;
      }
      .username {
        color: #7f7f7f;
        margin-left: 5px;
      }
    }
    .right {
      margin-right: 10px;
    }
  }
  .bottom {
    position: relative;
    padding: 15px;
    p {
      line-height: 30px;
    }
    .confirm {
      position: absolute;
      width: 200px;
      height: 200px;
      color: red;
      border-radius: 50%;
      border: 1px dashed red;
      text-align: center;
      line-height: 200px;
      left: 20%;
      top: 10%;
      opacity: 0.5; /* 透明度 */
      transform: rotate(45deg);
      font-weight: 500;
    }
  }
}
</style>
