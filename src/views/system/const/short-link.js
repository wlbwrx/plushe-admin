import request from '@/utils/request';

export const http = {
  reqList(params) {
    return request.post(`/shortLink/pageQuery`, params);
  },
  reqDel(data) {
    return request.get(`/shortLink/deleteLink`, data);
  },
  reqAdd(data) {
    return request.post(`/shortLink/createLink`, data);
  },
  // 更新状态:
  reqUpdateStatus(data) {
    return request.get(`/shortLink/updateLinkStatus`, data);
  },
  // 根据id,获取信息
  getByLinkId(data) {
    return request.get(`/shortLink/get`, data);
  },
  // 获取短链类型
  getLinkType(data) {
    return request.get(`/shortLink/getShortLinkTypes`, data);
  },
};

export const Dict = {
  validDays: {
    0: '永久',
    1: '1天',
    3: '3天',
    7: '7天',
    30: '30天',
    60: '60天',
    90: '90天',
  },
  linkTypes: {},
};
