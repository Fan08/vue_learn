<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区 -->
      <div class="avatar-box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登陆表单区 -->
      <!-- 使用 ref 来获取 vue 组件的实例对象 -->
      <el-form ref="loginFormRef" class="login-form" :model="loginForm" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
        // username: null,
        // password: null
      },
      // 表单验证规则
      loginFormRules: {
        username: [{
          required: true,
          message: '输入用户名',
          trigger: 'blur'
        }, {
          min: 3,
          max: 10,
          message: '3至10个字符',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '输入密码',
          trigger: 'blur'
        }, {
          min: 6,
          max: 15,
          message: '6至15个字符',
          trigger: 'blur'
        }]
      }
    }
  },

  methods: {
    resetLoginForm () {
      // 通过 this.$refs 获取到表单的对象
      // 并通过 resetFields 进行重置
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      // 在点击登陆按钮后触发的函数
      this.$refs.loginFormRef.validate(async (valid) => {
        // 根据验证条件进行验证，valid 就是验证结果
        // console.log(valid)
        if (!valid) return null
        // 发起请求，并对返回的值进行结构
        // 使用 await async 来直接获取数据，而非通过 then 进行获取
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')

        // 1 登陆成功后保存后台返回的 token，在 sessionStorage 中进行保存
        // console.log(res.data.token)
        window.sessionStorage.setItem('token', res.data.token)
        // 2 通过编程式导航跳转到后台主页，路由是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}

.login-box {
  border-radius: 3px;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
}

.avatar-box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
