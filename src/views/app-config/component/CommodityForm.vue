<template>
  <el-dialog
    top="5vh"
    :title="(currentCategory.name || currentCategory.title) + ' 关联商品'"
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
        <el-button @click="beforeClose()">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import crud from '@/mixins/crud';
import { transitionTreeArray } from '@utils/index';
import { http, Dict } from '@views/commodity/const/list';
import { mapGetters } from 'vuex';

const option = Vue => {
  return {
    tableSelection: true,
    column: [
      {
        label: '商品SPU批量',
        prop: 'noList',
        type: 'textarea',
        hide: true,
        search: true,
      },
      {
        label: '商品SPU',
        prop: 'productNo',
      },
      {
        label: '商品名称',
        prop: 'name',
        search: true,
        maxlength: 60,
      },
      {
        label: '商品品牌',
        prop: 'brandName',
      },
      {
        label: '所属类目',
        prop: 'productCateThree',
        formatter(row) {
          return `${row.productCateTwo} / ${row.productCateThree}`;
        },
      },
      {
        label: '所属类目',
        prop: 'searchParentId',
        search: true,
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
        label: '商品状态',
        prop: 'productStatus',
        Dict: Dict.productStatus,
        // search: true,
      },
    ],
  };
};

export default {
  props: {
    modelValue: {},
    currentCategory: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ['update:modelValue', 'submit'],
  mixins: [crud],
  data() {
    return {
      COM_HTTP: http,
      dialogVisible: false,
      extraData: {
        productStatus: 1,
      },
      isShowFirst: false,
    };
  },
  watch: {
    modelValue(val) {
      this.dialogVisible = !!val;
      this.formData = {};
      this.searchFun();
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
    beforeClose(done) {
      if (done) done();
      this.$emit('update:modelValue', false);
    },
    submit() {
      const { noList } = this.formData;
      if (this.selectionList.length == 0) return this.$message.warning('最少选择一项');
      let arr = [...this.selectionList];
      if (noList) {
        arr = [];
        const tempArr = noList.replace(/\s/g, ',').split(',');
        this.selectionList.forEach(item => {
          arr[tempArr.findIndex(element => element == item.productNo)] = item;
        });
      }
      this.$emit('submit', arr, this.beforeClose);
    },
    searchFunParamsFiltering(parms) {
      if (parms.searchParentId && Array.isArray(parms.searchParentId)) {
        const [productCateOne, productCateTwo, productCateThree] = parms.searchParentId;
        parms.productCateOne = productCateOne;
        parms.productCateThree = productCateThree;
        parms.productCateTwo = productCateTwo;
      }
      if (parms.noList) {
        // let str = parms.noList.replace(/[,|\r|\n]$/g, '');
        const str = parms.noList.replace(/\s/g, ',');
        parms.noList = str.split(',').map(item => item);
      }
      return parms;
    },
  },
};
</script>
<style lang="scss" scoped></style>
