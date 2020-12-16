import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

// 这样做项目的时候可以避免访问和获取数据的名字不一致导致的问题
const USER_KEY = 'toutiao.user'

export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY)
  },
  mutations: {
    setUser (state, data) {
      state.user = data

      setItem(USER_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
