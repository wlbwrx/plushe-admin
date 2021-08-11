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
  // 导出商品数据
  getBatchExport(data) {
    return request.post(`/productImport/export`, data);
  },
};

export function option(Vue) {
  const { fieldMap } = Vue;
  const { id } = fieldMap;
  return {
    sortsBtn: '批量排序',
    downloadBtn: '下载模板',
    importBtn: '导入',
    // addImportBtn: '导入(新增)',
    // updateImportBtn: '导入(修改)',
    exportBtn: '商品导出',
    addCustBtn: '新增',
    editCustSngl: '编辑',
    addUrlBtn: 'URL新增',
    skuSngl: 'SKU配置',
    sizeSngl: '尺寸信息',
    tableSelection: true,
    updataSnglPoPputAway: row => {
      return row.productStatus == 1 ? '下架' : '上架';
    },
    delSnglPoP: '删除',
    column: [
      {
        prop: 'timeArr',
        editType: 'date-picker',
        type: 'datetimerange',
        hide: true,
        search: true,
      },
      {
        label: 'SPU编码',
        prop: id,
        maxlength: 50,
        search: true,
      },
      {
        label: 'SKU编码',
        prop: 'skuNo',
        hide: true,
        search: true,
      },
      {
        label: '商品名称',
        prop: 'name',
        maxlength: 30,
        search: true,
      },
      {
        label: '所属类目',
        prop: 'productCateThree',
        formatter(row) {
          return `${row.productCateOne} / ${row.productCateTwo} / ${row.productCateThree}`;
        },
      },
      {
        label: '商品状态',
        prop: 'productStatus',
        Dict: Dict.productStatus,
        search: true,
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
        label: '附加属性',
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
        label: '商品排序',
        prop: 'sort',
        viewType: 'input',
      },
      {
        label: '主图片',
        prop: 'picUrl',
        editType: 'img',
      },
      {
        label: '修改时间',
        prop: 'modifyTime',
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
  applyAdd(params) {
    return request.post(`/productImport/apply/add`, params);
  },
  applyUpdate(params) {
    return request.post(`/productImport/apply/update`, params);
  },
};

export const Dict = {
  productStatus: {
    1: '上架',
    2: '下架',
    3: '草稿',
    4: '待上架',
  },
};
