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
    <CommodityForm :status="status" @update:status="status = $event" :currentRow="currentRow" @submit="submit" />
    <CommodityProductSize v-model="sizeStauts" :currentRow="currentRow" @submit="sizesubmit" />
    <SKUForm v-model="skuList" :skuLength="skuLength" @submit="skuSubmit" />
    <BaseExportTable v-model="exportData" @submit="exportSubmit" />
    <el-dialog top="5vh" title="批量排序" v-model="dialogVisible" width="30%">
      <el-input-number v-model="sort" :min="0" :max="9999"></el-input-number>
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
import { http, option, exportHttp } from './const/list';
// import { http as categoriesHttp } from './const/categories';
import CommodityForm from './component/CommodityForm';
import CommodityProductSize from './component/CommodityProductSize';
import SKUForm from './component/SKUForm';
import { mapGetters } from 'vuex';
import BaseExportTable from '@components/base/BaseExportTable';

export default {
  name: 'CommodityList',
  props: {},
  mixins: [crud],
  components: {
    BaseExportTable,
    CommodityProductSize,
    CommodityForm,
    SKUForm,
  },
  computed: {
    ...mapGetters(['productCategoryList', 'attachedProperty']),
    option() {
      return option(this);
    },
  },
  data() {
    return {
      COM_HTTP: http,
      status: 0,
      sizeStauts: 0,
      skuList: false,
      skuLength: 2,
      fieldMap: {
        id: 'productNo',
        status: 'productStatus',
      },
      dialogVisible: false,
      sort: '',
      uploadKey: 'Add',
    };
  },
  setup() {},
  methods: {
    searchFunParamsFiltering(parms) {
      if (parms.searchParentId && Array.isArray(parms.searchParentId)) {
        const [productCateOne, productCateTwo, productCateThree] = parms.searchParentId;
        parms.productCateOne = productCateOne;
        parms.productCateThree = productCateThree;
        parms.productCateTwo = productCateTwo;
      }
      if (parms.attrValId && Array.isArray(parms.attrValId)) {
        parms.attrValId = parms.attrValId[1] || '';
      }
      return parms;
    },
    skuSnglFun(parms) {
      const { productNo } = parms;
      this.loading = true;
      this.COM_HTTP.listSkuByProductId({
        productNo,
      }).then((res) => {
        if (res && res[0]) {
          const { attrValIdTwo, attrValIdThree, attrValIdFour } = res[0];
          this.skuLength = attrValIdFour ? 4 : attrValIdThree ? 3 : attrValIdTwo ? 2 : 1;
        }
        this.skuList = (res || []).map((item) => ({ ...item, productNo }));
        if (res) {
          this.loading = false;
          return;
        }
        // 获取产品属性列表
        this.COM_HTTP.getByProductNo({
          productNo,
        }).then((res) => {
          const { attrValRelList } = res;
          // 获取类目所有属性值
          const obj = {};
          attrValRelList.forEach((item) => {
            if (item.attrValStatus != 1 || item.attrType != 1) return;
            obj[item.attrId] = obj[item.attrId] || [];
            obj[item.attrId].push({ ...item, productNo });
          });
          const enumera = {
            0: {
              id: 'attrValIdOne',
              val: 'attrValOne',
            },
            1: {
              id: 'attrValIdTwo',
              val: 'attrValTwo',
            },
            2: {
              id: 'attrValIdThree',
              val: 'attrValThree',
            },
            3: {
              id: 'attrValIdFour',
              val: 'attrValFour',
            },
          };
          const originArr = this.mergeCalculate(...Object.keys(obj).map((item) => obj[item]));
          this.skuList = originArr.map((item) => {
            const skuObj = {};
            for (let index = 0; index < item.length; index++) {
              this.skuLength = item.length;
              skuObj.attrId = item[index].attrId;
              skuObj.productNo = productNo;
              skuObj[enumera[index]['id']] = item[index].attrValId;
              skuObj[enumera[index]['val']] = item[index].val;
            }
            return skuObj;
          });
          this.loading = false;
        });
      });
    },
    mergeCalculate() {
      return Array.prototype.reduce.call(
        arguments,
        function (a, b) {
          const ret = [];
          a.forEach(function (a) {
            b.forEach(function (b) {
              ret.push(a.concat([b]));
            });
          });
          return ret;
        },
        [[]]
      );
    },
    sizeSnglFun({ productNo }) {
      http['getProductSize']({
        productNo,
      }).then((res) => {
        // console.log(222, res);
        this.currentRow = Object.assign(res, this.currentRow);
        this.sizeStauts = 1;
      });
    },
    // 点击新增按钮:
    addCustBtnFun() {
      const { shopsId } = this.user;
      if (!shopsId && process.env.NODE_ENV !== 'development') {
        this.$message.warning('请使用店铺帐号操作商品');
        return false;
      }
      this.status = 1;
    },
    // 编辑按钮:
    editCustSnglFun(parms) {
      const { shopsId } = this.user;
      if (!shopsId && process.env.NODE_ENV !== 'development') {
        this.$message.warning('请使用店铺帐号操作商品');
        // return false;
      }
      this.loading = true;
      this.COM_HTTP.getByProductNo({
        productNo: parms.productNo,
      }).then((res) => {
        this.loading = false;
        this.status = 2;
        this.currentRow = {
          ...this.currentRow,
          ...res,
          picsList: res.picsList.sort((a, b) => a.picSort - b.picSort),
        };
      });
    },
    submit(form, callFun) {
      const { shopsId } = this.user;
      if (!shopsId && process.env.NODE_ENV !== 'development') {
        return this.$message.warning('请使用店铺帐号操作商品');
      }
      const { productNo } = form;
      http[this.status == 2 ? 'reqUpdate' : 'reqAdd'](form).then((res) => {
        this.$message.success('操作成功');
        this.tableList = this.tableList.map((item) => {
          if (item.productNo == productNo) {
            item.productStatus = 3;
          }
          return item;
        });
        // if (skuEdit) {
        this.skuSnglFun({
          productNo: productNo || res,
        });
        // }
        if (callFun) callFun();
        // this.searchFun();
      });
    },
    skuSubmit(obj, callFun) {
      obj.productStatus = obj.productStatus || this.currentRow.productStatus;
      http[obj.str](obj).then((_) => {
        this.$message.success('操作成功');
        this.searchFun();
        callFun();
      });
    },
    sizesubmit(form, callFun) {
      const { productNo } = this.currentRow;
      http[form.str]({ ...form, productNo }).then((_) => {
        this.$message.success('操作成功');
        this.searchFun();
        callFun();
      });
    },
    updateStatusParamsHandle(params = {}) {
      const { id, status } = this.fieldMap;
      return {
        [id]: params[id],
        [status]: params[status] == 1 ? 2 : 1,
      };
    },
    async updateSort(params) {
      await this.COM_HTTP.updateSort(params);
    },
    sortsBtnFun() {
      if (this.selectionList.length === 0) {
        return this.$message.warning('至少选中一项');
      }
      this.dialogVisible = true;
    },
    submitSort() {
      if (isNaN(this.sort)) return;
      const arr = this.selectionList.map((item) => http['updateSort']({ productNo: item.productNo, sort: this.sort }));
      Promise.all(arr)
        .then((_) => {
          this.dialogVisible = false;
          this.$message.success('操作成功');
          this.searchFun();
        })
        .catch((_) => {
          this.dialogVisible = false;
          this.$message.warning('请求异常,请确认每项排序值');
          this.searchFun();
        });
    },
    async updataSnglPoPputAwayFun(item) {
      const updataParams = await this.updateStatusParamsHandle(item);
      if (!updataParams) return;
      await this.COM_HTTP.reqUpdateStatus(updataParams);
      this.$message.success('修改成功');
      if (typeof this.updataLater === 'function') this.updataLater();
      setTimeout(() => {
        this.searchFun();
      }, 1000);
    },
    exportSubmit(list, callFun) {
      exportHttp['apply'](list)
        .then((_) => {
          this.$message.success('操作成功');
          this.searchFun();
          callFun();
        })
        .catch((_) => {
          callFun();
        });
    },
    // exportSubmit(list, callFun) {
    //   exportHttp[`apply${this.uploadKey}`](list)
    //     .then((_) => {
    //       this.$message.success('操作成功');
    //       this.searchFun();
    //       callFun();
    //     })
    //     .catch((_) => {
    //       callFun();
    //     });
    // },
    // async uploadCallback(res) {
    //   this.exportData = await this.COM_HTTP[`verifyFile${this.uploadKey}`]({ s3Key: res.response.picKey });
    // },
    addImportBtnFun() {
      this.uploadKey = 'Add';
    },
    updateImportBtnFun() {
      this.uploadKey = 'Update';
    },
  },
  created() {
    this.$store.dispatch('getBrands');
    this.$store.dispatch('getSizeConfig');
  },
};
</script>

<style lang="scss" scoped></style>
