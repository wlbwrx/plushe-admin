import request from '@/utils/request';

export const http = {
  reqList(params) {
    return request.post(`/banner/pageQuery`, params);
  },
  reqDel(data) {
    return request.get(`/banner/delete`, data);
  },
  reqAdd(data) {
    data.type = 2;
    return request.post(`/banner/add`, data);
  },
  reqUpdate(data) {
    return request.post(`/banner/update`, data);
  },
  reqUpdateStatus(data) {
    return request.post(`/banner/${data.enable == 1 ? 'enable' : 'disable'}?id=${data.id}`);
  },
  verifyFile(params) {
    return request.get(`/evaluate/verifyFile`, params);
  },
};
