<template>
  <avue-crud
    ref="crud"
    :option="option"
    v-model="formData"
    :table-data="tableList"
    :page="page"
    :loading="loading"
    @commonHandle="commonHandle"
  >
    <BaseExportTable v-model="exportData" @submit="exportSubmit" />
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option, exportHttp } from './const/sku-visit';
import BaseExportTable from '@components/base/BaseExportTable';

export default {
  name: 'SkuVisit',
  props: {},
  mixins: [crud],
  components: { BaseExportTable },
  computed: {
    option() {
      return option(this);
    },
  },
  data() {
    return {
      COM_HTTP: http,
    };
  },
  setup() {},
  methods: {
    addCustBtnFun() {},
    exportSubmit(list, callFun) {
      exportHttp['apply'](list)
        .then((_) => {
          this.$message.success('操作成功');
          this.searchFun();
          callFun();
        })
        .catch((_) => {
          callFun();
        });
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped></style>
