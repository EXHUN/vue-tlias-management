import { defineStore } from 'pinia'

export const useUserStore = defineStore('loginUser', {
  state: () => ({
    loginUser: null
  }),
  actions: {
    clearLoginUser() {
      // 1. 重置 state
      this.$reset()
      // pinia-plugin-persistedstate 会自动同步 localStorage，无需手动删除
      localStorage.removeItem('loginUser')
    }
  },
  persist: true // 开启持久化
})