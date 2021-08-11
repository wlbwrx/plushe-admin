import request from '@/utils/request';
import { RULE } from '@/utils/validators';
import { useI18n } from 'vue-i18n';

// import { transitionTreeArray } from '@utils/index';

export const http = {
  reqList(params) {
    return request.post(`/optCampaign/couponConfig/query`, params);
  },
  reqDel(data) {
    return request.get(`/optCampaign/couponConfig/delete`, data);
  },
  reqAdd(data) {
    return request.post(`/optCampaign/couponConfig/add`, data);
  },
  reqUpdateStatus(data) {
    return request.get(`/optCampaign/couponConfig/${data.couponStatus == 1 ? 'start' : 'stop'}`, data);
  },
  reqUpdate(data) {
    return request.post(`/optCampaign/couponConfig/update`, data);
  },
};

export function editOption(Vue) {
  const { couponType = 1, timeModel = 2, couponId } = Vue.editForm;
  const { t } = useI18n();
  // const { couponType = 1, timeModel = 2, couponId, currentRow = {} } = Vue.editForm;
  // const categoryList = transitionTreeArray(
  //   Vue.productCategoryList
  //     .filter(item => item.levels != 0)
  //     .map(item => ({
  //       ...item,
  //       disabled: (currentRow.productCategory || '').includes(item.id) && item.disabled ? false : item.disabled,
  //     }))
  // );
  return {
    formItemList: [
      {
        label: '优惠券ID',
        prop: 'couponId',
        editShow: true,
      },
      {
        label: '优惠券名称',
        prop: 'couponName',
        maxlength: 50,
        rules: [RULE.required],
      },
      {
        label: '使用限制',
        prop: 'couponRestrict',
        Dict: Vue.dict.CouponRestrictEnum,
        disabled: !!couponId,
        rules: [RULE.required],
      },
      {
        label: '优惠券类型',
        prop: 'couponType',
        defaultValue: couponType,
        Dict: Vue.dict.CouponTypeEnum,
        rules: [RULE.required],
      },
      {
        label: '满件数量',
        prop: 'thresholdNumber',
        maxlength: 3,
        rules: [RULE.required, RULE.numberInt],
        formItemHide: couponType != 4,
      },
      {
        label: '抵扣金额',
        prop: 'fixedAmount',
        maxlength: 9,
        suffixText: t('currencySymbol'),
        formItemHide: couponType == 3 || couponType == 4,
        rules: [RULE[Vue.user.platformId == 3 ? 'numberIntZero' : 'twoDecimal']],
      },
      {
        label: '抵扣比例',
        prop: 'discountProbability',
        maxlength: 2,
        max: 100,
        suffixIcon: 'icon-percentage',
        rules: [RULE.numberInt],
        formItemHide: !(couponType == 3 || couponType == 4),
      },
      {
        label: '门槛金额',
        prop: 'thresholdAmount',
        maxlength: 9,
        suffixText: t('currencySymbol'),
        formItemHide: couponType == 1 || couponType == 4,
        rules: [RULE[Vue.user.platformId == 3 ? 'numberIntZero' : 'twoDecimal']],
      },
      {
        label: '抵扣金额上限',
        prop: 'maxAmount',
        maxlength: 9,
        suffixText: t('currencySymbol'),
        formItemHide: !(couponType == 3 || couponType == 4),
        rules: [RULE[Vue.user.platformId == 3 ? 'numberIntZero' : 'twoDecimal']],
      },
      {
        label: '时间模式',
        prop: 'timeModel',
        defaultValue: timeModel,
        rules: [RULE.required],
        Dict: Vue.dict.CouponTimeModelEnum,
      },
      {
        label: '使用天数',
        prop: 'validPeriod',
        maxlength: 5,
        prependText: '领取后',
        suffixText: '天可使用',
        rules: [RULE.required, RULE.numberInt],
        formItemHide: timeModel != 2,
      },
      {
        label: '使用日期',
        prop: 'timeArr',
        editType: 'date-picker',
        type: 'datetimerange',
        rules: [RULE.required],
        formItemHide: timeModel != 1,
      },
      {
        label: '优惠券数量',
        prop: 'couponLimit',
        maxlength: 9,
        rules: [RULE.required, RULE.numberInt],
      },
      // {
      //   label: '使用范围',
      //   prop: 'productCategory',
      //   editType: 'cascader',
      //   props: {
      //     multiple: true,
      //     checkStrictly: true,
      //   },
      //   rules: [RULE.required],
      //   Dict: categoryList,
      // },
      {
        label: '使用说明',
        prop: 'comment',
        type: 'textarea',
        maxlength: 250,
      },
    ],
  };
}

export function option(Vue) {
  const { n } = useI18n();
  const { status, id } = Vue.fieldMap;
  return {
    addCustBtn: '新增',
    editCustSngl: '编辑',
    updataSnglPoP: row => {
      return row[status] == 1 ? '停用' : '启用';
    },
    delSnglPoP: '删除',
    column: [
      {
        label: '优惠券ID',
        prop: id,
        search: true,
        maxlength: 50,
      },
      {
        label: '优惠券码',
        prop: 'couponCode',
      },
      {
        label: '优惠券名称',
        prop: 'couponName',
        maxlength: 30,
        search: true,
      },
      {
        label: '金额/折数',
        prop: 'fixedAmount',
        rules: [RULE.required],
        formatter: row => {
          const { couponType, discountProbability, fixedAmount } = row;
          return couponType == 3 || couponType == 4 ? `${discountProbability}%` : n(fixedAmount, 'currency');
        },
      },
      {
        label: '门槛金额/数量',
        prop: 'thresholdAmount',
        formatter: row => {
          const { thresholdAmount } = row;
          if (row.couponType == 4) {
            return row.thresholdNumber + '件';
          }
          return n(thresholdAmount, 'currency');
        },
      },
      {
        label: '优惠券类型',
        prop: 'couponType',
        Dict: Vue.dict.CouponTypeEnum,
        search: true,
      },
      {
        label: '使用限制',
        prop: 'couponRestrict',
        search: true,
        Dict: Vue.dict.CouponRestrictEnum,
      },
      {
        label: '剩余数量',
        prop: 'couponLimit',
        formatter: row => {
          const { couponRestrict, couponLimit, distributedLimit = 0 } = row;
          return couponRestrict == 2 ? couponLimit - distributedLimit : '--';
        },
      },
      {
        label: '有效期',
        prop: 'timeModel',
        formatter: row => {
          const { validPeriod, startTime, endTime, timeModel } = row;
          return timeModel == 2 ? `${validPeriod} days` : `${startTime} - ${endTime}`;
        },
      },
      {
        label: '使用范围',
        prop: 'productCategory',
        Dict: Vue.productCategoryList,
      },
      {
        label: '状态',
        prop: status,
        search: true,
        Dict: Vue.dict.initStatus,
      },
    ],
  };
}

export const Dict = {};
