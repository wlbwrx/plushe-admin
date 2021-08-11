import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    return request.get(`/flashSale/pageQuery`, params);
  },
  reqDel(data) {
    return request.get(`/flashSale/delete`, data);
  },
  reqAdd(data) {
    return request.post(`/flashSale/add`, data);
  },
  reqUpdate(data) {
    return request.post(`/flashSale/update`, data);
  },
  reqUpdateStatus(data) {
    return request.post(`/flashSale/${data.enable == 1 ? 'enable' : 'disable'}?id=${data.id}`);
  },
  reqProduct(data) {
    return request.post(`/plushe-oa-web/product/pageCond`, data);
  },
};

export function option(Vue) {
  const { fieldMap } = Vue;
  const { id } = fieldMap;
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
        prop: id,
        maxlength: 50,
        search: true,
        editShow: true,
      },
      {
        label: '闪购名称',
        prop: 'title',
        maxlength: 20,
        search: true,
        rules: [RULE.required],
      },
      {
        label: '闪购时间',
        prop: 'timeArr',
        editType: 'date-picker',
        type: 'datetimerange',
        // search: true,
        rules: [RULE.required],
      },
      {
        label: '关联专题',
        prop: 'topicId',
        filterable: true,
        Dict: Vue.topicList,
        rules: [RULE.required],
      },
      {
        label: '封面图(H5)',
        prop: 'coverPicKeyPicture',
        viewProp: 'coverPicKeyUrl',
        editType: 'img',
        belongRootId: '6',
        // rules: [RULE.required],
      },
      {
        label: '封面图(PC)',
        prop: 'coverPicKeyPcPicture',
        viewProp: 'coverPicKeyPcUrl',
        editType: 'img',
        belongRootId: '6',
        // rules: [RULE.required],
      },
    ],
  };
}

export const commodityHttp = {
  reqList(params) {
    return request.get(`/flashSaleProduct/pageQuery`, params);
  },
  reqDel(data) {
    return request.get(`/flashSaleProduct/delete`, data);
  },
  reqUpdate(data) {
    return request.post(`/flashSaleProduct/update`, data);
  },
  reqBatchAdd(data) {
    return request.post(`/flashSaleProduct/batchAdd`, data);
  },
};
export const Dict = {};
