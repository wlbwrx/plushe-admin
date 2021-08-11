import request from '@/utils/request';

export const http = {
  reqList(params) {
    return request.post(`/logisticsQueryTask/pageQuery`, params);
  },
  queryDetails(params) {
    return request.post(`/logisticsQueryTask/pageQueryDetails`, params);
  },
  asyncRefreshLogisticsInfo(data) {
    return request.post(`/logisticsQueryTask/asyncRefreshLogisticsInfo`, data);
  },
  verifyFile(data) {
    return request.get(`/logisticsQueryTask/createTask`, data);
  },
  getTemplateLink() {
    return request.get(`/logisticsQueryTask/getTemplateLink`);
  },
  refreshLogisticsInfoSingle(data) {
    return request.get(`/logisticsQueryTask/asyncRefreshLogisticsInfo`, data);
  },
  getTaskResult(data) {
    return request.get(`/logisticsQueryTask/getTaskResult`, data);
  },
};

export function option(Vue) {
  const { fieldMap } = Vue;
  const { id } = fieldMap;
  return {
    downloadBtn: '下载模板',
    importBtn: '导入',
    viewsSngl: '列表',
    refreshSngl: '同步',
    downSnglPoP: '下载',
    column: [
      {
        label: '任务批次',
        prop: id,
        search: true,
      },
      {
        label: '物流条数',
        prop: 'nums',
      },
      {
        label: '任务状态',
        prop: 'taskStatus',
        Dict: Vue.dict.LogisticsQueryTaskStatus,
        search: true,
      },
      {
        label: '创建时间',
        prop: 'createTime',
      },
      {
        label: '修改人',
        prop: 'modifier',
      },
      {
        label: '创建人',
        prop: 'creator',
      },
      {
        label: '创建人',
        prop: 'creator',
      }
    ],
  };
}

export const httpList = {
  reqList(params) {
    return request.post(`/logisticsQueryTask/pageQueryDetails`, params);
  },
  refreshLogisticsInfoSingle(data) {
    return request.get(`/logisticsQueryTask/refreshLogisticsInfoSingle`, data);
  },
};
export function optionList(Vue) {
  return {
    // refreshsBtn: '批量同步',
    viewsSngl: '物流轨迹',
    refreshSngl: '同步',
    tableSelection: true,
    column: [
      {
        label: '任务批次',
        prop: 'taskId',
        search: true,
      },
      {
        label: '物流单号',
        prop: 'trackingNo',
        search: true,
      },
      {
        label: '物流状态',
        prop: 'logisticsStatus',
        Dict: Vue.dict.LogisticsStatus,
        search: true,
      },
      {
        label: '任务状态',
        prop: 'taskStatus',
        Dict: Vue.dict.LogisticsQueryTaskStatus,
        search: true,
      },
      {
        label: '创建时间',
        prop: 'createTime',
      },
      {
        label: '更新时间',
        prop: 'modifyTime',
      },

    ],
  };
}

export const exportHttp = {
  verifyFile(params) {
    return request.get(`/productImport/verifyFile`, params);
  },
  apply(params) {
    return request.post(`/productImport/apply`, params);
  },
  getTemplateLink(params) {
    return request.get(`/productImport/getTemplateLink`, params);
  },
};

export const Dict = {
  taskStatus: {
    'init': '待查询',
    'query': '查询中',
    'done': '完成',
    'fail': '失败',
  },
  logisticsStatus: {
    'Init': '初始化',
    'PickUp': '已揽收',
    'InTransit': '运输中',
    'Delivering': '派送中',
    'Delivered': '已签收',
    'Reject': '拒收',
    'Exception': '异常',
  }
};
