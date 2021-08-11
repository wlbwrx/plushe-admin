import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    params.type = 5;
    return request.post(`/optCategory/pageQuery`, params);
  },
  reqDel(data) {
    return request.get(`/optCategory/delete`, data);
  },
  reqAdd(data) {
    data.type = 5;
    return request.post(`/optCategory/createCategory`, data);
  },
  reqUpdate(data) {
    data.type = 5;
    return request.post(`/optCategory/updateCategory`, data);
  },
  reqUpdateStatus(data) {
    return request.get(`/optCategory/updateEnable`, data);
  },
  updateSort(data) {
    return request.get(`/optCategory/updateSort`, data);
  },
  addRelations(data) {
    return request.post(`/optCategory/addRelations`, data);
  },
};

export function option(Vue) {
  const { fieldMap } = Vue;
  const { id, status } = fieldMap;
  return {
    addBtn: '新增',
    editSngl: '编辑',
    updataSnglPoP: row => {
      return row[status] == 1 ? '停用' : '启用';
    },
    viewTopicSngl: row => {
      return !row.topicId ? '    ' : '专题商品';
    },
    delSnglPoP: '删除',
    column: [
      {
        label: 'ID',
        prop: id,
        maxlength: 50,
        editShow: true,
      },
      {
        label: '名称',
        prop: 'name',
        maxlength: 20,
        rules: [RULE.required],
      },
      {
        label: '文案',
        prop: 'docTitle',
        maxlength: 50,
        rules: [RULE.required],
      },
      {
        label: '所属客户端',
        prop: 'userDevice',
        Dict: Dict.userDevice,
        rules: [RULE.required],
      },
      {
        label: '图片',
        prop: 'picKeyPicture',
        viewProp: 'picUrl',
        editType: 'img',
        belongRootId: '6',
        rules: [RULE.required],
      },
      {
        label: '关联专题',
        prop: 'topicId',
        Dict: Vue.topicList,
        filterable: true,
        rules: [RULE.required],
      },
      {
        label: '状态',
        prop: status,
        editShow: true,
        Dict: Vue.dict.hideStatus,
      },
      {
        label: '排序值',
        prop: 'sort',
        viewType: 'input',
        maxlength: 5,
        rules: [RULE.numberIntZero],
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

export const Dict = {
  userDevice: {
    1: 'H5',
    2: 'PC',
  },
};
