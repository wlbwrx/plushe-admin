import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(data) {
    return request.get(`/shipping/pageQuery`, data);
  },
  reqDel(data) {
    return request.get(`/shipping/delete`, data);
  },
  reqAdd(data) {
    return request.post(`/shipping/add`, data);
  },
  reqUpdate(data) {
    return request.post(`/shipping/update`, data);
  },
};

export function option(Vue) {
  const currencyList =
    Vue.user.platformId == 3
      ? {
          JPY: '日元',
        }
      : {
          USD: '美元',
        };
  return {
    addBtn: true,
    editSngl: '编辑',
    delSnglPoP: '删除',
    column: [
      {
        prop: 'id',
        hide: true,
        editShow: true,
      },
      {
        label: '名称',
        prop: 'name',
        maxlength: 32,
        rules: [RULE.required],
      },
      {
        label: '币种',
        prop: 'currency',
        Dict: currencyList,
        rules: [RULE.required],
      },
      {
        label: '邮费',
        prop: 'fee',
        maxlength: 7,
        rules: [RULE.required, RULE[Vue.user.platformId == 3 ? 'numberIntZero' : 'twoDecimal']],
      },
      {
        label: '排序',
        prop: 'sort',
        maxlength: 4,
        rules: [RULE.required, RULE.numberIntZero],
      },
      {
        label: '描述',
        prop: 'desc',
        maxlength: 255,
      },
    ],
  };
}

export const Dict = {};
