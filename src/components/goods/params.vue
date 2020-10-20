<template>
    <div>

        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert
                    title="注意：只允许为第三极分类设置相关参数"
                    type="warning"
                    show-icon
                    :closable="false"
            >
            </el-alert>
            <!--  选择商品分类区域     -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类</span>
                    <!-- 级联选择器 -->
                    <el-cascader
                            v-model="selectedCateKeys"
                            :options="cateList"
                            :props="cateProps"
                            @change="handleChange">
                    </el-cascader>
                </el-col>
            </el-row>
            <!-- tags页签区域-->
            <el-tabs v-model="activeName" @tab-click="handleTagClick">
                <!--添加动态参数面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible=true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table
                            :data="manyTableDate"
                            border
                            stripe
                    >
                        <!--展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag closable v-for="(item,index) in scope.row.attr_vals" :key="index" @close="handleClose(index,scope.row)">
                                    {{item}}
                                </el-tag>
                                <!-- 输入文本框-->
                                <el-input
                                        class="as"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                            </template>
                        </el-table-column>
                        <!--索引列-->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope" >
                                <el-button icon="el-icon-edit" type="primary" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button icon="el-icon-delete" type="danger" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!--添加静态属性面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible=true">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table
                            :data="onlyTableDate"
                            border
                            stripe
                    >
                        <!--展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag closable v-for="(item,index) in scope.row.attr_vals" :key="index" @close="handleClose(index,scope.row)">
                                    {{item}}
                                </el-tag>
                                <!-- 输入文本框-->
                                <el-input
                                        class="as"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                            </template>
                        </el-table-column>
                        <!--索引列-->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作" >
                            <template >
                                <el-button icon="el-icon-edit" type="primary" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button icon="el-icon-delete" type="danger" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

        </el-card>


        <!--添加参数dialog-->
        <el-dialog
                :title="'添加'+titleText"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClose"
                >
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
        <!--修改参数dialog-->
        <el-dialog
                :title="'修改'+titleText"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogClose"
        >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                //商品列表
                cateList : [],
                //级联选择器配置项
                cateProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },
                //级联选择器双向绑定的对数组
                selectedCateKeys:[],
                //被激活的页签的名称
                activeName:'many',
                //静态参数列表数组
                manyTableDate:[],
                //动态属性列表数组
                onlyTableDate:[],
                //控制添加属性或参数对话框
                addDialogVisible:false,
                //添加参数的表单数据对象
                addForm:{},
                //添加表单的验证规则
                addFormRules:{
                    attr_name:[
                        {required:true,message:'请输入参数名称',trigger:'blur'}
                    ]
                },
                //控制修改dialog显示
                editDialogVisible:false,
                //添加参数的表单数据对象
                editForm:{},
                //修改表单的验证规则
                editFormRules:{
                    attr_name:[
                        {required:true,message:'请输入参数名称',trigger:'blur'}
                    ]
                }
            }
        },
        computed:{
          isBtnDisable(){
              return this.selectedCateKeys.length !== 3

          },
            //当前选中的三级分类的id
          cateId(){
              if (this.selectedCateKeys.length === 3) return this.selectedCateKeys[2]
              return null
          },
            //动态计算标题文本
          titleText(){
            if (this.activeName === 'many') return '动态参数'
              return '静态属性'
          }
        },
        created() {
            this.getCateList()
        },
        methods:{
            //获取获取商品列表
            async getCateList(){
                const {data:res}  = await this.$http.get('/categories')
                if (res.meta.status!==200) return this.$message.error('获取商品信息失败！')
                this.$message.success('获取商品列表成功')
                this.cateList = res.data

            },
            //调用接口查询参数数据
            async getAttributeList(){
                if (this.selectedCateKeys.length !== 3){//没有选择三级分类
                    this.selectedCateKeys = []
                    this.manyTableDate = []
                    this.onlyTableDate = []
                    this.$message.info('只能选中3三级分类')
                    return
                }
                //三级分类,根据选选id和所处面板请求接口
                const {data:res} =await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params:{sel:this.activeName}
                })
                if (res.meta.status !== 200) return this.$message.error('请求参数失败！')
                console.log(res)
                res.data.forEach(item=>{
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' '):[]
                    //添加布尔值，控制文本框显示隐藏
                    item.inputVisible = false
                    //文本框输入值
                    item.inputValue = ''
                })
                if (this.activeName  === 'many'){
                    this.manyTableDate = res.data
                }else {
                    this.onlyTableDate = res.data
                }
            },
            //级联选择器选项变化执行事件
             handleChange(){
                this.getAttributeList()
            },
            //点击页签执行函数
            handleTagClick(){
                this.getAttributeList()
            },
            //监听添加对话框的关闭事件
            addDialogClose(){
                this.$refs.addFormRef.resetFields()
            },
            //点击按钮，添加参数
            addParams(){
                this.$refs.addFormRef.validate( async valid => {
                    if (!valid) return
                    const {data:res}  = await this.$http.post(`/categories/${this.cateId}/attributes`,
                        {
                            attr_name:this.addForm.attr_name,
                            attr_sel:this.activeName
                        })
                    if (res.meta.status!==201) return this.$message.error('添加参数失败！')
                    this.$message.success('添加成功')
                    this.addDialogVisible = false
                    await this.getAttributeList()
                })
            },
            //点击按钮，展示修改的对话框
            async showEditDialog(id){
                const {data:res} = await this.$http.get(`/categories/${this.cateId}/attributes/${id}`,{params: {attr_sel:this.activeName}})
                if (res.meta.status !== 200) return this.$message.error('查询参数失败')
                this.editForm = res.data
                this.editDialogVisible = true

            },
            //监听修改对话框的关闭事件
            editDialogClose(){
                this.$refs.editFormRef.resetFields()
            },
            //点击按钮，修改参数
            editParams(){
                this.$refs.editFormRef.validate( async valid => {
                    if (!valid) return
                    const {data:res} = await this.$http.put(`/categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                        {
                            attr_name:this.editForm.attr_name,
                            attr_sel:this.activeName
                        })
                    if (res.meta.status!==200) return this.$message.error('修改参数失败！')
                    this.$message.success('修改成功')
                    this.editDialogVisible = false
                    await this.getAttributeList()
                })
            },
            //删除参数
            async deleteParams(id){
                const confirmResult = await this.$confirm('即将删除该参数, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                //用户取消操作
                if (confirmResult !== 'confirm') return this.$message.info('已取消操作')
                //确认删除
                const {data:res} = await this.$http.delete(`/categories/${this.cateId}/attributes/${id}`)
                if (res.meta.status !== 200) return this.$message.error('删除参数失败')
                this.$message.success('删除成功')
                await this.getAttributeList()
            },
            //文本框失去焦点或者按下enter
            handleInputConfirm(row){
                if (row.inputValue.trim().length === 0){
                    row.inputVisible = false
                    row.inputValue = ''
                    console.log('ok')
                }
                //符合要求，后续处理
                row.attr_vals.push(row.inputValue.trim())
                console.log(row,this.cateId)
                //发起请求
                row.inputValue = ''
                row.inputVisible = false
                this.saveAttrValues(row)


            },
            //点击按钮，展示文本输入框
            showInput(row){
                row.inputVisible = true
                //使文本框获得焦点
                //$nextTick方法：当页面上的元素被重新渲染之后，才会执行回调中的代码
                this.$nextTick(()=> {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            //将attr_vals的操作进行提交
            async saveAttrValues(row){
                const {data:res} = await this.$http.put(`/categories/${this.cateId}/attributes/${row.attr_id}`,
                    {
                        attr_name:row.attr_name,
                        attr_sel:row.attr_sel,
                        attr_vals:row.attr_vals.join(' ')
                    }
                )
                if (res.meta.status !== 200) return this.$message.error('添加失败')
                this.$message.success('修改成功')
            },
            //删除对应的参数选项
            handleClose(i,row){
                row.attr_vals.splice(i,1)
                this.saveAttrValues(row)
            }
        }
    }
</script>

<style scoped lang="less">
    .cat_opt{
        margin: 15px 0px;
    }
    .el-tag{
        margin: 10px;
    }
    .as{
        width: 120px;
    }
</style>
