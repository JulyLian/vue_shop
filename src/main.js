import Vue from 'vue'
import App from './App.vue'
//引入VueRouter
import VueRouter from 'vue-router'
//引入路由器
import router from './router'
//导入全局样式表
import './assets/css/global.css'
//按需引入
import { Form,FormItem,Input,Button,Message } from 'element-ui'
//导入axios
import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//把包挂载到vue原型对象上
Vue.prototype.$http = axios  //每一个vue组件都可以通过this直接访问到$http,从而发起ajax请求


Vue.config.productionTip = false

//应用element-ui
Vue.component(Form.name, Form)   //不把Form.name写进去，不会报错，但效果也不显示。Form.name是给组件取的名
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.component(Button.name, Button)
Vue.prototype.$message = Message  //把弹框组件挂载到vue原型对象上

//应用插件
Vue.use(VueRouter)

new Vue({
  router:router,
  render: h => h(App),
}).$mount('#app')
