<template>
  <div class="login_container">
    <div class="login_box">
        <div class="avatar-box">
          <img src="../assets/logo.png" alt="">
        </div>
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
      border-radius: ;
      img{
        width: 100%;
        height: 100%;
        
      }
    }
</style>