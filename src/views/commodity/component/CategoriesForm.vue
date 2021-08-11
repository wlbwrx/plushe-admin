<template>
  <el-dialog
    top="5vh"
    :title="title"
    :before-close="beforeClose"
    v-model="dialogVisible"
    destroy-on-close
    :close-on-click-modal="false"
    width="90%"
  >
    <el-form class="CategoriesForm" ref="editForm" :model="editForm" :rules="rules" label-width="120px">
      <el-form-item label="类目名称" prop="name">
        <el-input maxlength="30" v-model="editForm.name"></el-input>
      </el-form-item>
      <el-form-item label="类目编码" prop="categoryNo" v-if="editForm.levels == 3">
        <el-input maxlength="3" v-model="editForm.categoryNo" :disabled="!!editForm.id"></el-input>
      </el-form-item>
      <el-form-item label="类目级别" prop="levels">
        <el-select :disabled="!!editForm.id" v-model="editForm.levels" clearable placeholder="请选择">
          <el-option label="一级类目" :value="1"> </el-option>
          <el-option label="二级类目" :value="2"> </el-option>
          <el-option label="三级类目" :value="3"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="父级类目">
        <el-select
          :disabled="!!editForm.id"
          ref="select"
          v-model="editForm.parentId"
          clearable
          placeholder="请选择"
          no-data-text="先选择类目级别"
        >
          <el-option v-for="(item, index) in categoryList" :key="index" :label="item.label" :value="item.id"> </el-option
        ></el-select>
      </el-form-item>
      <el-form-item label="类目属性配置" v-if="editForm.levels == 3">
        <el-form-item
          v-for="(element, index) in editForm.categoryAttributes"
          :label="index < 3 ? `基础属性${index + 1}` : `附加属性${index - 2}`"
          :key="index"
          :prop="`categoryAttributes.${index}.attrId`"
          :rules="{
            required: index == 0,
            message: '请输入',
          }"
          class="attr-list"
        >
          <el-select ref="select" v-model="element.attrId" filterable clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in index < 3 ? basicAttribute : additiveAttribute"
              :key="index"
              :label="item.label"
              :value="item.id"
              :disabled="item.stauts != 1"
            >
            </el-option>
          </el-select>
          <div class="opt" v-if="index > 2">
            <i class="el-icon-remove-outline" @click="remove(index)"></i>
            <i class="el-icon-circle-plus-outline" @click="add"></i>
          </div>
        </el-form-item>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="beforeClose()">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { RULE } from '@utils/validators';
import { mapGetters } from 'vuex';

export default {
  props: ['categoriesDate', 'modelValue'],
  emits: ['update:modelValue', 'submit', 'update:categoriesDate'],
  data() {
    return {
      rules: {
        name: [RULE.required, RULE.lengthThirty],
        levels: [RULE.required],
        category: [RULE.required],
        attrId: [RULE.required],
        categoryNo: [RULE.required, { pattern: /^[A-Z]{3,3}/, message: `三位大写字母`, trigger: ['blur', 'change'] }],
      },
      editForm: {
        levels: '',
        parentId: '',
        categoryAttributes: [{}, {}, {}, {}],
        categoryStatus: 1,
      },
      title: '新增类目',
      dialogVisible: false,
    };
  },
  watch: {
    categoriesDate(val) {
      if (!val || Object.keys(val).length == 0) return;
      const { parentId, name, levels, id, categoryNo, attributes } = val;
      (attributes || []).forEach((element, index) => {
        if (element.attrType == 1) {
          this.editForm.categoryAttributes[index] = {
            attrId: element.id,
          };
        } else {
          this.editForm.categoryAttributes.push({
            attrId: element.id,
          });
        }
      });
      if (this.editForm.categoryAttributes.length > 4) {
        this.editForm.categoryAttributes = this.editForm.categoryAttributes.filter((_, i) => i != 3);
      }
      this.editForm = { ...this.editForm, id, parentId, name, levels, categoryNo };
    },
    modelValue(val) {
      this.title = val == 1 ? '新增' : '编辑';
      this.$nextTick(() => {
        this.dialogVisible = val != 0;
      });
    },
    'editForm.levels'(newVal, oldVal) {
      if (oldVal) {
        this.editForm.parentId = undefined;
      }
      if (newVal == 3) {
        this.$store.dispatch('getAttribute');
      }
    },
    'editForm.parentId'(newVal, oldVal) {
      if (oldVal && newVal) {
        console.log(111);
      }
    },
  },
  computed: {
    ...mapGetters(['productCategoryList', 'Attribute']),
    categoryList() {
      const { levels } = this.editForm;
      return this.productCategoryList.filter(item => item.levels == levels - 1 && item.categoryStatus == 1);
    },
    basicAttribute() {
      return this.Attribute.filter(item => item.attrType == 1);
    },
    additiveAttribute() {
      return this.Attribute.filter(item => item.attrType == 2);
    },
  },
  components: {},
  methods: {
    beforeClose() {
      this.editForm = { categoryAttributes: [{}, {}, {}, {}] };
      this.$emit('update:modelValue', 0);
      this.$emit('update:categoriesDate', false);
    },
    submit() {
      const { levels, parentId, categoryAttributes, id } = this.editForm;
      if (levels != 1 && !parentId) return this.$message.warning('请选择父级类目');
      if (
        new Set(categoryAttributes.filter(item => item.attrId).map(item => item.attrId)).size !==
        categoryAttributes.filter(item => item.attrId).length
      ) {
        return this.$message.warning('类目属性重复');
      }

      this.$refs['editForm'].validate(valid => {
        if (!valid) {
          // this.$message.warning('类目有必填项');
          return;
        }
        this.$emit(
          'submit',
          {
            ...this.editForm,
            categoryAttributes: categoryAttributes.filter(item => item.attrId).map(item => ({ ...item, categoryId: id })),
          },
          this.beforeClose
        );
      });
    },
    add() {
      this.editForm.categoryAttributes.push({});
    },
    remove(index) {
      if (this.editForm.categoryAttributes.length == 4) return this.$message.warning('至少保留一项附加属性');
      this.editForm.categoryAttributes = this.editForm.categoryAttributes.filter((_, i) => i != index);
    },
  },
};
</script>
<style lang="scss" scoped>
.opt {
  display: inline-flex;
  margin-left: 10px;
  width: 100px;
  i {
    flex: 1;
    text-align: center;
    padding: 10px 0;
  }
}
.attr-list {
  margin-bottom: 20px;
}
</style>
