<template>
  <el-dialog
    top="5vh"
    :title="`${status == 1 ? '新增' : '编辑'}专题`"
    :before-close="beforeClose"
    destroy-on-close
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    v-model="dialogVisible"
    width="80%"
  >
    <el-form ref="editForm" :model="editForm" :rules="rules" label-width="120px" :style="{ width: '90%' }">
      <el-form-item label="专题名称" prop="name">
        <el-input maxlength="60" clearable v-model="editForm.name"></el-input>
      </el-form-item>
      <el-form-item label="H5列表顶图" prop="listPicH5Picture">
        <BaseSelectImg v-model="editForm.listPicH5Picture" :formItem="{ limit: 1, belongRootId: 6 }" />
      </el-form-item>
      <el-form-item label="PC列表顶图" prop="listPicPcPicture">
        <BaseSelectImg v-model="editForm.listPicPcPicture" :formItem="{ limit: 1, belongRootId: 6 }" />
      </el-form-item>
      <el-form-item label="关联类型" prop="relationType">
        <el-select v-model="editForm.relationType" placeholder="请选择" clearable>
          <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in relationTypeArr"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="editForm.relationType !== 1" label="所属类目" prop="categoryId">
        <el-cascader
          clearable
          :show-all-levels="false"
          :options="categoryNewList"
          v-model="editForm.categoryId"
          :props="{ value: 'id', checkStrictly: true }"
        ></el-cascader>
      </el-form-item>
      <el-form-item v-if="editForm.relationType == 3" label="附加属性" prop="attrValId">
        <el-cascader
          :show-all-levels="false"
          clearable
          :options="attachedProperty"
          v-model="editForm.attrValId"
          :props="props"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="beforeClose">取 消</el-button>
        <el-button type="primary" @click="submit(true)">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { RULE } from '@utils/validators';
// import { http } from '../const/TopicConfig';
import request from '@/utils/request';
import { transitionTreeArray } from '@utils/index';
import { mapGetters } from 'vuex';
// import { imageHandler } from '@/utils/index';

export default {
  props: ['currentRow', 'status'],
  emits: ['update:status', 'submit'],
  data() {
    return {
      props: {
        lazy: true,
        multiple: true,
        value: 'id',
        lazyLoad(node, resolve) {
          const { id } = node.data;
          if (!id) return;
          request.get('/attribute/getAttrVals', { attrId: id }).then((res) => {
            resolve((res || []).map((item) => ({ id: item.id, label: item.val, leaf: true })));
          });
        },
      },
      relationTypeArr: [
        { value: 1, label: '关联商品' },
        { value: 2, label: '关联类目' },
        { value: 3, label: '关联附加属性' },
      ],
      originList: [],
      categoryNo: '',
      rules: {
        name: [RULE.required],
        relationType: [RULE.requiredT],
      },
      editForm: {
        name: '',
        listPicH5Picture: [],
        listPicPcPicture: [],
        relationType: 1,
        attrVals: [],
        category: {},
        categoryId: [],
        attrValId: [],
      },
      dialogVisible: false,
      // 产品标签相关
      tags: {
        list: [],
        visible: false,
        inputValue: '',
      },
      initialize: true,
    };
  },
  watch: {
    // 回显参数处理
    currentRow(val) {
      if (!val) {
        this.initialize = false;
        return;
      }
      const { category, attrVals } = val;
      this.editForm = {
        ...val,
        categoryId: category && category.id ? category.id : '',
        attrVals: [],
        attrValId:
          attrVals && attrVals.length
            ? attrVals.map((item) => {
                return [item.attrId, item.attrValId];
              })
            : [],
      };
    },
    status(val) {
      if (val) {
        // this.$store.dispatch('getProductCategoryList');
      }
    },
  },
  computed: {
    ...mapGetters(['productCategoryList', 'attachedProperty']),
    categoryNewList() {
      return transitionTreeArray(this.$store.getters.productCategoryList.filter((item) => item.levels != 0));
    },
  },
  methods: {
    handleClose(tag) {
      this.tags.list = this.tags.list.filter((item) => item != tag);
    },
    handleInputConfirm() {
      this.tags.visible = false;
      const vals = this.tags.inputValue.split(',');
      vals.forEach((tag) => {
        if (tag && tag.trim() != '') this.tags.list.push(tag);
      });
      this.tags.inputValue = '';
    },
    showInput() {
      this.tags.visible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    showDialog(isShow) {
      this.dialogVisible = isShow;
    },
    beforeClose(fun) {
      this.dialogVisible = false;
      this.initialize = true;
      this.editForm = {
        name: '',
        listPicH5Picture: [],
        listPicPcPicture: [],
        relationType: 1,
        attrVals: [],
        category: {},
        primary: [],
        secondary: [],
        // costShowType: 1,
        materialsCost: '',
        hardwareCost: 1.5,
        laborCost: 14.57,
        dutiesCost: 6.59,
        ransportCost: 0.64,
        traditionalRetailPrice: '',
        transportCost: '',
        picValue: '',
        dpaPicUrl: '',
        productModels: [{ desc: '', picKey: '', picUrl: '', pic: '' }],
      };
      this.tags = {
        list: [],
        visible: false,
        inputValue: '',
      };
      this.originList = [];
      this.$emit('update:status', 0);
      // if (fun) fun();
    },
    submit() {
      const { name, listPicH5Picture, listPicPcPicture, relationType, categoryId, attrValId } = this.editForm;
      let categoryObj = {};
      let attrValsList = [];
      if (attrValId && attrValId.length) {
        attrValsList = attrValId.map((item) => {
          return {
            attrId: item[0],
            attrValId: item[1],
          };
        });
      }
      if (categoryId) {
        if (Array.isArray(categoryId)) {
          categoryId.map((item, index) => {
            categoryObj = { id: item, level: index + 1 };
          });
        } else {
          categoryObj = { id: categoryId, level: null };
        }
      }
      let errStr = '';
      if (relationType == 2 && !categoryObj.id) errStr = '请选择关联类目';
      if (relationType == 3 && (!attrValsList || attrValsList.length == 0)) errStr = '请选择关联属性';
      if (errStr) return this.$message.warning(errStr);
      this.$refs['editForm'].validate((valid) => {
        if (!valid) return;
        const param = {
          name,
          relationType,
          listPicH5: listPicH5Picture && listPicH5Picture.length ? listPicH5Picture[0].picKey : '',
          listPicPc: listPicPcPicture && listPicPcPicture.length ? listPicPcPicture[0].picKey : '',
        };
        if (relationType === 2) {
          param['category'] = categoryObj;
        } else if (relationType === 3) {
          if (categoryId) param['category'] = categoryObj;
          param['attrVals'] = attrValsList;
        }
        this.$emit('submit', param, this.beforeClose);
      });
    },
    // 新增模特
    addModel() {
      this.editForm.productModels.push({ desc: '', picKey: '', pic: '' });
    },
  },
};
</script>
<style lang="scss" scoped>
.pic-title-wrap {
  width: 100%;
  display: flex;
}
.pic-title-list {
  margin-bottom: 20px;
  display: flex;
  .list {
    width: 80px;
    margin-right: 8px;
  }
}
.el-tag {
  margin-right: 10px;
}
</style>
