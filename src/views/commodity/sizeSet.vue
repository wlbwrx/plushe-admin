<template>
  <div class="commodity-size">
    <!-- <el-button v-if="getClick('add')" class="add" @click="handleAddClick">新增</el-button> -->
    <!-- <el-table v-if="getClick('list')" :data="list" border center style="width: 100%"> -->
    <el-table :data="list" border center style="width: 100%">
      <el-table-column fixed prop="size" label="Size" align="center"></el-table-column>
      <el-table-column prop="usSize" label="US" align="center">
        <template #default="scope">
          <el-input v-model="scope.row.usSize" maxlength="9"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="euSize" label="EU" align="center">
        <template #default="scope">
          <el-input v-model="scope.row.euSize" maxlength="9"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="deSize" label="DE" align="center">
        <template #default="scope">
          <el-input v-model="scope.row.deSize" maxlength="9"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="ukSize" label="UK" align="center">
        <template #default="scope">
          <el-input v-model="scope.row.ukSize" maxlength="9"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="auSize" label="AU" align="center">
        <template #default="scope">
          <el-input v-model="scope.row.auSize" maxlength="9"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="itSize" label="IT" align="center">
        <template #default="scope">
          <el-input v-model="scope.row.itSize" maxlength="9"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="brSize" label="BR" align="center">
        <template #default="scope">
          <el-input v-model="scope.row.brSize" maxlength="9"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="frSize" label="FR" align="center">
        <template #default="scope">
          <el-input v-model="scope.row.frSize" maxlength="9"></el-input>
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button v-if="getClick('delete')" @click="handleClose(scope.row.id)" type="text" size="small">删除</el-button>
          <el-button v-if="!scope.row.id && !isAdd" @click="handleSunmitClick(scope.row)" type="text" size="small">保存</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-button type="success" class="save" @click="handleSubmit">保 存</el-button>
  </div>
</template>
<script>
import { http } from './const/sizeSet';
import permission from '@/mixins/permission';
export default {
  mixins: [permission],
  methods: {
    handleSunmitClick(row) {
      const keys = Object.keys(row);
      const pass = keys.some((k) => {
        if (row[k] == '') {
          return true;
        }
      });
      if (pass) {
        this.$message.error('请输入完整');
        return;
      }
      if (this.isAdd) return;
      this.isAdd = true;
      http['reqAdd'](row).then((res) => {
        this.init();
      });
    },
    init() {
      // http['reqList'](this.param).then((res) => {
      //   this.list = res.list;
      //   setTimeout(() => {
      //     if (this.isAdd) this.isAdd = false;
      //   }, 500);
      //   console.log(this.list);
      // });
      this.list = [];
      Promise.all([http['reqSizeNames'](), http['reqList'](this.param)]).then((res) => {
        const [sizeNames, data] = res;
        const keys = { size: '', auSize: '', brSize: '', deSize: '', euSize: '', frSize: '', itSize: '', ukSize: '', usSize: '' }; // 可能的属性
        this.list = sizeNames.map((item) => ({ ...keys, size: item }));
        this.list = this.list.map((item) => {
          data.list.forEach((obj) => {
            if (obj.size == item.size) {
              item = obj;
            }
          });
          return item;
        });
      });
    },
    handleClose(id) {
      this.$confirm('确认是否删除？')
        .then((_) => {
          if (id) {
            http['reqDel'](id).then((res) => {
              this.init();
            });
          } else {
            const len = this.list.length - 1;
            this.list.splice(len, 1);
          }
        })
        .catch((_) => {});
    },
    handleAddClick() {
      const param = {
        size: '',
        auSize: '',
        brSize: '',
        deSize: '',
        euSize: '',
        frSize: '',
        itSize: '',
        ukSize: '',
        usSize: '',
      };
      this.list.push(param);
    },
    // 点击保存,验证全部必须有值:
    handleSubmit() {
      let err = false;
      this.list.forEach((item) => {
        for (const key in item) {
          if (!item[key] || String(item[key]).trim() == '') err = true;
        }
      });
      console.log(this.list);
      if (err) {
        this.$message.error('请输入完整');
        return;
      }
      http['reqSaveAll'](this.list).then((res) => {
        this.$message.success('保存成功!');
      });
    },
  },
  created() {
    this.init();
  },
  data() {
    return {
      isAdd: false,
      param: {
        pageNum: 1,
        pageSize: 100,
      },
      list: [],
    };
  },
};
</script>
<style lang="scss" scoped>
.commodity-size {
  margin: 24px;
  .add {
    margin-bottom: 20px;
  }
  .save {
    margin-top: 20px;
  }
}
</style>
