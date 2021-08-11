<template>
  <div class="ad-list">
    <div class="ad-list-head">
      <el-button v-if="getClick('add')" icon="el-icon-circle-plus-outline" size="small" type="success" @click="toAdd">新增</el-button>
    </div>
    <div class="ad-list-wrap">
      <el-table :height="500" :data="tableList" border style="width: 100%;">
        <el-table-column label="序号" prop="index" align="center" width="80"></el-table-column>
        <el-table-column label="广告模块名称" prop="name" align="center"></el-table-column>
        <el-table-column label="广告模块ID" prop="id" align="center">
          <template #default="scope">
            {{ scope.row.id }}
            <el-button type="text" size="small" @click="toCopy(scope.row.id)">复制</el-button>
          </template>
        </el-table-column>
        <el-table-column label="广告备注" prop="desc" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center">
          <template #default="scope">
            {{ dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="关联商品" align="center">
          <template #default="scope">
            <el-button v-if="getClick('viewCond')" type="text" size="small" @click="toViewItems(scope.row)"
              >查看关联商品{{ scope.row.productCount }}</el-button
            >
            <el-button v-if="getClick('pageCond')" type="text" size="small" @click="toRelateItems(scope.row, 1)">关联商品</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="index" align="center">
          <template #default="scope">
            <el-button type="text" v-if="getClick('update')" size="small" @click.stop="toEdit(scope.row, scope.$index)">编辑</el-button>
            <el-popconfirm :title="`确定要删除该广告吗`" @confirm="toDelete(scope.row)">
              <template #reference>
                <el-button v-if="getClick('delete')" type="text" size="small" class="color-red">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <pagination :page="page" @commonHandle="commonHandleCrud"></pagination>
    </div>
    <CommodityForm v-model="CommodityVisi" :currentCategory="currentRow" @submit="commoditySubmit" />
    <ViewCommodity v-model="viewCommodityVisi" :currentCategory="currentRow" :http="commodityHttp" @submit="editPro" />
    <el-dialog top="5vh" :title="form.id ? '编辑' : '添加'" v-model="dialogVisible" width="50%">
      <el-form :model="form" :rules="rules" ref="form" label-width="110px">
        <el-form-item label="广告模块名称" prop="name">
          <el-input class="input-width" maxlength="20" v-model="form.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input
            class="input-width"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            maxlength="200"
            v-model="form.desc"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { http, commodityHttp } from './const/list.js';
import Pagination from '@/components/avue/ele-ui/crud/Pagination.vue';
import { RULE } from '@utils/validators';

import CommodityForm from '@views/app-config/component/CommodityForm';
import ViewCommodity from '@views/app-config/component/ViewCommodity';
import useClipboard from 'vue-clipboard3';

export default {
  name: 'AdList',
  components: {
    Pagination,
    CommodityForm,
    ViewCommodity,
  },
  data() {
    return {
      dayjs,
      tableList: [],
      page: {
        total: 0,
        pageSize: 20,
        pageNum: 1,
      },
      dialogVisible: false, // 新增/编辑  弹框
      form: {
        name: '',
        desc: '',
      },
      rules: {
        name: [RULE.required],
      },
      // 关联商品/类目  查看商品
      CommodityVisi: false,
      viewCommodityVisi: false,
      commodityHttp,
      currentRow: {},
    };
  },
  created() {
    if (!this.getClick('list')) return;
    this.handleQuery();
  },
  methods: {
    // 权限判断
    getClick(btnName) {
      if (!btnName) return false;
      const { permissionList } = this.$store.getters;
      if (!permissionList) return false;
      const { menuId } = this.$route.meta;
      if (!permissionList[menuId]) return false;
      if (permissionList[menuId].includes(btnName)) return true;
    },
    // 新增
    toAdd() {
      this.form = {
        name: '',
        desc: '',
      };
      this.dialogVisible = true;
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    // 编辑
    toEdit(item) {
      this.form = { ...item };
      this.dialogVisible = true;
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    // 确定删除
    toDelete(item) {
      http
        .delete({
          id: item.id,
        })
        .then(() => {
          this.handleQuery();
          this.$message({
            message: '删除成功!',
            type: 'success',
          });
        });
    },
    // 复制
    toCopy(text) {
      const { toClipboard } = useClipboard();
      toClipboard(text);
      this.$message.success('复制成功!');
    },
    // 确定提交:
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const funKey = this.form.id ? 'update' : 'add';
          http[funKey]({ ...this.form }).then(res => {
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
    // 查看关联商品
    toViewItems(item) {
      if (item.productCount == 0) {
        this.$message.warning('无关联商品');
        return;
      }
      this.currentRow = item;
      this.viewCommodityVisi = true;
    },
    // 关联商品
    toRelateItems(item) {
      this.currentRow = item;
      this.CommodityVisi = true;
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
      const { id } = this.currentRow;
      http['addRelations']({
        productNos: list.map(item => item.productNo),
        relationType: 1, // 关联类型：1-产品，2-类目
        categoryId: id,
      }).then(_ => {
        this.CommodityVisi = false;
        this.handleQuery();
        this.$message.success('操作成功');
      });
    },
    editPro() {
      this.CommodityVisi = true;
    },
    // 查询数据：
    handleQuery() {
      this.page.pageNum = 1;
      this.getList();
    },
    // 获取表格数据：
    getList() {
      const params = {
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum,
      };
      http.reqList(params).then(data => {
        this.page.total = data.total;
        this.tableList = data.list.map((item, index) => {
          item.index = (this.page.pageNum - 1) * this.page.pageSize + (index + 1);
          return item;
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ad-list-head {
  padding: 30px 24px 30px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid #eee;
}
.ad-list-wrap {
  padding: 24px 24px 24px;
}
.color-red {
  color: red;
}
</style>
