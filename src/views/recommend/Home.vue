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
    <CommodityForm v-model="visible" :currentCategory="{ name: '首页' }" @submit="submit" />
    <el-dialog top="5vh" title="批量排序" v-model="dialogVisible" width="30%">
      <el-input-number v-model="sort"></el-input-number>
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
import { http, option } from './const/home';
import CommodityForm from '../app-config/component/CommodityForm';
import { mapGetters } from 'vuex';

export default {
  name: 'RecommendHome',
  props: {},
  mixins: [crud],
  components: { CommodityForm },
  computed: {
    ...mapGetters(['productCategoryList']),
    option() {
      return option(this);
    },
  },
  data() {
    return {
      COM_HTTP: http,
      visible: false,
      dialogVisible: false,
      sort: 0,
      extraData: {
        type: 1
      }
    };
  },
  setup() {},
  methods: {
    sortsBtnFun() {
      if (this.selectionList.length === 0) {
        return this.$message.warning('至少选中一项');
      }
      this.dialogVisible = true;
    },
    submitSort() {
      if (isNaN(this.sort)) return;
      const arr = this.selectionList.map(item => http['reqUpdate']({id: item.id, sort: this.sort}));
      Promise.all(arr).then(_ => {
        this.dialogVisible = false;
        this.$message.success('操作成功');
        this.searchFun();
      }).catch(_ => {
        this.dialogVisible = false;
        this.$message.warning('请求异常,请确认排序值');
        this.searchFun();
      });
    },
    addCustBtnFun() {
      this.visible = true;
    },
    submit(productList) {
      http['batchAdd']({
        productNos: productList.map(item => item.productNo),
        type: 1,
      }).then(_ => {
        this.$message.success('操作成功');
        this.visible = false;
        this.searchFun();
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
