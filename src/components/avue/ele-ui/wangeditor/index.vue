<template>
  <div class="" ref="editor"></div>
</template>

<script>
import create from '../../core/create';
import WangEditor from 'wangeditor';
import { onMounted, onBeforeUnmount, ref, toRefs, watch } from 'vue';

export default create({
  name: 'Wangeditor',
  data() {
    return {
      disable: false,
      content: '',
      options: {},
    };
  },
  components: {
    // vWangeditor,
  },
  emits: ['update:modelValue', 'commonHandle'], // vue3 modelValue warning
  inheritAttrs: false,
  props: ['modelValue', 'formItem'],
  setup(props, context) {
    const { modelValue, formItem } = toRefs(props);
    const editor = ref();
    let instance;
    onMounted(() => {
      instance = new WangEditor(editor.value);
      Object.assign(instance.config, {
        onchange() {
          if (instance.txt.html() === modelValue.value) return;
          context.emit('update:modelValue', instance.txt.html(), formItem.key);
        },
      });
      instance.create();
    });
    watch(
      modelValue,
      (newProps, oldProps) => {
        setTimeout(() => {
          instance.txt.html(newProps);
        }, 0);
      },
      { immediate: true }
    );
    onBeforeUnmount(() => {
      instance.destroy();
      instance = null;
    });
    return {
      editor,
    };
  },
  methods: {
    change(val) {
      console.log(111, val);
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
