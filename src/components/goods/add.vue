<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 提示区域 -->
            <el-alert
                    title="添加商品信息"
                    type="info"
                    center
                    show-icon
                    :closable="false"
            >
            </el-alert>
            <!-- 步骤条区域 -->
            <el-steps :space="200" align-center :active="activeIndex- 0" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!--  tag栏区域-->
            <el-form :model="addForm" :rules="addFormRules" label-position="top" ref="addRuleFormRef" label-width="100px">
                <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTagLeave" @tab-click="tabClick">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                    v-model="addForm.goods_cat"
                                    :options="cateList"
                                    :props="cateProps"
                                    @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 渲染表单的item项 -->
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item v-for="item in manyTableDate" :key="item.attr_id" :label="item.attr_name">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border v-for="(item2,index) in item.attr_vals" :key="index" :label="item2"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="item in onlyTableDate" :key="item.attr_id" :label="item.attr_name">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- action:上传的地址                       -->
                        <el-upload
                                :headers="headerObj"
                                action="http://49.234.103.109:8889/api/private/v1/upload"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :on-success="handleSuccess"
                                list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!--  富文本编辑器-->
                        <quill-editor
                            v-model="addForm.goods_introduce"
                        >

                        </quill-editor>
                        <el-button class="butAdd" type="primary" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <el-dialog
                title="图片预览"
                :visible.sync="previewVisible"
                width="50%"
                >
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default {
        data(){
            return{
                activeIndex:'0',//步骤条默认激活索引
                //添加商品的表单数据对象
                addForm:{
                    goods_name:'',
                    goods_price:0,
                    goods_weight:0,
                    goods_number:0,
                    goods_cat:[],//商品所属分类数组
                    pics:[],//图片的数组
                    goods_introduce:'',//商品详情描述
                    attrs:[]

                },
                //添加商品的表单验证规则
                addFormRules:{
                    goods_name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' },
                        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                    ],
                    goods_price: [
                        { required: true, message: '请输入商品价格', trigger: 'blur' },
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    goods_weight: [
                        { required: true, message: '请输入商品重量', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    goods_number: [
                        { required: true, message: '请输入商品数量', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    goods_cat: [
                        { required: true, message: '请选择商品分类', trigger: 'blur' },
                    ],
                },
                //商品分类列表
                cateList:[],
                cateProps:{
                    expandTrigger: 'hover',
                    label:'cat_name',
                    value:'cat_id',
                    children:'children'
                },
                //动态参数列表数组
                manyTableDate:[],
                //静态属性列表数组
                onlyTableDate:[],
                //图片上传的headers请求头对象
                headerObj:{
                    Authorization:window.sessionStorage.getItem('token')
                },
                //图片预览绝对地址
                previewPath:'',
                //图片预览对话框控制属性
                previewVisible:false
            }
        },
        created() {
            this.getCateList()
        },
        computed:{
            cateId () {
                if(this.addForm.goods_cat.length === 3){
                   return this.addForm.goods_cat[2]
                }
                return null
            }
        }
        ,
        methods:{
            async getCateList(){
                const {data:res} = await this.$http.get('/categories')
                if (res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
                this.cateList = res.data

            },
            //级联选择器选项变化执行函数
            handleChange(){
                if (this.addForm.goods_cat.length !== 3){
                    this.addForm.goods_cat = []
                }
            },
            //标签页切换前事件
            beforeTagLeave(activeName,oldActiveName){
                if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
                    this.$message.warning('请选择商品分类！')
                    return false
                }
            },
            //页签点击事件
            async tabClick(){
                if(this.activeIndex  === '1'){
                    const {data:res} = await this.$http.get(`/categories/${this.cateId}/attributes`,{params:{sel:'many'}})
                    if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
                    console.log(res)
                    res.data.forEach(item=>{
                        item.attr_vals =  item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
                    })
                    this.manyTableDate = res.data
                }else if (this.activeIndex  === '2'){
                    const {data:res} = await this.$http.get(`/categories/${this.cateId}/attributes`,{params:{sel:'only'}})
                    if (res.meta.status !== 200) return this.$message.error('获取属性列表失败')
                    this.onlyTableDate = res.data
                }
            },
            //处理图片预览效果
            handlePreview(file){
                this.previewPath = "http://49.234.103.109:8889/"+file.response.data.tmp_path
                this.previewVisible = true
                console.log(file)
            },
            //处理删除图片
            handleRemove(file){
                //获取将要删除的图片的临时路径
                const filePath = file.response.data.tem_path
                //从pics数组中，找到对饮索引值
                const i = this.addForm.pics.findIndex(value => {
                    value.pick === filePath
                })
                //从数组中移除
                this.addForm.pics.splice(i, 1)
            },
            //图片上传成功的钩子
            handleSuccess(response){
                //拼接图片信息对象
                const picInfo = {
                    pics:response.data.tmp_path
                }
                this.addForm.pics.push(picInfo)
                //将信息push到对应对象中
            },
            //添加商品
            add(){
                this.$refs.addRuleFormRef.validate(async valid => {
                    if (!valid) return this.$message.error('请填写必要的表单项')
                    //处理goods_cat为字符串
                    const form = _.cloneDeep(this.addForm)
                    form.goods_cat = form.goods_cat.join(',')
                    //处理动态参数
                    this.manyTableDate.forEach((item) => {
                        const newInfo = {
                            attr_id:item.attr_id,
                            attr_value:item.attr_vals.join(' ')
                        }
                        this.addForm.attrs.push(newInfo)
                    })
                    //和静态属性列表
                    this.onlyTableDate.forEach((item) => {
                        const newInfo = {
                            attr_id:item.attr_id,
                            attr_value:item.attr_vals
                        }
                        this.addForm.attrs.push(newInfo)
                    })
                    form.attrs = this.addForm.attrs
                    //发起请求添加商品，商品名称唯一
                    const {data:res} =await this.$http.post('/goods',form)
                    console.log(res)
                    if (res.meta.status !== 201) return this.$message.error('添加商品失败！')
                    this.$message.success('添加成功')
                    await this.$router.push('/goods')

                })
            }
        }
    }
</script>

<style scoped lang="less">
    .el-checkbox{
        margin: 0 10px 0 0  !important;

    }
    .previewImg{
        width: 100%;
    }
    .butAdd{
        margin-top: 15px;
    }
</style>
