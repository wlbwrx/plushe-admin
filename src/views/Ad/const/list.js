import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export function option(Vue) {
  const { name } = Vue.user;
  return {
    addBtn: '新增',
    editSngl: '编辑',
    delSnglPoP: '删除',
    viewCustSngl: '查看商品',
    commoditySngl: '关联商品',
    column: [
      {
        label: '广告ID',
        prop: 'id',
        maxlength: 50,
        search: true,
        viewType: 'copy',
        editShow: true,
      },
      {
        label: '广告名称',
        prop: 'name',
        search: true,
        maxlength: 20,
        rules: [RULE.required],
      },
      {
        label: '已关联商品数量',
        prop: 'productCount',
        editShow: true,
      },
      {
        label: '广告备注',
        prop: 'desc',
        type: 'textarea',
        maxlength: 200,
      },
      {
        label: '创建人',
        prop: 'creator',
        search: true,
        defaultValue: name,
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

export const http = {
  reqList(params) {
    params.type = 6;
    return request.post(`/optCategory/pageQuery`, params);
  },
  // 删除分类
  reqDel(params) {
    return request.get(`/optCategory/delete`, params);
  },
  // 新增
  reqAdd(params) {
    params.type = 6;
    return request.post(`/optCategory/createCategory`, params);
  },
  // 编辑--更新
  reqUpdate(params) {
    params.type = 6;
    return request.post(`/optCategory/updateCategory`, params);
  },
  // // 启用-禁用
  // updateEnable(params) {
  //   return request.get(`/optCategory/updateEnable`, params);
  // },
  // 关联商品
  addRelations(data) {
    return request.post(`/optCategory/addRelations`, data);
  },
};

export const commodityHttp = {
  reqList(params) {
    params.type = 6;
    return request.post(`/optCategory/getRelations`, params);
  },
  reqDel(data) {
    return request.get(`/optCategory/deleteRelation`, data);
  },
  reqUpdate(data) {
    return request.post(`/optCategory/updateRelation`, data);
  },
};
