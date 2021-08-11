import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    return request.get(`/role/list`, params);
  },
  batchDel(data) {
    return request.post(`/role/delete`, data.ids);
  },
  reqAdd(data) {
    return request.post(`/role/create`, data);
  },
  reqUpdate(data) {
    return request.post(`/role/update/${data.id}`, data);
  },
  reqUpdateStatus(data) {
    return request.post(`/role/updateStatus/${data.id}`, data);
  },
  reqListMenu(data) {
    return request.get(`/role/listMenu/${data.id}`);
  },
  reqAllocMenu(data) {
    return request.post(`/role/allocMenu/${data.roleId}`, data.ids);
  },
  reqListResource(data) {
    return request.get(`/role/listResource/${data.id}`);
  },
  reqAllocResource(data) {
    console.log('data', data);
    return request.post(`/role/allocResource/${data.roleId}`, data.ids);
  },
};

export function option(Vue) {
  const { status } = Vue.fieldMap;
  return {
    addBtn: true,
    // viewSngl: '查看',
    editSngl: '编辑',
    menuSngl: '菜单',
    authoritySngl: '权限',
    delsBtn: '批量删除',
    updataSnglPoP: row => {
      return row[status] == 1 ? '停用' : '启用';
    },
    tableSelection: true,
    column: [
      {
        label: 'ID',
        prop: 'id',
        hide: true,
        editShow: true,
      },
      {
        label: '关键字',
        prop: 'keyword',
        search: true,
        hide: true,
      },
      {
        label: '名称',
        prop: 'name',
        rules: [RULE.required],
      },
      {
        label: '描述',
        prop: 'description',
        rules: [RULE.required],
      },
      {
        label: '状态',
        prop: 'roleStatus',
        Dict: Vue.dict.hideStatus,
        editHide: true,
      },
      {
        label: '创建时间',
        prop: 'createTime',
        editHide: true,
      },
    ],
  };
}

export const Dict = {};
