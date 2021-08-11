import request from '@/utils/request';
// import { imageHandler } from '@/utils/index';

export const http = {
  reqList(params) {
    return request.post(`/sizeConfig/pageQuery`, params);
  },
  reqAdd(data) {
    return request.post(`/sizeConfig/add`, data);
  },
  reqUpdate(data) {
    return request.post(`/sizeConfig/update`, data);
  },
  reqDel(id) {
    return request.get(`/sizeConfig/delete`, { id });
  },
  reqSizeNames() {
    return request.get(`/attribute/getSizeValNames`, {});
  },
  reqSaveAll(data) {
    return request.post(`/sizeConfig/saveAll`, data);
  },
  //   updateSort(data) {
  //     return request.post(`/product/updateSort`, data);
  //   },
  //   reqUpdateStatus(data) {
  //     return request.post(`/product/updateStatus`, data);
  //   },
  //   getByProductNo(data) {
  //     return request.post(`/product/getByProductNo?productNo=${data.productNo}`).then(res => {
  //       const { picsList } = res;
  //       res.picsList = picsList.map(item => {
  //         item.picUrl = imageHandler(0, item.picKey);
  //         return item;
  //       });
  //       // res.tipPicUrl = imageHandler(0, tipPicKey);
  //       return res;
  //     });
  //   },
};
