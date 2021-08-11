<template>
  <div>
    <!-- 数字输入框 -->
    <el-input-number
      v-if="type === 'InputNumber'"
      v-model="fieldValue"
      :min="min"
      :precision="precision"
      :max="max"
      :maxlength="maxlength"
      :step="step"
      :label="label"
    ></el-input-number>
    <el-input
      v-else
      :class="{ large: large }"
      :placeholder="placeholder"
      v-model="fieldValue"
      :disabled="disabled"
      :type="type"
      :rows="rows"
      :clearable="clearable"
      :show-word-limit="showWordLimit"
      :maxlength="maxlength"
      :minlength="minlength"
    >
      <template #prepend v-if="prependText || prefixIcon">
        <span v-if="prependText">{{ prependText }}</span>
        <i v-else class="iconfont el-input__icon" :class="prefixIcon" />
      </template>
      <template #append v-if="suffixIcon || suffixText">
        <span v-if="suffixText">{{ suffixText }}</span>
        <i v-else class="iconfont el-input__icon" @click="$emit('commonHandle', formItem.key, formItem)" :class="suffixIcon" />
      </template>
    </el-input>
  </div>
</template>

<script>
// import { inject } from 'vue';
import create from '../../core/create';
export default create({
  name: 'input',
  // inheritAttrs: false,
  data() {
    return {
      size: '',
      resize: '',
      rows: 2,
      precision: 0,
      step: 1,
      form: '',
      large: false, // 大号输入框
      readonly: false,
      type: 'text',
      prependText: '',
      autosize: false,
      autocomplete: 'off',
      autoComplete: 'off',
      validateEvent: true,
      suffixIcon: '',
      prefixIcon: '',
      label: '',
      showPassword: false,
      showWordLimit: false,
      placeholder: '',
      verificationImg: '',
      max: Infinity,
      min: -Infinity,
      maxlength: '',
      minlength: '',
      suffixText: '',
    };
  },
  computed: {},
  created() {},
  methods: {},
});
</script>
