<template>
  <div class="sel_img">
    <template v-if="fileList.length != 0">
      <vuedraggable :list="fileList" :animation="100" item-key="picKey" tag="ul" @start="onDragStart" @end="onDragEnd">
        <template #item="{ element, index }">
          <li class="draggable-item">
            <el-image :src="element.picUrl" :preview-src-list="[previewSrc(element.picUrl)]"></el-image>
            <div class="shadow" @click="onRemoveHandler(index)">
              <i class="el-icon-delete"></i>
            </div>
          </li>
        </template>
      </vuedraggable>
    </template>
    <div class="plus_box" @click="selVisibility = true">
      <span class="el-icon-plus"></span>
    </div>
    <el-dialog top="5vh" title="选择图片" v-model="selVisibility" :close-on-press-escape="false" width="90%">
      <BaseImageSpace ref="imageSpace" :belongRootId="formItem.belongRootId" :limit="formItem.limit" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="selVisibility = false">取 消</el-button>
          <el-button type="primary" @click="submit">选择</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// import crud from '@/mixins/crud';
import { Base64 } from 'js-base64';
import BaseImageSpace from '@components/base/BaseImageSpace';
import vuedraggable from 'vuedraggable';

export default {
  name: 'BaseSelectImg',
  emits: ['update:modelValue'],
  props: {
    modelValue: {},
    formItem: {
      type: Object,
      default: () => ({
        limit: 1,
      }),
    },
  },
  // mixins: [crud],
  data() {
    return {
      selVisibility: false,
      fileList: [],
    };
  },
  computed: {},
  created() {},
  watch: {
    modelValue: {
      handler(val) {
        // console.log('modelValue', val);
        if (val && val.length) {
          this.fileList = val;
        } else if (val === undefined) {
          this.fileList = [];
        }
      },
      immediate: true,
    },
    selVisibility(val) {
      if (val === false) {
        this.$refs.imageSpace.toggleRowSelection([]);
      }
    },
  },
  methods: {
    beforeClose() {},
    submit() {
      const { limit = 1 } = this.formItem;
      const { selectionList } = this.$refs.imageSpace;
      if (selectionList.some((item) => item.type == 1)) return this.$message.warning('请不要选中文件夹');
      if (selectionList.length == 0) return this.$message.warning('最少选中一张图片');
      if (this.fileList.length + selectionList.length > limit) {
        return this.$message.warning(`限制${limit}张,已有${this.fileList.length}张,新增${selectionList.length}张`);
      }
      this.fileList = this.fileList.concat(selectionList);
      this.selVisibility = false;
      this.$emit('change');
      this.$emit(
        'update:modelValue',
        this.fileList.map((item) => ({
          picKey: item.picKey,
          picUrl: item.picUrl,
        }))
      );
    },
    onDragStart(e) {
      e.target.classList.add('hideShadow');
    },
    onDragEnd(e) {
      e.target.classList.remove('hideShadow');
    },
    onRemoveHandler(index) {
      this.$confirm('确定删除该图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.fileList = this.fileList.filter((v, i) => {
            return i !== index;
          });
          this.$emit('update:modelValue', this.fileList.length ? this.fileList : undefined);
        })
        .catch(() => {
          console.log('catch', index);
        });
    },
    previewSrc(val) {
      const str = 'https://img.plushe.com/';
      if (!val || !val.includes(str)) return;
      const obj = JSON.parse(Base64.decode(val.split(str)[1]));
      delete obj.edits.resize.width;
      delete obj.edits.resize.height;
      const newStr = `${str}${Base64.encode(JSON.stringify(obj))}`;
      return newStr;
    },
  },
  components: {
    BaseImageSpace,
    vuedraggable,
  },
};
</script>
<style scoped lang="scss">
.sel_img {
  display: inline-flex;
  min-width: 180px;
  :deep() {
    .el-dialog__body {
      display: flex;
    }

    .avue-crud {
      height: 69vh;
    }
    .image-space {
      flex: 1;
    }
  }
  .hideShadow {
    .shadow {
      display: none;
    }
  }
  .draggable-item {
    display: inline-block;
    margin-right: 10px;
    position: relative;
    height: 80px;
  }
  .el-image {
    width: 80px;
    height: 80px;
  }
  .shadow {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 14px;
    padding: 4px;
  }
  .plus_box {
    width: 80px;
    height: 80px;
    min-width: 80px;
    text-align: center;
    cursor: pointer;
    line-height: 80px;
    border: 1px dashed #d9d9d9;
  }
}
</style>
