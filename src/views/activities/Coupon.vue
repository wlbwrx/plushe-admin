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
    <el-dialog top="5vh" :title="`${editForm[fieldMap.id] ? '编辑' : '新增'}优惠券`" v-model="dialogVisible" width="70%">
      <avue-form ref="editForm" v-model="editForm" v-if="dialogVisible" :option="editOption"></avue-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option, editOption } from './const/coupon';

import { mapGetters } from 'vuex';
export default {
  name: 'Coupon',
  props: {},
  mixins: [crud],
  components: {},
  computed: {
    ...mapGetters(['productCategoryList']),
    editOption() {
      return editOption(this);
    },
    option() {
      return option(this);
    },
  },
  watch: {},
  data() {
    return {
      COM_HTTP: http,
      dialogVisible: false,
      editForm: {},
      fieldMap: {
        id: 'couponId',
        status: 'couponStatus',
      },
    };
  },
  setup() {},
  methods: {
    customFormattingData(tableData) {
      return tableData.map(item => ({
        ...item,
        timeArr: [item.startTime, item.endTime],
        productCategory: item.productCategory.split(',').map(item => Number(item)),
      }));
    },
    addCustBtnFun() {
      this.dialogVisible = true;
      this.editForm = {};
    },
    editCustSnglFun() {
      Object.assign(this.editForm, this.currentRow);
      this.dialogVisible = true;
    },
    submit() {
      if (!this.$refs.editForm.validate()) return;
      const { id } = this.fieldMap;
      this[this.editForm[id] ? 'updataFun' : 'addFun'](this.editForm).then(_ => {
        this.dialogVisible = false;
        this.editForm = {};
      });
    },
    customCrudParamsHandle(params) {
      const { productCategory, couponType, discountProbability, thresholdAmount, couponRestrict, timeModel, couponLimit } = params;
      let errStr = '';
      const fixedAmount = Number(params.fixedAmount);
      const maxAmount = Number(params.maxAmount);
      if (couponType == 1) {
        if (!fixedAmount) errStr = '抵扣金额不能为空';
        params.discountModel = 1;
      } else if (couponType == 2) {
        if (!fixedAmount || !thresholdAmount) errStr = '抵扣金额和门槛金额不能为空';
        if (fixedAmount >= thresholdAmount) errStr = '抵扣金额必须小于门槛金额';
        params.discountModel = 1;
      } else if (couponType == 3) {
        if (!discountProbability || !thresholdAmount || !maxAmount) errStr = '抵扣比例,门槛金额,最高金额不能为空';
        if (discountProbability > 50) errStr = '抵扣比例不能大于50';
        params.discountModel = 2;
      } else if (couponType == 4) {
        if (!discountProbability || !maxAmount) errStr = '抵扣比例,最高金额不能为空';
        params.discountModel = 2;
        params.thresholdAmount = 0;
      }
      if (couponRestrict == 1 && timeModel == 1) errStr = '通用券只能选择相对时间模式';
      if (this.currentRow && this.currentRow.couponLimit > couponLimit) errStr = `优惠券数量不小于${this.currentRow.couponLimit}`;
      if (errStr) {
        this.$message.warning(errStr);
        return;
      }
      if (Array.isArray(productCategory)) {
        params.productCategory = productCategory.includes(-1) ? 0 : productCategory.join(',');
      }
      params.productCategory = productCategory || '';
      params.couponCurrency = this.$t('currencySymbol');
      return params;
    },
    customParameterHandle(arr) {
      return arr.concat('discountProbability', 'maxAmount', 'validPeriod', 'couponLimit', 'comment');
    }
  },
  mounted() {},
  created() {},
};
</script>

<style lang="scss" scoped></style>
