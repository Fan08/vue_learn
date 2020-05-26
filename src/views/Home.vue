<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout() {
      // 清空storage
      window.sessionStorage.clear()
      // 跳转至登录页
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
