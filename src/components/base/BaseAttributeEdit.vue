<template>
  <el-row type="flex" class="base-attribute-edit">
    <div class="batchFill">
      <p>批量选择</p>
      <BaseSelectImg v-model="batchList" :formItem="{ limit: categoriesList[active].list.length, belongRootId: 1 }" />
    </div>
    <div class="group-list" :style="{ background: '#f7f7f7', width: '255px' }">
      <el-row type="flex" justify="space-around">分组列表</el-row>
      <vuedraggable :list="categoriesList" item-key="id" @end="onDragEnd">
        <template #item="{ element , index }">
          <el-row
            width="100%"
            type="flex"
            justify="space-around"
            :style="{ margin: '10px 0' }"
            @click="cutActive(index)"
            :class="{ active: active == index }"
          >
            <el-input v-model="element.groupName" maxlength="30" :style="{ width: '100px' }" placeholder="分组名"></el-input>
            <div>
              <span class="del" @click.stop="del(index)" v-if="categoryStatus != 0 || !element.id">删除</span>
            </div>
          </el-row>
        </template>
      </vuedraggable>
      <el-row type="flex" justify="space-around"><el-button @click="save">新增分组名</el-button></el-row>
    </div>
    <div v-show="categoriesList.length">
      <el-form :model="categoriesList[active]" label-width="80px">
        <el-form-item label="属性值">
          <vuedraggable :list="categoriesList[active].list" item-key="id">
            <template #item="{ element , index }">
              <el-row type="flex" :class="{ isDeleted: !!element.isDeleted, arrt_item: true }">
                <div>
                  <el-input maxlength="30" v-model="element.val" placeholder="属性值" @focus.stop=""></el-input>
                </div>
                <div style="width: 200px;margin-left:10px;">
                  <BaseSelectImg v-model="element.files" :formItem="{ limit: 1, belongRootId: 1 }" />
                </div>
                <div>
                  <i class="el-icon-remove-outline" @click="remove(index)"></i>
                </div>
                <div>
                  <i class="el-icon-circle-plus-outline" @click="add"></i>
                </div>
              </el-row>
            </template>
          </vuedraggable>
            <el-button class="save-btn" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-row>
</template>

<script>
// import { RULE } from '@utils/validators';
import { http } from '@views/commodity/const/categories';
// import { http as attributeHTTP } from '@views/commodity/const/attribute';
import { cloneDeep } from 'lodash';
import { imageHandler } from '@/utils/index';
import vuedraggable from 'vuedraggable';

export default {
  name: 'BaseAttributeEdit',
  props: ['modelValue', 'categoryStatus'],
  emits: ['update:modelValue'],
  data() {
    return {
      formItem: {
        limit: 1,
        accept: 'image/*',
        typeStr: 'attrval',
        sizeLimit: 3 * 1024 * 1024,
      },
      ruleForm: {},
      rules: {},
      categoriesList: [
        {
          list: [{}],
        },
      ],
      active: 0,
      batchList: [],
    };
  },
  computed: {},
  components: {
    vuedraggable,
  },
  created() {},
  mounted() {},
  watch: {
    modelValue: {
      handler(val) {
        if (!val[0]) {
          return;
        }
        val = val.map(item => ({
          ...item,
          files: item.picKey ? [{ picKey: item.picKey, picUrl: imageHandler(0, item.picKey) }] : [],
        }));
        if (!val[0].groupName) {
          this.categoriesList = [
            {
              groupName: '',
              list: cloneDeep(val),
            },
          ];
          return;
        }
        const obj = {};
        this.categoriesList = [];
        val.forEach(item => {
          obj[item.groupName] = obj[item.groupName] || [];
          obj[item.groupName].push({ ...item });
          if (obj[item.groupName].length == 1) {
            this.categoriesList.push({
              groupName: item.groupName,
              list: obj[item.groupName],
            });
          }
        });
      },
      immediate: true,
    },
    batchList: {
      handler(val) {
        if (!val || !val.length) return;
        let a = 0;
        this.categoriesList[this.active].list.forEach((item, i, arr) => {
          if (val.length == a) return;
          if (!item.files || !item.files[0]) {
            console.log('val[i - a]', a, i, val[a]);
            arr[i] = {
              ...arr[i],
              files: val[a].picKeyPicture,
            };
            a++;
          }
        });
        this.$nextTick(_ => {
          this.batchList = undefined;
        });
      },
      immediate: true,
    },
  },
  methods: {
    cutActive(i) {
      this.active = i;
    },
    save() {
      const { list, groupName } = this.categoriesList[this.active];
      const found = list.findIndex(item => !item.val);
      if (found != -1) {
        return this.$message.warning(`第${found + 1}项属性值未填写`);
      }
      if (!groupName) {
        return this.$message.warning(`分组名未填写`);
      }
      this.categoriesList.push({
        list: [{}],
      });
      this.cutActive(this.categoriesList.length - 1);
    },
    add() {
      this.categoriesList[this.active].list.push({});
    },
    remove(index) {
      if (this.categoriesList[this.active].list.filter(item => !item.isDeleted).length === 1) return this.$message.warning('至少保留一项');
      const { id, val } = this.categoriesList[this.active].list[index];
      if (!id) return this.categoriesList[this.active].list.splice(index, 1);
      this.$confirm(`确认删除该属性的${val}属性值吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(_ => {
        this.$message.warning('保存属性时删除');
        this.categoriesList[this.active].list[index].isDeleted = true;
      });
    },
    del(index) {
      if (this.categoriesList.length === 1) return this.$message.warning('至少保留一项');
      const { groupName } = this.categoriesList[index];
      this.$confirm(`确认删除分组${groupName || ''}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(_ => {
        this.categoriesList = this.categoriesList.filter((item, i) => i != index);
        if (this.active == this.categoriesList.length) {
          this.active = this.active - 1;
        }
      });
    },
    cutStatus() {
      const { id, attrStatus } = this.categoriesList[this.active];
      const list = cloneDeep(this.modelValue);
      const obj = list.filter(item => item.id == id)[0];
      if (attrStatus == 1 && obj.attrType == 1 && this.modelValue.filter(item => item.attrType == 1 && item.attrStatus == 1).length < 2) {
        return this.$message.warning('至少存在一个启用的基础属性');
      }
      http
        .updateProductAttrCombined({
          id,
          attrStatus: attrStatus == 1 ? 0 : 1,
        })
        .then(_ => {
          this.$message.success('操作成功');
          this.categoriesList[this.active].attrStatus = attrStatus == 1 ? 0 : 1;
          obj.attrStatus = attrStatus == 1 ? 0 : 1;
          this.$emit('update:modelValue', list);
        });
    },
    verify() {
      try {
        let errStr = '';
        // let isOne = false; // 判断至少启用一个基础属性
        const length = this.categoriesList.length;
        const categoriesSort = Array.from(new Array(length + 1).keys()).slice(1);
        this.categoriesList.some(element => {
          const { sorts, groupName, list } = element;
          if (!isNaN(sorts)) categoriesSort[sorts - 1] = false;
          // let filesLength = 0;
          const copyList = cloneDeep(list.filter(item => !item.isDeleted));
          if (copyList.length == 0) errStr = `${groupName}至少存在一个属性值`;
          const arr = Array.from(new Array(copyList.length + 1).keys()).slice(1);
          if (new Set(copyList.map(item => item.val)).size !== copyList.length) errStr = `属性值名称不能重复`;
          copyList.reduce((total, item, index) => {
            if (!isNaN(item.sorts)) arr[item.sorts - 1] = false;
            if (!item.val) errStr = `请填写第${index + 1}项属性值`;
            // if (item.files && item.files.length) {
            //   filesLength += 1;
            // }
            return item;
          }, {});
          // if (filesLength !== 0 && copyList.length !== filesLength) errStr = '属性值图片必须同时存在或不存在';
          if (errStr) return true;
        });
        if (!errStr) {
          if (new Set(this.categoriesList.map(item => item.groupName)).size !== length) errStr = `分组名称不能重复`;
        }
        if (errStr) {
          this.$message.error(errStr);
        } else {
          return true;
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    submit() {
      const arr = [];
      cloneDeep(this.categoriesList).map((item, index) => {
        item.list
          .filter(item => !item.isDeleted)
          .forEach((element, i) => {
            arr.push({
              ...element,
              groupName: item.groupName,
              sort: arr.length,
              picKey: element.files && element.files[0] ? element.files[0].picKey : '',
              groupIndex: index + 1,
              active: this.active + 1,
              i: i + 1,
            });
          });
      });
      return arr;
    },
    onDragEnd(e) {
      // console.log(111, e);
      const { newIndex } = e;
      this.active = newIndex;
    },
  },
};
</script>
<style scoped lang="scss">
.base-attribute-edit {
  :deep() {
    .el-input {
      width: auto;
    }
  }
  .isDeleted {
    display: none;
  }
  .del {
    padding: 4px 10px;
    border: 1px solid #ccc;
  }
  .active {
    padding: 5px;
    border: 1px solid #ccc;
  }
  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100px;
  }
}
.batchFill {
  width: 100%;
  display: flex;
  margin-left: 496px;
  margin-bottom: 10px;
  :deep() {
    .draggable-item {
      display: none;
    }
  }
}
.arrt_item {
  height: 90px;
}
</style>
