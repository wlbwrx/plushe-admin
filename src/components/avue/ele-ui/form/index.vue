<template>
  <el-form ref="form" :model="formValue" :label-width="formAttributes.labelWidth" :inline="formAttributes.inline" :label-position="formAttributes.labelPosition" :rules="rules">
    <el-form-item
      v-for="formItem in formItemList"
      :key="formItem.key"
      :label="formItem.label"
      :prop="formItem.key"
      @keyup.enter="keyupEnter(formItem.key)"
      :class="{ hide: formItem.editShow && !formItem.disabled }"
    >
      <slot v-if="formItem.editSlot" :name="formItem.key" :formValue="formValue" :form-item="formItem" />
      <component
        v-else
        :ref="formItem.key"
        :is="formItem.component"
        :key="formItem.key"
        :form-item="formItem"
        v-model="formValue[formItem.key]"
        @update:modelValue="ItemInput"
        @commonHandle="commonHandle"
      />
    </el-form-item>
  </el-form>
</template>
<script>
import create from '../../core/create';
import { isEqual } from 'lodash';
export default create({
  name: 'form',
  data() {
    return {
      formValue: {},
      extraData: {}, // 表单额外的参数select为主
      formAttributes: {
        inline: false, // 默认行内排列
        labelPosition: 'left',
        labelWidth: '100px',
        size: '',
      },
      rules: {},
      formItemList: [],
    };
  },
  emits: ['commonHandle', 'update:modelValue'],
  props: {
    option: {
      type: Object,
      default: () => {
        return {
          column: [],
        };
      },
    },
    modelValue: {},
  },
  created() {},
  mounted() {},
  watch: {
    option: {
      handler() {
        this.init();
      },
      immediate: true,
    },
    formValue: {
      handler(val) {
        this.$emit('update:modelValue', val);
      },
      deep: true,
      immediate: true,
    },
    modelValue: {
      handler(val) {
        if (val && !isEqual(val, this.formValue)) {
          this.formValue = val;
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      const optionArr = Object.keys(this.option);
      if (!Array.isArray(optionArr) || optionArr.length === 0) return;
      optionArr.forEach(item => {
        if (item == 'formItemList') {
          this.formItemList = this.option.formItemList.map(item => this.initColumn(item)).filter(item => !item.formItemHide);
        } else if (this.option[item] !== undefined) {
          this.formAttributes[item] = this.option[item];
        }
      });
      if (this.formAttributes.inline) {
        this.formAttributes.labelWidth = '';
      }
    },
    initColumn(formColumn) {
      formColumn.key = formColumn.key || formColumn.prop;
      if (formColumn.editSlot) {
        this.formValue[formColumn.key] = formColumn.defaultValue;
        return formColumn;
      }
      if (!formColumn.editType) {
        if (formColumn.Dict || formColumn.remoteFun) formColumn.editType = 'select';
        else formColumn.editType = 'input';
      }
      if (formColumn.editType == 'img') {
        formColumn.editType = 'base-select-img';
        formColumn.viewType = 'img';
        formColumn.limit = 1;
      } else if (formColumn.editType == 'imgs') {
        formColumn.editType = 'base-select-img';
        formColumn.viewType = 'imgs';
      }
      formColumn.component =
        formColumn.editType.startsWith('el-') || formColumn.editType.startsWith('base-')
          ? formColumn.editType
          : 'avue-' + formColumn.editType;
      if (formColumn.rules) {
        this.rules[formColumn.key] = formColumn.rules;
      }
      return formColumn;
    },
    validate() {
      let str;
      this.$refs['form'].validate(validate => {
        str = validate;
      });
      return str;
    },
    resetFields() {
      this.$refs['form'].resetFields();
    },
    ItemInput(value, key) {
      if (!key) return;
      this.formValue[key] = value;
    },
    keyupEnter(key) {
      this.$emit('commonHandle', 'keyupEnter', key);
    },
    commonHandle(key, value) {
      this.$emit('commonHandle', key, value);
    },
  },
});
</script>
