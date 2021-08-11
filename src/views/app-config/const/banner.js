import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    params.type = 1;
    return request.post(`/banner/pageQuery`, params);
  },
  reqDel(data) {
    return request.get(`/banner/delete`, data);
  },
  reqAdd(data) {
    data.type = 1;
    return request.post(`/banner/add`, data);
  },
  reqUpdate(data) {
    return request.post(`/banner/update`, data);
  },
  reqUpdateStatus(data) {
    return request.post(`/banner/${data.enable == 1 ? 'enable' : 'disable'}?id=${data.id}`);
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
    viewTopicSngl: row => {
      return !row.topicId ? '    ' : '专题商品';
    },
    delSnglPoP: '删除',
    column: [
      {
        label: 'ID',
        prop: id,
        maxlength: 50,
        // search: true,
        hide: true,
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
        label: '店铺',
        prop: 'shopsId',
        Dict: Vue.dict.userShops,
        editShow: true,
      },
      {
        label: '文案标题',
        prop: 'docTitle',
        maxlength: 50,
        rules: [RULE.required],
      },
      {
        label: '文案内容',
        prop: 'docContent',
        maxlength: 150,
        rules: [RULE.required],
      },
      {
        label: '所属客户端',
        prop: 'userDevice',
        search: true,
        Dict: Dict.userDevice,
        rules: [RULE.required],
      },
      {
        label: '图片',
        prop: 'picKeyPicture',
        viewProp: 'picUrl',
        belongRootId: '5',
        editType: 'img',
        rules: [RULE.required],
      },
      {
        label: '关联类型',
        prop: 'relType',
        Dict: Vue.dict.relType,
        rules: [RULE.required],
      },
      {
        label: '关联链接',
        prop: 'internalUrl',
        rules: [RULE.bothBlank],
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
        maxlength: 5,
        viewType: 'input',
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
        search: true,
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

export const Dict = {
  userDevice: {
    1: 'H5',
    2: 'PC',
  },
};
