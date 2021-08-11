<template>
  <div class="classify">
    <el-row class="header-box">
      <el-col :span="20">
        <el-select class="item" v-model="userDevice" clearable placeholder="查询平台">
          <el-option label="H5" :value="1"></el-option>
          <el-option label="PC" :value="2"></el-option>
        </el-select>
        <el-button v-if="getClick('list')" type="danger" icon="el-icon-search" size="small" style="marginleft: 20px" @click="query">
          查询
        </el-button>
        <el-button
          v-if="getClick('add')"
          class="btn-add-one"
          icon="el-icon-circle-plus"
          type="primary"
          size="small"
          @click="dialogVisible = true"
          >添加一级分类
        </el-button>
      </el-col>
    </el-row>
    <div class="wrapper">
      <el-tree
        v-if="getClick('list')"
        :data="classifyData"
        draggable
        default-expand-all
        :allow-drop="allowDrop"
        @node-drop="nodeDrop"
        :props="{
          label: 'name',
          children: 'children',
          isLeaf: 'isLeaf',
        }"
      >
        <template #default="{ node, data }">
          <el-row v-if="getClick('list')" class="custom-tree-node" type="flex" justify="space-between">
            <div style="height: 40px">
              <div class="name">
                <template v-if="data.level == 1">({{ data.userDevice == 1 ? 'H5' : 'PC' }})</template>{{ node.label }}
              </div>
              <div class="name red" v-if="data.level == 3">{{ nodeTypeFun(data.nodeType) }}</div>
              <img class="img" :src="data.picUrl" v-if="data.level == 3 || data.level == 4" />
              <div class="name name_special" v-if="data.topicId" @click="viewProduct(data)">
                专题:{{ (topicList.filter((item) => item.id == data.topicId)[0] || {}).label }}
              </div>
              <div class="name" v-if="data.linkUrl">链接:{{ data.linkUrl }}</div>
            </div>
            <el-row type="flex" justify="space-between" class="opt">
              <div v-if="data.level == 3 || data.level == 4">
                <span v-if="data.level != 4 && getClick('update')" @click.stop="edit(data, node)" class="opt_item color-blue">编辑</span>
              </div>
              <div v-else>
                <span v-if="getClick('update')" @click.stop="edit(data, node)" class="opt_item color-blue">编辑 </span>
                <span @click.stop="add(data)" v-if="data.level != 4 && getClick('add')" class="opt_item color-green">
                  添加{{ data.level + 1 }}级分类
                </span>
              </div>
              <el-popconfirm v-if="getClick('delete')" title="确定删除该分类吗?" @confirm="remove(data, node)">
                <template #reference>
                  <span class="opt_item color-red">删除</span>
                </template>
              </el-popconfirm>
            </el-row>
          </el-row>
        </template>
      </el-tree>
    </div>
    <el-dialog top="5vh" :title="title" v-model="dialogVisible" width="80%">
      <el-row type="flex" class="classify_box">
        <el-cascader
          class="item"
          :options="productCategoryTree"
          v-model="form.productCategories"
          :props="{ checkStrictly: true, value: 'id' }"
          v-if="form.productCategories"
        >
        </el-cascader>
        <template v-else>
          <el-form :model="form" ref="ruleForm" style="width: 950px" :rules="rules" label-position="right" label-width="80px">
            <el-form-item label="分类名称" prop="name">
              <el-input class="item" v-model="form.name" clearable maxlength="20" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="所属平台" v-if="!form.level || form.level == 1" prop="userDevice">
              <el-select class="item" v-model="form.userDevice" clearable placeholder="请选择所属平台">
                <el-option label="H5" :value="1"></el-option>
                <el-option label="PC" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类图片" v-if="form.level == 3">
              <BaseSelectImg v-model="form.fileList" :formItem="{ limit: 1, belongRootId: 3 }" />
            </el-form-item>
            <el-form-item label="显示类型" v-if="form.level == 3" prop="nodeType">
              <el-select class="item" v-model="form.nodeType" clearable placeholder="请选择显示类型">
                <el-option label="文本" :value="0"></el-option>
                <el-option label="图片" :value="2"></el-option>
                <el-option label="链接" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="显示类型" v-else-if="form.level == 2" prop="nodeType">
              <el-select class="item" v-model="form.nodeType" clearable placeholder="请选择显示类型">
                <el-option label="文本" :value="0"></el-option>
                <el-option label="分组" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关联专题" v-if="form.level == 3 && form.nodeType == 0" prop="topicId">
              <el-select class="item" v-model="form.topicId" clearable filterable placeholder="请选择关联专题">
                <el-option :label="item.label" :value="item.id" v-for="item in topicList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类链接" v-if="form.level == 3 && form.nodeType == 3" prop="linkUrl">
              <el-input v-model="form.linkUrl"></el-input>
            </el-form-item>
            <el-form-item label="下级分类" v-if="form.level == 3">
              <vuedraggable class="item" :list="threeList" item-key="id">
                <template #item="{ element, index }">
                  <el-row type="flex">
                    <el-input style="width: 150px" maxlength="20" v-model="element.name" placeholder="子类名称" @focus.stop=""></el-input>
                    <el-select v-model="element.relType" clearable placeholder="请选择关联类型">
                      <el-option label="链接" :value="1"></el-option>
                      <el-option label="专题" :value="2"></el-option>
                    </el-select>
                    <el-select v-model="element.topicId" clearable v-if="element.relType == 2" filterable placeholder="子类专题">
                      <el-option :label="item.label" :value="item.id" v-for="item in topicList" :key="item.id"></el-option>
                    </el-select>
                    <el-input
                      v-else
                      style="width: 150px; margin-left: 10px"
                      v-model="element.linkUrl"
                      placeholder="子类链接"
                      @focus.stop=""
                    ></el-input>
                    <BaseSelectImg
                      style="width: 200px; margin-left: 10px"
                      v-model="element.fileList"
                      :formItem="{ limit: 1, belongRootId: 3 }"
                    />
                    <i class="el-icon-remove-outline" @click="removeList(index)"></i>
                    <i class="el-icon-circle-plus-outline" @click="addList"></i>
                  </el-row>
                </template>
              </vuedraggable>
            </el-form-item>
          </el-form>
        </template>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <BaseViewTopic v-model="viewCommodityVisi" :currentCategory="viewForm" />
  </div>
</template>

<script>
import { RULE } from '@utils/validators';
import { http, commodityHttp } from './const/classify';
import { mapGetters } from 'vuex';
import { transitionTreeArray, imageHandler } from '@utils/index';
import vuedraggable from 'vuedraggable';

export default {
  name: 'Classify',
  props: {},
  components: { vuedraggable },
  computed: {
    ...mapGetters(['user', 'dict', 'productCategoryList', 'topicList']),
    productCategoryTree() {
      return transitionTreeArray(
        this.productCategoryList
          .map((item) => ({
            ...item,
            disabled: item.categoryStatus != 1,
          }))
          .filter((item) => item.levels != 0)
      );
    },
  },
  data() {
    return {
      COM_HTTP: http,
      commodityHttp,
      dialogVisible: false,
      categoryId: 0,
      form: {},
      viewForm: {},
      rules: {
        name: [RULE.required],
        nodeType: [RULE.required],
        fileList: [RULE.required],
        userDevice: [RULE.required],
        relType: [RULE.required],
      },
      threeList: [{}],
      classifyData: [],
      category: '',
      node: {},
      viewCommodityVisi: false,
      title: '添加一级分类', // /  form.productCategories ? '关联类目' : form.id ? '编辑分类' : '添加分类'
      userDevice: 1,
    };
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.form = {};
        this.title = '添加一级分类';
      }
    },
  },
  // setup() {},
  methods: {
    getClick(btnName) {
      if (!btnName) return false;
      const { permissionList } = this.$store.getters;
      if (!permissionList) return false;
      const { menuId } = this.$route.meta;
      if (!permissionList[menuId]) return false;
      if (permissionList[menuId].includes(btnName)) return true;
    },
    removeList(index) {
      if (this.threeList.length == 1) return this.$message.warning('至少保存一项');
      this.threeList = this.threeList.filter((o, i) => i != index);
    },
    addList() {
      this.threeList.push({});
    },
    loadNode(node, resolve) {
      const { id, level } = node.data;
      http.reqList({ pid: id || 0 }).then((res) => {
        const list = res.list.map((item) => ({
          ...item,
          isLeaf: level == 4,
        }));
        if (resolve) resolve(list);
        if (!id) {
          this.classifyData = list;
        } else if (list.length > 0) {
          this.classifyData.forEach((item, index, arr) => {
            if (item.id == list[0].pid) {
              arr[index].children = list;
            }
            if (item.children) {
              item.children.forEach((element, index, arr) => {
                if (element.id == list[0].pid) {
                  arr[index].children = list;
                }
              });
            }
          });
        }
      });
    },
    allowDrop(draggingNode, dropNode, type) {
      const visAvis = draggingNode.level === dropNode.level;
      return visAvis && type !== 'inner';
    },
    submit() {
      const { id, productCategories, productNos, node, sort, fileList, linkUrl, topicId, nodeType, level } = this.form;
      const obj = { ...this.form };
      delete obj.node;
      if (productCategories) {
        // 选择分类
        if (productCategories.length == 0) return this.$message.warning('请选择产品分类');
        obj.productCategories = productCategories.map((item, index) => ({
          id: item,
          level: index + 1,
        }));
        delete obj.productNos;
        http.addRelations(obj).then((_) => {
          this.updateSingle(node);
        });
      } else if (productNos) {
        http.addRelations(obj).then((_) => {
          this.updateSingle(node);
        });
      } else {
        this.$refs['ruleForm'].validate((valid) => {
          if (!valid) return;
          let errMsg = '';
          this.threeList.forEach((item, index, arr) => {
            // 0文本节点  1分组节点 2图片 3链接
            if (level < 3) return;
            const { relType, name, fileList, linkUrl, topicId } = item;
            if (relType) {
              arr[index][relType == 1 ? 'topicId' : 'linkUrl'] = '';
            } else {
              arr[index].linkUrl = '';
            }
            if (nodeType == 2) {
              if (!name || !fileList || !fileList[0]) {
                errMsg = `第${index + 1}项名称或图片不存在`;
              } else if (relType == 1 && !linkUrl) {
                errMsg = `第${index + 1}项子类链接不存在`;
              } else if (relType == 2 && !topicId) {
                errMsg = `第${index + 1}项子类专题不存在`;
              }
            } else if (relType || name || fileList || linkUrl || topicId) {
              errMsg = '只有图片节点有下级分类';
            }
          });
          if (errMsg) return this.$message.warning(errMsg);
          // delete obj.children;
          if (level == 3) {
            if (nodeType == 0 && !topicId) errMsg = '文本节点必须选择专题';
            if (nodeType == 3 && !linkUrl) errMsg = '链接类型必须配链接';
            if ((nodeType == 0 || nodeType == 3) && !fileList) errMsg = '非图片节点必须选择图片';
            // if (nodeType == 2 && !this.threeList[0].fileList) errMsg = '子节点图片不存在';
            obj.children = this.threeList
              .filter((item) => item.name)
              .map((item) => ({
                ...item,
                picKey: item.fileList[0].picKey,
                nodeType: item.linkUrl ? 3 : 0,
                [item.relType == 1 ? 'topicId' : 'linkUrl']: '',
              }));
            obj[nodeType == 0 ? 'linkUrl' : 'topicId'] = '';
          }
          if (errMsg) return this.$message.warning(errMsg);
          obj.sort = sort || 0;
          if (fileList && fileList[0]) {
            obj.picKey = fileList[0].picKey;
          } else {
            delete obj.picKey;
          }
          http[id ? 'reqUpdate' : 'reqAdd'](obj).then((_) => {
            this.dialogVisible = false;
            this.$message.success('操作成功');
            this.query();
          });
        });
      }
    },
    query() {
      const vm = this.$loading();
      http
        .reqList({ userDevice: this.userDevice })
        .then((res) => {
          vm.close();
          this.classifyData = transitionTreeArray(res, { parentId: 'pid' });
        })
        .catch((_) => {
          vm.close();
        });
    },
    async edit(data, node) {
      console.log('edit', { ...data });
      // if (data.level == 1) {
      //   this.$message.warning('一级分类暂不支持修改');
      //   return;
      // }
      this.node = node;
      this.form = { ...data, topicId: String(data.topicId || '') };
      if (data.level == 3) {
        if (data.picKey) {
          this.form.fileList = [
            {
              picKey: data.picKey,
              picUrl: imageHandler(0, data.picKey),
            },
          ];
        }
        const res = await http['getRecurse']({ id: data.id });
        if (res.children.length) {
          this.threeList = res.children.map((item) => ({
            ...item,
            fileList: [{ picKey: item.picKey, picUrl: imageHandler(0, item.picKey) }],
            topicId: String(item.topicId || '')
          }));
        } else {
          this.threeList = [{}];
        }
      }
      this.dialogVisible = true;
      this.title = data.name + ' 编辑';
    },
    add(data) {
      const { id, level } = data;
      this.form = { pid: id, level: level + 1, type: 1, sort: data.children ? data.children.length : 0 };
      this.dialogVisible = true;
      this.title = data.name + ' 添加下级分类';
      this.threeList = [{}];
      if (this.$refs['ruleForm']) {
        this.$refs['ruleForm'].resetFields();
      }
    },
    remove(data, node) {
      const { parent } = node;
      if (parent.data.children && parent.data.children.length === 1) return this.$message.warning('至少保留一个三级分类');
      http['reqDel']({
        id: data.id,
      }).then((_) => {
        this.$message.success('操作成功');
        this.classifyData = this.classifyData.filter((item) => {
          if (item.children) {
            item.children = item.children.filter((item) => {
              if (item.children) {
                item.children = item.children.filter((item) => {
                  return item.id != data.id;
                });
              }
              return item.id != data.id;
            });
          }
          return item.id != data.id;
        });
      });
    },
    relevance(data, relationType, node) {
      console.log('relevance', { ...data });
      if (data.nodeType != 0) {
        this.$message.warning('非普通三级类目请给下级类目关联类目或商品');
        return;
      }
      this.form = {
        id: data.id,
        categoryId: data.id,
        relationType,
        productCategories: (data.productCategorys || []).map((item) => item.productCategoryId),
        productNos: [],
        node,
        name: data.name,
      };
      this[relationType == 2 ? 'dialogVisible' : 'CommodityVisi'] = true;
      this.title = data.name + ' 关联类目';
    },
    commoditySubmit(list) {
      this.form.productNos = list.map((item) => item.productNo);
      delete this.form.productCategories;
      this.submit();
    },
    nodeDrop(draggingNode, dropNode, dropType, ev) {
      const vm = this.$loading();
      const { data } = dropNode.parent;
      const promiArr = [];
      (Array.isArray(data) ? data : data.children).forEach((item, index) => {
        promiArr.push(
          http.updateSort({
            id: item.id,
            sort: index + 1,
          })
        );
      });
      Promise.all(promiArr).then((_) => {
        vm.close();
        this.$message.success('切换成功');
      });
    },
    updateSingle(node) {
      http.reqList({ id: node.data.id }).then((res) => {
        this.$message.success('操作成功');
        node.data = res[0];
        this.dialogVisible = false;
        this.CommodityVisi = false;
      });
    },
    viewProduct(data) {
      this.viewForm = { ...data, name: (this.topicList.filter((item) => item.id == data.topicId)[0] || {}).label };
      this.viewCommodityVisi = true;
    },
    editPro() {
      this.CommodityVisi = true;
    },
    relieve(data, node) {
      http
        .addRelations({
          categoryId: data.id,
          id: data.id,
          relationType: 2,
          productCategories: [],
        })
        .then((_) => {
          this.updateSingle(node);
        });
    },
    nodeTypeFun(type) {
      const obj = {
        undefined: '历史数据',
        0: '普通节点',
        1: '图片节点',
        2: '图片节点',
        3: '链接节点',
      };
      return obj[type];
    },
  },
  created() {
    if (!this.getClick('list')) return;
    this.query();
  },
};
</script>

<style lang="scss" scoped>
.classify {
  .name {
    width: 120px;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap;
    display: inline-block;
  }
  .name.red {
    color: red;
  }
  .name_special {
    width: 180px;
  }
  .category {
    width: auto;
  }
  .custom-tree-node {
    width: 100%;
  }
  .opt {
    margin-left: 20px;
  }
  .opt_item {
    margin-right: 10px;
  }
  .img {
    min-width: 40px;
    max-height: 40px;
    max-width: 150px;
    margin-right: 10px;
  }
  .des {
    color: #f56c6c;
  }
  .wrapper {
    :deep() {
      .el-tree-node__content {
        height: auto;
        line-height: 40px;
        margin-bottom: 10px;
      }
    }
  }
  .header-box {
    padding: 30px;
    border-bottom: 1px solid #edeef3;
    .btn-add-one {
      background: #60b199 !important;
      border-color: #60b199;
    }
  }
  .wrapper {
    padding: 20px 30px;
    .color-green {
      color: #60b199;
    }
    .color-blue {
      color: #3b91c8;
    }
    .color-red {
      color: #f56c6c;
    }
    .color-yellow {
      color: #fbaa5f;
    }
  }
}
.classify_box {
  flex-direction: column;
  .item {
    margin-top: 10px;
  }
}
</style>
