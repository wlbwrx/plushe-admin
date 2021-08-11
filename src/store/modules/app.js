import { LS, transitionTreeArray } from '@utils/index';
import request from '@/utils/request';

const app = {
  state: {
    sidebar: {
      opened: !LS.get('sidebarStatus'),
    },
    dict: {
      currencyList: {
        USD: '美元',
        JPY: '日元',
      },
      countryList: {
        US: '美国',
        JP: '日本',
      },
      initStatus: {
        0: { value: '待启用', status: 'info' },
        1: { value: '启用', status: 'success' },
        2: { value: '停用', status: 'info' },
      },
      hideStatus: {
        0: { value: '停用', status: 'info' },
        1: { value: '启用', status: 'success' },
      },
      whether: {
        0: { value: '否', status: 'info' },
        1: { value: '是', status: 'success' },
      },
      relType: {
        1: '链接',
        2: '专题',
      },
      userDevice: {
        1: 'H5',
        2: 'PC',
      },
    },
    menuTreeList: LS.get('menuTreeList') || [],
    resourceList: LS.get('resourceList') || [],
    roleList: LS.get('roleList') || [],
    productCategoryList: LS.get('productCategoryList') || [],
    Attribute: LS.get('Attribute') || [],
    SizeConfig: LS.get('SizeConfig') || {},
    attachedProperty: LS.get('attachedProperty') || [],
    brandsList: LS.get('brandsList') || [],
    CouponList: LS.get('CouponList') || [],
    topicList: LS.get('topicList') || [],
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      LS.set('sidebarStatus', Number(state.sidebar.opened));
      state.sidebar.opened = !state.sidebar.opened;
    },
    CLOSE_SIDEBAR: state => {
      LS.set('sidebarStatus', 1);
      state.sidebar.opened = false;
    },
    SET_topicList: (state, topicList) => {
      LS.set('topicList', topicList);
      state.topicList = topicList;
    },
    SET_MENU: (state, menuTreeList) => {
      LS.set('menuTreeList', menuTreeList);
      state.menuTreeList = menuTreeList;
    },
    SET_ROLE: (state, roleList) => {
      LS.set('roleList', roleList);
      state.roleList = roleList;
    },
    SET_AUTHOR: (state, resourceList) => {
      LS.set('resourceList', resourceList);
      state.resourceList = resourceList;
    },
    SET_DICT: (state, dictObj) => {
      state.dict = {
        ...state.dict,
        ...dictObj,
      };
    },
    SET_ProductCategory: (state, productCategoryList) => {
      LS.set('productCategoryList', productCategoryList);
      state.productCategoryList = productCategoryList;
    },
    SET_Attribute: (state, Attribute) => {
      LS.set('Attribute', Attribute);
      state.Attribute = Attribute;
    },
    SET_SizeConfig: (state, SizeConfig) => {
      LS.set('SizeConfig', SizeConfig);
      state.SizeConfig = SizeConfig;
    },
    SET_Brands: (state, brandsList) => {
      LS.set('brandsList', brandsList);
      state.brandsList = brandsList;
    },
    SET_attachedProperty: (state, attachedProperty) => {
      LS.set('attachedProperty', attachedProperty);
      state.attachedProperty = attachedProperty;
    },
    SET_CouponList: (state, CouponList) => {
      LS.set('CouponList', CouponList);
      state.CouponList = CouponList;
    },
  },
  actions: {
    ToggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR');
    },
    CloseSideBar({ commit }) {
      commit('CLOSE_SIDEBAR');
    },
    GetTopicList({ commit }) {
      request.post('/topicConfig/pageQuery', { pageNum: 1, pageSize: 999, enable: 1 }).then(res => {
        commit(
          'SET_topicList',
          res.list.map(item => ({
            id: `${item.id}`,
            label: `${item.name}(${item.id})`,
          }))
        );
      });
    },
    GetMenuTreeList({ commit }) {
      request.get('/menu/treeList').then(res => {
        commit(
          'SET_MENU',
          res.map(item => ({
            id: item.id,
            label: item.title,
            parentId: item.parentId,
            children: item.children.map(item => ({
              id: item.id,
              label: item.title,
              parentId: item.parentId,
            })),
          }))
        );
      });
    },
    GetRoleList({ commit }) {
      request.get('/role/list', { pageSize: 100 }).then(res => {
        commit(
          'SET_ROLE',
          res.list.map(item => ({
            label: item.name,
            id: item.id,
          }))
        );
      });
    },
    GetAuthorityList({ commit }) {
      request.get('/resource/listAll').then(res => {
        commit(
          'SET_AUTHOR',
          transitionTreeArray(
            res.map(item => ({
              id: item.id,
              parentId: item.categoryId,
              label: item.name,
            }))
          )
        );
      });
    },
    getProductCategoryList({ commit }) {
      return request.post('/productCategory/list', { pageSize: 999, pageNum: 1 }).then(res => {
        res.list.forEach((item, index, arr) => {
          if (item.parentId != -1) {
            const { categoryStatus, name } = res.list.find(element => element.id == item.parentId) || {};
            arr[index].name = `${name} / ${item.name}`;
            if (categoryStatus == 0) {
              arr[index].categoryStatus = 0;
            }
          }
        });
        res.list.unshift({
          id: -1,
          name: '顶级类目',
          levels: 0,
        });
        commit(
          'SET_ProductCategory',
          res.list.map(item => ({
            label: item.name,
            id: item.id,
            levels: item.levels,
            parentId: item.parentId,
            categoryStatus: item.categoryStatus,
          }))
        );
      });
    },
    getAttribute({ commit }) {
      return request.post('/attribute/query', {}).then(res => {
        commit(
          'SET_Attribute',
          res.map(item => ({
            label: item.name,
            id: item.id,
            group: item.group,
            attrType: item.attrType,
            stauts: item.attrStatus,
          }))
        );
      });
    },
    getSizeConfig({ commit }) {
      return request.post('/sizeConfig/query', {}).then(res => {
        const obj = {};
        const [size] = res;
        for (const key in size) {
          if (key.indexOf('Size') > -1) {
            const keyItem = key.replace('Size', '');
            obj[keyItem] = [];
          }
        }
        const keyArr = Object.keys(obj);
        keyArr.forEach(m => {
          res.forEach(p => {
            obj[m].push(p[`${m}Size`]);
          });
        });
        commit('SET_SizeConfig', obj);
      });
    },
    GetOptCampaignEnums({ commit }) {
      request.get('/frontEnum/getOptCampaignEnums').then(res => {
        commit('SET_DICT', res);
      });
    },
    GetPageGetEmailTemplate({ commit }) {
      return request.post('/optTemplate/emailTemplate/pageGet', { pageNumer: 1, pageSize: 100 }).then(res => {
        const EmailTemplate = {};
        res.list.forEach(item => {
          EmailTemplate[item.emailTemplateId] = item.title;
        });
        commit('SET_DICT', {
          EmailTemplate,
        });
      });
    },
    pageGetMessageTemplate({ commit }) {
      return request.post('/optTemplate/messageTemplate/pageGet', { pageNumer: 1, pageSize: 100 }).then(res => {
        const MessageTemplate = {};
        res.list.forEach(item => {
          MessageTemplate[item.messageTemplateId] = item.title;
        });
        commit('SET_DICT', {
          MessageTemplate,
        });
      });
    },
    getALLPlatformShops({ commit, getters }) {
      return request.get('/admin/getALLPlatformShops', { platformId: '' }).then(res => {
        const { shopsId, platformId } = getters.user;
        const platformList = {};
        const shopsList = {};
        const userShops = {
          0: '平台',
        };
        res.forEach(item => {
          if (platformId == item.platformId) {
            userShops[item.shopsId] = item.shopsName;
          }
          shopsList[item.shopsId] = item.shopsName;
          platformList[item.platformId] = item.platformName;
        });
        commit('SET_DICT', {
          platformList,
          shopsList,
          userShops,
        });
        commit('SET_shopsName', shopsList[shopsId] || platformList[platformId]);
      });
    },
    getAllDictionaries({ commit, getters }) {
      return request.get('/frontEnum/getAllDictionaries').then(res => {
        const obj = {};
        Object.keys(res).forEach(item => {
          obj[item] = {};
          res[item].forEach(element => {
            obj[item][element.code] = element.desc;
          });
        });
        commit('SET_DICT', obj);
      });
    },
    getBrands({ commit }) {
      request.post('/product/getBrands').then(res => {
        commit('SET_Brands', res);
      });
    },
    getAttachedProperty({ commit }) {
      request.post('/attribute/query', { attrType: 2, attrStatus: 1 }).then(res => {
        commit(
          'SET_attachedProperty',
          res.map(item => ({ id: item.id, label: item.name }))
        );
      });
    },
    GetCouponList({ commit }) {
      return request.post('/optCampaign/couponConfig/query', { couponStatus: 1, pageNum: 1, pageSize: 999 }).then(res => {
        commit(
          'SET_CouponList',
          res.list.map(item => ({
            id: item.couponId,
            label: item.couponName,
            couponRestrict: item.couponRestrict,
            disabled: item.bindCampaign === 1,
          }))
        );
      });
    },
    initData({ state, dispatch }) {
      // 活动枚举
      const { EmailTemplate, MessageTemplate, CouponTypeEnum, ProductAttrTypeEnum } = state.dict;
      if (!EmailTemplate) dispatch('GetPageGetEmailTemplate');
      if (!MessageTemplate) dispatch('pageGetMessageTemplate');
      if (!CouponTypeEnum) dispatch('GetOptCampaignEnums');
      if (!ProductAttrTypeEnum) dispatch('getAllDictionaries');
      dispatch('getALLPlatformShops');
      dispatch('getProductCategoryList');
      // dispatch('GetTopicList');
    },
  },
};

export default app;
