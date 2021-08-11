<template>
  <div class="order-detail">
    <div class="order-detail__top">
      <span class="order-detail__status">当前订单状态：{{ Dict.orderStatus[orderStatus] }}</span>
      <div class="order-detail__top-btns">
        <!-- <el-button v-if="orderStatus >= 1" @click="changeReceiverUserInfo">修改收件人信息</el-button> -->
        <el-button
          v-if="orderStatus >= 1 && orderStatus < 6"
          @click="afterSaleAll"
          :disabled="orderStatus >= 4 || isHavedReturn"
          type="primary"
          >整单售后</el-button
        >
      </div>
    </div>
    <div class="order-detail__box">
      <h3 class="order-detail__title">基本信息</h3>
      <el-table :data="orderTable" header-cell-class-name="order-detail__table-header" border style="width: 100%;margin-bottom: 10px;">
        <el-table-column prop="orderSn" label="订单编号" align="center"></el-table-column>
        <el-table-column prop="email" label="用户账号" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="sourceType" label="支付方式" align="center">
          <template #default="scope">
            {{ Dict.payStatus[scope.row.payType] }}
          </template>
        </el-table-column>
        <el-table-column prop="sourceType" label="订单来源" align="center">
          <template #default="scope">
            {{ Dict.orderSourceType[scope.row.sourceType] }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="order-detail__box">
      <h3 class="order-detail__title">费用信息</h3>
      <el-table :data="orderTable" header-cell-class-name="order-detail__table-header" border style="width: 100%;margin-bottom: 10px;">
        <el-table-column prop="totalPayAmountYuan" :label="`付款总额(${$t('currencySymbol')})`" align="center"></el-table-column>
        <el-table-column prop="totalAmountYuan" :label="`商品总额(${$t('currencySymbol')})`" align="center"></el-table-column>
        <el-table-column prop="payAmountYuan" :label="`商品实付(${$t('currencySymbol')})`" align="center"></el-table-column>
        <el-table-column prop="" :label="`减免金额(${$t('currencySymbol')})`" align="center">
          <template #default="scope">
            {{
              ((scope.row.couponAmountYuan || 0) * 100 +
                (scope.row.integrationAmountYuan || 0) * 100 +
                (scope.row.promotionAmountYuan || 0) * 100 +
                (scope.row.discountAmountYuan || 0) * 100) /
                100
            }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="codFeeAmountYuan" :label="`到付手续费(${$t('currencySymbol')})`" align="center"></el-table-column> -->
        <el-table-column prop="taxAmountYuan" :label="`税款(${$t('currencySymbol')})`" align="center"></el-table-column>
        <el-table-column prop="freightAmountYuan" :label="`运费总额(${$t('currencySymbol')})`" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- <div class="order-detail__box">
      <h3 class="order-detail__title">收件人信息</h3>
      <el-table :data="orderTable" header-cell-class-name="order-detail__table-header" border style="width: 100%;margin-bottom: 10px;">
        <el-table-column prop="receiverFirstName" label="FirstName" align="center"></el-table-column>
        <el-table-column prop="receiverLastName" label="LastName" align="center"></el-table-column>
        <el-table-column prop="receiverPhone" label="电话" align="center"></el-table-column>
        <el-table-column prop="receiverCountry" label="国家" align="center"></el-table-column>
        <el-table-column prop="receiverCity" label="City" align="center"></el-table-column>
        <el-table-column prop="receiverState" label="State/Province" align="center"></el-table-column>
        <el-table-column prop="receiverPostCode" label="邮政编码" align="center"></el-table-column>
        <el-table-column prop="receiverDetailAddress" label="详细收件地址" align="center">
          <template #default="scope">
            {{ scope.row.receiverDetailAddressone + ' ' + scope.row.receiverDetailAddresstwo }}
          </template>
        </el-table-column>
        <el-table-column prop="billRecCity" label="账单地址" align="center">
          <template #default="scope">
            {{ scope.row.billDetailAddressone + ' ' + scope.row.billDetailAddresstwo }}
          </template>
        </el-table-column>
      </el-table>
    </div> -->
    <div class="order-detail__box">
      <h3 class="order-detail__title">地址信息</h3>
      <el-table :data="orderAddress" header-cell-class-name="order-detail__table-header" border style="width: 100%;margin-bottom: 10px;">
        <el-table-column prop="addressType" label="地址类型" align="center">
          <template #default="scope">
            {{ scope.row.addressType == 2 ? '账单地址' : '收件地址' }}
          </template>
        </el-table-column>
        <el-table-column prop="firstName" label="FirstName" align="center"></el-table-column>
        <el-table-column prop="lastName" label="LastName" align="center"></el-table-column>
        <el-table-column prop="katakanaFirstName" label="片假名（姓）:" align="center"></el-table-column>
        <el-table-column prop="katakanaLastName" label="片假名（名）:" align="center"></el-table-column>
        <el-table-column prop="phone" label="电话" align="center"></el-table-column>
        <el-table-column prop="country" label="国家" align="center"></el-table-column>
        <el-table-column prop="city" label="City" align="center"></el-table-column>
        <el-table-column prop="state" label="State/Province" align="center"></el-table-column>
        <el-table-column prop="ting" label="町" align="center"></el-table-column>
        <el-table-column prop="postCode" label="邮政编码" align="center"></el-table-column>
        <el-table-column prop="detailAddress" label="详细地址" align="center">
          <template #default="scope">
            {{ scope.row.detailAddressone + ' ' + scope.row.detailAddresstwo }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="order-detail__box">
      <h3 class="order-detail__title">商品信息</h3>
      <goods-table :goodsList="goodsTable" :order="orderTable[0]" :isHeaderBg="true" @click-sale="clickSale"></goods-table>

      <!-- <h3 class="order-detail__goods-totals">
        <span>合计：{{ (orderTable[0] && orderTable[0].totalAmountYuan) || '' }}</span>
        <span>实付：{{ (orderTable[0] && orderTable[0].payAmountYuan) || '' }}</span>
      </h3> -->
    </div>

    <div class="order-detail__box">
      <h3 class="order-detail__title">物流信息</h3>
      <el-table :data="logisticsTable" header-cell-class-name="order-detail__table-header" border style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <el-table :data="props.row.goodsList" border>
              <el-table-column label="SKU编号" prop="skuNo" align="center"></el-table-column>
              <el-table-column label="数量" prop="productQuantity" align="center"></el-table-column>
              <el-table-column prop="picKey" label="商品图片" align="center">
                <template #default="scope">
                  <el-image class="goods-image" :src="scope.row.picUrl"></el-image>
                </template>
              </el-table-column>
              <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="deliverySn" label="物流单号" align="center">
          <template #default="scope">
            <span class="el-button--text" @click="toViewLogistics(scope.row)">{{ scope.row.deliverySn }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryCompany" label="物流公司" align="center"></el-table-column>
        <el-table-column prop="logisticsStatus" label="物流状态" align="center">
          <template #default="scope">
            {{ (scope.row.logisticsStatus >= 0 && Dict.logisticsStatus[scope.row.logisticsStatus]) || '暂无' }}
          </template>
        </el-table-column>
        <el-table-column prop="receiveTime" label="收货时间" align="center"></el-table-column>
      </el-table>
    </div>

    <after-sale-form
      v-model="showAfterSale"
      :type="afterSaleType"
      :row="goodsInfo"
      :only="onlyOneReturnType"
      :order="orderTable[0]"
      @submit="toRefresh"
    ></after-sale-form>

    <!-- <recevie-user-form v-model="showRecevieUser" :info="orderTable[0]"></recevie-user-form> -->

    <el-dialog top="5vh" title="物流详情" v-model="logisticsVisible" width="40%">
      <el-steps direction="vertical" :active="0" v-if="logisticsDetail.length">
        <el-step :title="item.time" :description="item.content" v-for="item of logisticsDetail" :key="item.time"></el-step>
      </el-steps>
      <p v-else>暂无物流信息</p>
    </el-dialog>
  </div>
</template>

<script>
import { http, Dict } from './const/list';
import AfterSaleForm from './component/AfterSaleForm.vue';
// import RecevieUserForm from './component/RecevieUserForm.vue';
import GoodsTable from './component/GoodsTable.vue';
import dayjs from 'dayjs';

export default {
  components: {
    AfterSaleForm,
    // RecevieUserForm,
    GoodsTable,
  },
  data() {
    return {
      Dict: Dict,
      orderSn: '', // 核心id
      email: '', // 用户账号
      orderStatus: '', // 订单状态
      orderTable: [], // 订单表格信息
      orderAddress: [],
      logisticsTable: [], // 物流信息
      goodsTable: [], // 商品详情信息
      showAfterSale: false, // 售后弹框 显隐
      afterSaleType: 0, // 1-点击商品里的售后， 0-点击整单售后
      goodsInfo: {}, // 表格-商品信息传入售后组件
      showRecevieUser: false, // 修改收件人信息弹框 显隐
      logisticsVisible: false, // 物流详情 显隐
      isHavedReturn: false, // 是否发生过售后
      onlyOneReturnType: '', // 整单部分退 or 待发货只能整单全部退 的情景
      logisticsDetail: [], // 物流详情信息
    };
  },
  setup() {},
  created() {
    this.email = this.$route.query.email;
    this.orderSn = this.$route.query.orderSn;
    this.getPageData();
  },
  methods: {
    // 整单售后：
    afterSaleAll() {
      this.afterSaleType = 0;
      this.goodsInfo = {};
      this.showAfterSale = true;
    },
    // 修改收件人信息
    changeReceiverUserInfo() {},
    // 查看物流信息：
    toViewLogistics(row) {
      http
        .orderLogistics({
          orderId: row.orderId,
          orderSn: row.orderSn,
          deliveryCompany: row.deliveryCompany,
          deliverySn: row.deliverySn,
        })
        .then(res => {
          this.logisticsVisible = true;
          if (res.deliveryInfo) {
            const info = res.deliveryInfo.split('\n');
            let arr = [];
            info.forEach((item, index) => {
              if (index % 2 == 0) {
                arr.push({ time: item });
              } else {
                arr[arr.length - 1].content = item;
              }
            });
            arr = arr.filter(item => item.time);
            this.logisticsDetail = arr;
          } else {
            this.lthis.logisticsDetail = [];
          }
        });
    },
    // 点击了商品里的售后：
    clickSale(goods) {
      this.afterSaleType = 1;
      this.goodsInfo = goods;
      this.showAfterSale = true;
    },
    // 刷新订单状态：
    toRefresh() {
      this.getPageData();
    },
    // 获取页面数据：
    getPageData() {
      const data = {
        orderSn: this.orderSn,
      };
      http.orderDetail(data).then(res => {
        this.onlyOneReturnType = '';
        // 处理订单信息
        res.orderResp.email = this.email;
        this.orderStatus = res.orderResp.orderStatus;
        this.orderTable = [res.orderResp].map(item => ({
          ...item,
          createTime: dayjs(item.createTime)
            .tz('America/Los_Angeles')
            .format('YYYY-MM-DD HH:mm:ss'),
        }));
        this.orderAddress = res.orderAddressRespList;
        // 处理物流信息
        if (res.orderLogisticsRespList && res.orderLogisticsRespList.length) {
          this.logisticsTable = res.orderLogisticsRespList.map(item => {
            item.orderSkuList = JSON.parse(item.orderSkuList);
            item.goodsList = [];
            for (const key in item.orderSkuList) {
              const goods = res.orderItemResp.find(obj => obj.skuNo == key);
              if (goods) {
                item.goodsList.push({ ...goods, productQuantity: item.orderSkuList[key] });
              }
            }
            return item;
          });
        }

        // 处理商品信息
        this.goodsTable = res.orderItemResp.map(item => {
          item.orderStatus = res.orderResp.orderStatus;
          if (item.orderStatus == 1) {
            // 待发货状态下只能悬着 整单全部退含运费
            this.onlyOneReturnType = '0';
          }
          // 采集-售后信息
          if (res.orderReturnApplyRespList && res.orderReturnApplyRespList.length) {
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

        // 检测是否发生过售后(仅 2-整单部分退 还能再次退款)
        if (res.orderReturnApplyRespList) {
          res.orderReturnApplyRespList.forEach(item => {
            if (item.returnType >= 3 || item.returnType <= 1) {
              this.isHavedReturn = true;
            }
            if (item.returnType == 2) {
              this.onlyOneReturnType = '2';
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.order-detail {
  padding: 32px;
  overflow-y: auto;
  .order-detail__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    margin-bottom: 16px;
    background: #f5f5f5;
    padding: 20px;
    .order-detail__status {
      color: red;
    }
  }
  .order-detail__box {
    margin-bottom: 30px;
  }
  .order-detail__title {
    font-size: 16px;
    margin-bottom: 12px;
    padding-left: 24px;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 12px;
      height: 12px;
      background: #000;
      transform: translateY(-50%);
    }
  }
  .order-detail__goods-totals {
    text-align: right;
    margin-top: 16px;
    color: red;
    span {
      margin-left: 20px;
    }
  }
  .order-detail__btns {
    margin-top: 10px;
    text-align: right;
  }
  :deep(.order-detail__table-header) {
    background: #f5f5f5;
    color: #606266;
  }
  .goods-image {
    width: 60px;
    height: 60px;
  }
}
</style>
