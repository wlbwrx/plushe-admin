<template>
  <el-dialog
    top="5vh"
    :title="`链接创建商品`"
    :before-close="beforeClose"
    destroy-on-close
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    v-model="dialogVisible"
    width="80%"
  >
    <el-form ref="editForm" :model="editForm" :rules="rules" label-width="120px" :style="{ width: '90%' }">
      <el-form-item label="所属品牌" prop="brand">
        <el-select v-model="editForm.brand" placeholder="请选择">
          <el-option :label="item" :value="index" :key="index" v-for="(item, index) in brandsList"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属类目" prop="category">
        <el-cascader :show-all-levels="false" :options="categoryList" v-model="editForm.category" :props="{ value: 'id' }"></el-cascader>
      </el-form-item>

      <el-form-item label="1688链接" prop="productUrls">
        <el-input type="textarea" v-model="editForm.productUrls"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="beforeClose">取 消</el-button>
        <!-- <el-button @click="submit()">存草稿</el-button> -->
        <el-button type="primary" @click="submit(true)">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { RULE } from '@utils/validators';
import { transitionTreeArray } from '@utils/index';
import { mapGetters } from 'vuex';

export default {
  props: ['currentRow', 'status'],
  emits: ['update:status', 'submit'],
  data() {
    return {
      rules: {
        category: [RULE.required],
        brand: [RULE.required],
        productUrls: [RULE.required],
      },
      editForm: {},
      dialogVisible: false,
    };
  },
  watch: {
    status(val) {
      if (val) {
        this.$store.dispatch('getProductCategoryList');
      }
      this.dialogVisible = Boolean(val);
    },
  },
  computed: {
    ...mapGetters(['brandsList']),
    categoryList() {
      const arr = transitionTreeArray(
        this.$store.getters.productCategoryList
          .map(item => ({
            ...item,
            disabled: item.categoryStatus != 1,
          }))
          .filter(item => item.levels != 0)
      );
      return arr.filter(item => {
        if (item.children) {
          item.children = item.children.filter(item => item.children);
          return item.children.length != 0;
        }
      });
    },
  },
  methods: {
    beforeClose(fun) {
      this.editForm = {};
      this.tags = {
        list: [],
        visible: false,
        inputValue: '',
      };
      this.$emit('update:status', 0);
    },
    submit() {
      this.$refs['editForm'].validate(valid => {
        if (!valid) return;
        const { category, brand, productUrls } = this.editForm;
        const obj = {
          brand,
          productCateOne: category[0],
          productCateTwo: category[1],
          productCateThree: category[2],
          productUrls: productUrls.split('\n').filter(item => item != null && item != '' && !item.indexOf('http')),
          attrLanguage: 'jp',
        };
        this.$emit('submit', obj, this.beforeClose);
      });
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
