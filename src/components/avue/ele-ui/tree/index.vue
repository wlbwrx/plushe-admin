<template>
  <el-tree
    ref="tree"
    :props="props"
    :expand-on-click-node="expandOnClickNode"
    :data="options"
    :node-key="nodeKey"
    :show-checkbox="showCheckbox"
    :check-on-click-node="checkOnClickNode"
    :accordion="accordion"
    :default-checked-keys="fieldValue || []"
    @check-change="handleCheckChange"
  >
  </el-tree>
</template>

<script>
import create from '../../core/create';
export default create({
  name: 'Tree',
  data() {
    return {
      props: {
        label: 'label',
        children: 'children'
      },
      count: 1,
      showCheckbox: true,
      expandOnClickNode: true,
      checkOnClickNode: false,
      accordion: false,
      nodeKey: 'id'
    };
  },
  props: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleCheckChange() {
      this.$emit('update:modelValue', this.$refs.tree.getCheckedKeys(), this.key);
    }
  }
});
</script>
