import request from '@/utils/request';
import { transitionTreeArray } from '@utils/index';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(data) {
    return request.post(`/topicConfig/pageQuery`, data);
  },
  reqDel(data) {
    return request.get(`/topicConfig/deleteTopic`, data); // topicConfig/get
  },
  reqDetail(params) {
    return request.get(`/topicConfig/get`, params);
  },
  reqAdd(data) {
    return request.post(`/topicConfig/createTopic`, data);
  },
  reqUpdate(data) {
    return request.post(`/topicConfig/updateTopic`, data);
  },
  reqUpdateStatus(params) {
    let enable = true;
    if (params.enable == 1) {
      enable = true;
    } else {
      enable = false;
    }
    return request.get(`/topicConfig/updateEnable`, { enable, id: params.id });
  },
  reqProduct(data) {
    return request.post(`/plushe-oa-web/product/pageCond`, data);
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
};

export function option(Vue) {
  const { fieldMap } = Vue;
  const { id } = fieldMap;
  const relationTypeArr = {
    1: '关联商品',
    2: '关联类目',
    3: '关联附加属性',
  }; // 关联类型：1-产品，2-类目
  return {
    addCustBtn: '新增',
    editCustSngl: '编辑',
    viewCustSngl: '查看商品',
    commoditySngl: '关联商品',
    updataSnglPoP: row => {
      return row['enable'] ? '停用' : '启用';
    },
    delSnglPoP: '删除',
    column: [
      {
        label: 'ID',
        prop: id,
        maxlength: 50,
        search: true,
        // editShow: true,
        editHide: true,
      },
      {
        label: '专题名称',
        prop: 'name',
        maxlength: 20,
        search: true,
        rules: [RULE.required],
        // formatter(row) {
        //   return `<a href="/#/flash-sale-commodity?flashSaleId=${row.id}">${row.title}</a>`;
        // },
      },
      {
        label: '关联类型',
        prop: 'relationType',
        // editShow: true,
        Dict: relationTypeArr,
      },
      {
        label: '关联商品数',
        prop: 'relationProductSize',
        editHide: true,
        formatter(row) {
          return `${row.relationProductSize}(${row.relationOnSaleProductSize})`;
        },
      },
      {
        label: 'H5列表顶图',
        prop: 'listPicH5Picture',
        viewProp: 'listPicH5Url',
        editType: 'img',
        belongRootId: '6',
      },
      {
        label: 'PC列表顶图',
        prop: 'listPicPcPicture',
        viewProp: 'listPicPcUrl',
        editType: 'img',
        belongRootId: '6',
      },
      {
        label: '链接后缀',
        prop: 'linkUri',
        editHide: true,
      },
      {
        label: '创建时间',
        prop: 'createTime',
        editHide: true,
      },
      {
        label: '修改时间',
        prop: 'modifyTime',
        editHide: true,
      },
      {
        label: '创建人',
        prop: 'creator',
        editHide: true,
      },
      {
        label: '修改人',
        prop: 'modifier',
        editHide: true,
      },
      {
        label: '状态',
        prop: 'enable',
        editHide: true,
        Dict: Vue.dict.hideStatus,
        search: true,
      },
      {
        label: '所属类目',
        prop: 'category',
        // search: true,
        hide: true,
        editType: 'cascader',
        collapseTags: true,
        showAllLevels: false,
        props: {
          checkStrictly: true,
        },
        options: transitionTreeArray(Vue.productCategoryList.filter(item => item.levels != 0)),
      },
    ],
  };
}

export const commodityHttp = {
  reqList(params) {
    if (params.categoryId) {
      params['topicId'] = params.categoryId;
      delete params['categoryId'];
    }
    if (params.extend) delete params['extend'];
    return request.post(`/topicConfig/pageQueryProducts`, params);
  },
  reqDel(data) {
    return request.post(`/topicConfig/deleteTopicProductRels`, data);
  },
  reqUpdate(data) {
    return request.post(`/flashSaleProduct/update`, data);
  },
  reqBatchAdd(data) {
    return request.post(`/flashSaleProduct/batchAdd`, data);
  },
  // 导出商品数据
  getBatchExport(data) {
    if (data.extend) delete data.extend;
    const topicId = localStorage.getItem('topicId');
    return request.post(`/productImport/exportTopicProduct`, { ...data, topicId });
  },
  updateSort(data, val) {
    if (val) {
      const topicId = localStorage.getItem('topicId');
      const { productNo, sort } = val;
      return request.get(`/topicConfig/updateTopicProductRelSort`, { topicId, productNo, sort });
    }
  },
  getAttrVals(attrId) {
    return request.get(`/attribute/getAttrVals`, { attrId });
  },
};
export const Dict = {};
