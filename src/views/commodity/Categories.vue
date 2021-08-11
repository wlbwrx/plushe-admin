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
    <CategoriesForm v-model="status" @submit="submit" :categoriesDate="categoriesDate" @update:categoriesDate="categoriesDate = $event" />
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option } from './const/categories';
import CategoriesForm from './component/CategoriesForm';
import { mapGetters } from 'vuex';

export default {
  name: 'Categories',
  props: {},
  mixins: [crud],
  components: {
    CategoriesForm,
  },
  computed: {
    ...mapGetters(['productCategoryList']),
    option() {
      return option(this);
    },
  },
  data() {
    return {
      COM_HTTP: http,
      fieldMap: {
        id: 'id',
        status: 'categoryStatus',
      },
      status: 0,
      categoriesDate: false,
      isShowFirst: false,
    };
  },
  setup() {},
  methods: {
    updataLater() {
      this.$store.dispatch('getProductCategoryList');
    },
    searchFunParamsFiltering(parms) {
      const { searchParentId } = parms;
      if (searchParentId) {
        parms.parentId = searchParentId[1] || searchParentId[0];
        delete parms.searchParentId;
      }
      return parms;
    },
    customCrudParamsHandle(parms) {
      const { searchParentId } = parms;
      if (searchParentId) {
        parms.parentId = searchParentId[1] || searchParentId[0];
        delete parms.searchParentId;
      }
      return parms;
    },
    editCustSnglFun(parms) {
      if (parms.levels != 3) {
        this.status = 2;
        this.categoriesDate = { ...parms };
        return;
      }
      this.loading = true;
      this.COM_HTTP.getProductCategoryEx({
        id: parms.id,
      }).then((res) => {
        this.status = 2;
        this.categoriesDate = Object.assign(res, parms);
        this.loading = false;
      });
    },
    addCustBtnFun() {
      this.categoriesDate = {};
      this.status = 1;
    },
    submit() {
      const form = arguments[0];
      const beforeClose = arguments[1];
      const str = form.id ? 'updataFun' : 'addFun';
      this[str](form).then((_) => {
        if (beforeClose) beforeClose();
      });
    },
    customParameterHandle(arr) {
      return arr.concat('categoryAttributes');
    },
  },
  created() {
    this.$store.dispatch('getAttribute');
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.searchFun();
    }, 1000);
  },
};
</script>

<style lang="scss" scoped></style>
