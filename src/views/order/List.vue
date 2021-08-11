<template>
  <div class="order-list">
    <el-form class="order-list__query" :model="queryParams" ref="queryForm" :inline="true">
      <div v-if="getClick('list')">
        <el-form-item label="订单编号" prop="orderSn">
          <el-input v-model="queryParams.orderSn" :maxlength="50" placeholder="请输入订单编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品SPU" prop="productNo">
          <el-input v-model="queryParams.productNo" :maxlength="50" placeholder="请输入商品SPU ID" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="queryParams.productName" :maxlength="50" placeholder="请输入商品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="物流单号" prop="deliverySn">
          <el-input v-model="queryParams.deliverySn" :maxlength="50" placeholder="请输入物流单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户Email" prop="orderUserEmail">
          <el-input v-model="queryParams.orderUserEmail" :maxlength="50" placeholder="请输入用户email" clearable></el-input>
        </el-form-item>
        <el-form-item label="收件人FirstName" prop="receiverFirstName">
          <el-input v-model="queryParams.receiverFirstName" :maxlength="50" placeholder="请输入收件人FirstName" clearable></el-input>
        </el-form-item>
        <el-form-item label="收件人LastName" prop="receiverLastName">
          <el-input v-model="queryParams.receiverLastName" :maxlength="50" placeholder="请输入收件人LastName" clearable></el-input>
        </el-form-item>
        <el-form-item label="收件人手机" prop="receiverPhone">
          <el-input v-model="queryParams.receiverPhone" type="number" :maxlength="20" placeholder="请输入收件人手机"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="payType">
          <el-select v-model="queryParams.payType" placeholder="请选择" clearable>
            <el-option v-for="(label, value) in Dict.payStatus" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-select v-model="queryParams.orderStatus" placeholder="请选择" clearable>
            <el-option v-for="(label, value) in Dict.orderStatus" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="所属店铺">
        <el-select v-model="productQuantity.orderStatus" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item> -->
        <el-form-item label="创建时间" prop="createTimeRange">
          <el-date-picker
            v-model="queryParams.createTimeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="defaultTime"
            clearable
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button v-if="getClick('list')" icon="el-icon-search" size="small" type="danger" @click="handleQuery">查询</el-button>
        <el-button v-if="getClick('list')" icon="el-icon-refresh" size="small" @click="resetQuery('queryForm')">重置</el-button>
        <el-button v-if="getClick('down')" icon="el-icon-download" size="small" type="warning" disabled>导出订单</el-button>
      </el-form-item>
    </el-form>
    <div class="order-list-table" v-if="getClick('list')">
      <el-table :data="tableList" border style="width: 100%;" max-height="657px" height="657px" @expand-change="expandChange">
        <el-table-column type="expand" label="">
          <template #default="props">
            <goods-table
              v-if="tableGoods[props.row.orderSn]"
              :goodsList="tableGoods[props.row.orderSn].goodsList"
              :order="tableGoods[props.row.orderSn].orderResp"
              @click-sale="clickSale"
            ></goods-table>
          </template>
        </el-table-column>
        <el-table-column prop="index" label="编号" align="center" width="50"></el-table-column>
        <el-table-column prop="orderSn" label="订单编号" align="center"  width="120px"></el-table-column>
        <el-table-column prop="createTime" label="提交时间" align="center" width="160px"></el-table-column>
        <el-table-column prop="createTimeAt" label="本地时区" align="center" width="150px"></el-table-column>
        <el-table-column prop="email" label="用户账号" align="center" width="200px"></el-table-column>
        <el-table-column prop="payType" label="支付方式" align="center">
          <template #default="scope">
            {{ Dict.payStatus[scope.row.payType] }}
          </template>
        </el-table-column>
        <el-table-column prop="sourceType" label="订单来源" align="center">
          <template #default="scope">
            {{ Dict.orderSourceType[scope.row.sourceType] }}
          </template>
        </el-table-column>
        <el-table-column prop="totalPayAmountYuan" :label="`订单金额(${$t('currencySymbol')})`" align="center"  width="130px"></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" align="center">
          <template #default="scope">
            {{ Dict.orderStatus[scope.row.orderStatus] }}
          </template>
        </el-table-column>
        <el-table-column prop="" v-if="getClick('viewOrder')" label="操作" align="center">
          <template #default="scope">
            <el-button type="text" size="small" @click="viewCustSnglFun(scope.row)">查看订单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :page="page" @commonHandle="commonHandleCrud"></pagination>
    </div>
    <after-sale-form v-model="showAfterSale" :row="goodsInfo" :order="orderInfo" @submit="toRefresh"></after-sale-form>
  </div>
</template>

<script>
// import crud from '@/mixins/crud';
import Pagination from '@/components/avue/ele-ui/crud/Pagination.vue';
import GoodsTable from './component/GoodsTable.vue';
import AfterSaleForm from './component/AfterSaleForm.vue';
import { http, Dict } from './const/list';
import dayjs from 'dayjs';

export default {
  name: 'OrderList',
  props: {},
  // mixins: [crud],
  components: {
    Pagination,
    GoodsTable,
    AfterSaleForm,
  },
  data() {
    return {
      COM_HTTP: http,
      Dict: Dict,
      queryParams: {
        orderSn: undefined,
        productNo: undefined,
        productName: undefined,
        deliverySn: undefined,
        orderUserEmail: undefined,
        receiverFirstName: undefined,
        receiverLastName: undefined,
        orderStatus: undefined,
        receiverPhone: undefined,
        createTimeRange: undefined,
      },
      page: {
        total: 0,
        pageSize: 20,
        pageNum: 1,
      },
      tableList: [], // 表格数据

      showAfterSale: false,
      goodsInfo: {}, // 商品售后数据
      orderInfo: {}, // 售后订单的整体信息

      tableGoods: {}, // 表格里的商品数据列表，与表格同步(因为表格新增字段数据，会导致表格重新渲染)
      defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)],
    };
  },
  setup() {},
  created() {
    if (!this.getClick('list')) return;
    this.handleQuery();
  },
  methods: {
    getClick(btnName) {
      if (!btnName) return false;
      const { permissionList } = this.$store.getters;
      if (!permissionList) return false;
      const { menuId } = this.$route.meta;
      if (!permissionList[menuId]) return false;
      if (permissionList[menuId].includes(btnName)) return true;
    },
    // 获取表格数据：
    getList() {
      const params = {
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum,
        ...this.queryParams,
      };
      if (params && params.createTimeRange) {
        params.createTimeBegin = dayjs(params.createTimeRange[0])
          .tz()
          .format('YYYY-MM-DD HH:mm:ss');
        params.createTimeEnd = dayjs(params.createTimeRange[1])
          .tz()
          .format('YYYY-MM-DD HH:mm:ss');
        delete params.createTimeRange;
      }

      this.COM_HTTP.reqList(params).then(data => {
        // console.log(data);
        this.page.total = data.total;
        this.tableList = data.list.map((item, index) => {
          item.index = index + 1 + (this.page.pageNum - 1) * this.page.pageSize;
          item.createTimeAt = dayjs(item.createTime).tz().format('YYYY-MM-DD HH:mm');
          item.createTime = dayjs(item.createTime)
            .tz('America/Los_Angeles')
            .format('YYYY-MM-DD HH:mm:ss');
          return item;
        });
      });
    },
    // 查询数据：
    handleQuery() {
      this.page.pageNum = 1;
      this.getList();
    },
    // 重置表单
    resetQuery(formName) {
      for (const key in this.queryParams) {
        if (!(key == 'pageSize' || key == 'pageNum')) {
          this.queryParams[key] = undefined;
        }
      }
      this.$refs[formName].resetFields();
    },
    // 查看订单
    viewCustSnglFun(params) {
      this.$router.push({
        path: `order-detail`,
        query: {
          orderSn: params.orderSn,
          email: params.email,
        },
      });
    },
    // 对某一行展开/关闭时：
    expandChange(row, swi) {
      if (this.tableGoods[row.orderSn] && !swi) return;
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      this.COM_HTTP.orderDetail({
        orderSn: row.orderSn,
      }).then(res => {
        loading.close(); // 关闭
        this.tableGoods[row.orderSn] = {};
        this.tableGoods[row.orderSn].orderResp = res.orderResp;
        // 处理商品信息
        this.tableGoods[row.orderSn].goodsList = res.orderItemResp.map(item => {
          item.orderStatus = res.orderResp.orderStatus;
          // 采集-售后信息
          if (res.orderReturnApplyRespList) {
            const haveAllReturn = res.orderReturnApplyRespList[0].returnType <= 2;
            if (haveAllReturn) {
              // 发生过整单售后
              item.returnType = res.orderReturnApplyRespList[0].returnType;
              item.returnStatus = res.orderReturnApplyRespList[0].returnStatus;
            } else {
              const returnObj = res.orderReturnApplyRespList.find(obj => obj.orderItemId == item.id);
              item.returnStatus = returnObj ? returnObj.returnStatus : undefined;
              item.returnType = returnObj ? returnObj.returnType : undefined;
            }
          }
          return item;
        });
      });
    },
    // 点击商品里的售后：
    clickSale(goods, order) {
      this.orderInfo = order;
      this.goodsInfo = goods;
      this.showAfterSale = true;
    },
    // 刷新订单状态：
    toRefresh(order) {
      this.expandChange(order, 'true'); // 第二个参数仅是个有长度的对象，无其他意义
    },
    // 分页操作：
    commonHandleCrud(key, value) {
      if (key == 'size-change') {
        this.page.pageNum = 1;
        this.page.pageSize = value;
        this.getList();
      } else if (key == 'current-change') {
        if (this.page.pageNum != value) {
          this.page.pageNum = value;
          this.getList();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.order-list {
  background: #edeef3;
  padding-bottom: 30px;
  .order-list__query {
    padding: 30px 24px 10px;
    background: #fff;
  }
  .order-list-table {
    padding: 24px 24px 0;
  }
}
</style>
