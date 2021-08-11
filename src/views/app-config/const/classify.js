import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    params.type = 1;
    return request.post(`/optCategory/query`, params);
  },
  reqDel(data) {
    return request.get(`/optCategory/delete`, data);
  },
  reqAdd(data) {
    data.type = 1;
    return request.post(`/optCategory/createCategory`, data);
  },
  reqUpdate(data) {
    data.type = 1;
    return request.post(`/optCategory/updateCategory`, data);
  },
  updateSort(data) {
    data.type = 1;
    return request.get(`/optCategory/updateSort`, data);
  },
  addRelations(data) {
    return request.post(`/optCategory/addRelations`, data);
  },
  getRecurse(data) {
    return request.get(`/optCategory/getRecurse`, data);
  },
};

export function option(Vue) {
  const { fieldMap } = Vue;
  const { status, id } = fieldMap;
  return {
    addBtn: '新增',
    editSngl: '编辑',
    updataSnglPoP: row => {
      return row[status] == 1 ? '停用' : '启用';
    },
    delSnglPoP: '删除',
    column: [
      {
        label: 'ID',
        prop: id,
        maxlength: 50,
        search: true,
        editShow: true,
      },
      {
        label: '标题',
        prop: 'title',
        search: true,
        maxlength: 50,
        rules: [RULE.required],
      },
      {
        label: '平台',
        prop: 'platformId',
        Dict: Vue.dict.platformList,
        search: true,
        editShow: true,
      },
      {
        label: '店铺',
        prop: 'shopsId',
        Dict: Vue.dict.userShops,
        search: true,
        editShow: true,
      },
      {
        label: '链接地址',
        prop: 'internalUrl',
        rules: [RULE.required, RULE.url],
      },
      {
        label: '图片',
        prop: 'picKeyPicture',
        viewProp: 'picUrl',
        editType: 'img',
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
        prop: 'picKey',
        hide: true,
        editShow: true,
      },
      {
        label: '状态',
        prop: status,
        // search: true,
        editShow: true,
        Dict: Vue.dict.hideStatus,
      },
      // {
      //   label: '描述',
      //   prop: 'des',
      //   type: 'textarea',
      // },
    ],
  };
}

export const commodityHttp = {
  reqList(params) {
    return request.post(`/optCategory/getRelations`, params);
  },
  reqUpdate(data) {
    return request.post(`/optCategory/updateRelation`, data);
  },
  reqDel(data) {
    return request.get(`/optCategory/deleteRelation`, data);
  },
};

// export const Dict = {};
