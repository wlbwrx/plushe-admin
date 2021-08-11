import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(data) {
    return request.post(`/optTemplate/emailTemplate/pageGet`, data);
  },
  reqDel(data) {
    return request.get(`/optTemplate/emailTemplate/deleteByTemplateId`, data);
  },
  reqAdd(data) {
    return request.post(`/optTemplate/emailTemplate/add`, data);
  },
  reqUpdate(data) {
    return request.post(`/optTemplate/emailTemplate/update`, data);
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
        prop: 'emailTemplateId',
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
        label: '通知标题',
        prop: 'title',
        rules: [RULE.required],
      },
      {
        label: '通知详情',
        prop: 'content',
        type: 'textarea',
        rules: [RULE.required],
      },
      {
        label: '通知语言',
        prop: 'language',
        Dict: Vue.dict.LanguageEnum,
        rules: [RULE.required],
      },
      {
        label: '通知类型',
        prop: 'messageType',
        Dict: Vue.dict.MessageTypeEnum,
        rules: [RULE.required],
      },
    ],
  };
}

export const Dict = {};
