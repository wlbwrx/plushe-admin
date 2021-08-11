<template>
  <div class="custom-one">
    <div class="custom-one-head">
      <el-button v-if="getClick('list')" icon="el-icon-search" size="small" @click="handleQuery">查询</el-button>
      <el-button v-if="getClick('add')" icon="el-icon-circle-plus-outline" size="small" type="success" @click="toAdd">新增</el-button>
    </div>
    <div class="custom-one-wrap" v-if="getClick('list')">
      <el-table ref="tableRef" :data="tableList" border style="width: 100%" :height="500" @expand-change="expandChange">
        <el-table-column type="expand" label="">
          <template #default="{ row, $index }">
            <el-table :data="tableItemList[row.id]" border v-loading="isLoading">
              <el-table-column prop="picUrl" label="图片" align="center">
                <template #default="scope">
                  <el-image :src="scope.row.picUrl" alt="" />
                </template>
              </el-table-column>
              <el-table-column prop="name" label="子模块名称" align="center"></el-table-column>
              <el-table-column prop="docTitle" label="子模块文案" align="center"></el-table-column>
              <el-table-column prop="sort" label="排序" align="center"></el-table-column>
              <el-table-column prop="topicTitle" label="专题" align="center">
              </el-table-column>
              <el-table-column prop="enable" label="状态" align="center">
                <template #default="scope">
                  {{ scope.row.enable ? '启用' : '停用' }}
                  <i :class="['iconfont icon-circle', scope.row.enable ? 'success' : ' info']"></i>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="descText" label="关联类目|商品" align="center"> </el-table-column> -->
              <el-table-column label="操作" align="center" width="330px">
                <template #default="scope">
                  <el-popconfirm
                    :title="`确定${!scope.row.enable ? '停用' : '启用'}吗？`"
                    @confirm="toSwitchItems(scope.row, scope.$index, $index)"
                  >
                    <template #reference>
                      <el-button type="text" size="small" class="color-red">{{ scope.row.enable ? '停用' : '启用' }}</el-button>
                    </template>
                  </el-popconfirm>
                  <el-button
                    type="text"
                    v-if="scope.row.topicId"
                    size="small"
                    @click="toViewItems(scope.row)"
                  >
                    查看专题商品
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="模块名称" align="center"></el-table-column>
        <el-table-column prop="sort" label="排序" align="center"></el-table-column>
        <el-table-column prop="userDevice" label="客户端" align="center">
          <template #default="scope">
            {{ Dict.devices[scope.row.userDevice] }}
          </template>
        </el-table-column>
        <el-table-column prop="enable" label="状态" align="center">
          <template #default="{ row }">
            {{ row.enable ? '启用' : '停用' }}
            <i :class="['iconfont icon-circle', row.enable ? 'success' : ' info']"></i>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row, $index }">
            <el-button type="text" v-if="getClick('update')" size="small" @click.stop="toEdit(row, $index)">编辑</el-button>
            <el-popconfirm :title="`确定${!row.enable ? '停用' : '启用'}吗？`" @confirm="toSwitch(row)">
              <template #reference>
                <el-button type="text" size="small" class="color-red">
                  {{ row.enable ? '停用' : '启用' }}
                </el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm :title="`确定删除吗？`" @confirm="toDelete(row)">
              <template #reference>
                <el-button v-if="getClick('delete')" type="text" size="small" class="color-red">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <pagination :page="page" @commonHandle="commonHandleCrud"></pagination>
    </div>
    <el-dialog top="5vh" :title="(form.id ? '编辑' : '添加') + '自定义模块'" v-model="dialogVisible" width="1000px">
      <el-form :model="form" :rules="rules" ref="form" label-width="96px">
        <el-form-item label="模块名称" prop="name">
          <el-input class="input-width" maxlength="20" v-model="form.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="所属客户端" prop="userDevice">
          <el-select class="input-width" v-model="form.userDevice" placeholder="请选择">
            <el-option v-for="(label, value) in Dict.devices" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="序号" prop="sort">
          <el-input class="input-width" maxlength="5" v-model="form.sort" placeholder="请输入序号"></el-input>
        </el-form-item>
        <el-form-item label="子模块" prop="children">
          <vuedraggable :list="form.children" item-key="id">
            <template #item="{ element, index }">
              <div class="child-items" :key="index + 'a'">
                <el-input class="input-width" v-model="element.name" maxlength="20" placeholder="请输入子模块名称"></el-input>
                <el-input class="input-width" v-model="element.docTitle" maxlength="50" placeholder="请输入子模块文案"></el-input>
                <el-select class="item" v-model="element.topicId" filterable placeholder="请选择关联专题">
                  <el-option :label="item.label" :value="item.id" v-for="item in topicList" :key="item.id"></el-option>
                </el-select>
                <div class="child-upload">
                  <BaseSelectImg v-model="element.fileList" :formItem="{ limit: 1, belongRootId: 6 }" />
                  <p>
                    <i class="btn-icon el-icon-remove-outline" @click="deleteItems(index)"></i>
                    <i class="btn-icon el-icon-circle-plus-outline" @click="addItems(index)"></i>
                  </p>
                </div>
              </div>
            </template>
          </vuedraggable>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="toSubmit">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog top="5vh" :title="currentRow.name + '关联类目'" v-model="categoryVisi" width="50%">
      <div>
        <el-cascader :options="productCategory" v-model="productCategories" :props="{ checkStrictly: true, value: 'id' }"> </el-cascader>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="categoryVisi = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <BaseViewTopic v-model="viewCommodityVisi" :currentCategory="viewForm" />
  </div>
</template>

<script>
import Pagination from '@/components/avue/ele-ui/crud/Pagination.vue';
import { http, commodityHttp, Dict } from './const/custom-one.js';
import vuedraggable from 'vuedraggable';
import { RULE } from '@utils/validators';

import { transitionTreeArray } from '@/utils/index';
import { mapGetters } from 'vuex';

export default {
  name: 'CustomOne',
  props: {},
  components: {
    vuedraggable,
    Pagination,
  },
  data() {
    return {
      Dict,
      isLoading: false,
      tableList: [], // 表格数据
      tableItemList: {}, // 子模块数据
      page: {
        total: 0,
        pageSize: 20,
        pageNum: 1,
      },
      dialogVisible: false, // 新增/编辑  弹框
      form: {
        name: '',
        userDevice: '',
        sort: '',
        level: 1,
        children: [
          {
            name: '',
            picKey: '',
          },
        ],
      },
      rules: {
        name: [RULE.required],
        userDevice: [RULE.required],
        children: [RULE.required],
        sort: [RULE.numberIntZero],
      },

      // 关联商品/类目  查看商品
      CommodityVisi: false,
      categoryVisi: false,
      viewCommodityVisi: false,
      commodityHttp,
      productCategories: [],
      currentRow: {},
      viewForm: {},
    };
  },
  computed: {
    ...mapGetters(['productCategoryList', 'topicList']),
    productCategory() {
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
  setup() {},
  created() {
    if (!this.getClick('list')) return;
    this.handleQuery();
  },
  mounted() {},
  methods: {
    getClick(btnName) {
      if (!btnName) return false;
      const { permissionList } = this.$store.getters;
      if (!permissionList) return false;
      const { menuId } = this.$route.meta;
      if (!permissionList[menuId]) return false;
      if (permissionList[menuId].includes(btnName)) return true;
    },
    // 点击新增:
    toAdd() {
      this.form = {
        name: '',
        userDevice: '',
        sort: '',
        level: 1,
        children: [
          {
            name: '',
            picKey: '',
          },
        ],
      };
      this.dialogVisible = true;
      // this.$refs.form.resetFields();
    },
    // 切换 停用/启用:
    toSwitch(item) {
      http
        .updateEnable({
          id: item.id,
          enable: !item.enable,
        })
        .then((_) => {
          this.$message.success('修改成功');
          this.handleQuery();
        });
    },
    // 点击编辑:
    toEdit(item) {
      this.form = { ...item };
      this.form.userDevice = '' + this.form.userDevice;

      const params = { pid: item.id };
      http.getRecurse(params).then((res) => {
        const children = res.map((item) => {
          if (item.picKey) {
            item.fileList = [
              {
                picKey: item.picKey,
                picUrl: item.picUrl,
              },
            ];
          }
          item.topicId = String(item.topicId);
          return item;
        });
        this.form.children = children;
        this.dialogVisible = true;
      });
    },
    // 点击删除:
    toDelete(item) {
      http
        .delete({
          id: item.id,
        })
        .then((res) => {
          this.handleQuery();
          this.$message({
            message: '删除成功!',
            type: 'success',
          });
        });
    },
    // 对某一行展开/关闭时：
    expandChange(row, expandedRows) {
      if (!expandedRows.length) return;
      if (!expandedRows.map((item) => item.id).includes(row.id)) return;
      const params = { pid: row.id };
      this.isLoading = true;
      http.getRecurse(params).then((res) => {
        this.isLoading = false;
        this.tableItemList[row.id] = res.map((item) => {
          item.topicTitle = (this.topicList.filter((element) => item.topicId == element.id)[0] || {}).label;
          return item;
        });
        this.$nextTick(this.$refs.tableRef.doLayout());
      });
    },
    // 子模块 切换 停用/启用:
    toSwitchItems(item, index) {
      const params = {
        id: item.id,
        enable: !item.enable,
      };
      http.updateEnable(params).then((_) => {
        this.$message.success('修改成功');
        this.tableItemList[item.pid][index].enable = params.enable;
      });
    },
    // 子模块 查看商品:
    toViewItems(data) {
      this.viewForm = { ...data, name: (this.topicList.filter((item) => item.id == data.topicId)[0] || {}).label };
      this.viewCommodityVisi = true;
    },
    // 子模块 关联商品-1/类目-2:
    toRelateItems(item, type) {
      this.productCategories = [];
      this.currentRow = item;
      if (type == 2) {
        this.categoryVisi = true;
        return;
      }
      this.CommodityVisi = true;
    },
    // 点击 - 删除子模块的某一项:
    deleteItems(index) {
      if (this.form.children.length == 1) return this.$message.warning('至少保留一个');
      this.form.children.splice(index, 1);
    },
    // 点击+ 新增子模块:
    addItems(index) {
      const temp = {
        name: '',
        picKey: '',
      };
      this.form.children.splice(index + 1, 0, temp);
    },
    // 提交--新增/编辑表单:
    toSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 这里校验子模块的数据完整性:
          const childs = this.form.children;
          let bool = false;

          childs.forEach((item, index) => {
            if (!item.fileList || !item.name) {
              this.$message({
                message: `第${index + 1}个子模块没有名称或图片`,
                type: 'warning',
              });
              bool = true;
              return;
            }
            item.fileList.forEach((obj) => {
              item.picKey = obj.picKey;
            });
          });
          if (bool) return;
          this.form.sort = String(this.form.sort) || 9999;
          this.form.children = this.form.children.map((item, index) => ({
            ...item,
            sort: index + 1,
            relType: 2,
          }));
          const funKey = this.form.id ? 'update' : 'add';
          http[funKey]({ ...this.form }).then((res) => {
            this.dialogVisible = false;
            this.$message({
              message: this.form.id ? '修改成功!' : '新增成功!',
              type: 'success',
            });
            this.handleQuery();
          });
        }
      });
    },
    // 获取表格数据：
    getList() {
      const params = {
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum,
        level: 1,
      };
      http.reqList(params).then((data) => {
        this.page.total = data.total;
        this.tableList = data.list;
      });
    },
    // 查询数据：
    handleQuery() {
      this.page.pageNum = 1;
      this.getList();
    },
    // 分页操作：
    commonHandleCrud(key, value) {
      if (key == 'size-change') {
        this.page.pageNum = 1;
        this.page.pageSize = value;
        this.getList();
      } else if (key == 'current-change') {
        if (this.page.pageNum != value) {
          this.page.pageNum = value;
          this.getList();
        }
      }
    },

    commoditySubmit(list) {
      const { id, pid } = this.currentRow;
      http['addRelations']({
        productNos: list.map((item) => item.productNo),
        relationType: 1, // 关联类型：1-产品，2-类目
        categoryId: id,
      }).then((_) => {
        this.CommodityVisi = false;
        this.$message.success('操作成功');
        http.getRecurse({ id: id }).then((res) => {
          if (!res || !res[0]) return;
          const signItem = res[0];
          signItem.descText = `关联${signItem.productCount}个商品`;
          this.tableItemList[pid].forEach((element, index, arr) => {
            if (element.id == signItem.id) {
              arr[index] = { ...signItem, picUrl: signItem.picUrl };
            }
          });
        });
      });
    },
    editPro() {
      this.CommodityVisi = true;
    },
    submit() {
      if (this.productCategories.length == 0) return this.$message.warning('请选择产品分类');
      const { id, pid } = this.currentRow;
      http['addRelations']({
        productCategories: this.productCategories.map((item, index) => ({
          id: item,
          level: index + 1,
        })),
        relationType: 2, // 关联类型：1-产品，2-类目
        categoryId: id,
      }).then((_) => {
        this.categoryVisi = false;
        this.$message.success('操作成功');
        http.getRecurse({ id: id }).then((res) => {
          if (!res || !res[0]) return;
          const signItem = res[0];
          signItem.descText = this.productCategoryList.find(
            (element) => element.id == this.productCategories[this.productCategories.length - 1]
          ).label;
          this.tableItemList[pid].forEach((element, index, arr) => {
            if (element.id == signItem.id) {
              arr[index] = { ...signItem, picUrl: signItem.picUrl };
            }
          });
        });
      });
    },
    relieve(row) {
      const { id, pid } = row;
      http
        .addRelations({
          categoryId: id,
          id,
          relationType: 2,
          productCategories: [],
        })
        .then((_) => {
          this.$message.success('操作成功');
          http.getRecurse({ id: id }).then((res) => {
            if (!res || !res[0]) return;
            const signItem = res[0];
            signItem.descText = `关联0个商品`;
            this.tableItemList[pid].forEach((element, index, arr) => {
              if (element.id == signItem.id) {
                arr[index] = { ...signItem, picUrl: signItem.picUrl };
              }
            });
          });
          // this.handleQuery();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-one {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.custom-one-head {
  padding: 30px 24px 30px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid #eee;
}
.color-red {
  color: #f56c6c;
}
.child-items {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .child-upload {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .child-sort {
    width: 120px;
    margin: 0 10px;
  }
}
.custom-one-wrap {
  padding: 24px 24px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  .el-table {
    flex: 1;
  }
}
.btn-icon {
  font-size: 24px;
  margin-left: 6px;
}
.input-width {
  width: 180px;
}

.icon-circle {
  font-size: 12px;
  margin-left: 5px;
}
.icon-circle.success {
  color: #67c23a;
}
.icon-circle.info {
  color: #606266;
}
</style>
