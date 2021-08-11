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
    <CommodityForm ref="commodityForm" v-model="visible" :currentCategory="currentRow" @submit="submit" />
    <TopicConfigForm ref="topicForm" :status="status" @update:status="status = $event" :currentRow="currentRow" @submit="submit" />
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option, commodityHttp } from './const/TopicConfig';
import TopicConfigForm from './component/TopicConfigForm';
import CommodityForm from './component/CommodityForm';
import ViewCommodity from './component/ViewCommodity';
import { mapGetters } from 'vuex';

export default {
  name: 'TopicConfig',
  props: {},
  mixins: [crud],
  components: { CommodityForm, ViewCommodity, TopicConfigForm },
  computed: {
    ...mapGetters(['productCategoryList']),
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
    updataLater() {
      this.$store.dispatch('getProductCategoryList');
    },
    // 点击新增按钮:
    addCustBtnFun() {
      // const { shopsId } = this.user;
      // if (!shopsId && process.env.NODE_ENV !== 'development') {
      //   this.$message.warning('请使用店铺帐号操作商品');
      //   return false;
      // }
      this.status = 1;
      this.$nextTick(() => {
        // 初始化赋值
        this.$refs.topicForm.showDialog(true);
      });
    },
    // 编辑按钮:
    editCustSnglFun(parms) {
      // const { shopsId } = this.user;
      // if (!shopsId && process.env.NODE_ENV !== 'development') {
      //   this.$message.warning('请使用店铺帐号操作商品');
      //   // return false;
      // }
      this.loading = true;
      this.COM_HTTP.reqDetail({
        id: parms.id,
      }).then((res) => {
        this.loading = false;
        this.status = 2;
        this.currentRow = {
          ...this.currentRow,
          ...res,
          // picsList: res.picsList.sort((a, b) => a.picSort - b.picSort),
        };
        this.$nextTick(() => {
          // 初始化赋值
          this.$refs.topicForm.showDialog(true);
        });
      });
    },
    viewCustSnglFun(parms) {
      this.viewCommodityVisi = true;
      this.COM_HTTP.reqDetail({
        id: parms.id,
      }).then((res) => {
        this.currentRow = {
          ...this.currentRow,
          ...res,
          // picsList: res.picsList.sort((a, b) => a.picSort - b.picSort),
        };
      });
    },
    commoditySnglFun(_) {
      this.visible = true;
    },
    submit(productList) {
      const { id, relationType } = this.currentRow;
      if (Array.isArray(productList)) {
        const products = productList
          .filter((item) => item && item.productNo)
          .map((item) => {
            return {
              productNo: item.productNo,
              sort: item.sort,
            };
          });
        http['reqUpdate']({
          id,
          relationType,
          products,
        }).then((_) => {
          this.$message.success('操作成功');
          this.visible = false;
          setTimeout(() => {
            this.searchFun();
          }, 1000);
        });
      } else {
        if (id) productList['id'] = id;
        http[this.status == 2 ? 'reqUpdate' : 'reqAdd'](productList).then((_) => {
          this.$message.success('操作成功');
          this.$nextTick(() => {
            // 初始化赋值
            this.$refs.topicForm.showDialog(false);
            setTimeout(() => {
              this.searchFun();
            }, 1000);
          });
        });
      }
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
