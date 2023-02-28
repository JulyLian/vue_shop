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
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload
 } from 'element-ui'

 //导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme 

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

//全局定义一个格式化时间的过滤器
Vue.filter('dataFormat',function(originval) {
  const dt = new Date(originval)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')  //Month是从0开始的，所以要加1，字符串的padStart(2,'0'):不足两位数，用0填充
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

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
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.prototype.$message = Message  //把弹框组件挂载到vue原型对象上
Vue.prototype.$confirm = MessageBox.confirm

//应用插件
Vue.use(VueRouter)
//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

new Vue({
  router:router,
  render: h => h(App),
}).$mount('#app')
