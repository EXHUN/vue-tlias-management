import { defineStore } from 'pinia'

export const useUserStore = defineStore('loginUser', {
  state: () => ({
    loginUser: null
  }),
  persist: true // 开启持久化
})