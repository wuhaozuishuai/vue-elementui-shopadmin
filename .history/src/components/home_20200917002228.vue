<template>
    <!-- <div> -->
        <el-container class="home-container">
            <!-- 头部 -->
            <el-header>
        <!-- <el-button type="info" @click="logout">退出</el-button> -->
                
            </el-header>
            <!-- 主体 -->
            <el-container>
                <!-- 侧边栏 -->
                <el-aside width="200px">Aside</el-aside>
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
    .el-header{
        background-color: #373d41;
    }
    .el-aside{
         background-color: #333744;
    }
    .el-main{
         background-color: #EAEDF1;
    }
    .home-container{
        height: 100%;
    }
    
</style>
