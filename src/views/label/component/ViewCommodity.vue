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
    <ul class="shop-type">
      <li>
        <label>关联类型：</label>
        <span>{{ getCategory() }}</span>
      </li>
      <li v-if="getId('relationType') != 1 && showAllLevels(currentCategory)">
        <label>类目：</label>
        <span>{{ showAllLevels(currentCategory) }}</span>
      </li>
      <li v-if="getId('relationType') == 3 && attrValue">
        <label>附加属性：</label>
        <span>{{ attrValue.substr(1) }}</span>
      </li>
    </ul>
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
import { RULE } from '@/utils/validators';
// import { transitionTreeArray } from '@utils/index';
// import { Dict } from '@views/commodity/const/list';
import { mapGetters } from 'vuex';
// import List from '../../Ad/List.vue';

const option = (Vue) => {
  let relationTypeBool = false;
  if (Vue.currentCategory.relationType !== 1) {
    relationTypeBool = true;
  } else {
    relationTypeBool = false;
  }
  const btnObj = {};
  if (relationTypeBool) {
    btnObj['exportBtn'] = '商品导出';
  } else {
    btnObj['addCustBtn'] = '关联商品';
    btnObj['delSnglPoP'] = '解除关联';
    btnObj['delsBtn'] = '批量解除';
    btnObj['tableSelection'] = true;
  }
  return {
    ...btnObj,
    exportBtn: '商品导出',
    column: [
      {
        label: '产品首图',
        prop: 'picUrl',
        viewType: 'img',
      },
      {
        label: '商品SPU',
        prop: 'productNo',
        search: true,
      },
      {
        label: '排序值',
        prop: 'sort',
        viewType: relationTypeBool ? '' : 'input',
        maxlength: 5,
        rules: [RULE.numberInt2],
      },
      {
        label: '品牌',
        prop: 'brandName',
      },
      {
        label: '商品名称',
        prop: 'name',
        search: true,
      },
      {
        label: '商品状态',
        prop: 'productStatus',
        search: true,
        Dict: Vue.productStatus,
      },
      {
        label: '所属类目',
        prop: 'productCateThree',
        formatter(row) {
          return `${row.productCateOne} / ${row.productCateTwo} / ${row.productCateThree}`;
        },
      },
    ],
  };
};

export default {
  // components: { List },
  props: ['modelValue', 'http', 'currentCategory'],
  emits: ['update:modelValue', 'submit'],
  mixins: [crud],
  inject: ['reload'],
  data() {
    return {
      // isRefsh: true,
      attrValue: '',
      productStatus: {
        1: '上架',
        2: '下架',
        3: '草稿',
        4: '待上架',
      },
      relationTypeArr: {
        1: '关联商品',
        2: '关联类目',
        3: '关联附加属性',
      },
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
    currentCategory: {
      handler(currentCategory, oldName) {
        if (!currentCategory || !currentCategory.attrVals) return '';
        const { attrVals } = currentCategory;
        if (attrVals && attrVals.length) {
          const obj = {};
          attrVals.forEach((el) => {
            if (!obj[el.attrId]) {
              obj[el.attrId] = [el.attrValId];
            } else {
              obj[el.attrId].push(el.attrValId);
            }
          });
          this.attrValue = '';
          const arr = Object.keys(obj).map((v) => this.COM_HTTP.getAttrVals(v));
          Promise.all(arr).then((res) => {
            let attrValue = '';
            const newArr = res.flat();
            for (const k in obj) {
              const objArr = obj[k];
              attrValue = newArr
                .filter((e) => objArr.includes(e.id))
                .map((m) => m.val)
                .join('/');
              const [{ label }] = this.attachedProperty.filter((item) => item.id == k);
              this.attrValue += `&${label}:${attrValue}`;
            }
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  // setup() {},
  computed: {
    ...mapGetters(['productCategoryList', 'attachedProperty']),
    option() {
      return option(this);
    },
  },
  methods: {
    getCategory() {
      const { relationType, id } = this.currentCategory || {};
      if (id) localStorage.setItem('topicId', id);
      if (relationType) {
        return this.relationTypeArr[relationType];
      } else {
        return '';
      }
    },
    getId(param) {
      const currentCategory = this.currentCategory || {};
      if (currentCategory[param]) {
        return currentCategory[param];
      } else {
        return '';
      }
    },
    showAllLevels(currentCategory) {
      const { category } = currentCategory;
      if (!category || !category.id) return '';
      const { id } = category;
      const [{ label }] = this.productCategoryList.filter((item) => item.id == id);
      return label || '';
    },
    customFormattingData(list) {
      return list.map((item) => ({
        ...item,
        productPicUrl: item.productPicUrl || item.picUrl,
      }));
    },
    beforeClose(done) {
      if (done) done();
      this.$emit('update:modelValue', false);
      // if (this.isRefsh) {
      //   this.reload();
      // } else {
      //   this.isRefsh = true;
      // }
    },
    // submit() {
    //   if (this.selectionList.length == 0) return this.$message.warning('最少选择一项');
    //   this.$emit('submit', this.selectionList, this.beforeClose);
    // },
    searchFunParamsFiltering(parms) {
      parms[location.href.indexOf('flash-sale') > -1 ? 'flashSaleId' : 'categoryId'] = this.currentCategory.id;
      return parms;
    },
    delFun(obj) {
      const list = [obj];
      this.batchDelFun(obj, list);
    },
    batchDelFun(ids, list) {
      const { id } = this.currentCategory;
      const productNos = list.map((item) => item.productNo);
      this.COM_HTTP.reqDel({
        topicId: id,
        productNos,
      }).then(() => {
        this.$message.success('操作成功');
        this.searchFun();
      });
      // Promise.all(arr).then(_ => {
      //   this.$message.success('操作成功');
      //   this.searchFun();
      // });
    },
    addCustBtnFun() {
      // if (this.selectionList.length == 0) return this.$message.warning('最少选择一项');
      // this.$emit('submit', this.selectionList, this.beforeClose);
      this.$emit('submit');
      // this.isRefsh = false;
      this.beforeClose();
    },
  },
};
</script>
<style lang="scss" scoped>
.shop-type {
  display: flex;
  li {
    margin-left: 24px;
  }
}
</style>
