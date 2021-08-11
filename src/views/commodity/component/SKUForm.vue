<template>
  <div class="CommodityForm" v-if="dialogVisible">
    <el-dialog top="5vh" title="SKU配置" :before-close="beforeClose" v-model="dialogVisible" width="90%">
      <el-row :gutter="10">
        <el-col :offset="4" :span="3">
          <el-input maxlength="9" v-model="generalNum" placeholder="sku通用库存输入框"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input maxlength="9" v-model="generalPrice" placeholder="sku通用价格输入框"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input maxlength="9" v-model="generalDiscountPrice" placeholder="sku通用折扣价格输入框"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input maxlength="3" max="100" v-model="generalDiscountRate" placeholder="sku通用折扣比例输入框"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input maxlength="9" v-model="generalPurchasePrice" placeholder="sku通用采购价格输入框"></el-input>
        </el-col>
      </el-row>
      <el-table :data="SKUList" style="width: 100%" border>
        <el-table-column label="默认sku" width="80">
          <template #default="scope">
            <el-radio v-model="radio" :label="scope.$index"></el-radio>
          </template>
        </el-table-column>
        <el-table-column v-for="(item, index) in skuLength" :key="index" label="基础属性" :prop="enumera[item].val" width="100">
        </el-table-column>
        <el-table-column label="SKU编码">
          <template #default="scope">
            <el-input maxlength="13" :disabled="!!scope.row.id" v-model="scope.row.skuNo" placeholder="空则自动生成"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="库存">
          <template #default="scope">
            <el-input maxlength="9" v-model="scope.row.num"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="销售价格">
          <template #default="scope">
            <el-input maxlength="9" v-model="scope.row.price" @input="changePrice($event, scope.$index)">
              <template #append>
                <span>{{ $t('currencySymbol') }}</span>
              </template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="折扣比例">
          <template #default="scope">
            <el-input maxlength="3" max="100" min="0" v-model="scope.row.discountRate" @input="changeDiscountRate($event, scope.$index)">
              <template #append>
                <span>%</span>
              </template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="折扣价格">
          <template #default="scope">
            <el-input maxlength="9" v-model="scope.row.discountPrice" @input="changeDiscountPrice($event, scope.$index)">
              <template #append>
                <span>{{ $t('currencySymbol') }}</span>
              </template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="采购价格">
          <template #default="scope">
            <el-input maxlength="9" v-model="scope.row.costPrice">
              <template #append>
                <span>{{ $t('currencySymbol') }}</span>
              </template>
            </el-input>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="beforeClose">取 消</el-button>
          <!-- <el-button @click="submit(3)">存草稿</el-button> -->
          <el-button type="primary" @click="submit">发 布</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import NP from 'number-precision';
export default {
  props: ['modelValue', 'skuLength'],
  emits: ['update:modelValue', 'submit'],
  data() {
    return {
      dialogVisible: false,
      generalNum: '',
      generalPrice: '',
      generalDiscountPrice: '',
      generalPurchasePrice: '',
      generalDiscountRate: '',
      radio: 0,
      SKUList: [],
      enumera: {
        1: {
          id: 'attrValIdOne',
          val: 'attrValOne',
        },
        2: {
          id: 'attrValIdTwo',
          val: 'attrValTwo',
        },
        3: {
          id: 'attrValIdThree',
          val: 'attrValThree',
        },
        4: {
          id: 'attrValIdFour',
          val: 'attrValFour',
        },
      },
    };
  },
  watch: {
    modelValue(val) {
      this.dialogVisible = !!val;
      if (!val) return;
      val.forEach((item, index) => {
        if (item.isDefault == 1) {
          this.radio = index;
        }
      });
      this.SKUList = val.map(item => ({
        ...item,
        price: item.price ? NP.divide(item.price, 100) : '',
        discountPrice: item.discountPrice ? NP.divide(item.discountPrice, 100) : '',
        costPrice: item.costPrice ? NP.divide(item.costPrice, 100) : '',
        // discountRate: item.discountRate ? NP.multi(item.discountRate, 100) : '',
        discountRate: item.discountRate ? item.discountRate * 100 : '',
      }));
    },
    generalNum(val) {
      if (val) {
        this.SKUList.forEach((item, index, arr) => {
          arr[index].num = val;
        });
      }
    },
    // 通用销售价格:
    generalPrice(val) {
      if (val) {
        this.SKUList.forEach((item, index, arr) => {
          arr[index].price = val;
          arr[index].discountRate = Math.round(((val - item.discountPrice) / val) * 100);
        });
      }
    },
    // 通用折扣价格:
    generalDiscountPrice(val) {
      if (val) {
        this.SKUList.forEach((item, index, arr) => {
          arr[index].discountRate = Math.round(((item.price - val) / item.price) * 100);
          arr[index].discountPrice = val;
        });
      }
    },
    // 通用折扣比例:
    generalDiscountRate(val) {
      if (val) {
        if (val >= 100) {
          val = 100;
          this.generalDiscountRate = 100;
        }
        this.SKUList.forEach((item, index, arr) => {
          arr[index].discountPrice = val < 100 ? (item.price - NP.divide(item.price * val, 100)).toFixed(2) : 0;
          arr[index].discountRate = val;
        });
      }
    },
    generalPurchasePrice(val) {
      if (val) {
        this.SKUList.forEach((item, index, arr) => {
          arr[index].costPrice = val;
        });
      }
    },
  },
  computed: {},
  methods: {
    beforeClose() {
      this.SKUList = [];
      this.radio = 0;
      this.generalNum = '';
      this.generalPrice = '';
      this.generalDiscountPrice = '';
      this.generalPurchasePrice = '';
      this.generalDiscountRate = '';
      this.$emit('update:modelValue', false);
    },
    submit() {
      let errStr = '';
      let str = 'addProductSku';
      this.SKUList.some(item => {
        const { id, num, price, discountPrice, costPrice, skuNo } = item;
        // const { id, price, discountPrice, skuNo } = item;
        if (id) {
          str = 'updateProductSku';
        }
        // if (!id && skuNo && new RegExp(`/^(${this.currentRow.productNo})\d{3,3}/`).test(skuNo)) {
        if (!id && skuNo && new RegExp(`/\w{1,13}/`).test(skuNo)) {
          errStr = `sku编码1~13位字母数字组合`;
        }
        if ((!num && num !== 0) || !/^\+?[0-9]*$/.test(num)) errStr = '库存为自然数';
        if (!price || !/^([0-9]|[1-9]\d+)(\.\d{1,2})?$/.test(price)) errStr = '销售价格必填且至多两位小数';
        if (discountPrice == '0') errStr = '折扣价格不能为0';
        if (discountPrice && !/^([0-9]|[1-9]\d+)(\.\d{1,2})?$/.test(discountPrice)) errStr = '折扣价格至多两位小数';
        if (discountPrice && discountPrice > Number(price)) errStr = '折扣价格不能高于销售价格';
        if (this.$t('currencySymbol') == 'JPY' && (String(price).includes('.') || String(discountPrice).includes('.') || String(costPrice).includes('.'))) {
          errStr = 'bondot平台价格不能有小数';
        }
        return Boolean(errStr);
      });
      if (errStr) return this.$message.warning(errStr);
      this.$emit(
        'submit',
        {
          list: this.SKUList.map((item, index) => ({
            ...item,
            price: NP.times(item.price, 100),
            discountPrice: item.discountPrice ? NP.times(item.discountPrice, 100) : NP.times(item.price, 100),
            costPrice: NP.times(item.costPrice, 100),
            skuSort: index + 1,
            isDefault: Number(index == this.radio),
          })),
          str,
        },
        this.beforeClose
      );
    },
    // 销售价格变化:
    changePrice(val, i) {
      if (this.SKUList[i].discountPrice) {
        this.SKUList[i].discountRate = Math.round(((val - this.SKUList[i].discountPrice) / val) * 100);
      }
    },
    // 折扣比例
    changeDiscountRate(val, i) {
      if (this.SKUList[i].price) {
        if (val >= 100) {
          val = 100;
          this.SKUList[i].discountRate = 100;
        }
        this.SKUList[i].discountPrice = (this.SKUList[i].price - NP.divide(this.SKUList[i].price * val, 100)).toFixed(2);
      }
    },
    // 折扣价格:
    changeDiscountPrice(val, i) {
      if (this.SKUList[i].price) {
        this.SKUList[i].discountRate = Math.round(((this.SKUList[i].price - val) / this.SKUList[i].price) * 100);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.CommodityForm {
  .el-table {
    margin-top: 10px;
    th {
      background: #f7f7f7;
    }
  }
}
</style>
