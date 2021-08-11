import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    return request.get(`/resource/list`, params);
  },
  reqDel(data) {
    return request.post(`/resource/delete/${data.id}`);
  },
  reqAdd(data) {
    return request.post(`/resource/create`, data);
  },
  reqUpdate(data) {
    return request.post(`/resource/update/${data.id}`, data);
  },
};

export function option(Vue) {
  const resourceObj = {
    0: '一级权限',
  };
  Vue.$store.getters.resourceList.forEach(item => {
    resourceObj[item.id] = item.label;
  });
  return {
    addBtn: true,
    editSngl: '编辑',
    delSnglPoP: '删除',
    column: [
      // {
      //   label: '菜单ID',
      //   prop: 'categoryId',
      //   hide: true,
      //   editShow: true
      // },
      {
        label: '名称',
        prop: 'name',
        rules: [RULE.required],
      },
      {
        label: '父级权限',
        prop: 'categoryId',
        search: true,
        rules: [RULE.required],
        Dict: resourceObj,
      },
      {
        label: 'URL',
        prop: 'url',
        type: 'textarea',
        rules: [RULE.required],
      },
      {
        label: '描述',
        prop: 'description',
        rules: [RULE.required],
      },
      {
        label: '创建时间',
        prop: 'createTime',
        editHide: true,
      },
      {
        label: '创建者',
        prop: 'creator',
        editHide: true,
      },
      {
        label: '最后操作人',
        prop: 'modifier',
        editHide: true,
      },
    ],
  };
}

export const Dict = {};
