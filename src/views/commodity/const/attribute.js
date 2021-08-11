import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    return request.post(`/attribute/pageQuery`, params);
  },
  reqDel(data) {
    return request.get(`/attribute/delete`, data);
  },
  reqAdd(data) {
    return request.post(`/attribute/createAttr`, data);
  },
  reqUpdate(data) {
    return request.post(`/attribute/updateAttr`, data);
  },
  reqUpdateStatus(data) {
    return request.post(`/attribute/updateAttrStatus`, data);
  },
  getAttrVals(data) {
    return request.get(`/attribute/getAttrVals`, data);
  },

};

export function option(Vue) {
  const { status } = Vue.fieldMap;
  return {
    addCustBtn: '新增',
    editCustSngl: '编辑',
    delSnglPoP: '删除',
    updataSnglPoP: row => {
      return row[status] == 1 ? '停用' : '启用';
    },
    column: [
      {
        label: '属性ID',
        prop: 'id',
        rules: [RULE.required],
        maxlength: 50
      },
      {
        label: '属性名称',
        prop: 'name',
        rules: [RULE.required],
        search: true,
        maxlength: 30
      },
      {
        label: '属性类型',
        prop: 'attrType',
        Dict: Vue.dict.ProductAttrTypeEnum,
        rules: [RULE.required],
        search: true,
      },
      {
        label: '属性排序',
        prop: 'sort',
        rules: [RULE.required],
      },
      {
        label: '状态',
        prop: status,
        search: true,
        Dict: Vue.dict.hideStatus,
      },
    ],
  };
}

export const Dict = {
};
