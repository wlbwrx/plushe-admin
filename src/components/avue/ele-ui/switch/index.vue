<!--
 * @Author: your name
 * @Date: 2020-05-26 17:02:09
 * @LastEditTime: 2020-06-29 11:58:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vip-revision\src\components\ppvue\component\switch\index.vue
-->
<template>
  <el-switch
    v-model="value"
    :active-color="activeColor"
    :inactive-color="inactiveColor"
    :active-value="activeValue"
    :inactive-value="inactiveValue"
    @change="handleChange"
  >
  </el-switch>
</template>

<script>
import create from '../../core/create';
export default create({
  name: 'Switch',
  // inheritAttrs: false,
  data() {
    return {
      value: undefined,

      width: 40,
      activeIconClass: '',
      inactiveIconClass: '',
      activeText: '',
      inactiveText: '',
      activeColor: '',
      inactiveColor: '',
      activeValue: true,
      inactiveValue: false,
      name: '',
      validateEvent: true,
      id: ''
    };
  },
  computed: {},
  props: {
    formItem: {
      default: () => {}
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleChange(val) {
      this.$emit('update:modelValue', this.key, val);
    }
  }
});
</script>
