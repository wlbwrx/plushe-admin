import fly from 'flyio';
import { ElNotification } from 'element-plus';
import store from '@/store';
import { getToken } from '@/utils/auth';
import { imageHandler } from '@/utils/index';

fly.config.baseURL = `${process.env.NODE_ENV === 'development' ? '/uat' : ''}/plusheoa/plushe-oa-web`;
fly.config.timeout = 60000;

// 请求拦截器
fly.interceptors.request.use(
  config => {
    const { body, url } = config;
    // console.log('config', {...config});
    if (url.includes('.amazonaws.com') || url.includes('img.plushe.com')) return config;
    if (getToken()) {
      config.headers['Authorization'] = getToken();
    }
    // config.headers['timeZone'] = UTC;
    if (body) {
      const strArray = /(optCampaign)/;
      Object.keys(body).forEach(item => {
        if (strArray.test(url) && Array.isArray(body[item])) {
          // 活动模块,数组用字符串分割
          body[item] = body[item].join(',');
        }
        if (typeof body[item] == 'string' && body[item].length < 9 && body[item] && !isNaN(body[item]) && !/^0\d+/.test(body[item])) {
          body[item] = Number(body[item]);
        }
      });
    }
    // console.log('config', {...config});
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// 响应拦截器
fly.interceptors.response.use(
  res => {
    if (Object.prototype.toString.call(res.data) !== '[object Object]') return res.data;
    const { code, data = {}, msg } = res.data;
    console.groupCollapsed(res.request.url);
    console.log('请求参数', res.request.body || res.request.params);
    console.log('响应结果', data);
    console.groupEnd();
    if (code == 401 || code == 403) {
      ElNotification.info({
        title: '登录过期',
      });
      store.dispatch('LogOut').then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
      return Promise.reject(res.data);
    } else if (code != 0) {
      console.log('请求参数', JSON.stringify(res.request.body || res.request.params));
      ElNotification.error({
        title: msg,
      });
      return Promise.reject(res.data);
    } else {
      const { list, children } = data || {};
      if (list && Array.isArray(list)) {
        data.list = data.list.map(item => {
          if (item.picKey || item.logoPicKey) {
            item.picUrl = imageHandler(0, item.picKey);
            item.logoPicKeyUrl = imageHandler(0, item.logoPicKey);
          }
          if (item.listPicH5) item.listPicH5Url = imageHandler(0, item.listPicH5);
          if (item.listPicPc) item.listPicPcUrl = imageHandler(0, item.listPicPc);
          if (item.coverPicKey) item.coverPicKeyUrl = imageHandler(0, item.coverPicKey);
          if (item.coverPicKeyPc) item.coverPicKeyPcUrl = imageHandler(0, item.coverPicKeyPc);
          if (item.modelPic) item.modelPicUrl = imageHandler(0, item.modelPic);
          return item;
        });
      } else if (children && Array.isArray(children)) {
        data.children = data.children.map(item => {
          if (item.picKey || item.logoPicKey) {
            item.picUrl = imageHandler(0, item.picKey);
            item.logoPicKeyUrl = imageHandler(0, item.logoPicKey);
          }
          if (item.coverPicKey) item.coverPicKeyUrl = imageHandler(0, item.coverPicKey);
          if (item.coverPicKeyPc) item.coverPicKeyPcUrl = imageHandler(0, item.coverPicKeyPc);
          return item;
        });
      } else if (Array.isArray(data)) {
        data.forEach((item, index, arr) => {
          if (item.picKey || item.logoPicKey) {
            arr[index].picUrl = imageHandler(0, item.picKey);
            arr[index].logoPicKeyUrl = imageHandler(0, item.logoPicKey);
          }
          // if (item.coverPicKey) itemcoverPicUrl = imageHandler(0, item.coverPicKey);
          return item;
        });
      }
      return data;
    }
  },
  error => {
    console.log('error', error);
    const { status } = error;
    if (status == 401 || status == 403) {
      ElNotification.info({
        title: '登录过期',
      });
      store.dispatch('LogOut').then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    } else if (status != 404) {
      ElNotification.error(error.message || '请求错误');
    }
    return Promise.reject(error);
  }
);

export default fly;
