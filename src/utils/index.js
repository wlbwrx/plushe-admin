import { Base64 } from 'js-base64';

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

// productKey:  图片key值
// layout:  0 -> h5列表页   1 -> h5商品详情页
export const imageHandler = function(layout = 0, productKey) {
  if (!productKey) return;
  const resize = {
    0: {
      height: 40,
      fit: 'cover',
    },
    1: {
      fit: 'cover',
    },
  };
  const parameter = {
    bucket: process.env.VUE_APP_BUCKET || 'test-plushe', // 根据host来识别，如果是sit则填：test-plushe；如果是生产则填：pro-plushe
    key: productKey, // productKey, // 后台放回S3 图片key
    edits: {
      resize: resize[layout || 0],
    },
  };
  return `https://img.plushe.com/${Base64.encode(JSON.stringify(parameter))}`;
};

export const LS = {
  get(key) {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    } else {
      return false;
    }
  },
  set(key, value) {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear: function() {
    localStorage.clear();
  },
};

export const SS = {
  get(key) {
    const value = sessionStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    } else {
      return false;
    }
  },
  set(key, value) {
    if (typeof value === 'object') {
      sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      sessionStorage.setItem(key, value);
    }
  },
  remove(key) {
    sessionStorage.removeItem(key);
  },
  clear: function() {
    sessionStorage.clear();
  },
};

export const deepCopy = obj => {
  return JSON.parse(JSON.stringify(obj));
};

export const transitionTreeArray = (data, obj) => {
  const { parentId = 'parentId', parentVal = '-1,0', id = 'id' } = obj || {};
  const map = {};
  const val = [];
  const arr = JSON.parse(JSON.stringify(data));
  arr.forEach(item => {
    map[item[id]] = item;
  });
  arr.forEach(item => {
    const parent = map[item[parentId]];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else if (parentVal.includes(item[parentId])) {
      val.push(item);
    }
  });
  return val;
};
