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
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
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
                        label="状态"
                >
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.mg_state"
                                @change="userStateChange(scope.row)"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <!-- 修改角色 -->
                        <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除角色 -->
                        <el-button type="danger" icon="el-icon-delete" @click="sureDeleteUser(scope.row.id)"></el-button>
                        <!-- 分配角色 -->
                        <el-tooltip class="item" :enterable="false" effect="dark" content="分配权限" placement="top">
                            <el-button type="warning" icon="el-icon-setting"></el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[3, 5, 10, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>


        <!-- 添加用户对话框-->
        <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisible"
                @close="addDialogClose"
                width="50%"
        >
            <!-- 主题区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!--  修改用户对话框  -->
        <el-dialog
                title="修改用户"
                :visible.sync="editDialogVisible"
                width="30%"
                @close="editDialogClose"
                >
            <!-- 主题区域 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        data() {
            var checkMobile = (rule, value, callback) => {
                //验证手机正则
                const regMobile = /^1[3456789]\d{9}$/
                if (regMobile.test(value)) {
                    //合法
                    return callback()
                }
                callback(new Error('请输入合法手机号'))
            }
            return {
                //用户列表查询参数
                queryInfo: {
                    //查询参数
                    query: '',
                    //当前页数
                    pagenum: 1,
                    //每页显示条数
                    pagesize: 10
                },
                //用户列表
                userList: [],
                //
                total: 0,
                //控制添加用户对话框显示隐藏
                addDialogVisible: false,
                //控制修改用户对话框显示隐藏
                editDialogVisible:false,
                //添加用户表单
                addForm: {
                    username: '',//用户名
                    password: '123456',//密码
                    email: '123@qqq.cn',//邮箱
                    mobile: '13666666666'//手机
                },
                //修改用户表单
                editForm: {

                },
                //添加用户表单验证规则
                addFormRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '用户名长度为3-10位', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '密码长度为3-10位', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                },
                //修改用户表单验证规则
                editFormRules: {
                    email: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                },
            }

        },
        created() {
            this.getUserList()
        },
        methods: {
            //获取用户列表
            async getUserList() {
                const {data: res} = await this.$http.get('/users', {params: this.queryInfo})
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.userList = res.data.users;
                this.total = res.data.total
            },
            //监听每页显示条数改变事件
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },
            //监听页码改变
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getUserList()
            },
            //用户状态改变
            async userStateChange(userInfo) {
                const {data: res} = await this.$http.put('/users/' + userInfo.id + '/state/' + userInfo.mg_state)
                if (res.meta.status !== 200) {
                    userInfo.mg_state = !userInfo.mg_state
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
            },
            //添加用户对话框关闭
            addDialogClose() {
                this.$refs.addFormRef.resetFields();//清空添加用户对话框
            },
            //确认添加用户
            addUser() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return;//预校验失败
                    //校验成功，执行操作
                    const {data: res} = await this.$http.post('/users', this.addForm);
                    if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
                    this.$message.success(res.meta.msg);
                    this.addDialogVisible = false;
                    await this.getUserList();
                })
            },
            //显示修改用户对话框
            async showEditDialog(id) {
                const {data:res} =await this.$http.get('users/'+id);
                if (res.meta.status!==200) return this.$message.error(res.meta.msg)
                this.editForm  =  res.data
                this.editDialogVisible = true;

            },
            editDialogClose(){
                this.$refs.editFormRef.resetFields();
            },
            //修改用户
            editUser(){
                console.log(this.editForm)
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return;//预校验失败
                    //校验成功，执行操作
                    const {data: res} = await this.$http.put('/users/'+this.editForm.id, {email:this.editForm.email,mobile:this.editForm.mobile});
                    console.log(res)
                    if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                    this.$message.success(res.meta.msg);
                    this.editDialogVisible = false;
                    await this.getUserList();
                })
            },
            //确认删除用户弹窗
            sureDeleteUser(id) {
                this.$confirm('确认删除用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const {data:res} =await this.$http.delete('/users/'+id);
                    if (res.meta.status!==200)return this.$message.error('删除失败，请重试！');
                    await this.getUserList();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
