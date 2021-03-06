import request from '@/utils/request';
// import { RULE } from '@/utils/validators';
import { transitionTreeArray } from '@utils/index';
import { imageHandler } from '@/utils/index';

export const http = {
  reqList(params) {
    return request.post(`/product/pageCond`, params);
  },
  reqAdd(data) {
    return request.post(`/product/addProduct`, data);
  },
  reqUpdate(data) {
    return request.post(`/product/updateProduct`, data);
  },
  reqDel(data) {
    const { productNo } = data;
    return request.post(`/product/updateStatus`, { productNo, status: 0 });
  },
  updateSort(data) {
    return request.post(`/product/updateSort`, data);
  },
  reqUpdateStatus(data) {
    return request.post(`/product/updateStatus`, data);
  },
  getByProductNo(data) {
    return request.post(`/product/getByProductNo?productNo=${data.productNo}`).then(res => {
      const { picsList } = res;
      res.picsList = picsList.map(item => {
        item.picUrl = imageHandler(0, item.picKey);
        return item;
      });
      // res.tipPicUrl = imageHandler(0, tipPicKey);
      return res;
    });
  },
  listSkuByProductId(data) {
    return request.post(`/product/listSkuByProductNo?productNo=${data.productNo}`);
  },
  addProductSku(data) {
    return request.post(`/product/addProductSku`, data);
  },
  updateProductSku(data) {
    return request.post(`/product/updateProductSku`, data);
  },
  addProductSize(data) {
    return request.post(`/product/addProductSize`, data);
  },
  updateProductSize(data) {
    return request.post(`/product/updateProductSize`, data);
  },
  getProductSize(data) {
    return request.get(`/product/getProductSize`, data);
  },
  verifyFile(params) {
    return request.get(`/productImport/verifyFile`, params);
  },
  // verifyFileAdd(params) {
  //   return request.get(`/productImport/verifyFile/add`, params);
  // },
  // verifyFileUpdate(params) {
  //   return request.get(`/productImport/verifyFile/update`, params);
  // },
  getTemplateLink(params) {
    return request.get(`/productImport/getTemplateLink`, params);
  },
  // ??????????????????
  getBatchExport(data) {
    return request.post(`/productImport/export`, data);
  },
};

export function option(Vue) {
  const { fieldMap } = Vue;
  const { id } = fieldMap;
  return {
    sortsBtn: '????????????',
    downloadBtn: '????????????',
    importBtn: '??????',
    // addImportBtn: '??????(??????)',
    // updateImportBtn: '??????(??????)',
    exportBtn: '????????????',
    addCustBtn: '??????',
    editCustSngl: '??????',
    addUrlBtn: 'URL??????',
    skuSngl: 'SKU??????',
    sizeSngl: '????????????',
    tableSelection: true,
    updataSnglPoPputAway: row => {
      return row.productStatus == 1 ? '??????' : '??????';
    },
    delSnglPoP: '??????',
    column: [
      {
        prop: 'timeArr',
        editType: 'date-picker',
        type: 'datetimerange',
        hide: true,
        search: true,
      },
      {
        label: 'SPU??????',
        prop: id,
        maxlength: 50,
        search: true,
      },
      {
        label: 'SKU??????',
        prop: 'skuNo',
        hide: true,
        search: true,
      },
      {
        label: '????????????',
        prop: 'name',
        maxlength: 30,
        search: true,
      },
      {
        label: '????????????',
        prop: 'productCateThree',
        formatter(row) {
          return `${row.productCateOne} / ${row.productCateTwo} / ${row.productCateThree}`;
        },
      },
      {
        label: '????????????',
        prop: 'productStatus',
        Dict: Dict.productStatus,
        search: true,
      },
      {
        label: '????????????',
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
        label: '????????????',
        prop: 'attrValId',
        search: true,
        hide: true,
        editType: 'cascader',
        collapseTags: true,
        showAllLevels: false,
        props: {
          lazy: true,
          lazyLoad(node, resolve) {
            const { id } = node.data;
            if (!id) return;
            request.get('/attribute/getAttrVals', { attrId: id }).then(res => {
              resolve((res || []).map(item => ({ id: item.id, label: item.val, leaf: true })));
            });
          },
        },
        options: Vue.attachedProperty,
      },
      {
        label: '????????????',
        prop: 'sort',
        viewType: 'input',
      },
      {
        label: '?????????',
        prop: 'picUrl',
        editType: 'img',
      },
      {
        label: '????????????',
        prop: 'modifyTime',
      },
      {
        label: '????????????',
        prop: 'createTime',
      },
    ],
  };
}

export const exportHttp = {
  apply(params) {
    return request.post(`/productImport/apply`, params);
  },
  applyAdd(params) {
    return request.post(`/productImport/apply/add`, params);
  },
  applyUpdate(params) {
    return request.post(`/productImport/apply/update`, params);
  },
};

export const Dict = {
  productStatus: {
    1: '??????',
    2: '??????',
    3: '??????',
    4: '?????????',
  },
};
