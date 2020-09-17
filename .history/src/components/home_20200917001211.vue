<template>
    <div>
        <el-button type="info" @click="logout">退出</el-button>
        <el-container>
            <el-header>Header</el-header>
            <el-container>
                <el-aside width="200px">Aside</el-aside>
                <el-main>Main</el-main>
            </el-container>
        </el-container>
    </div>
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
</style>
