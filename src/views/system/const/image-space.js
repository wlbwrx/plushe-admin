import request from '@/utils/request';
import dayjs from 'dayjs';

export const http = {
  reqList(data) {
    return request.post(`/Picture/queryPictures`, data);
  },
  batchDel(data) {
    return request.post(`/Picture/deletePictures`, data.ids);
  },
  reqAdd(data) {
    return request.post(`/PictureFile/create`, data);
  },
  reqUpdate(data) {
    return request.post(`/Picture/update`, data);
  },
  PictureFile() {
    return request.post(`/PictureFile/treeList`, {});
  },
  movePictures(data) {
    return request.post(`/Picture/movePictures`, data);
  },
  batchUpload(data) {
    return request.post(`/Picture/batchUpload`, data);
  },
  uploadImg(image) {
    return new Promise((resole, reject) => {
      const folder = dayjs().format('YYYYMMDDHHmmss') + `${Math.ceil(Math.random() * 100000000)}`.padStart(8, 0);
      const filename = dayjs().format('YYYYMMDDHHmmss') + `${Math.ceil(Math.random() * 100)}`.padStart(3, 0);
      const fileType = image.type.split('/')[1];
      const fileTpteEnum = {
        png: 'png',
        jpeg: 'jpg',
        jpg: 'jpg',
        webp: 'webp',
        gif: 'gif',
      };
      const picKey = `product/${folder}/${filename}.${fileTpteEnum[fileType]}`;
      request['post']('/images/getUploadUrl', {
        picKey: picKey,
      })
        .then(res => {
          request['put'](res, image, {
            baseURL: '',
            Headers: {
              AllowedOrigin: true,
            },
          })
            .then(_ => {
              resole(picKey);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  },
};

export function option(Vue) {
  const obj = {
    tableSelection: true,
    uploadLimit: 0,
    uploadMultiple: true,
    addCustBtn: '新增文件夹',
    importImgBtn: '上传图片',
    delsBtn: '批量删除',
    movesBtn: '批量移动',
    modeBtn: Vue.mode,
    selAllBtn: '全选',
    moveSngl(row) {
      return row.type == 2 ? '移动' : '查看';
    },
    downSngl(row) {
      return row.type == 1 ? '' : '下载';
    },
    // delSnglPoP: '删除',
    column: [
      {
        prop: 'id',
        hide: true,
        editShow: true,
      },
      {
        label: '图片',
        prop: 'picKeyPicture',
        viewProp: 'picUrl',
        editType: 'img',
      },
      {
        label: '名称',
        prop: 'picName',
        search: true,
        maxlength: 20,
        placeholder: '请输入名称',
        formatter(row) {
          return row.picName || row.fileDirName;
        },
      },
      {
        label: '全局搜索',
        prop: 'overall',
        search: true,
        maxlength: 20,
        placeholder: '请输入名称',
        hide: true,
      },
      {
        label: '类型',
        prop: 'type',
        Dict: Dict.type,
        // search: true,
        hide: true,
      },
      {
        label: '大小',
        prop: 'picSize',
      },
      {
        label: '尺寸',
        prop: 'picDimensions',
      },
      {
        label: '上传时间',
        prop: 'createTime',
      },
    ],
  };
  if (Vue.belongRootId) {
    delete obj.addCustBtn;
    delete obj.importImgBtn;
    delete obj.delsBtn;
    delete obj.movesBtn;
    delete obj.moveSngl;
    delete obj.downSngl;
    obj.enterBtn = '图片空间';
  }
  return obj;
}

export const Dict = {
  type: {
    2: '图片',
    1: '文件夹',
  },
};
