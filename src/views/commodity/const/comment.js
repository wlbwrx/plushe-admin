import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const comHttp = {
  reqList(params) {
    return request.post(`/evaluate/spuEvaluateStatistics`, params);
  },
  verifyFile(params) {
    return request.get(`/evaluate/verifyFile`, params);
  },
  getTemplateLink(params) {
    return request.get(`/evaluate/getTemplateLink`, params);
  },
};
export function comOption(Vue) {
  return {
    viewCustSngl: '查看',
    // viewSngl: '查看',
    downloadBtn: '下载模板',
    importBtn: '导入',
    column: [
      {
        label: '商品SPU',
        prop: 'productNo',
        search: true,
      },
      {
        label: '评论数量',
        prop: 'evaluateNum',
      },
    ],
  };
}
export const http = {
  reqList(params) {
    return request.post(`/evaluate/getUserEvaluateList`, params);
  },
  reqAdd(data) {
    return request.post(`/evaluate/createNoUserEvaluate`, data);
  },
  reqUpdate(data) {
    return request.post(`/evaluate/updateEvaluate`, data);
  },
  reqDel(data) {
    return request.get(`/evaluate/deleteEvaluate`, data);
  },
  verifyFile(params) {
    return request.get(`/evaluate/verifyFile`, params,);
  },
  getTemplateLink(params) {
    return request.get(`/evaluate/getTemplateLink`, params,);
  },
};

export function option(Vue) {
  const { fieldMap } = Vue;
  const { id } = fieldMap;
  return {
    addBtn: '新增',
    editSngl: '编辑',
    // updataSnglPoP: row => {
    //   return row.productStatus == 1 ? '下架' : row.productStatus == 3 ? '' : '上架';
    // },
    delSnglPoP: '删除',
    column: [
      {
        label: '评论ID',
        prop: id,
        maxlength: 50,
        hide: true,
      },
      {
        label: '订单编号',
        prop: 'orderSn',
        maxlength: 30,
        editHide: true,
        // search: true,
      },
      {
        label: '用户邮箱',
        prop: 'userEmail',
        search: true,
        rules: [RULE.required, RULE.eMail],
        maxlength: 50,
      },
      {
        label: '评价时间',
        prop: 'evaluateTime',
        editType: 'date-picker',
        type: 'datetime',
        rules: [RULE.required],
        disabledDate: (data) => {
          return data.getTime() > Date.now();
        },
        defaultValue: new Date(),
      },
      {
        label: '评价内容',
        prop: 'evaluateContent',
        rules: [RULE.required],
        type: 'textarea',
        width: 600
      },
      {
        label: '评价星级',
        prop: 'evaluateStart',
        Dict: Dict.evaluateStartDict,
        rules: [RULE.required],
        // search: true,
      },
      {
        label: '评价来源',
        prop: 'evluateSource',
        editHide: true,
        Dict: Dict.evluateSourceDict,
      },
      {
        label: '商品SPU',
        prop: 'productNo',
        search: true,
        // editHide: true,
        rules: [RULE.required],
        maxlength: 15,
      },
      {
        label: '商品SKU',
        prop: 'skuNo',
        // search: true,
        editHide: true,
        maxlength: 15,
      },
      {
        label: '商品属性1',
        prop: 'attr1',
        // rules: [RULE.required],
      },
      {
        label: '商品属性值1',
        prop: 'attrVal1',
        // rules: [RULE.required],
      },
      {
        label: '商品属性2',
        prop: 'attr2',
      },
      {
        label: '商品属性值2',
        prop: 'attrVal2',
      },
      {
        label: '商品属性3',
        prop: 'attr3',
      },
      {
        label: '商品属性值3',
        prop: 'attrVal3',
      },
      {
        label: '商品属性4',
        prop: 'attr4',
      },
      {
        label: '商品属性值4',
        prop: 'attrVal4',
      },
      {
        label: '是否合适',
        prop: 'productMatch',
        rules: [RULE.required],
        Dict: Dict.productMatchDict,
      },
      {
        label: '评价图片',
        prop: 'evaluatePics',
        editType: 'imgs',
        minWidth: 180,
        belongRootId: '6',
        limit: 3,
        // rules: [RULE.required],
      },
      {
        label: '店铺',
        prop: 'shopsId',
        editHide: true,
        Dict: Vue.dict.userShops,
      },
      {
        label: '用户ID',
        prop: 'userId',
        editHide: true,
      },
    ],
  };
}

export const exportHttp = {
  apply(params) {
    return request.post(`/evaluate/apply`, params,);
  },
};

export const Dict = {
  productMatchDict: {
    0: 'ture to size',
    1: 'large',
    2: 'small',
  },
  evluateSourceDict: {
    0: '用户',
    1: '非用户',
  },
  evaluateStartDict: {
    1: '一星',
    2: '二星',
    3: '三星',
    4: '四星',
    5: '五星',
  },
};
