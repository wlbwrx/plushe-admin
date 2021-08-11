import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    return request.get(`/menu/list`, params);
  },
  reqDel(params) {
    return request.post(`/menu/delete/${params.id}`);
  },
  reqAdd(data) {
    return request.post(`/menu/create`, data);
  },
  reqUpdate(data) {
    return request.post(`/menu/update/${data.id}`, data);
  },
  reqUpdateStatus(data) {
    return request.post(`/menu/update/${data.id}`, data);
  },
  reqListMenu(data) {
    return request.get(`/menu/listMenu/${data.id}`);
  },
  reqAllocMenu(data) {
    return request.post(`/menu/allocMenu`, data);
  },
};

export function option(Vue) {
  const { status } = Vue.fieldMap;
  const menuTreeObj = {
    0: '一级菜单',
  };
  Vue.$store.getters.menuTreeList.forEach(item => {
    menuTreeObj[item.id] = item.label;
  });
  return {
    addBtn: true,
    editSngl: '编辑',
    updataSnglPoP: row => {
      return row[status] == 1 ? '停用' : '启用';
    },
    delSnglPoP: '删除',
    column: [
      {
        label: '菜单ID',
        prop: 'id',
        editShow: true,
      },
      {
        label: '菜单名称',
        prop: 'title',
        rules: [RULE.required],
      },
      {
        label: '父级菜单',
        prop: 'parentId',
        search: true,
        rules: [RULE.required],
        Dict: menuTreeObj,
      },
      {
        label: '菜单关键字',
        prop: 'name',
        rules: [RULE.required],
      },
      {
        label: '状态',
        prop: 'hidden',
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
