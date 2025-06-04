<script setup>
import { ref,onMounted } from "vue"
import { useUserStore } from '@/store/user';
import { computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { changePasswordApi } from '@/api/user'

// 当前登录员工
const userStore = useUserStore()
const loginName = computed(() => userStore.loginUser?.name || '未登录')
const router = useRouter()

// 退出登录
const logout = () => {
    // 弹出确认框
  ElMessageBox.confirm(
    '您确认退出登录吗？', '提示',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(async () => { // 确认
    ElMessage.success('退出成功');
    // 清除登录状态
    userStore.clearLoginUser();
    // 跳转到登录页面
    router.push('/login');
  }).catch(() => { // 取消
    ElMessage.info('您已取消退出');
  })
}

const showPwdDialog = ref(false)
const pwdForm = ref({
  oldPwd: '',
  newPwd: '',
  confirmPwd: ''
})
const pwdLoading = ref(false)

const handleOpenPwdDialog = () => {
  pwdForm.value = { oldPwd: '', newPwd: '', confirmPwd: '' }
  showPwdDialog.value = true
}

const handlePwdSubmit = async () => {
  if (!pwdForm.value.oldPwd || !pwdForm.value.newPwd || !pwdForm.value.confirmPwd) {
    ElMessage.error('请填写完整信息')
    return
  }
  if (pwdForm.value.newPwd !== pwdForm.value.confirmPwd) {
    ElMessage.error('两次输入密码不一致，请您仔细核对')
    return
  }
  pwdLoading.value = true
  try {
    const res = await changePasswordApi({
      oldPwd: pwdForm.value.oldPwd,
      newPwd: pwdForm.value.newPwd
    })
    if (res && res.code === 1) {
      ElMessage.success('密码修改成功，请重新登录')
      showPwdDialog.value = false
      userStore.clearLoginUser()
      router.push('/login')
    } else if (res && res.code === 0 && res.msg && res.msg.includes('原始密码错误')) {
      ElMessage.error('对不起, 您输入的原始密码错误, 请检查后重新输入')
    } else {
      ElMessage.error(res?.msg || '密码修改失败')
    }
  } catch (e) {
    ElMessage.error(e.message || '密码修改失败')
  } finally {
    pwdLoading.value = false
  }
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- Header 区域 -->
      <el-header class="header">
        <span class="title">Belugu智能学习辅助系统</span>
        <span class="right_tool">
          <a href="javascript:;" @click="handleOpenPwdDialog">
            <el-icon>
              <EditPen />
            </el-icon> 修改密码 &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;
          </a>
          <a href="javascript:;" @click="logout">
            <el-icon>
              <SwitchButton />
            </el-icon> 退出登录 【{{ loginName }}】
          </a>
        </span>
      </el-header>

      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="200px" class="aside">
          <el-menu router>
            <!-- 首页菜单 -->
              <el-menu-item index="/index">
                <el-icon>
                  <Promotion />
                </el-icon> 首页
              </el-menu-item>

            <!-- 班级管理菜单 -->
            <el-sub-menu index="/manage">
              <template #title>
                <el-icon>
                  <Menu />
                </el-icon> 班级学员管理
              </template>
              <el-menu-item index="/clazz">
                <el-icon>
                  <HomeFilled />
                </el-icon>班级管理
              </el-menu-item>
              <el-menu-item index="/stu">
                <el-icon>
                  <UserFilled />
                </el-icon>学员管理
              </el-menu-item>
            </el-sub-menu>

            <!-- 系统信息管理 -->
            <el-sub-menu index="/system">
              <template #title>
                <el-icon>
                  <Tools />
                </el-icon>系统信息管理
              </template>
              <el-menu-item index="/dept">
                <el-icon>
                  <HelpFilled />
                </el-icon>部门管理
              </el-menu-item>
              <el-menu-item index="/emp">
                <el-icon>
                  <Avatar />
                </el-icon>员工管理
              </el-menu-item>
            </el-sub-menu>

            <!-- 数据统计管理 -->
            <el-sub-menu index="/report">
              <template #title>
                <el-icon>
                  <Histogram />
                </el-icon>数据统计管理
              </template>
              <el-menu-item index="/empReport">
                <el-icon>
                  <InfoFilled />
                </el-icon>员工信息统计
              </el-menu-item>
              <el-menu-item index="/stuReport">
                <el-icon>
                  <Share />
                </el-icon>学员信息统计
              </el-menu-item>
              <el-menu-item index="/log">
                <el-icon>
                  <Document />
                </el-icon>日志信息统计
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 修改密码弹窗 -->
        <el-dialog v-model="showPwdDialog" title="修改密码" width="420px" :close-on-click-modal="false">
          <el-form :model="pwdForm" label-width="90px" style="margin-top:10px;">
            <el-form-item label="原始密码" required>
              <el-input v-model="pwdForm.oldPwd" type="password" placeholder="请输入原始密码" clearable />
            </el-form-item>
            <el-form-item label="新密码" required>
              <el-input v-model="pwdForm.newPwd" type="password" placeholder="请输入新密码" clearable />
            </el-form-item>
            <el-form-item label="确认新密码" required label-width="90px" style="white-space:nowrap;">
              <el-input v-model="pwdForm.confirmPwd" type="password" placeholder="请再次输入新密码" clearable />
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button type="primary" :loading="pwdLoading" @click="handlePwdSubmit">保存</el-button>
            <el-button @click="showPwdDialog=false">取消</el-button>
          </template>
        </el-dialog>
      </el-container>

    </el-container>
  </div>
</template>

<style scoped>
.header {
  background-image: linear-gradient(to right, #00547d, #007fa4, #00aaa0, #00d072, #a8eb12);
}

.title {
  color: white;
  font-size: 40px;
  font-family: 楷体;
  line-height: 60px;
  font-weight: bolder;
}

.right_tool {
  float: right;
  line-height: 60px;
}

a {
  color: white;
  text-decoration: none;
}

.aside {
  width: 220px;
  border-right: 1px solid #ccc;
  height: 730px;
}

.el-form-item__label {
  white-space: nowrap;
}
</style>
