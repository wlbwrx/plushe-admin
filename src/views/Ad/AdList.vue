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
    <ViewCommodity v-model="viewCommodityVisi" :currentCategory="currentRow" :http="commodityHttp" @submit="commoditySnglFun" />
    <CommodityForm ref="commodityForm" v-model="visible" :currentCategory="currentRow" @submit="commoditySubmit" />
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option, commodityHttp } from './const/list';
import CommodityForm from '@views/app-config/component/CommodityForm';
import ViewCommodity from '@views/app-config/component/ViewCommodity';
import { mapGetters } from 'vuex';

export default {
  name: 'AdList',
  props: {},
  mixins: [crud],
  components: { CommodityForm, ViewCommodity },
  computed: {
    ...mapGetters(['productCategoryList', 'attachedProperty']),
    option() {
      return option(this);
    },
  },
  data() {
    return {
      fieldMap: {
        id: 'id',
        status: 'enable',
      },
      status: 0,
      commodityHttp,
      COM_HTTP: http,
      visible: false,
      viewCommodityVisi: false,
    };
  },
  setup() {},
  methods: {
    viewCustSnglFun(parms) {
      this.viewCommodityVisi = true;
    },
    commoditySnglFun(_) {
      this.visible = true;
    },
    commoditySubmit(list) {
      const { id } = this.currentRow;
      http['addRelations']({
        productNos: list.map((item) => item.productNo),
        relationType: 1, // 关联类型：1-产品，2-类目
        categoryId: id,
      }).then((_) => {
        this.visible = false;
        // this.handleQuery();
        this.$message.success('操作成功');
      });
    },
  },
  mounted() {},
  created() {
    this.formData.creator = this.user.name || '';
  }
};
</script>

<style lang="scss" scoped></style>
