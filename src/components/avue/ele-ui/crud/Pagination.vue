<template>
  <el-row type="flex" justify="end">
    <el-pagination
      style="margin-top: 16px"
      @size-change="commonHandleCrud('size-change', $event)"
      @current-change="commonHandleCrud('current-change', $event)"
      :current-page="page.pageNum"
      :page-sizes="[10, 20, 50, 80, 100]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    >
    </el-pagination>
  </el-row>
</template>

<script>
import create from '../../core/create';
import { debounce } from 'lodash';
export default create({
  name: 'Pagination',
  data() {
    return {};
  },
  props: {
    page: {
      type: Object,
      default: () => {
        return {
          pageNum: 1,
          pageSize: 20,
          total: 0,
        };
      },
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    commonHandleCrud: debounce(
      function(key, value) {
        this.$emit('commonHandle', key, value);
      },
      1000,
      { leading: true, trailing: true }
    ),
  },
});
</script>
