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
    <el-dialog top="5vh" width="60%" v-model="dialogVisible" title="物流详情">
      <p style="white-space:pre-wrap;">{{ currentRow.logisticsInfo }}</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <template #tableExpand="data">
      <p>{{ data }}</p>
    </template>
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { httpList, optionList } from './const/logistics';

export default {
  name: 'Logistics',
  props: {},
  mixins: [crud],
  components: {},
  computed: {
    option() {
      return optionList(this);
    },
  },
  data() {
    return {
      COM_HTTP: httpList,
      dialogVisible: false,
    };
  },
  setup() {},
  methods: {
    viewsSnglFun(parms) {
      if (!parms.logisticsInfo) return;
      this.dialogVisible = true;
    },
    refreshSnglFun(parms) {
      if (parms.logisticsStatus == 'Delivered' || parms.logisticsStatus == 'Reject') return this.$message.warning('该单号不需要同步');
      this.loading = true;
      httpList['refreshLogisticsInfoSingle']({
        detailId: parms.id,
      }).then(_ => {
        this.loading = false;
        setTimeout(() => {
          this.$message.success('同步完成');
          this.searchFun();
        }, 1000);
      });
    },
    // refreshsBtnFun() {
    //   if (this.selectionList.length === 0) {
    //     return this.$message.warning('至少选中一项');
    //   }
    //   const arr = this.selectionList.map(item => httpList['refreshLogisticsInfoSingle']({ detailId: item.id }));
    //   Promise.all(arr).then(_ => {
    //     this.$message.success('操作成功');
    //     this.searchFun();
    //   });
    // },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.logistics {
  :deep() {
    .avue-crud__table .el-table .cell {
      max-height: 23px;
    }
  }
}
</style>
