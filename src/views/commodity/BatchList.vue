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
    <CommodityUrlForm :status="status" @update:status="status = $event" :currentRow="currentRow" @submit="submit" />
    <el-dialog top="5vh" title="批量排序" v-model="dialogVisible" width="30%">
      <el-input-number v-model="sort" :min="0" :max="9999"></el-input-number>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitSort">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option } from './const/batchList';
import CommodityUrlForm from './component/CommodityUrlForm';
import { mapGetters } from 'vuex';

export default {
  name: 'CommodityList',
  props: {},
  mixins: [crud],
  components: {
    CommodityUrlForm,
  },
  computed: {
    ...mapGetters(['productCategoryList', 'brandsList']),
    option() {
      return option(this);
    },
  },
  data() {
    return {
      COM_HTTP: http,
      status: 0,
      dialogVisible: false,
    };
  },
  setup() {},
  methods: {
    addCustBtnFun() {
      const { shopsId } = this.user;
      if (!shopsId && process.env.NODE_ENV !== 'development') {
        this.$message.warning('请使用店铺帐号操作商品');
        return false;
      }
      this.status = 1;
    },
    searchFunParamsFiltering(parms) {
      if (parms.searchParentId && Array.isArray(parms.searchParentId)) {
        const [productCateOne, productCateTwo, productCateThree] = parms.searchParentId;
        parms.productCateOne = productCateOne;
        parms.productCateThree = productCateThree;
        parms.productCateTwo = productCateTwo;
      }
      return parms;
    },
    submit(form, callFun) {
      const { shopsId } = this.user;
      if (!shopsId && process.env.NODE_ENV !== 'development') {
        return this.$message.warning('请使用店铺帐号操作商品');
      }
      http['reqAdd'](form).then(res => {
        this.$message.success('操作成功');
        if (callFun) callFun();
        setTimeout(() => {
          this.searchFun();
        }, 500);
      });
    },
  },
  mounted() {
    this.$store.dispatch('getBrands');
  },
};
</script>

<style lang="scss" scoped></style>
