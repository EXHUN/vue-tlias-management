import axios from 'axios'
import { useUserStore } from '@/store/user'
//创建axios实例对象
const request = axios.create({
  baseURL: '/api',
  timeout: 600000
})


// axios的请求 request 拦截器 - 获取LocalStorage中的token,在请求头中增加token请求头
request.interceptors.request.use(
  (config) => { //成功回调
    const userStore = useUserStore()
    const token = userStore.loginUser?.token
    if (token) {
      config.headers['token'] = token;
    }
    
    return config
  },
  (error) => { //失败回调
    return Promise.reject(error)
  }
) 


// axios的响应 response 拦截器
request.interceptors.response.use(
  (response) => { //成功回调
    return response.data
  },
  (error) => { //失败回调
    return Promise.reject(error)
  }
)

export default request