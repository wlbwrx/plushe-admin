<template>
  <avue-crud
    ref="crud"
    class="activitie"
    :option="option"
    v-model="formData"
    :table-data="tableList"
    :fieldMap="fieldMap"
    :page="page"
    :loading="loading"
    @commonHandle="commonHandle"
  >
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option } from './const/activitie';
import { mapGetters } from 'vuex';

export default {
  name: 'Activitie',
  props: {},
  mixins: [crud],
  components: {},
  computed: {
    ...mapGetters(['CouponList']),
    option() {
      return option(this);
    },
  },
  data() {
    return {
      COM_HTTP: http,
      fieldMap: {
        id: 'campaignId',
        status: 'campaignStatus',
      },
      isShowFirst: false,
    };
  },
  setup() {},
  methods: {
    customFormattingData(tableData) {
      return tableData.map(item => ({
        ...item,
        couponList: item.couponList.split(','),
      }));
    },
  },
  mounted() {
    this.loading = true;
    this.$store.dispatch('GetCouponList').then(_ => {
      this.loading = false;
      this.searchFun();
    });
  },
};
</script>

<style lang="scss" scoped>
.activitie{
  :deep() {
     .avue-crud__table .el-table .el-table__row .cell{
      max-height: none;
    }
  }
}</style>
