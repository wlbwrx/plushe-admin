import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    params.type = 2;
    return request.post(`/banner/pageQuery`, params);
  },
  reqDel(data) {
    return request.get(`/banner/delete`, data);
  },
  reqAdd(data) {
    data.type = 2;
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
        label: '名称',
        prop: 'title',
        search: true,
        maxlength: 20,
        rules: [RULE.required],
      },
      {
        label: '店铺',
        prop: 'shopsId',
        Dict: Vue.dict.userShops,
        editShow: true,
      },
      {
        label: '链接地址',
        prop: 'internalUrl',
        rules: [RULE.url],
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
        belongRootId: '6',
        editType: 'img',
        rules: [RULE.required],
      },
      {
        label: '排序值',
        prop: 'sort',
        maxlength: 5,
        viewType: 'input',
        rules: [RULE.numberIntZero],
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

export const Dict = {
  userDevice: {
    1: 'H5',
    2: 'PC',
  },
};
