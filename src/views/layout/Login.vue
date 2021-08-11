<template>
  <div class="login">
    <el-card class="main">
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" @keyup.enter="login('loginForm')">
        <h3 class="title">欢迎来到Plushe后台管理系统</h3>
        <el-form-item prop="username">
          <el-input size="medium" v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="medium" v-model="loginForm.password" type="password" prefix-icon="el-icon-lock" placeholder="密码" />
        </el-form-item>
        <el-form-item>
          <el-button size="medium" class="submit" type="primary" @click="login('loginForm')">登 录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  components: {},
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('密码不能小于3位'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            validator: validatePass,
            trigger: 'blur',
          },
        ],
      },
    };
  },
  setup() {},
  methods: {
    login(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch('Login', this.loginForm).then(res => {
            // 如果是首次登录，则跳去修改密码页
            console.log('LoginLoginLogin', res);
            const firstLogin = false;
            if (firstLogin) {
              this.$router.replace({
                path: '/resetPwd',
              });
              return;
            }
            this.$router.push({
              name: 'Home',
            });
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  width: 360px;
  margin: 160px auto 0;
  .el-form {
    .title {
      font-size: 18px;
      text-align: center;
      margin-bottom: 32px;
    }
    .submit {
      width: 100%;
      margin-top: 6px;
    }
  }
}
</style>
