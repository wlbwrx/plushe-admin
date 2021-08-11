<template>
  <template v-if="dialogVisible">
    <el-dialog
      :title="`${modelValue == 2 ? '编辑' : '新增'}属性`"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-model="dialogVisible"
      top="5vh"
      width="70%"
    >
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="120px">
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="editForm.name" maxlength="30" />
        </el-form-item>
        <el-form-item label="属性排序" prop="sort">
          <el-input-number v-model="editForm.sort" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="属性类型" prop="attrType">
          <el-select :disabled="!!editForm.id" v-model="editForm.attrType" placeholder="请选择">
            <el-option label="基础属性" :value="1" />
            <el-option label="附加属性" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示样式" prop="showStyle">
          <el-select v-model="editForm.showStyle" placeholder="请选择">
            <el-option label="文字" :value="1" />
            <el-option label="图片" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否分组">
          <el-select v-model="editForm.group" placeholder="请选择">
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item :class="{ hidden: !editForm.group }">
          <BaseAttributeEdit ref="BaseAttributeEdit" v-model="categoriesValList" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="beforeClose">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </template>
</template>

<script>
import { RULE } from '@utils/validators';
import { transitionTreeArray } from '@utils/index';
import BaseAttributeEdit from '@components/base/BaseAttributeEdit';

export default {
  props: ['modelValue', 'attributeDate'],
  setup() {},
  emits: ['submit', 'update:modelValue'],
  data() {
    return {
      rules: {
        name: [RULE.required],
        attrType: [RULE.required],
        showStyle: [RULE.required],
        // sort: [RULE.required],
      },
      editForm: {
        // group: true,
        sort: 999,
        // showStyle: 1,
        // attrType: '1',
        attrStatus: '1',
      },
      categoriesValList: [],
      dialogVisible: false,
    };
  },
  watch: {
    modelValue(val) {
      this.dialogVisible = val != 0;
    },
    attributeDate(val) {
      if (!val) {
        return;
      }
      const { vals, sort } = val;
      this.editForm = {
        ...val,
        sort: Number(sort),
      };
      this.categoriesValList = vals;
    },
    'editForm.group'(val, old) {
      if (old === undefined || val === undefined) return;
      setTimeout(() => {
        const vals = this.$refs.BaseAttributeEdit.submit();
        if (!val && vals.length > 1) {
          this.$message.warning('提交时将会清空其他属性值与属性分组,请确认');
        }
      }, 0);
    },
  },
  computed: {
    categoryList() {
      return transitionTreeArray(this.$store.getters.productCategoryList.filter(item => item.levels != 0));
    },
  },
  methods: {
    beforeClose() {
      this.editForm = {
        attrStatus: '1',
        sort: 999,
      };
      this.categoriesValList = [];
      this.$emit('update:modelValue', 0);
    },
    submit() {
      const { group, showStyle } = this.editForm;
      this.$refs['editForm'].validate(valid => {
        if (!valid) return;
        if (!this.$refs.BaseAttributeEdit.verify()) return;
        let vals = this.$refs.BaseAttributeEdit.submit();
        console.log('vals', vals);
        const groupName = vals.find(item => !item.groupName);
        const noPicKey = vals.find(item => !item.picKey);
        const picKey = vals.find(item => item.picKey);
        console.log('groupName', groupName);
        if (group && groupName) return this.$message.warning(`请填写第${groupName.groupIndex}列属性分组名`);
        if (showStyle == 2 && noPicKey) return this.$message.warning(`图片模式, 第${noPicKey.groupIndex}组下第${noPicKey.i}列应有图片`);
        if (showStyle == 1 && picKey) return this.$message.warning(`文字模式, 第${picKey.groupIndex}组下第${picKey.i}列应去掉图片`);
        if (!group) {
          vals = vals
            .filter(item => item.active == item.groupIndex)
            .map(item => ({
              ...item,
              groupName: '',
            }));
        }
        this.$emit(
          'submit',
          {
            ...this.editForm,
            vals,
          },
          this.beforeClose
        );
      });
    },
  },
  components: {
    BaseAttributeEdit,
  },
};
</script>

<style lang="scss" scoped>
.hidden {
  :deep() {
    .group-list,
    .save-btn {
      visibility: hidden;
    }
  }
}
</style>
