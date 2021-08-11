import request from '@/utils/request';
// import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    return request.post(`/optCategory/getRelations`, params);
  },
  reqDel(data) {
    return request.get(`/optCategory/deleteRelation`, data);
  },
  reqUpdate(data) {
    return request.post(`/optCategory/updateRelation`, data);
  },
};

export function option(Vue) {
  const { fieldMap } = Vue;
  const { id } = fieldMap;
  return {
    // delsBtn: '批量删除',
    // tableSelection: true,
    delSnglPoP: ' 删除 ',
    column: [
      {
        label: '分类ID',
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
          return productThree.label || '--';
        },
      },
      {
        label: '商品图片',
        prop: 'productPicUrl',
        viewType: 'img',
      },
      {
        label: '商品SPU',
        prop: 'productNo',
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
