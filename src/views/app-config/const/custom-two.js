import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    params.type = 3;
    return request.post(`/optCategory/pageQuery`, params);
  },
  reqDel(data) {
    return request.get(`/optCategory/delete`, data);
  },
  reqAdd(data) {
    data.type = 3;
    return request.post(`/optCategory/createCategory`, data);
  },
  reqUpdate(data) {
    return request.post(`/optCategory/updateCategory`, data);
  },
  updateSort(data) {
    data.type = 3;
    return request.get(`/optCategory/updateSort`, data);
  },
  reqUpdateStatus(data) {
    return request.post(`/optCategory/${data.enable == 1 ? 'enable' : 'disable'}?id=${data.id}`);
  },
  addRelations(data) {
    return request.post(`/optCategory/addRelations`, data);
  },
};

export function option(Vue) {
  const { fieldMap } = Vue;
  const { id } = fieldMap;
  return {
    addBtn: '新增',
    editSngl: '编辑',
    viewTopicSngl: row => {
      return !row.topicId ? '    ' : '专题商品';
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
        prop: 'name',
        search: true,
        maxlength: 50,
        // formatter(row) {
        //   return `<a href="/#/floor-commodity?categoryId=${row.id}">${row.name}</a>`;
        // },
        rules: [RULE.required],
      },
      {
        label: '所属客户端',
        prop: 'userDevice',
        Dict: Vue.dict.userDevice,
        search: true,
        rules: [RULE.required],
      },
      {
        label: '关联专题',
        prop: 'topicId',
        filterable: true,
        Dict: Vue.topicList,
      },
      {
        label: '排序值',
        prop: 'sort',
        viewType: 'input',
        maxlength: 5,
        rules: [RULE.numberIntZero],
      },
      {
        label: '模块封面',
        prop: 'coverPicKeyPicture',
        viewProp: 'coverPicKeyUrl',
        editType: 'img',
        belongRootId: '6',
      },
    ],
  };
}

export const commodityHttp = {
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

export const Dict = {};
