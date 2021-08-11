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
import { comHttp, comOption, exportHttp } from './const/comment';
import BaseExportTable from '@components/base/BaseExportTable';
import { imageHandler } from '@/utils/index';

export default {
  name: 'CommodityComment',
  props: {},
  mixins: [crud],
  components: {
    BaseExportTable,
  },
  computed: {
    option() {
      return comOption(this);
    },
  },
  data() {
    return {
      COM_HTTP: comHttp,
    };
  },
  setup() {},
  methods: {
    customFormattingData(list) {
      return list.map(item => ({
        ...item,
        evaluatePics: [
          imageHandler(0, item.evaluatePicsOnekey),
          imageHandler(0, item.evaluatePicsTwokey),
          imageHandler(0, item.evaluatePicsThreekey),
        ].filter(item => item),
      }));
    },
    exportSubmit(list, callFun) {
      exportHttp['apply'](list).then(_ => {
        this.$message.success('操作成功');
        callFun();
        this.searchFun();
      }).catch(_ => {
        callFun();
      });
    },
    viewCustSnglFun(parms) {
      this.$router.push(`/comment-list?productNo=${parms.productNo}`);
    },
  },
};
</script>

<style lang="scss" scoped></style>
