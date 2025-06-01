import axios from 'axios'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import router from '@/router'

//创建axios实例对象
const request = axios.create({
  baseURL: '/api',
  timeout: 600000
})


// axios的请求 request 拦截器 - 获取LocalStorage中的token,在请求头中增加token请求头
request.interceptors.request.use(
  (config) => {
    // 直接从 localStorage 读取
    const piniaUser = localStorage.getItem('loginUser')
    let token = ''
    if (piniaUser) {
      try {
        token = JSON.parse(piniaUser).loginUser?.token
      } catch {}
    }
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  (error) => Promise.reject(error)
)


// axios的响应 response 拦截器
request.interceptors.response.use(
  (response) => { //成功回调
    return response.data
  },
  (error) => { //失败回调
    if (error.response && error.response.status === 401) {
      // 401未登录或token失效，清空pinia并跳转登录
      // 提示信息
      ElMessage.error('登录已过期，请重新登录')
      const userStore = useUserStore()
      // 清空pinia中的登录用户信息
      userStore.loginUser = null
      // 跳转到登录页面
      router.push('/login')
    }else{
      ElMessage.error('接口访问异常')
    }
    return Promise.reject(error)
  }
)

export default request