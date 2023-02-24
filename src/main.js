import Vue from 'vue'
import App from './App.vue'
//引入VueRouter
import VueRouter from 'vue-router'
//引入路由器
import router from './router'
//导入全局样式表
import './assets/css/global.css'
//按需引入
import { 
  Form,
  FormItem,
  Input,
  Button,
  Message, 
  Container, 
  Header, 
  Aside, 
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox
 } from 'element-ui'
//导入axios
import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//axios请求拦截
axios.interceptors.request.use(config => {
  // console.log(config)
  //为请求头对象，添加Token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在最后必须return config
  return config
})

//把包挂载到vue原型对象上
Vue.prototype.$http = axios  //每一个vue组件都可以通过this直接访问到$http,从而发起ajax请求


Vue.config.productionTip = false

//应用element-ui
Vue.use(Form)   //不把Form.name写进去，不会报错，但效果也不显示。Form.name是给组件取的名
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$message = Message  //把弹框组件挂载到vue原型对象上
Vue.prototype.$confirm = MessageBox.confirm
//应用插件
Vue.use(VueRouter)

new Vue({
  router:router,
  render: h => h(App),
}).$mount('#app')
