<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!--  卡片区域   -->
        <el-card>
            <!-- 搜索与添加 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-button type="primary" round @click="showAddCateDialog">新增分类</el-button>
                </el-col>

            </el-row>
            <!-- 表格 -->
            <tree-table class="treeTable"
                        :data="cartList"
                        :columns="columns"
                        :selection-type="false"
                        :expand-type="false"
                        show-index
                        index-text="#"
                        border
            >
                <!--  是否有效 -->
                <template slot="isOk" slot-scope="scope">
                    <i class="el-icon-success" style="color: #55a532" v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-icon-error" style="color: red" v-else></i>
                </template>
                <!--  排序   -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <!--  操作   -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" round icon="el-icon-edit" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
                    <el-button type="danger" round icon="el-icon-delete" @click="sureDeleteCate(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!--           分页组件-->
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
        <!--  添加分类对话框  -->
        <el-dialog
                title="添加分类"
                :visible.sync="addCateDialogVisible"
                width="50%"
                @close="addCateDialogClose"
                >
            <!--  添加分类的表单 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="150px" >
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <!--  级联选择器 options数据源 prop用来指定配置项-->
                    <el-cascader
                            style="width:100%;"
                            v-model="selectedKeys"
                            :options="parentCateList"
                            :props="cascaderProps"
                            @change="parentCateChange"
                            clearable

                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        <!--  修改分类对话框  -->
        <el-dialog
                title="修改分类"
                :visible.sync="updateCateDialogVisible"
                width="50%"
                @close="editDialogClose"
                >
            <!--  修改分类的表单 -->
            <el-form :model="editForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="150px" >
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="editForm.cat_name"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="updateCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCate">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "cart",
        data() {
            return {
                cartList: [],//商品分类列表
                //用户列表查询参数
                queryInfo: {
                    //查询参数,查询哪一级别的分类
                    type: 3,
                    //当前页数
                    pagenum: 1,
                    //每页显示条数
                    pagesize: 10
                },
                //总数据条数
                total: 0,
                //treeTable配置
                columns: [
                    {
                        prop: 'cat_name',
                        label: '分类名称',
                    },
                    {
                        label: '是否有效',
                        type: 'template',
                        //当前列使用的模板名称
                        template: 'isOk'
                    },
                    {
                        label: '排序',
                        type: 'template',
                        //当前列使用的模板名称
                        template: 'order'
                    },
                    {
                        label: '操作',
                        type: 'template',
                        //当前列使用的模板名称
                        template: 'opt'
                    }
                ],
                //控制添加分类对话框显示隐藏
                addCateDialogVisible:false,
                //添加分类的表单数据对象
                addCateForm: {
                    cat_name:'',
                    //父级分类id
                    cat_pid:0,
                    //当前分类登记,默认一级分类
                    cat_level:0
                },
                //增加分类表单验证规则
                addCateFormRules: {
                    cat_name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                        {min: 3, max: 10, message: '分类名称长度为3-10位', trigger: 'blur'}
                    ]
                },
                //修改分类验证规则
                editCateFormRules: {
                    cat_name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                        {min: 3, max: 10, message: '分类名称长度为3-10位', trigger: 'blur'}
                    ]
                },
                //父级分类列表
                parentCateList:[],
                //级联选择器配置项
                cascaderProps:{
                    expandTrigger:'hover',//展开方式
                    label:'cat_name',
                    value:'cat_id',
                    children:'children',
                    checkStrictly:true
                },
                selectedKeys:[],//级联选择器所选id数组
                //控制修改对话框显示隐藏
                updateCateDialogVisible:false,
                //修改分类数据对象
                editForm:{}

            }
        },
        created() {
            this.getCartList()
        },
        mounted() {
            setInterval(function () {
                document.querySelectorAll('.el-cascader-node__label').forEach(el => {
                    el.onclick = function () {
                        if (this.previousElementSibling) this.previousElementSibling.click()
                    }
                })
            },1000)
        },
        methods: {
            //获取列表数据
            async getCartList() {
                const {data: res} = await this.$http.get('/categories', {params: this.queryInfo})
                if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败！')
                this.cartList = res.data.result
                this.total = res.data.total
            },
            //监听每页显示条数改变事件
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getCartList()
            },
            //监听页码改变
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getCartList()
            },
            //打开添加分类对话框
            showAddCateDialog(){
                this.addCateDialogVisible = true
                this.getParentCateList()
            },
            //获取父级分类的数据列表
            async getParentCateList(){
                const {data:res} = await this.$http.get('/categories',{params: {type:2}})
                console.log(res)
                if (res.meta.status !== 200) return this.$message.error('获取父级分类失败')
                this.parentCateList = res.data
            },
            //选择项发生变化时执行函数
            parentCateChange(){

                //如果selectedKeys数组中我的length > 0，证明选中了父级分类
                //反之则没有选择
                if (this.selectedKeys.length >0){
                    //父级分类id
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
                    //为当前分类的等级赋值
                    this.addCateForm.cat_level = this.selectedKeys.length
                    return
                }else {
                    this.addCateForm.cat_pid = 0
                    //为当前分类的等级赋值
                    this.addCateForm.cat_level = 0
                }
            },
            //点击按钮，添加新的分类
            async addCate(){
                this.$refs.addCateFormRef.validate(async valid => {
                    if (!valid) return;//预校验失败
                    //校验成功，执行操作
                    const {data: res} = await this.$http.post('/categories', this.addCateForm);
                    if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
                    this.$message.success(res.meta.msg);
                    this.addCateDialogVisible = false;
                    await this.getCartList();
                })

            },
            //关闭添加分类dialog，清除关闭对话框后的数据
            addCateDialogClose(){
                this.$refs.addCateFormRef.resetFields()//清空对话框输入框
                //重置级联选择器
                this.selectedKeys = []
                //重置提交的表单
                this.addCateForm.cat_level = 0
                this.addCateForm.cat_pid = 0

            },
            //打开修改分类对话框
            async showEditCateDialog(id){
                const {data:res} = await this.$http.get('/categories/'+id)
                if (res.meta.status!==200) return this.$message.error('获取分类信息失败！')
                this.editForm = res.data
                console.log(this.editForm)

                this.updateCateDialogVisible = true
            },
            //关闭修改分类dialog，清除关闭对话框后的数据
            editDialogClose(){
                this.$refs.editCateFormRef.resetFields();
                this.editForm = {}
            },
            //修改分类
            editCate(){
                this.$refs.editCateFormRef.validate(async valid=>{
                    console.log(this.editForm)
                    if (!valid) return ;//预校验失败
                    //校验成功，执行操作
                    const {data:res} = await this.$http.put('/categories/'+this.editForm.cat_id,{cat_name:this.editForm.cat_name})
                    if (res.meta.status !== 200) return this.$message.error('修改商品分类失败！请重试')
                    this.$message.success('修改商品分类成功')
                    await this.getCartList()
                    this.updateCateDialogVisible = false
                })
            },
            //刪除分类
            sureDeleteCate(id){
                this.$confirm('确认删除分类?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const {data:res} =await this.$http.delete('/categories/'+id);
                    console.log(res)
                    if (res.meta.status!==200)return this.$message.error('删除失败，请重试！');
                    await this.getCartList();
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

<style scoped lang="less">
    .treeTable {
        margin-top: 15px;
    }
</style>
