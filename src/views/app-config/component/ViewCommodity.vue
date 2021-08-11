<template>
  <el-dialog
    top="5vh"
    :title="(currentCategory.name || currentCategory.title) + ' 查看关联商品'"
    :before-close="beforeClose"
    destroy-on-close
    :close-on-click-modal="false"
    v-model="dialogVisible"
    width="90%"
  >
    <avue-crud
      ref="crud"
      :option="option"
      v-model="formData"
      :table-data="tableList"
      :page="page"
      :loading="loading"
      @commonHandle="commonHandle"
    >
    </avue-crud>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="beforeClose()">关闭</el-button>
        <!-- <el-button type="primary" @click="submit">确 定</el-button> -->
      </span>
    </template>
  </el-dialog>
</template>

<script>
import crud from '@/mixins/crud';
import { transitionTreeArray } from '@utils/index';
// import { Dict } from '@views/commodity/const/list';
import { mapGetters } from 'vuex';

const option = Vue => {
  return {
    addCustBtn: '关联商品',
    delSnglPoP: '解除关联',
    delsBtn: '批量解除',
    tableSelection: true,
    column: [
      {
        label: '商品SPU',
        prop: 'productNo',
        // search: true,
      },
      {
        label: '商品名称',
        prop: 'productName',
      },
      {
        label: '商品品牌',
        prop: 'brandName',
      },
      {
        label: '商品图片',
        prop: 'productPicUrl',
        viewType: 'img',
      },
      {
        label: '所属类目',
        prop: 'productCateThree',
        formatter(row) {
          const { productCateThree } = row;
          const proThr = Vue.productCategoryList.filter(item => item.id == productCateThree)[0] || {};
          return `${proThr.label}`;
        },
      },
      {
        label: '所属类目',
        prop: 'searchParentId',
        // search: true,
        hide: true,
        editType: 'cascader',
        collapseTags: true,
        showAllLevels: false,
        props: {
          checkStrictly: true,
        },
        options: transitionTreeArray(Vue.productCategoryList.filter(item => item.levels != 0 && item.categoryStatus == 1)),
      },
      {
        label: '排序',
        prop: 'sort',
        viewType: 'input',
      },
    ],
  };
};

export default {
  props: ['modelValue', 'http', 'currentCategory'],
  emits: ['update:modelValue', 'submit'],
  mixins: [crud],
  data() {
    return {
      COM_HTTP: this.http,
      dialogVisible: false,
      extraData: {
        extend: true,
      },
      isShowFirst: false,
    };
  },
  watch: {
    modelValue(val) {
      this.dialogVisible = !!val;
      if (val) {
        this.searchFun();
      }
    },
  },
  // setup() {},
  computed: {
    ...mapGetters(['productCategoryList']),
    option() {
      return option(this);
    },
  },
  methods: {
    customFormattingData(list) {
      return list.map(item => ({
        ...item,
        productPicUrl: item.productPicUrl || item.picUrl,
      }));
    },
    beforeClose(done) {
      if (done) done();
      this.$emit('update:modelValue', false);
    },
    // submit() {
    //   if (this.selectionList.length == 0) return this.$message.warning('最少选择一项');
    //   this.$emit('submit', this.selectionList, this.beforeClose);
    // },
    searchFunParamsFiltering(parms) {
      parms[location.href.indexOf('flash-sale') > -1 ? 'flashSaleId' : 'categoryId'] = this.currentCategory.id;
      return parms;
    },
    batchDelFun(list) {
      const arr = list.ids.map(item => this.COM_HTTP.reqDel({id: item}));
      Promise.all(arr).then(_ => {
        this.$message.success('操作成功');
        this.searchFun();
      });
    },
    addCustBtnFun() {
      this.$emit('submit');
      this.beforeClose();
    },
  },
};
</script>
<style lang="scss" scoped></style>
