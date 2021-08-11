import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(data) {
    return request.post(`/optTemplate/messageTemplate/pageGet`, data);
  },
  reqDel(data) {
    return request.get(`/optTemplate/messageTemplate/deleteByTemplateId`, data);
  },
  reqAdd(data) {
    return request.post(`/optTemplate/messageTemplate/add`, data);
  },
  reqUpdate(data) {
    return request.post(`/optTemplate/messageTemplate/update`, data);
  },
};

export function option(Vue) {
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
        prop: 'messageTemplateId',
        hide: true,
        editShow: true,
      },
      {
        label: '关键字',
        prop: 'keyword',
        search: true,
        hide: true,
      },
      {
        label: '站内信标题',
        prop: 'title',
        rules: [RULE.required],
      },
      {
        label: '站内信详情',
        prop: 'content',
        rules: [RULE.required],
      },
      {
        label: '消息语言',
        prop: 'language',
        Dict: Vue.dict.LanguageEnum,
        rules: [RULE.required],
      },
      {
        label: '消息类型',
        prop: 'messageType',
        Dict: Vue.dict.MessageTypeEnum,
        rules: [RULE.required],
      },
      {
        label: '店铺',
        prop: 'shopsId',
        Dict: Vue.dict.userShops,
        rules: [RULE.required],
      },
    ],
  };
}

export const Dict = {};
