<template>
  <el-dialog
    top="5vh"
    :title="`编辑商品尺寸`"
    :before-close="beforeClose"
    destroy-on-close
    :close-on-click-modal="false"
    v-model="dialogVisible"
    width="70%"
  >
    <el-row class="oprate-box" type="flex" justify="end">
      <span class="btn-item color-blue" @click="column.push('')">增加列</span>
      <span class="btn-item color-green" @click="tableData.push({ 0: '' })">增加行</span>
      <span class="btn-item color-red" @click="deleteRow">移除行</span>
    </el-row>
    <el-table :data="tableData" border ref="tableRef" highlight-current-row @current-change="handleCurrentChange">
      <el-table-column v-for="(item, index) in column" :key="index" :label="xTitle[index]" :prop="String(index)">
        <template #header="scope">
          <!-- <el-select @change="getSizeArr('int')" style="width: 100px" v-if="index===1" v-model="xTitle[index]" placeholder="请选择">
            <el-option
              v-for="item in countrySize"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-input v-else v-model="xTitle[index]" :disabled="scope.$index == 0" style="width: 100px" placeholder="请输入" />
          <i class="el-icon-delete" v-if="scope.$index != 0 && scope.$index != 1" @click="delColume(scope.$index)" maxlength="20"></i> -->

          <el-input v-model="xTitle[index]" :disabled="scope.$index == 0" style="width: 100px" placeholder="请输入" />
          <i class="el-icon-delete" v-if="scope.$index != 0" @click="delColume(scope.$index)" maxlength="20"></i>
        </template>
        <template #default="scope">
          <!-- <el-select v-if="index===1" style="width: 100px" v-model="scope.row[index]" placeholder="请选择">
            <el-option
              v-for="item in sizeArrs"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select> -->
          <el-input v-model="scope.row[index]" style="width: 100px" placeholder="请输入" maxlength="15" />
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" label="操作" width="180">
        <template #default="scope">
          <el-row type="flex">
            <a style="padding: 8px" @click="tableData.push({ 0: '' })">增加行</a>
            <a style="padding: 8px" @click="deleteRow(scope.$index)">移除行</a>
          </el-row>
        </template>
      </el-table-column> -->
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="beforeClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
// import { RULE } from '@utils/validators';
// import { http } from '../const/categories';
// import { transitionTreeArray } from '@utils/index';
import { mapGetters } from 'vuex';
// import { cloneDeep } from 'lodash';

export default {
  props: ['modelValue', 'currentRow'],
  emits: ['update:modelValue', 'submit'],
  data() {
    return {
      dialogVisible: false,
      tableData: [{ 0: '' }],
      xTitle: [this.$t('size')],
      column: [''],
      scopeIndex: -1,
      sizeArrs: [],
    };
  },
  watch: {
    modelValue(val) {
      this.dialogVisible = Boolean(val);
    },
    currentRow: {
      handler(val) {
        const { sizeCm } = val;
        if (sizeCm) {
          const { datas, xTitle } = JSON.parse(sizeCm);
          this.xTitle = xTitle;
          // const someEle = xTitle && xTitle.length > 1 ? xTitle[1] == '' || this.countrySize.includes(xTitle[1]) : false;
          // if (!someEle) {
          //   this.xTitle.splice(1, 0, '');
          //   datas.map((item, index) => {
          //     item.splice(1, 0, '');
          //     return item;
          //   });
          // }
          this.column.length = xTitle.length;
          this.tableData = datas.map((item) => ({ ...item }));
          // this.getSizeArr();
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters(['SizeConfig']),
    // countrySize() {
    //   return Object.keys(this.SizeConfig);
    // },
    // sizeArrs() {
    //   return [];
    // },
  },
  methods: {
    getSizeArr(scope) {
      const index = this.xTitle[1];
      this.sizeArrs = this.SizeConfig[index];
      if (scope == 'int') {
        this.tableData.map((item) => {
          item['1'] = '';
          return item;
        });
      }
      // console.log(this.column)
      // this.tableData = this.tableData.map((el, index) => {
      //   if (index > 0) {
      //     el = '';
      //     return el;
      //   }
      // });
    },
    handleCurrentChange(val) {
      console.log(val);
      this.scopeIndex = this.tableData.findIndex((item) => JSON.stringify(item) == JSON.stringify(val));
    },
    beforeClose(fun) {
      this.tableData = [{ 0: '' }];
      this.xTitle = [this.$t('size')];
      this.column = [''];
      this.$emit('update:modelValue', 0);
      // if (fun) fun();
    },
    submit() {
      let errStr = '';
      const str = this.currentRow.sizeCm ? 'updateProductSize' : 'addProductSize';
      const sizcInch = { datas: [], xTitle: this.xTitle };
      const sizeCm = { datas: [], xTitle: this.xTitle };
      console.log(this.tableData, 'table', this.xTitle.length);
      this.tableData.forEach((item, index) => {
        // if (!item['1']) item['1'] = '';
        if (!item['0']) item['0'] = '';
        if (Object.keys(item).length != this.xTitle.length) {
          errStr = `第${index + 2}行有空白项`;
        }
        sizcInch.datas[index] = [];
        sizeCm.datas[index] = [];
        Object.keys(item).forEach((element, i) => {
          sizcInch.datas[index].push(item[element]);
          sizeCm.datas[index].push(item[element]);
          if (i == 0) return;
          const reg = /^(\d+|\d+\.\d{1,2})$/;
          if (item[element].includes('-')) {
            if (item[element].split('-').length !== 2 && i !== 1) errStr = `第${index + 2}行第${i + 1}列格式不正确,数字或-分隔数字`;
            const [a, b] = item[element].split('-');
            if (!reg.test(a) || (!reg.test(b) && i !== 1)) errStr = `第${index + 2}行第${i + 1}列格式不正确,数字或-分隔数字`;
            sizcInch.datas[index][i] = (a / 2.54).toFixed(2) + '-' + (b / 2.54).toFixed(2);
          } else {
            if (!reg.test(item[element]) && i !== 1) errStr = `第${index + 2}行第${i + 1}列格式不正确,数字或-分隔数字`;
            sizcInch.datas[index][i] = (item[element] / 2.54).toFixed(2);
          }
        });
      });
      if (
        (this.xTitle.length != this.column.length && this.column.length !== 2) ||
        [...this.xTitle].some((item, index) => !item && index != 1)
      ) {
        errStr = '表头至少存在一个且不能为空';
      }
      if (errStr) return this.$message.warning(errStr);
      this.$emit(
        'submit',
        {
          str,
          sizcInch: JSON.stringify(sizcInch),
          sizeCm: JSON.stringify(sizeCm),
        },
        this.beforeClose
      );
    },
    delColume(index) {
      this.$refs.tableRef.doLayout();
      this.column.splice(index, 1);
      this.xTitle.splice(index, 1);
      this.tableData = this.tableData.map((item) => {
        const arr = Array.from({ ...item, length: Object.keys(item).length });
        arr.splice(index, 1);
        return { ...arr };
      });
    },
    deleteRow() {
      if (this.scopeIndex == -1) return this.$message.warning('先选中需要删除的行');
      if (this.tableData.length == 1) return this.$message.warning('至少保留一项');
      this.tableData.splice(this.scopeIndex, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.el-icon-delete {
  position: absolute;
  top: 0px;
  left: 113px;
}
.color-red {
  color: #f56c6c;
}
.color-green {
  color: #60b199;
}
.color-blue {
  color: #3b91c8;
}
.oprate-box {
  padding: 10px 0;
  .btn-item {
    margin-left: 20px;
    cursor: pointer;
  }
}
</style>
