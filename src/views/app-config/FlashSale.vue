<template>
  <avue-crud
    ref="crud"
    :option="option"
    v-model="formData"
    :table-data="tableList"
    :fieldMap="fieldMap"
    :page="page"
    :loading="loading"
    @commonHandle="commonHandle"
  >
    <BaseViewTopic v-model="viewCommodityVisi" :currentCategory="viewForm" />
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option, commodityHttp } from './const/flash-sale';

export default {
  name: 'FlashSale',
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
      commodityHttp,
      COM_HTTP: http,
      visible: false,
      viewCommodityVisi: false,
      viewForm: {},
    };
  },
  setup() {},
  methods: {
    viewTopicSnglFun(data) {
      this.viewForm = { ...data, name: (this.topicList.filter((item) => item.id == data.topicId)[0] || {}).label };
      this.viewCommodityVisi = true;
    },
    commoditySnglFun(_) {
      this.visible = true;
    },
    submit(productList) {
      const { id } = this.currentRow;
      commodityHttp['reqBatchAdd']({
        flashSaleId: id,
        productNos: productList.map((item) => item.productNo),
      }).then((_) => {
        this.$message.success('操作成功');
        this.visible = false;
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
