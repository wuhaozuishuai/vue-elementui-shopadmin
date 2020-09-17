<template>
    <div>
        <h3>用户列表</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 搜索与添加 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table
                    :data="userList"
                    border
                    stripe
                    style="width: 100%">
                <el-table-column
                       type="index"
                        label="#"
                        width="40">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="姓名"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="电话"
                        width="180">
                </el-table-column>
                <el-table-column
                    prop="role_name"
                    label="角色">
                </el-table-column>
                <el-table-column
                        prop="mg_state"
                        label="状态">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.mg_state"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template >
                        <!-- 修改角色 -->
                        <el-button type="primary" icon="el-icon-edit"></el-button>
                        <!-- 删除角色 -->
                        <el-button type="danger" icon="el-icon-delete"></el-button>
                        <!-- 分配角色 -->
                        <el-tooltip class="item" :enterable="false" effect="dark" content="分配权限" placement="top">
                            <el-button type="warning" icon="el-icon-setting"></el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>

</template>

<script>
    export default {
        data(){
            return{
                //用户列表查询参数
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:2
                },
                //用户列表
                userList:[],
                //
                total:0
            }

        },
        created() {
            this.getUserList()
        },
        methods:{
           async getUserList(){
               const {data:res} = await this.$http.get('/users',{params:this.queryInfo})
               if (res.meta.status!==200) return  this.$message.error(res.meta.msg)
               console.log(res)
               this.userList = res.data.users;
               this.total  =res.data.total
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
