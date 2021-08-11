import request from '@/utils/request';
import { RULE } from '@/utils/validators';

export const http = {
  reqList(params) {
    return request.post(`/optModel/pageQuery`, params);
  },
  reqDel(data) {
    return request.get(`/optModel/delete`, data);
  },
  reqAdd(data) {
    return request.post(`optModel/add`, data);
  },
  reqUpdate(data) {
    return request.post(`/optModel/update`, data);
  },
};

export function option(Vue) {
  const { id } = Vue.fieldMap;
  return {
    addBtn: '新增',
    editSngl: '编辑',
    delSnglPoP: '删除',
    column: [
      {
        label: 'ID',
        prop: id,
        hide: true,
        editShow: true,
        maxlength: 50,
      },
      {
        label: '名称',
        prop: 'modelName',
        rules: [RULE.required],
        search: true,
        maxlength: 30,
      },
      {
        label: '模特头像',
        prop: 'modelPicPicture',
        viewProp: 'modelPicUrl',
        rules: [RULE.required],
        editType: 'img',
        belongRootId: '6',
      },
      {
        label: 'Height(cm)',
        prop: 'heightCm',
        rules: [RULE.oneDecimal],
      },
      {
        label: 'Bust(cm)',
        prop: 'bustCm',
        rules: [RULE.oneDecimal],
      },
      {
        label: 'Waist(cm)',
        prop: 'waistCm',
        rules: [RULE.oneDecimal],
      },
      {
        label: 'Hips(cm)',
        prop: 'hipsCm',
        rules: [RULE.oneDecimal],
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
    ],
  };
}

export const Dict = {};
