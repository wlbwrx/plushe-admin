<template>
  <el-dialog top="5vh" title="修改收件人信息" v-model="dialogVisible" width="30%">
    <el-form :model="form" :rules="rules" rel="form">
      <el-form-item label="收件人First name" prop="receiverFirstName">
        <el-input v-model="form.receiverFirstName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="收件人Last name" prop="receiverLastName">
        <el-input v-model="form.receiverLastName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="receiverPhone">
        <el-input v-model="form.receiverPhone" type="number" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="邮政编码" prop="receiverPostCode">
        <el-input v-model="form.receiverPostCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="国家/地区" prop="billRecState">
        <el-input disabled v-model="form.billRecState" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="receiverDetailAddress">
        <el-input type="textarea" v-model="form.receiverDetailAddress"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="warning" @click="submitForm">提 交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean
    },
    info: {
      type: Object
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      rules: {}
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    },
    form() {
      return this.info;
    }
  },
  methods: {
    submitForm() {}
  }
};
</script>

<style></style>
