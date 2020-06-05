import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

// 全局导入 axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 使用拦截器在发送请求前添加 token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须 return config
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

// 声明 vue-table-with-tree-grid 的组件
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
