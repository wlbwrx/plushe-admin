<template>
  <el-select
    ref="mySelect"
    v-model="fieldValue"
    :filterable="filterable"
    :remote-method="remoteMethod"
    :remote="remote"
    :loading="loading"
    :multiple="multiple"
    :disabled="disabled"
    :clearable="clearable"
    :reserve-keyword="reserveKeyword"
    :collapseTags="collapseTags"
    :placeholder="placeholder"
    @change="handlerChange"
  >
    <el-option v-for="item in options" :key="item.key" :disabled="!!item.disabled" :label="item.value" :value="item.key"> </el-option>
  </el-select>
</template>

<script>
import create from '../../core/create';
export default create({
  name: 'Select',
  data() {
    return {
      clearable: true,
      filterable: false,
      remote: false,
      loading: false,
      collapseTags: false,
      reserveKeyword: true,
      placeholder: '请选择',
      multiple: false,
    };
  },
  props: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handlerChange(val) {
      this.value = val;
      this.$emit('update:modelValue', val, this.key);
    },
    remoteMethod(query) {
      console.log('query', query);
      if (query !== '') {
        this.loading = true;
        if (this.remoteFun) {
          this.remoteFun({ name: query })
            .then(res => {
              this.loading = false;
              this.options = res;
            })
            .catch(_ => {
              this.loading = false;
            });
        }
      } else {
        this.options = [];
      }
    },
  },
});
</script>
