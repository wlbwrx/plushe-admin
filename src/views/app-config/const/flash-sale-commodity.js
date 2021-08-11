import request from '@/utils/request';

export const http = {
  reqList(params) {
    return request.get(`/flashSaleProduct/pageQuery`, params);
  },
  reqDel(data) {
    return request.get(`/flashSaleProduct/delete`, data);
  },
  reqAdd(data) {
    return request.post(`/flashSaleProduct/add`, data);
  },
  reqBatchAdd(data) {
    return request.post(`/flashSaleProduct/batchAdd`, data);
  },
  reqUpdate(data) {
    return request.post(`/flashSaleProduct/update`, data);
  },
};

export function option(Vue) {
  const { fieldMap } = Vue;
  const { id } = fieldMap;
  return {
    delSnglPoP: ' 删除 ',
    column: [
      {
        label: '闪购场次ID',
        prop: 'flashSaleId',
        maxlength: 50,
        search: true,
        editShow: true,
      },
      {
        label: 'ID',
        prop: id,
        maxlength: 50,
      },
      {
        label: '商品名称',
        prop: 'productName',
      },
      {
        label: '商品SPU',
        prop: 'productNo',
        maxlength: 50,
      },
      {
        label: '商品图片',
        prop: 'picUrl',
        editType: 'img',
      },
      {
        label: '商品排序',
        prop: 'sort',
        maxlength: 5,
        viewType: 'input',
      },
    ],
  };
}

export const Dict = {};
