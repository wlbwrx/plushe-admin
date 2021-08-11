import request from '@/utils/request';

export const menuTreeList = _ => request.get(apiObj.menuTreeList);

export const resourceList = _ => request.get(apiObj.resourceList);

export const roleList = _ => request.get(apiObj.roleList, { pageSize: 100 });

export const pageGetEmailTemplate = _ => request.post(apiObj.pageGetEmailTemplate, { pageNumer: 1, pageSize: 100 });

export const pageGetMessageTemplate = _ => request.post(apiObj.pageGetMessageTemplate, { pageNumer: 1, pageSize: 100 });

export const getOptCampaignEnums = _ => request.get(apiObj.getOptCampaignEnums);

export const uploadImg = data => {
  const formData = new FormData();
  formData.append('image', data.image);
  formData.append('type', data.type);
  return request.post(apiObj.uploadImg, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getProductCategoryList = _ => request.post(apiObj.getProductCategoryList, { pageSize: 999, pageNum: 1 });

export const getBrands = _ => request.post(apiObj.getBrands);

export const GetCouponList = _ => request.post(apiObj.GetCouponList, { couponStatus: 1, pageNum: 1, pageSize: 999 });
export const getAllDictionaries = _ => request.get(apiObj.getAllDictionaries);
export const getAttribute = _ => request.post(apiObj.getAttribute, { });

export const apiObj = {
  menuTreeList: `/menu/treeList`,
  resourceList: `/resource/listAll`,
  roleList: `/role/list`,
  getOptCampaignEnums: `/frontEnum/getOptCampaignEnums`,
  pageGetEmailTemplate: `/optTemplate/emailTemplate/pageGet`,
  pageGetMessageTemplate: `/optTemplate/messageTemplate/pageGet`,
  uploadImg: `/images/uploadImg`,
  getProductCategoryList: `/productCategory/list`,
  getBrands: `/product/getBrands`,
  GetCouponList: `/optCampaign/couponConfig/query`,
  getAllDictionaries: `/frontEnum/getAllDictionaries`,
  getAttribute: `/attribute/query`,
};
