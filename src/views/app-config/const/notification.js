import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    params.type = 1;
    return request.post(`/notice/pageQuery`, params);
  },
  reqDel(data) {
    return request.get(`/notice/delete`, data);
  },
  reqAdd(data) {
    data.type = 1;
    return request.post(`/notice/add`, data);
  },
  reqUpdate(data) {
    return request.post(`/notice/update`, data);
  },
  reqUpdateStatus(data) {
    return request.get(`/notice/updateEnable`, data);
  },
};

export function option(Vue) {
  const { fieldMap } = Vue;
  const { status, id } = fieldMap;
  return {
    addBtn: '新增',
    editSngl: '编辑',
    updataSnglPoP: row => {
      return row[status] ? '停用' : '启用';
    },
    delSnglPoP: '删除',
    column: [
      {
        label: 'ID',
        prop: id,
        maxlength: 50,
        hide: true,
        editShow: true,
      },
      {
        label: '名称',
        prop: 'name',
        search: true,
        maxlength: 20,
        rules: [RULE.required],
      },
      {
        label: '所属用户端',
        prop: 'userDevice',
        search: true,
        Dict: Dict.userDevice,
        rules: [RULE.required],
      },
      {
        label: '链接地址',
        prop: 'internalUrl',
        rules: [RULE.required, RULE.url],
      },
      {
        label: '排序值',
        prop: 'sort',
        maxlength: 5,
        viewType: 'input',
        rules: [RULE.numberIntZero],
      },
      {
        label: '通知内容',
        prop: 'content',
        search: true,
        editType: 'wangeditor',
        maxlength: 255,
        rules: [RULE.required],
      },
      {
        label: '状态',
        prop: status,
        search: true,
        editShow: true,
        Dict: Vue.dict.hideStatus,
      },
      {
        label: '操作人',
        prop: 'modifier',
        editShow: true,
      },
      {
        label: '创建时间',
        prop: 'createTime',
        editShow: true,
      },
      {
        label: '更新时间',
        prop: 'modifyTime',
        editShow: true,
      },
    ],
  };
}

export const Dict = {
  userDevice: {
    1: 'H5',
    2: 'PC',
  },
};
