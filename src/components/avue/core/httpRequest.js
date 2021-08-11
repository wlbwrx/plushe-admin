import request from '@/utils/request';
import dayjs from 'dayjs';
import { imageHandler } from '@/utils/index';

function httpRequest(type, image) {
  const folder = dayjs().format('YYYYMMDDHHmmss') + `${Math.ceil(Math.random() * 100000000)}`.padStart(8, 0);
  const filename = dayjs().format('YYYYMMDDHHmmss') + `${Math.ceil(Math.random() * 100)}`.padStart(3, 0);
  const fileType = image.type.split('/')[1];
  const fileTpteEnum = {
    'vnd.ms-excel': 'xls',
    'vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    png: 'png',
    jpeg: 'jpg',
    jpg: 'jpg',
    webp: 'webp',
    gif: 'gif',
  };
  console.log(fileType, '上传的图片类型是??????');
  return new Promise((resole, reject) => {
    if (!fileTpteEnum[fileType]) {
      reject('文件类型未收录');
      return;
    }
    request
      .post('/images/getUploadUrl', {
        picKey: `${type}/${folder}/${filename}.${fileTpteEnum[fileType]}`,
        // type,
      })
      .then(res => {
        request
          .put(res, image, {
            baseURL: '',
            Headers: {
              AllowedOrigin: true,
            },
          })
          .then(_ =>
            resole({
              uid: image.uid,
              status: 'success',
              picKey: `${type}/${folder}/${filename}.${fileTpteEnum[fileType]}`,
              picUrl: imageHandler(1, `${type}/${folder}/${filename}.${fileTpteEnum[fileType]}`),
            })
          )
          .catch(err => reject(err));
      })
      .catch(err => {
        reject(err);
      });
  });
}

export default httpRequest;
