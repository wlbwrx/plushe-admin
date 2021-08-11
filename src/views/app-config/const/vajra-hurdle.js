import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    params.type = 2;
    return request.post(`/optCategory/pageQuery`, params);
  },
  reqDel(data) {
    return request.get(`/optCategory/delete`, data);
  },
  reqAdd(data) {
    data.type = 2;
    return request.post(`/optCategory/createCategory`, data);
  },
  reqUpdate(data) {
    return request.post(`/optCategory/updateCategory`, data);
  },
  updateSort(data) {
    data.type = 2;
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
        prop: 'id',
        maxlength: 50,
        // search: true,
        editShow: true,
      },
      {
        label: '名称',
        prop: 'name',
        // search: true,
        maxlength: 50,
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
        label: '图片',
        prop: 'picKeyPicture',
        viewProp: 'picUrl',
        editType: 'img',
        belongRootId: '2',
        rules: [RULE.required],
      },
      // {
      //   label: '关联链接',
      //   prop: 'linkUrl',
      // },
      {
        label: '关联专题',
        prop: 'topicId',
        Dict: Vue.topicList,
        filterable: true,
        rules: [RULE.required],
      },
      {
        label: '图片key值',
        prop: 'picKey',
        hide: true,
        editShow: true,
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
