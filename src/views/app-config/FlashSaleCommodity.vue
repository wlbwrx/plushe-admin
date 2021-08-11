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
    <CommodityForm v-model="visible" />
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option } from './const/flash-sale-commodity';
import CommodityForm from './component/CommodityForm';

export default {
  name: 'FlashSaleCommodity',
  props: {},
  mixins: [crud],
  components: {
    CommodityForm,
  },
  computed: {
    option() {
      return option(this);
    },
  },
  data() {
    return {
      COM_HTTP: http,
      fieldMap: {
        id: 'id',
        status: 'enable',
      },
      visible: false,
    };
  },
  setup() {},
  methods: {
    addCustBtnFun() {
      const { flashSaleId } = this.formData;
      if (!flashSaleId) return this.$message.warning('请先关联场次再添加商品');
      this.visible = true;
    },
    amend() {},
  },
  mounted() {},
  created() {},
};
</script>

<style lang="scss" scoped></style>
