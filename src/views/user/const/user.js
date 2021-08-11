import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    return request.post(`/admin/adminList`, params);
  },
  reqDel(data) {
    return request.post(`/admin/delete/${data.id}`);
  },
  reqAdd(data) {
    return request.post(`/admin/register`, data);
  },
  reqUpdate(data) {
    return request.post(`/admin/update/${data.id}`, data);
  },
  reqUpdateStatus(data) {
    return request.post(`/admin/updateStatus/${data.id}`, data);
  },
  reqGetRole(data) {
    return request.get(`/admin/role/${data.id}`);
  },
  reqRoleUpdate(data) {
    return request.post(`/admin/role/update/${data.adminId}`, data.roleIds);
  },
};

export function option(Vue) {
  return {
    addBtn: true,
    editSngl: '编辑',
    adminSnglPoP: row => {
      return row.adminStatus == 0 ? '启用' : '停用';
    },
    roleSngl: '角色',
    passSngl: '重置密码',
    delSnglPoP: '删除',
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
        label: '用户名',
        prop: 'username',
        rules: [RULE.required],
      },
      {
        label: '昵称',
        prop: 'nickName',
        rules: [RULE.required],
      },
      {
        label: '头像',
        prop: 'iconPicture',
        viewProp: 'icon',
        editType: 'img',
      },
      {
        label: '邮箱',
        prop: 'email',
        rules: [RULE.required, RULE.eMail],
      },
      {
        label: '所属店铺',
        prop: 'shopsId',
        Dict: Vue.dict.userShops,
        defaultValue: Vue.user.shopsId,
        // rules: [RULE.required],
        // editShow: true,
      },
      {
        label: '帐号状态',
        prop: 'adminStatus',
        Dict: Vue.dict.hideStatus,
        editHide: true,
      },
      // {
      //   label: '密码',
      //   prop: 'password',
      //   hide: true,
      //   rules: [RULE.required],
      // },
      {
        label: '备注',
        prop: 'note',
      },
      {
        label: '创建人',
        prop: 'creator',
        editHide: true,
      },
      {
        label: '修改时间',
        prop: 'modifyTime',
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
