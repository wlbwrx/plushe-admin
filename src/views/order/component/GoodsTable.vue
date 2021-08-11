<template>
  <div>
    <el-table :data="goodsList" border :header-cell-class-name="isHeaderBg ? 'order-detail__table-header' : ''">
      <el-table-column prop="skuNo" label="SKU编号" align="center"></el-table-column>
      <el-table-column prop="picUrl" label="商品图片" align="center">
        <template #default="scope">
          <el-image class="goods-image" :src="scope.row.picUrl" :preview-src-list="[scope.row.picUrlMax]"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="" label="基础属性" align="center">
        <template #default="scope">
          <div v-html="filterAttr(scope.row)"></div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="countPayPriceYuan" :label="`应付(${$t('currencySymbol')})`" align="center"></el-table-column> -->
      <el-table-column prop="productPriceYuan" :label="`原价(${$t('currencySymbol')})`" align="center"></el-table-column>
      <el-table-column prop="payPriceYuan" :label="`折扣价单价(${$t('currencySymbol')})`" align="center"></el-table-column>
      <el-table-column prop="unitAmountYuan" :label="`实付单价(${$t('currencySymbol')})`" align="center"></el-table-column>
      <el-table-column prop="totalAmountYuan" :label="`实付总额(${$t('currencySymbol')})`" align="center"></el-table-column>
      <el-table-column prop="productQuantity" label="数量" align="center"></el-table-column>
      <el-table-column prop="returnStatus" label="售后状态" align="center">
        <template #default="scope">
          {{ scope.row.returnStatus >= 0 ? Dict.returnStatus[scope.row.returnStatus] : '未售后' }}
        </template>
      </el-table-column>
      <el-table-column prop="returnType" label="售后类型" align="center">
        <template #default="scope">
          {{ scope.row.returnType >= 0 ? Dict.returnType[scope.row.returnType] : '未售后' }}
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" align="center">
        <template #default="scope">
          <el-button
            :disabled="order.orderStatus < 1 || order.orderStatus > 3 || scope.row.returnType >= 0"
            type="text"
            size="small"
            @click="afterSale(scope.row, order)"
            >售后</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Dict } from '../const/list';

export default {
  props: {
    goodsList: {
      type: Array,
    },
    order: {
      type: Object,
    },
    isHeaderBg: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click-sale'],
  data() {
    return {
      Dict: Dict,
      goodsInfo: {},
      orderInfo: {},
      showAfterSale: false,
    };
  },
  created() {},
  methods: {
    // 生成想要的属性：
    filterAttr(row) {
      let str = '';
      const arrKey = [];
      const arrValue = [];
      for (const key in row) {
        if (key.includes('attr') && row[key] && key.length == 5) {
          arrKey.push(row[key]);
        } else if (key.includes('attrVal') && row[key]) {
          arrValue.push(row[key]);
        }
      }
      arrKey.forEach((item, index) => {
        str += item + '：' + arrValue[index] + '<br>';
      });
      return str;
    },
    // 点击售后：
    afterSale(row, order) {
      this.orderInfo = order;
      if (row.returnStatus >= 1) {
        // 处理中
        this.$message.warning('该订单正在售后处理中，请等待处理完成后再操作');
      } else {
        this.goodsInfo = row;
        this.showAfterSale = true;
      }
      this.$emit('click-sale', row, order);
    },
  },
};
</script>

<style lang="scss" scoped>
.goods-image {
  width: 60px;
  height: 60px;
}
</style>
