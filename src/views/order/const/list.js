import request from '@/utils/request';
import store from '@/store';
// import { RULE } from '@/utils/validators';
import { imageHandler } from '@/utils/index';

export const http = {
  reqList(params) {
    return request.post(`/order/list`, params);
  },
  invoice(data) {
    return request.post(`/order/invoice/${data.id}`);
  },
  closeOrder(data) {
    return request.post(`/order/closeOrder/${data.id}`);
  },
  orderDetail(data) {
    return request.post(`/order/orderDetail/${data.orderSn}`).then(res => {
      res.orderItemResp = res.orderItemResp.map(item => {
        if (item.picKey) {
          item.picUrl = imageHandler(0, item.picKey);
          item.picUrlMax = imageHandler(1, item.picKey);
        }
        return item;
      });
      return res;
    });
  },
  // 物流信息：
  orderLogistics(data) {
    return request.post(`/order/logistics`, data);
  },
  // 售后
  returnOrder(data) {
    return request.post(`/order/returnOrder`, data);
  },
};

export const Dict = {
  ...store.getters.dict,
  // 订单状态
  payStatus: {
    1: 'paypal',
    4: 'Stripe',
    5: 'afterpay',
  },
  orderStatus: {
    0: '待支付',
    1: '待发货',
    2: '已发货',
    3: '已收货',
    4: '交易关闭',
    5: '交易完成',
    6: '支付中',
  },
  // 订单来源
  orderSourceType: {
    1: 'android',
    2: 'ios',
    3: 'h5',
    4: 'pc',
  },
  // 退款类型
  returnType: {
    '0': '整单全部退(含运费)',
    '1': '整单全部退(不含运费)',
    '2': '整单部分退',
    '3': 'SKU全部退',
    '4': 'SKU部分退',
  },
  // 退款原因
  returnReasonId: {
    0: '尺寸不符合',
    1: '质量问题',
    2: '不想要了',
    3: '货物丢失',
    4: '其他',
    28: '缺货下架',
  },
  // 退款状态
  returnStatus: {
    0: '退款申请',
    1: '退款处理中',
    2: '退款成功',
    3: '退款失败',
  },

  evaluateStatus: {
    0: '未评价',
    1: '已评价',
  },
  // 物流状态
  logisticsStatus: {
    0: '已发货',
    1: '运输中',
    2: '已收货',
  },
  orderType: {
    0: '正常订单',
    1: '秒杀订单',
  },
};
