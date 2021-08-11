import request from '@/utils/request';
// import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    return request.post(`/operationImport/importQuery`, params);
  },
  verifyFile(params) {
    return request.get(`/operationSummary/verifyFile`, params);
  },
  getTemplateLink(params) {
    return request.get(`/operationSummary/getTemplateLink`, params);
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
        label: '加购次数（导入）',
        prop: 'addCarts',
      },
      {
        label: '广告费（导入）',
        prop: 'advertisePirce',
      },
      {
        label: '访问收银台次数',
        prop: 'checkouts',
      },
      {
        label: '总访问量（导入）',
        prop: 'sessionAcount',
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
        label: '经营日期',
        prop: 'operationDate',
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
    return request.post(`/operationSummary/apply`, params);
  },
};
