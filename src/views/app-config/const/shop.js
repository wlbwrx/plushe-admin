import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    return request.get(`/shop/pageQuery`, params);
  },
  reqDel(data) {
    return request.get(`/shop/delete`, data);
  },
  reqAdd(data) {
    return request.post(`/shop/add`, data);
  },
  reqUpdate(data) {
    return request.post(`/shop/update`, data);
  },
};

export function option(Vue) {
  const { fieldMap } = Vue;
  const { id } = fieldMap;
  return {
    addBtn: '新增',
    editSngl: '编辑',
    delSnglPoP: '删除',
    column: [
      {
        label: '店铺ID',
        prop: id,
        maxlength: 50,
        editShow: true,
      },
      {
        label: '店铺名',
        prop: 'name',
        maxlength: 50,
        rules: [RULE.required],
      },
      {
        label: '店铺地址',
        prop: 'internalUrl',
        rules: [RULE.required, RULE.url],
      },
      {
        label: '店铺Logo',
        prop: 'logoPicKeyPicture',
        viewProp: 'logoPicKeyUrl',
        editType: 'img',
        belongRootId: '6',
        rules: [RULE.required],
      },
      {
        label: '聚水潭ID',
        prop: 'thirdShopId',
        rules: [RULE.required],
      },
      {
        label: '排序值',
        prop: 'sort',
        maxlength: 5,
        rules: [RULE.numberIntZero],
      },
      {
        label: '图片key值',
        prop: 'logoPicKey',
        hide: true,
      },
      {
        label: '描述',
        prop: 'desc',
      },
    ],
  };
}

// export const Dict = {};
