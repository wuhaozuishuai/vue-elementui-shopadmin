<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 默认头像区域 -->
        <div class="avatar-box">
          <img src="../assets/logo.png" alt="">
        </div>
      <!-- 表单区域 -->
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item> 
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang='less' scoped>

    .login_container{
        background-color: #2b4b6b;
        height: 100%;
        position: relative;
    };
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform:translate(-50%,-50%);
    }
    .avatar-box{
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow:  0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
       background-color: #fff;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
    }
</style>