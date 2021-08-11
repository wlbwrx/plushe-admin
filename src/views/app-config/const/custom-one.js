import request from '@/utils/request';
import store from '@/store';

export const http = {
  reqList(params) {
    params.type = 4;
    return request.post(`/optCategory/pageQuery`, params);
  },
  // 删除分类
  delete(params) {
    return request.get(`/optCategory/delete`, params);
  },
  // 新增
  add(params) {
    params.type = 4;
    return request.post(`/optCategory/createCategory`, params);
  },
  // 编辑--更新
  update(params) {
    return request.post(`/optCategory/updateCategory`, params);
  },
  // 启用-禁用
  updateEnable(params) {
    return request.get(`/optCategory/updateEnable`, params);
  },
  // 获取 子模块列表
  getRecurse(params) {
    params.type = 4;
    return request.post(`/optCategory/query`, params);
  },
  addRelations(data) {
    return request.post(`/optCategory/addRelations`, data);
  },
};

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
  ...store.getters.dict,
  // 设备
  devices: {
    1: 'H5',
    2: 'PC',
  },
  //
  type: {
    1: 'shop_category',
    2: 'bean',
    3: 'floor2',
    4: 'floor1', // 自定义模块
    5: 'new_in',
  },
};
