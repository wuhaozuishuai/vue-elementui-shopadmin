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
                <!--侧边栏 -->
                <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#ffd04b">
                    <!-- 一级菜单 -->
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>导航一</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-submenu index="1-4">
                            <template slot="title">选项4</template>
                            <!-- 三级菜单 -->
                            <el-menu-item index="1-4-1">选项1</el-menu-item>
                        </el-submenu>
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
        methods: {
            logout() {
                window.sessionStorage.clear()
                this.$router.push('/login')
            },
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
</style>
