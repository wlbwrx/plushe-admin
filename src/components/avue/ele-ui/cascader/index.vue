<template>
  <el-cascader
    ref="myCascader"
    v-model="fieldValue"
    :options="options"
    :props="props"
    :clearable="clearable"
    :placeholder="placeholder"
    :collapse-tags="collapseTags"
    :show-all-levels="showAllLevels"
    @change="handlerChange"
  >
  </el-cascader>
</template>

<script>
import create from '../../core/create';
export default create({
  name: 'Cascader',
  data() {
    return {
      fieldValue: '',
      options: [],
      collapseTags: false,
      showAllLevels: false,
      placeholder: '请选择',
      props: {
        value: 'id',
      },
    };
  },
  props: {
    formItem: {
      default: () => {},
    },
  },
  created() {},
  methods: {
    handlerChange(val) {},
  },
});
</script>
