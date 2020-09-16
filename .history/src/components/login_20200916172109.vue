<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 默认头像区域 -->
            <div class="avatar-box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单区域 -->
            <el-form 
                label-width="0" 
                class="formLogin" 
                :model="loginForm"
                :rules="loginFormRules"
                ref="loginFormRef"
            >
                <el-form-item prop="username">
                    <el-input
                        prefix-icon="el-icon-user-solid"
                        v-model="loginForm.username"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input 
                    v-model="loginForm.password"
                    type="password"
                    prefix-icon="el-icon-lock"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login('loginFormRef')" >提交</el-button>
                    <el-button type="info" @click="resetForm('loginFormRef')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                loginForm:{
                    username:"",
                    password:""
                },
                // form验证规则
                loginFormRules:{
                    username:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        {  min: 3, max: 10, message: '用户名长度为3-10位', trigger: 'blur' },
                    ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        {  min: 6, max: 10, message: '密码长度为3-10位', trigger: 'blur' },

                    ]
                }
            }
        },
        methods:{
            // 重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //登录
            login(formName){
                //获取在登录之前的预验证,使用了async和await来简化返回的promise对象，再利用解构赋值将返回值中的data赋给res
               this.$refs[formName].validate(async valid=>{
                   console.log(valid);
                   if(!valid) return;
                 const {data:res} =  await this.$http.post('/login',this.loginForm);
                 console.log(res);
                 if(res.meta.status!==200) return this.$message.error('登陆失败');
                console.log('登陆成功');
                 this.$message.success('登陆成功')
               })
            }
        }
    }
</script>

<style lang='less' scoped>

    .login_container {
        background-color: #2b4b6b;
        height: 100%;
        position: relative;
    }

    ;
    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .avatar-box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
    .btns{
        display: flex;
       justify-content: flex-end;
    }
    .formLogin{
        width: 100%;
        padding: 0 20px;
        position: absolute;
        bottom: 0;
        box-sizing: border-box;
    }
</style>
