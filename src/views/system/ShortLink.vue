<template>
  <div class="short-list">
    <div class="short-list-head">
      <el-form class="short-list__query" :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="原链地址" prop="originUrl">
          <el-input v-model="queryParams.originUrl" :maxlength="50" placeholder="请输入原链接地址" clearable></el-input>
        </el-form-item>
        <el-form-item label="短链地址" prop="shortUrl">
          <el-input v-model="queryParams.shortUrl" :maxlength="50" placeholder="请输入短链地址" clearable></el-input>
        </el-form-item>
        <el-form-item label="短链类型" prop="linkType">
          <el-select v-model="queryParams.linkType" placeholder="请选择" clearable>
            <el-option v-for="value in Dict.linkTypes" :key="value" :label="value" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-if="getClick('list')" icon="el-icon-search" size="small" type="danger" @click="handleQuery">查询</el-button>
          <el-button v-if="getClick('list')" icon="el-icon-refresh" size="small" @click="resetQuery('queryForm')">重置</el-button>
          <el-button v-if="getClick('add')" icon="el-icon-circle-plus-outline" size="small" type="success" @click="toAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="short-list-wrap">
      <el-table :height="500" :data="tableList" border style="width: 100%;">
        <el-table-column label="序号" prop="index" align="center" width="80"></el-table-column>
        <el-table-column label="原链接地址" prop="originUrl" align="center"></el-table-column>
        <el-table-column label="短链地址" prop="shortUrl" align="center">
          <template #default="scope">
            {{ scope.row.shortUrl }}
            <el-button type="text" size="small" @click="toCopy(scope.row.shortUrl)">复制</el-button>
          </template>
        </el-table-column>
        <el-table-column label="短链类型" prop="linkType" align="center"></el-table-column>
        <el-table-column label="有效期" prop="validDays" align="center">
          <template #default="scope">
            {{ scope.row.validDays == 0 ? '永久' : scope.row.validDays + '天' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            {{ (scope.row.linkStatus == 1 && '启用') || (scope.row.linkStatus == 0 && '停用') || (scope.row.linkStatus == 2 && '过期') }}
            <i :class="['iconfont icon-circle', scope.row.linkStatus == 1 ? 'success' : ' info']"></i>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="index" align="center">
          <template #default="scope">
            <el-popconfirm :title="`确定${!scope.row.linkStatus ? '停用' : '启用'}吗？`" @confirm="toSwitch(scope.row)">
              <template #reference>
                <el-button v-if="getClick('status') && scope.row.linkStatus != 2" type="text" size="small" class="color-red">{{
                  (scope.row.linkStatus == 1 && '停用') || (scope.row.linkStatus == 0 && '启用')
                }}</el-button>
              </template>
            </el-popconfirm>
            <!-- <el-button type="text" v-if="getClick('update')" size="small" @click.stop="toEdit(scope.row, scope.$index)">编辑</el-button> -->
            <el-popconfirm :title="`确定删除吗？`" @confirm="toDelete(scope.row)">
              <template #reference>
                <el-button v-if="getClick('delete')" type="text" size="small" class="color-red">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <pagination :page="page" @commonHandle="commonHandleCrud"></pagination>
    </div>
    <el-dialog top="5vh" :title="form.id ? '编辑' : '添加'" v-model="dialogVisible" width="50%">
      <el-form :model="form" :rules="rules" ref="form" label-width="110px">
        <el-form-item label="原链地址" prop="originUrl">
          <el-input class="input-width" v-model="form.originUrl" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="短链类型" prop="linkType">
          <el-select v-model="form.linkType" placeholder="请选择" clearable>
            <el-option v-for="value in Dict.linkTypes" :key="value" :label="value" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期" prop="validDays">
          <el-select v-model="form.validDays" placeholder="请选择" clearable>
            <el-option v-for="(label, value) in Dict.validDays" :key="value" :label="label" :value="value"></el-option>
          </el-select>
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
import { http, Dict } from './const/short-link.js';
import Pagination from '@/components/avue/ele-ui/crud/Pagination.vue';
import { RULE } from '@utils/validators';

import useClipboard from 'vue-clipboard3';

export default {
  name: 'AdList',
  components: {
    Pagination,
  },
  data() {
    return {
      Dict,
      dayjs,
      tableList: [],
      // 请求参数
      queryParams: {
        originUrl: undefined,
        shortUrl: undefined,
        linkType: undefined,
        validDays: undefined,
      },
      page: {
        total: 0,
        pageSize: 20,
        pageNum: 1,
      },
      dialogVisible: false, // 新增/编辑  弹框
      form: {
        originUrl: '',
        linkType: '',
        validDays: '',
      },
      rules: {
        name: [RULE.required],
      },

      currentRow: {},
    };
  },
  created() {
    this.getTypeList();
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
      console.log(menuId, permissionList[menuId]);
      if (!permissionList[menuId]) return false;
      if (permissionList[menuId].includes(btnName)) return true;
    },
    // 新增
    toAdd() {
      this.form = {
        originUrl: '',
        linkType: '',
        validDays: '',
      };
      this.dialogVisible = true;
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    // 编辑
    // toEdit(item) {
    //   this.form = { ...item };
    //   this.dialogVisible = true;
    //   if (this.$refs.form) {
    //     this.$refs.form.resetFields();
    //   }
    // },
    // 切换 停用/启用:
    toSwitch(item) {
      http
        .reqUpdateStatus({
          id: item.id,
          linkStatus: Number(!item.linkStatus),
        })
        .then(_ => {
          this.$message.success('修改成功');
          this.handleQuery();
        });
    },
    // 确定删除
    toDelete(item) {
      http
        .reqDel({
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
          const funKey = 'reqAdd';
          http[funKey]({ ...this.form }).then(res => {
            this.dialogVisible = false;
            this.$message({
              message: '新增成功!',
              type: 'success',
            });
            this.handleQuery();
          });
        }
      });
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
        ...this.queryParams,
      };
      http.reqList(params).then(data => {
        this.page.total = data.total;
        this.tableList = data.list.map((item, index) => {
          item.index = (this.page.pageNum - 1) * this.page.pageSize + (index + 1);
          return item;
        });
      });
    },
    // 获取短链类型:
    getTypeList() {
      http.getLinkType().then(res => {
        // console.log(res);
        this.Dict.linkTypes = res;
      });
    },
    // 重置表单
    resetQuery(formName) {
      for (const key in this.queryParams) {
        this.queryParams[key] = undefined;
      }
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.short-list-head {
  padding: 30px 24px 30px;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.short-list-wrap {
  padding: 24px 24px 24px;
}
.color-red {
  color: red;
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
