import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    return request.post(`/optCampaign/campaignConfig/query`, params);
  },
  reqDel(data) {
    return request.get(`/optCampaign/campaignConfig/delete`, data);
  },
  reqAdd(data) {
    return request.post(`/optCampaign/campaignConfig/add`, data);
  },
  reqUpdate(data) {
    return request.post(`/optCampaign/campaignConfig/update`, data);
  },
  reqUpdateStatus(data) {
    return request.get(`/optCampaign/campaignConfig/${data.campaignStatus == 1 ? 'start' : 'stop'}`, {
      campaignId: data.campaignId,
    });
  },
};

export function option(Vue) {
  const { popForm, fieldMap, currentRow } = Vue;
  const { status, id } = fieldMap;
  const selCouponList = Vue.CouponList.filter(item => item.couponRestrict == popForm.couponRestrict).map(item => ({
    ...item,
    disabled: (currentRow.couponList || '').includes(item.id) && item.disabled ? false : item.disabled,
  }));
  return {
    addBtn: '新增',
    editSngl: '编辑',
    updataSnglPoP: row => {
      return row[status] == 1 ? '停用' : '启用';
    },
    delSnglPoP: '删除',
    searchOption: {
      inline: false,
    },
    column: [
      {
        label: '活动ID',
        prop: id,
        maxlength: 50,
        search: true,
        editShow: true,
      },
      {
        label: '活动名称',
        prop: 'campaignName',
        search: true,
        maxlength: 50,
        rules: [RULE.required],
      },
      {
        label: '活动时间',
        prop: 'timeArr',
        editType: 'date-picker',
        type: 'datetimerange',
        rules: [RULE.required],
        formatter: row => {
          return `${row.startTime + ' - ' + row.endTime}`;
        },
      },
      {
        label: '活动码',
        prop: 'campaignCode',
        maxlength: 20,
        rules: [RULE.character],
        disabled: Boolean(popForm[id]),
        placeholder: '空则自动生成',
      },
      {
        label: '日领取限制',
        prop: 'dayLimit',
        maxlength: 5,
        rules: [RULE.lengthTen, RULE.numberIntZero],
        formatter: row => {
          return row.dayLimit || '无限制';
        },
      },
      {
        label: '总领取限制',
        prop: 'countLimit',
        maxlength: 5,
        rules: [RULE.lengthTen, RULE.numberIntZero],
        formatter: row => {
          return row.countLimit || '无限制';
        },
      },
      {
        label: '活动类型',
        prop: 'campaignType',
        Dict: {
          1: '公开类型',
          2: '私有类型'
        },
        rules: [RULE.required],
      },
      {
        label: '优惠券类型',
        prop: 'couponRestrict',
        defaultValue: '1',
        clearable: false,
        Dict: Vue.dict.CouponRestrictEnum,
        rules: [RULE.required],
      },
      {
        label: '活动优惠券',
        prop: 'couponList',
        multiple: true,
        Dict: selCouponList,
        minWidth: 150,
        rules: [RULE.required],
        formatter: row => {
          const { couponList } = row;
          let str = '';
          Vue.CouponList.forEach(item => {
            if (couponList.includes(item.id)) {
              str += `<a href="#/coupon?couponId=${item.id}">${item.label}</a><br/>`;
            }
          });
          return str;
        },
      },
      {
        label: '活动状态',
        prop: status,
        search: true,
        editShow: true,
        Dict: Vue.dict.CampaignStatusEnum,
      },
    ],
  };
}
