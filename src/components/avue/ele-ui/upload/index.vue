<template>
  <div class="uploadWrapper">
    <vuedraggable class="vue-draggable" @start="onDragStart" item-key="uid" :animation="100" @end="onDragEnd" tag="ul" :list="fieldValue">
      <template #item="{ element , index }">
        <li class="draggable-item">
          <el-image :src="element.picUrl" :preview-src-list="[element.picUrl]"></el-image>
          <div class="shadow" @click="onRemoveHandler(index)">
            <i class="el-icon-delete"></i>
          </div>
        </li>
      </template>
      <template #footer>
        <el-upload
          ref="uploadRef"
          class="upload"
          action=""
          :multiple="multiple"
          :limit="limit"
          :accept="accept"
          :drag="drag"
          :show-file-list="showFileList"
          :on-success="onSuccess"
          :on-error="onError"
          :on-exceed="onExceed"
          :before-upload="beforeUpload"
          :http-request="httpRequest"
        >
          <a class="el-icon-plus"> <span class="uploading" v-show="isUploading">正在上传{{isUploading}}..</span></a>
        </el-upload>
      </template>
    </vuedraggable>
  </div>
</template>

<script>
import create from '../../core/create';
import customHttpRequest from '../../core/httpRequest';
import vuedraggable from 'vuedraggable';
// import { cloneDeep } from 'lodash';

export default create({
  name: 'Upload',
  data() {
    return {
      typeStr: 'product', // 商品属性值product_img，属性值图片attr_val_img
      limit: 3,
      multiple: true,
      autoUpload: true,
      fieldValue: [],
      accept: 'image/jpeg,image/jpg,image/png',
      drag: true,
      showFileList: false,
      sizeLimit: 0,
      isFirstMount: true,
      isUploading: 0,
    };
  },
  components: {
    vuedraggable,
  },
  props: ['modelValue'],
  watch: {},
  methods: {
    onSuccess(response, file, fileListEx) {
      console.log('onSuccess', {...response});
      // this.fieldValue.push(response);
      // this.isUploading--;
    },
    onDragStart(e) {
      e.target.classList.add('hideShadow');
    },
    onDragEnd(e) {
      e.target.classList.remove('hideShadow');
    },
    httpRequest(option) {
      const { file } = option;
      return customHttpRequest(this.typeStr, file).then(response => {
        this.fieldValue.push(response);
        this.isUploading--;
        return response;
      });
    },
    syncElUpload(val) {
      const imgList = val || this.fieldValue || [];
      this.$refs.uploadRef.uploadFiles = imgList.map((v, i) => {
        return {
          name: 'pic' + i,
          picUrl: v.url,
          status: 'success',
          uid: v.uid || i++,
        };
      });
      this.isFirstMount = false;
      this.$emit('update:modelValue', this.fieldValue);
    },
    onExceed() {
      this.$message.warning('数量超限请先删除后再上传');
    },
    onRemoveHandler(index) {
      this.$confirm('确定删除该图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.fieldValue = this.fieldValue.filter((v, i) => {
            return i !== index;
          });
        })
        .catch(() => {});
    },
    beforeUpload(file) {
      console.log('beforeUpload', file);
      if (this.sizeLimit !== 0 && file.size > this.sizeLimit) {
        this.$message.error(`大小限制为${this.sizeLimit / 1024 / 1024}M`);
        return false;
      }
      if (this.accept && !new RegExp(this.accept.replace(/,/g, '|')).test(file.type)) {
        this.$message.error(`只能上传${this.accept}格式`);
        return false;
      }
      this.isUploading++;
    },
    onError(err, file, fileListEx) {
      this.$message.error(err);
    },
  },
});
</script>
<style scoped lang="scss">
.upload {
  width: 80px;
  height: 80px;
  display: inline-block;
  :deep() {
    .el-upload-dragger {
      width: 80px;
      height: 80px;
    }
  }
}
.el-icon-plus {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fbfdff;
  font-size: 20px;
  color: #999;

  .limitTxt,
  .uploading {
    position: absolute;
    bottom: 10%;
    left: 0;
    width: 100%;
    font-size: 14px;
    text-align: center;
  }
}

// 拖拽
.vue-draggable {
  display: inline-flex;
  flex-wrap: wrap;

  .draggable-item {
    width: 80px;
    height: 80px;
    margin-right: 8px;
    margin-bottom: 5px;
    border: 1px solid #ddd;
    border-radius: 6px;
    position: relative;
    overflow: hidden;

    .el-image {
      width: 80px;
      height: 80px;
    }
    .shadow {
      position: absolute;
      top: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 0.3s;
      color: #fff;
      font-size: 20px;
      line-height: 20px;
      padding: 2px;
      cursor: pointer;
    }
    &:hover {
      .shadow {
        opacity: 1;
      }
    }
  }
  &.hideShadow {
    .shadow {
      display: none;
    }
  }
  &.single {
    overflow: hidden;
    position: relative;

    .draggable-item {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
  }
  &.maxHidden {
    .uploadBox {
      display: none;
    }
  }
}
// el-image
.el-image-viewer__wrapper {
  .el-image-viewer__mask {
    opacity: 0.8;
  }
  .el-icon-circle-close {
    color: #fff;
  }
}
</style>
