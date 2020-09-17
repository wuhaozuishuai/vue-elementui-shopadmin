<template>
    <!-- <div> -->
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="../assets/homeLogo.jpg" class="ims" width="50" height="50" alt/>
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside width="200px">
                <div class="toggle-button">|||</div>

                <!--侧边栏 -->
                <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409Eff"
                        :unique-opened="true"
                        >
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="subItem.id+''" v-for="subItem in item.children" :key="subItem.id">
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                        
                    </el-submenu>

                </el-menu>
            </el-aside>
            <!-- 右侧主体 -->
            <el-main>Main</el-main>
        </el-container>
    </el-container>
    <!-- </div> -->
</template>

<script>
    export default {
        data(){
            return {
                //z左侧菜单数据
                menuList:[],
                iconObj:{
                    '125':'iconfont icon-user',
                    '103':'iconfont icon-tijikongjian',
                    '101':'iconfont icon-shangpin',
                    '102':'iconfont icon-danju',
                    '145':'iconfont icon-baobiao',
                }
            }
        },
        created(){
            this.getMenuList()
        },
        methods: {
            logout() {
                window.sessionStorage.clear()
                this.$router.push('/login')
            },
            async getMenuList(){
                const {data:res} = await this.$http.get('/menus')
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.menuList = res.data
                console.log(this.menuList);
            }
        },
    }
</script>

<style lang='less' scoped>
    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 20px;
        >div{
                display: flex;
                align-items: center;

            }
        span{
            margin-left: 15px;
        }
    }

    .el-aside {
        background-color: #333744;
        .el-menu{
            border-right: 0;
        }
    }

    .el-main {
        background-color: #eaedf1;
    }

    .home-container {
        height: 100%;
    }
    .ims{
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .iconfont{
        margin-right: 10px;
    }
    .toggle-button{
        background-color: #fff;
    }
</style>
