import request from '@/utils/request';
import { transitionTreeArray } from '@utils/index';

export const http = {
  reqList(params) {
    return request.post(`/product/ali/page/list`, params);
  },
  reqAdd(data) {
    return request.post(`/product/ali/sourceUrl/batchAdd`, data);
  },
  reqUpdate(data) {
    return request.post(`/product/updateProduct`, data);
  },
};

export function option(Vue) {
  return {
    addCustBtn: '链接创建',
    column: [
      {
        label: '创建时间',
        prop: 'timeArr',
        editType: 'date-picker',
        search: true,
        hide: true,
        type: 'datetimerange',
      },
      {
        label: 'SPU编码',
        prop: 'productNo',
        maxlength: 50,
        search: true,
      },
      {
        label: '商品链接',
        prop: 'sourceUrl',
        editType: 'url',
      },
      {
        label: '商品标题',
        prop: 'name',
      },
      {
        label: '所属品牌',
        prop: 'brandName',
      },
      {
        label: '所属类目',
        prop: 'productCateThree',
        formatter(row) {
          return `${row.productCateOne} / ${row.productCateTwo} / ${row.productCateThree}`;
        },
      },
      {
        label: '所属品牌',
        prop: 'brand',
        search: true,
        hide: true,
        showType: 'showOne',
        Dict: Vue.brandsList,
      },
      {
        label: '所属类目',
        prop: 'searchParentId',
        search: true,
        hide: true,
        editType: 'cascader',
        collapseTags: true,
        showAllLevels: false,
        props: {
          checkStrictly: true,
        },
        options: transitionTreeArray(Vue.productCategoryList.filter(item => item.levels != 0)),
      },
      {
        label: '创建状态',
        prop: 'createStatus',
        Dict: Dict.createStatus,
        search: true,
      },
      {
        label: '备注',
        prop: 'remark',
      },
      {
        label: '创建时间',
        prop: 'createTime',
      },
    ],
  };
}

export const exportHttp = {
  apply(params) {
    return request.post(`/productImport/apply`, params);
  },
};

export const Dict = {
  createStatus: {
    1: '待创建',
    2: '创建中',
    3: '创建失败',
    4: '创建成功',
  },
};
