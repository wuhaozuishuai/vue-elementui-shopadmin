<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 搜索与添加 -->
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-button type="primary" @click="addRoleVisible">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table
                    :data="rolesList"
                    border
                    stripe
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',index1===0 ? 'bdtop' : '','vcentr']"
                                v-for="(item1,index1) in scope.row.children" :key="item1.id">
                            <!--                            一级权限-->
                            <el-col :span="5">
                                <el-tag closable
                                        @close="removeRightById(scope.row,item1.id)">
                                    {{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--                            二级和三级权限-->
                            <el-col :span="19">
                                <el-row :class="[index2===0 ? '' : 'bdtop','vcentr']"
                                        v-for="(item2,index2) in item1.children" :key="item2.id">
                                    <el-col :span="5">
                                        <el-tag type="success" closable
                                                @close="removeRightById(scope.row,item2.id)">
                                            {{item2.authName}}

                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="19">
                                        <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable
                                                @close="removeRightById(scope.row,item3.id)"
                                        >
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column
                        type="index"
                        label="#"
                        width="40">
                </el-table-column>
                <el-table-column
                        prop="roleName"
                        label="名称"
                >
                </el-table-column>
                <el-table-column
                        prop="roleDesc"
                        label="描述"
                >
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <!-- 修改角色 -->
                        <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑
                        </el-button>
                        <!-- 删除角色 -->
                        <el-button type="danger" icon="el-icon-delete" @click="sureDelete(scope.row.id)">删除</el-button>
                        <!-- 分配角色 -->
                        <el-tooltip class="item" :enterable="false" effect="dark" content="分配权限" placement="top">
                            <el-button type="warning" icon="el-icon-setting" @click="showRightdialog(scope.row)">分配权限</el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色对话框-->
        <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogVisible"
                @close="dialogClose"
                width="50%"
        >
            <!-- 主题区域 -->
            <el-form :model="RolesForm" :rules="FormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="名称" prop="roleName">
                    <el-input v-model="RolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="roleDesc">
                    <el-input v-model="RolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog
                title="分配权限"
                :visible.sync="rightDialogVisible"                width="50%"
                :before-close="colseRight"
                >
            <el-tree :data="rightsList"
                     :props="treeProps"
                     default-expand-all
                     show-checkbox
                     node-key="id"
                     :default-checked-keys="defKeys"
                     ref="treeRef1"
            ></el-tree>


            <span slot="footer" class="dialog-footer">
                <el-button @click="rightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRight">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                //角色列表
                rolesList: [],
                //控制添加角色对话框显示隐藏
                dialogVisible: false,
                //添加角色表单
                RolesForm: {
                    roleName: '123',//角色名称
                    roleDesc: '31',//角色描述
                },
                //对话框类型  0:增加   1：修改
                dialogType: 0,
                //对话框标题
                dialogTitle: '',
                //添加用户表单验证规则
                FormRules: {
                    roleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        {min: 3, max: 10, message: '名称长度为3-10位', trigger: 'blur'}
                    ],
                    roleDesc: [
                        {required: true, message: '请输入角色描述', trigger: 'blur'},
                        {min: 6, max: 15, message: '描述长度为6-15位', trigger: 'blur'}
                    ],
                },
                rightDialogVisible:false,
                //所有权限数据
                rightsList:[],
                //树形控件的绑定对象
                treeProps:{
                    label:'authName',
                    children:'children'
                },
                //角色对应选中权限id值数组
                defKeys:[],
                //当前点击角色id
                roleID:''



            }
        },
        created() {
            this.getRolesList();
        },
        methods: {
            //获取角色列表
            async getRolesList() {
                const {data: res} = await this.$http.get('/roles')
                if (res.meta.status !== 200) return this.$message.error('获取角色列表失败，请刷新重试！')
                this.rolesList = res.data
            },
            //对话框关闭事件
            dialogClose() {
                this.RolesForm = {
                    roleName: '',
                    roleDesc: ''
                }
                this.$refs.addFormRef.resetFields();//清空添加用户对话框
            },
            //确认添加/修改角色
            addRole() {
                if (this.dialogType == 0) {
                    this.$refs.addFormRef.validate(async valid => {
                        if (!valid) return;//预校验失败
                        //校验成功，执行操作
                        const {data: res} = await this.$http.post('/roles', this.RolesForm);
                        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
                        this.$message.success(res.meta.msg);
                        this.dialogVisible = false;
                        await this.getRolesList();
                    })
                } else if (this.dialogType == 1) {
                    this.$refs.addFormRef.validate(async valid => {
                        if (!valid) return;//预校验失败
                        //校验成功，执行操作
                        const {data: res} = await this.$http.put('/roles/' + this.RolesForm.roleId, this.RolesForm);
                        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                        this.$message.success(res.meta.msg);
                        this.dialogVisible = false;
                        await this.getRolesList();
                    })
                }

            },
            //添加角色打开对话框
            addRoleVisible() {
                this.RolesForm = {
                    roleName: '',
                    roleDesc: ''
                };
                this.dialogTitle = '添加角色';
                this.dialogType = 0;//修改类型为添加角色
                this.dialogVisible = true;

            },
            //修改角色打开对话框
            async showEditDialog(id) {
                const {data: res} = await this.$http.get('/roles/' + id);
                if (res.meta.status !== 200) return this.$message.error('查询角色失败，请重试！')
                this.RolesForm = res.data;
                this.dialogTitle = '修改角色';
                this.dialogType = 1;//修改类型为修改角色
                this.dialogVisible = true;
            },
            //确认删除角色弹窗
            sureDelete(id) {
                this.$confirm('确认删除角色?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const {data: res} = await this.$http.delete('/roles/' + id);
                    if (res.meta.status !== 200) return this.$message.error('删除失败，请重试！');
                    await this.getRolesList();
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
            },
            //根据id删除权限
            async removeRightById(row, rightId) {
                //弹框提示用户是否删除
                const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(reason => {
                    console.log(reason)
                });
                if (confirmResult !== 'confirm') return this.$message.info('取消了操作');
                const {data: res} = await this.$http.delete(`roles/${row.id}/rights/${rightId}`);
                if (res.meta.status !== 200) {
                    this.$message.error('删除权限失败！');
                }
                row.children = res.data;
            },
            //打开分配权限对话框
            async showRightdialog(role) {
                this.roleID = role.id
                //获取所有权限的数据
                const {data:res}= await this.$http.get('/rights/tree');
                if (res.meta.status!==200) return this.$message.error('获取权限列表失败！');
                this.rightsList  = res.data;
                //递归获取三级节点id
                this.getLeafKeys(role,this.defKeys)
                this.rightDialogVisible  = true
            },
            //通过递归的形式，获取角色下所有三级权限的id,并保存到defKeys中
            getLeafKeys(node,arr){
                //如果当前node节点不包含children属性，则是三级节点
                if (!node.children){
                    return arr.push(node.id)
                }
                node.children.forEach(item=>{
                    this.getLeafKeys(item,arr)
                })
            },
            //关闭分配权限对话框
            colseRight(){
                this.defKeys = []
            },
            //点击为角色分配权权限
            async allotRight(){
                const keys = [
                    ...this.$refs.treeRef1.getCheckedKeys(),//选中节点
                    ...this.$refs.treeRef1.getHalfCheckedNodes()//半选节点

                ];
                const idStr = keys.join(',')
                const {data:res} =await  this.$http.post(`roles/${this.roleID}/rights`,{rids:idStr})
                if (res.meta.status!==200) return this.$message.error('角色授权失败');
                this.$message.success('角色授权成功');
                this.getRolesList()
                this.rightDialogVisible  = false;
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }

    .vcentr {
        display: flex;
        align-items: center;
    }
</style>
