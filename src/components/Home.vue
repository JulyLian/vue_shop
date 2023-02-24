<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div><span>电商后台管理系统</span></div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409EFF" 
        :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
          <!-- 一级菜单 -->
          <!-- index只接收字符串，不接收数值 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 以及菜单的模板区域 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 --> 
            <el-menu-item :index="'/'+ subItem.path" v-for="subItem in item.children" 
            :key="subItem.id" @click="saveNavState('/'+ subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容字体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    data() {
        return {
            //左侧菜单数据
            menulist: [],
            iconsObj: {
                '125': 'el-icon-user',
                '103': 'el-icon-lock',
                '101': 'el-icon-goods',
                '102': 'el-icon-edit-outline',
                '145': 'el-icon-data-line'
            },
            //是否折叠
            isCollapse:false,
            //被激活的链接地址
            activePath: ''
        }
    },
    created() {
        //通过调用getMenuList来获取所有的左侧菜单
        this.getMenuList(),
        //整个Home组件已被创建的时候【此时会执行created生命周期函数】，就立即从sessionStorage中把值取出来，
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        logout() {
            window.sessionStorage.clear()
            this.$router.push("/login")
        },
        //获取所有的菜单
        async getMenuList() {
           const { data: res }= await this.$http.get('menus')
           if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
           this.menulist = res.data
           console.log(res)
        },
        //点击|||按钮，切换菜单的折叠与展开
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        //保存链接的激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        }
    }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;

  .el-header {
    //每一个element-ui组件的名称就是一个类名
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
  }

  .el-aside {
    background-color: #545c64; //#333744;
    .toggle-button {
        background-color: #4A5064;
        font-size: 12px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;  //设置|||之间的间距
        cursor: pointer;
    }
    .el-menu {
        border-right: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>