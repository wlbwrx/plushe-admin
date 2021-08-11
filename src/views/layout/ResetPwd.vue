<template>
  <div class="reset-pwd">
    <el-card class="main">
      <el-form :model="restForm" :rules="restRules" ref="form" label-width="100px">
        <h3 class="title">欢迎来到Plushe后台管理系统</h3>
        <el-form-item label="原始密码" prop="pwd">
          <el-input size="medium" v-model="restForm.pwd" type="password" placeholder="原始密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input size="medium" v-model="restForm.newPwd" type="password" placeholder="新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="newPwd2">
          <el-input size="medium" v-model="restForm.newPwd2" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item>
          <div class="btn-box">
            <el-button size="medium" class="btn submit" type="primary" @click="confirmChange('restForm')">确认修改</el-button>
            <el-button size="medium" class="btn cancel" @click="cancel">取 消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    const validNewPwd = (rule, value, callback) => {
      if (this.restForm.newPwd != value) {
        callback(new Error('两次密码不一致'));
      } else {
        callback();
      }
    };
    return {
      restForm: {
        pwd: '',
        newPwd: '',
        newPwd2: '',
      },
      restRules: {
        pwd: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur',
          },
        ],
        newPwd: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur',
          },
        ],
        newPwd2: [
          {
            required: true,
            validator: validNewPwd,
            trigger: 'blur',
          },
        ],
      },
    };
  },
  setup() {},
  methods: {
    // 确认修改密码：
    confirmChange(formName) {
      this.$refs[formName].validate(valid => {});
    },
    // 取消：
    cancel() {
      this.$router.replace({
        path: '/home',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.reset-pwd {
  .main {
    width: 375px;
    margin: 160px auto 0;

    .el-form {
      .title {
        font-size: 18px;
        text-align: center;
        margin-bottom: 32px;
      }

      .btn-box {
        display: flex;
        justify-content: space-between;

        .btn {
          width: 48%;
        }
      }
    }
  }
}
</style>
