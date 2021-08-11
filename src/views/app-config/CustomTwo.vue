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
    <BaseViewTopic v-model="viewCommodityVisi" :currentCategory="viewForm" />
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option, commodityHttp } from './const/custom-two';
import { mapGetters } from 'vuex';
import { transitionTreeArray } from '@utils/index';

export default {
  name: 'CustomTwo',
  props: {},
  mixins: [crud],
  components: {},
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
      viewCommodityVisi: false,
      visible: false,
      categoryVisi: false,
      productCategories: [],
      viewForm: {},
    };
  },
  setup() {},
  methods: {
    viewTopicSnglFun(data) {
      this.viewForm = { ...data, name: (this.topicList.filter((item) => item.id == data.topicId)[0] || {}).label };
      this.viewCommodityVisi = true;
    },
    commoditySnglFun(parms) {
      this.visible = true;
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
        this.visible = false;
        this.searchFun();
      });
    },
    categorySnglFun(parms) {
      const { productCategorys = [] } = parms;
      this.categoryVisi = true;
      this.productCategories = productCategorys.map((item) => item.productCategoryId);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
