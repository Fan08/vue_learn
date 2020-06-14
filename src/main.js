import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

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

// 将富文本编辑器注册为全局可用
Vue.use(VueQuillEditor)

// 定义全局的时间过滤器
// 使用构造函数实现
Vue.filter('dateFormat', function(originalVal) {
  const dt = new Date(originalVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}`
})

// 在全局定义路由方法
// 使用方式：this.$router.push('/goods/add')
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
