<template>
  <el-date-picker
    :size="size"
    :format="format"
    :type="type"
    :clearable="clearable"
    :disabled="disabled"
    v-model="fieldValue"
    :disabled-date="disabledDate"
    :default-time="defaultTime"
    :range-separator="rangeSeparator"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
  >
  </el-date-picker>
</template>

<script>
import create from '../../core/create';

export default create({
  name: 'Date-picker',
  data() {
    return {
      type: 'date',
      size: '',
      format: 'YYYY-MM-DD HH:mm:ss',
      // timeArrowControl: false,
      // valueFormat: '',
      // readonly: false,
      placeholder: '',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      clearable: true,
      defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)],
      rangeSeparator: '-',
      disabledDate: () => {},
    };
  },
  props: {
    formItem: {
      default: () => {},
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
});
</script>
