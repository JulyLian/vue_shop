//该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router'
//引入组件
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'

//创建并暴露一个路由器
const router = new VueRouter({
    routes:[
        {
            path: '/',
            redirect: '/login'  //用户从'/'地址就可以重定向‘/login'地址
        },
        {
            path: '/login',
            component: Login  //当用户访问/login地址的时候，通过component属性来指定要展示的组件
        },
        {
            path: '/home',
            component: Home,  //当用户访问/login地址的时候，通过component属性来指定要展示的组件
            redirect:'/welcome', 
             children: [    //children属性是子路由的意思
                {
                    path: '/welcome',
                    component: Welcome,
                },
                {
                    path: '/users',
                    component: Users,
                }  
             ]
        }
    ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next)=>{
    //to 将要访问的路径，from 代表从哪个路径跳转而来， next 是一个函数，表示放行
    // next() 放行，  next('/login') 强制跳转

    if(to.path === '/login') return next()
    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})
export default router