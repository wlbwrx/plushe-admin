import request from '@/utils/request';
// const post = request.post;
// const get = request.get;

export const login = data => request.post(apiObj.login, data);

export const getAdminInfo = _ => request.get(apiObj.getAdminInfo);

export const logout = _ => request.post(apiObj.logout);

export const getALLPlatformShops = _ => request.get(apiObj.getALLPlatformShops, { platformId: '' });

export const apiObj = {
  logout: `/oa/logout`,
  getAdminInfo: `/oa/getAdminInfo`,
  login: `/oa/login`,
  getALLPlatformShops: `/admin/getALLPlatformShops`,
};
