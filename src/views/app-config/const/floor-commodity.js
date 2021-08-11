import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    return request.get(`/floor/getRelations`, params);
  },
  reqDel(data) {
    return request.get(`/floor/deleteRelation`, data);
  },
  reqUpdate(data) {
    return request.post(`/floor/updateRelation`, data);
  },
};

export function option(Vue) {
  const { fieldMap } = Vue;
  const { id } = fieldMap;
  return {
    addBtn: '新增',
    delSnglPoP: '删除',
    column: [
      {
        label: '楼层ID',
        prop: 'categoryId',
        viewProp: 'optCategoryId',
        maxlength: 50,
        search: true,
        editShow: true,
      },
      {
        label: 'ID',
        prop: id,
        hide: true,
      },
      {
        label: '商品名称',
        prop: 'productName',
      },
      {
        label: '商品类目',
        prop: 'productCateOne',
        formatter(row) {
          const { productCateThree } = row;
          const productThree = Vue.productCategoryList.filter(item => item.id == productCateThree)[0] || {};
          return productThree.label || '无';
        },
      },
      {
        label: '排序值',
        prop: 'sort',
        maxlength: 5,
        viewType: 'input',
        rules: [RULE.numberIntZero],
      },
    ],
  };
}

export const Dict = {};
