<template>
  <avue-crud
    class="logistics"
    ref="crud"
    :option="option"
    v-model="formData"
    :table-data="tableList"
    :page="page"
    :loading="loading"
    @commonHandle="commonHandle"
  >
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option } from './const/logistics';
// import { http as categoriesHttp } from './const/categories';
// import { mapGetters } from 'vuex';

export default {
  name: 'Logistics',
  props: {},
  mixins: [crud],
  components: {},
  computed: {
    option() {
      return option(this);
    },
  },
  data() {
    return {
      COM_HTTP: http,
      dialogVisible: false,
    };
  },
  setup() {},
  methods: {
    uploadLater() {
      this.$message.success('导入成功');
      this.searchFun();
    },
    viewsSnglFun(parms) {
      this.$router.push(`/logistics-list?taskId=${parms.id}`);
    },
    customFormattingData(data) {
      return data.map(item => ({
        ...item,
        hasChildren: true,
      }));
    },
    refreshSnglFun(parms) {
      if (parms.taskStatus == 'done') return this.$message.warning('任务已完成,无需同步');
      http['refreshLogisticsInfoSingle']({
        taskId: parms.id,
      }).then(_ => {
        this.$message.success('正在同步,请稍后重新尝试');
      });
    },
    downSnglPoPFun(parms) {
      http['getTaskResult']({
        taskId: parms.id,
      }).then(res => {
        this.downloadFile(res);
      });
    }
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.logistics {
  :deep() {
    .avue-crud__table .el-table .cell  {
      max-height: 23px;
    }
  }
}
</style>
