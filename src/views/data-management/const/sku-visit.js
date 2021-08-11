import request from '@/utils/request';
// import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    return request.post(`/operationImport/sessionQuery`, params);
  },
  verifyFile(params) {
    return request.get(`/operationSession/verifyFile`, params);
  },
  getTemplateLink(params) {
    return request.get(`/operationSession/getTemplateLink`, params);
  },
};

export function option(Vue) {
  //   const { fieldMap } = Vue;
  //   const { id } = fieldMap;
  return {
    downloadBtn: '下载模板',
    importBtn: '导入',
    column: [
      {
        prop: 'timeArr',
        editType: 'date-picker',
        type: 'datetimerange',
        hide: true,
        search: true,
      },
      {
        label: '平台',
        prop: 'reportPlatformId',
        Dict: Vue.dict.platformList,
        hide: true,
        search: true,
      },
      {
        label: '平台',
        prop: 'platformId',
        Dict: Vue.dict.platformList,
      },
      {
        label: '产品 SKU',
        prop: 'skuNo',
        search: true,
      },
      {
        label: '加购数量',
        prop: 'skuCarts',
      },
      {
        label: '产品详情视图',
        prop: 'skuSession',
      },
      {
        label: '日期',
        prop: 'operationDate',
      },
      {
        label: '导入日期',
        prop: 'createTime',
      },
      {
        label: '修改人',
        prop: 'modifier',
      },
    ],
  };
}

export const exportHttp = {
  apply(params) {
    return request.post(`/operationSession/apply`, params);
  },
};
