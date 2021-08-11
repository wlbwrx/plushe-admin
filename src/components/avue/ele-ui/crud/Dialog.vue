<template>
  <el-dialog top="5vh" :title="title" v-model="visibility" width="80%" :before-close="handleClose">
    <avue-form v-model="formValue" :option="option" @commonHandle="commonHandleDialog" ref="form"></avue-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:modelValue', false)">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { toRefs } from 'vue';
import create from '../../core/create';
export default create({
  name: 'Dialog',
  data() {
    return {
      formValue: {}
    };
  },
  inheritAttrs: false,
  emits: ['update:modelValue'],
  setup(props) {
    const { modelValue, edit } = toRefs(props);
    return {
      visibility: modelValue,
      edit
    };
  },
  props: {
    option: {},
    modelValue: {},
    edit: {}
  },
  computed: {
    title() {
      if (this.formValue.id) {
        return '编辑';
      }
      return this.edit ? '新增' : '查看';
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('update:modelValue', false);
    },
    submit() {
      if (!this.$refs.form.validate()) return;
      this.commonHandleDialog(this.formValue.id ? 'update' : 'add', this.formValue);
    },
    commonHandleDialog(key, value) {
      this.$emit('commonHandle', key, value, this.handleClose);
    }
  }
});
</script>
