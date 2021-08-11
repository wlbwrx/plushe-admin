import request from '@/utils/request';

export const http = {
  reqList(params) {
    return request.get(`/productRecommend/pageQuery`, params);
  },
  reqDel(data) {
    return request.get(`/productRecommend/delete`, data);
  },
  batchDel(data) {
    return request.post(`/productRecommend/deleteByIds`, data);
  },
  batchAdd(data) {
    return request.post(`/productRecommend/batchAdd`, data);
  },
  reqAdd(data) {
    return request.post(`/productRecommend/add`, data);
  },
  reqUpdate(data) {
    return request.post(`/productRecommend/update`, data);
  },
};

export function option(Vue) {
  return {
    addCustBtn: '关联商品',
    delsBtn: '批量删除',
    sortsBtn: '批量排序',
    tableSelection: true,
    delSnglPoP: '删除',
    column: [
      {
        label: '商品SPU',
        prop: 'productNo',
      },
      {
        label: '商品名称',
        prop: 'productName',
      },
      {
        label: '图片',
        prop: 'picUrl',
        viewType: 'img',
      },
      {
        label: '商品品牌',
        prop: 'brandName',
      },
      {
        label: '所属类目',
        prop: 'productCateOne',
        formatter(row) {
          const { productCateThree } = row;
          const proThr = Vue.productCategoryList.filter(item => item.id == productCateThree)[0] || {};
          return proThr.label || '--';
        },
      },
      {
        label: '排序值',
        prop: 'sort',
        viewType: 'input',
      },
    ],
  };
}

export const Dict = {};
