import request from '@/utils/request';
import { RULE } from '@/utils/validators';
import { transitionTreeArray } from '@utils/index';

export const http = {
  reqList(data) {
    return request.post(`/productCategory/list`, data);
  },
  reqAdd(data) {
    return request.post(`/productCategory/add`, data);
  },
  reqUpdate(data) {
    return request.post(`/productCategory/update`, data);
  },
  reqDel(data) {
    data.status = 0;
    return request.post(`/productCategory/changeStatus`, data);
  },
  reqUpdateStatus(data) {
    return request.post(`/productCategory/changeStatus`, data);
  },
  getProductCategoryEx(data) {
    return request.post(`/productCategory/getProductCategoryEx?id=${data.id}`);
  },
  reqProductCategory(data) {
    return request.post(`/productCategory/list`, data).then(res => {
      const { list } = res;
      list.unshift({
        key: -1,
        value: '无上级类目',
      });
      return list.map(item => ({
        ...item,
        value: item.value || item.name,
        key: item.key || item.id,
      }));
    });
  },
  updateProductAttrCombined(data) {
    return request.post('productAttr/updateProductAttrCombined', data);
  },
  reqModel() {
    return request.post('/optModel/pageQuery', { pageNum: 1, pageSize: 999 });
  },
  getSizeValNames() {
    return request.get('/attribute/getSizeValNames');
  },
};

export function option(Vue) {
  const { status } = Vue.fieldMap;
  return {
    addCustBtn: '新增',
    editCustSngl: '编辑',
    updataSnglPoP: row => {
      return row[status] == 1 ? '停用' : '启用';
    },
    delSnglPoP: '删除',
    column: [
      {
        label: 'ID',
        prop: 'id',
        maxlength: 30,
        editShow: true,
      },
      {
        label: '类目编码',
        prop: 'categoryNo',
        hide: true,
      },
      {
        label: '类目名称',
        prop: 'name',
        maxlength: 30,
        search: true,
        rules: [RULE.required],
      },
      {
        label: '父级类目',
        prop: 'searchParentId',
        search: true,
        hide: true,
        editType: 'cascader',
        collapseTags: true,
        showAllLevels: false,
        props: {
          checkStrictly: true,
        },
        options: transitionTreeArray(Vue.productCategoryList.filter(item => item.levels != 0 && item.levels != 3)),
      },
      {
        label: '类目级别',
        prop: 'levels',
        Dict: Dict.levels,
        search: true,
        rules: [RULE.required],
      },
      {
        label: '上级类目',
        prop: 'parentId',
        rules: [RULE.required],
        Dict: Vue.productCategoryList,
      },
      {
        label: '状态',
        prop: 'categoryStatus',
        search: true,
        Dict: Vue.dict.hideStatus,
      },
    ],
  };
}

export const Dict = {
  levels: {
    1: '一级类目',
    2: '二级类目',
    3: '三级类目',
  },
};
