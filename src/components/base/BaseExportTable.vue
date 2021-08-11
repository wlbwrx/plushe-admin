<template>
  <el-dialog top="5vh" title="导入数据" v-model="exportVisibility" width="80%">
    <div class="base-export-table">
      <el-row type="flex" justify="space-between">
        <p>
          导入成功{{ succeedList.length }}条,失败<span style="color: red;">{{ failList.length }}</span
          >条
        </p>
        <div>
          <el-check-tag :checked="checked == 'succeed'" @change="checked = 'succeed'" style="margin-right: 20px;">成功</el-check-tag>
          <el-check-tag :checked="checked == 'fail'" @change="checked = 'fail'">失败</el-check-tag>
        </div>
      </el-row>
      <avue-crud :option="option" :table-data="checked == 'fail' ? failList : succeedList"> </avue-crud>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="beforeClose">取 消</el-button>
        <el-button type="primary" v-loading="loading" :disabled="failList.length != 0" @click="submit">上传成功数据</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import crud from '@/mixins/crud';

export default {
  name: 'BaseExportTable',
  emits: ['update:modelValue', 'submit'],
  props: ['modelValue'],
  mixins: [crud],
  data() {
    return {
      exportVisibility: false,
      isShowFirst: false,
      title: [],
      dataOrgin: [],
      checked: 'fail',
      loading: false,
    };
  },
  computed: {
    succeedList() {
      if (this.dataOrgin.length == 0) return [];
      const length = Object.keys(this.dataOrgin[0]).length;
      return this.dataOrgin.filter(item => !item[length - 1]);
    },
    failList() {
      if (this.dataOrgin.length == 0) return [];
      const length = Object.keys(this.dataOrgin[0]).length;
      return this.dataOrgin.filter(item => item[length - 1]);
    },
    option() {
      return {
        pageHide: true,
        tableIndex: true,
        column: this.title.map((item, index) => ({ label: item, prop: String(index), minWidth: index == this.title.length - 1 ? 300 : undefined })),
      };
    },
  },
  created() {},
  watch: {
    modelValue(val) {
      this.exportVisibility = !!val;
      if (val) {
        this.title = val[0].map(item => item);
        this.dataOrgin = val.filter((_, index) => index !== 0).map(item => item);
        if (!this.dataOrgin.some(item => !!item[this.title.length - 1])) {
          this.checked = 'succeed';
        }
      }
    },
  },
  methods: {
    beforeClose() {
      this.loading = false;
      this.$emit('update:modelValue', false);
    },
    submit() {
      this.loading = true;
      this.$emit('submit', [this.title, ...this.succeedList], this.beforeClose);
    },
  },
};
</script>
<style scoped lang="scss">
.base-export-table {
  height: 540px;
}
</style>
