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
    <el-dialog top="5vh" :title="currentRow.name + '关联类目'" v-model="categoryVisi" width="50%">
      <div>
        <el-cascader :options="productCategory" v-model="productCategories" :props="{ checkStrictly: true, value: 'id' }"> </el-cascader>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="categoryVisi = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option, commodityHttp } from './const/new-arrivals';
import { mapGetters } from 'vuex';
import { transitionTreeArray } from '@utils/index';

export default {
  name: 'Floor',
  props: {},
  mixins: [crud],
  components: { },
  computed: {
    ...mapGetters(['productCategoryList']),
    productCategory() {
      return transitionTreeArray(
        this.productCategoryList
          .map((item) => ({
            ...item,
            disabled: item.categoryStatus != 1,
          }))
          .filter((item) => item.levels != 0)
      );
    },
    option() {
      return option(this);
    },
  },
  data() {
    return {
      commodityHttp,
      COM_HTTP: http,
      categoryVisi: false,
      productCategories: [],
      fieldMap: {
        id: 'id',
        status: 'enable',
      },
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
    customFormattingData(data) {
      return data.map((item) => ({
        ...item,
        enable: Number(item.enable),
        sort: String(item.sort),
      }));
    },
    delCategorySnglPoPFun(parms) {
      http['addRelations']({
        productCategories: [],
        relationType: 2, // 关联类型：1-产品，2-类目
        categoryId: parms.id,
      }).then((_) => {
        this.$message.success('操作成功');
        this.searchFun();
      });
    },
    submit() {
      if (this.productCategories.length == 0) return this.$message.warning('请选择产品分类');
      const { id } = this.currentRow;
      http['addRelations']({
        productCategories: this.productCategories.map((item, index) => ({
          id: item,
          level: index + 1,
        })),
        relationType: 2, // 关联类型：1-产品，2-类目
        categoryId: id,
      }).then((_) => {
        this.categoryVisi = false;
        this.$message.success('操作成功');
        this.searchFun();
      });
    },
    commoditySubmit(productList) {
      const { id } = this.currentRow;
      http['addRelations']({
        categoryId: id,
        relationType: 1,
        productNos: productList.map((item) => item.productNo),
      }).then((_) => {
        this.$message.success('操作成功');
        this.searchFun();
      });
    },
    categorySnglFun(parms) {
      const { productCategorys = [] } = parms;
      this.categoryVisi = true;
      this.productCategories = productCategorys.map((item) => item.productCategoryId);
    },
    customCrudParamsHandle(parms) {
      delete parms.modifyTime;
      delete parms.createTime;
      parms.sort = parms.sort || 9999;
      parms.internalUrl = parms.internalUrl || '';
      parms.relType = 2;
      return parms;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
