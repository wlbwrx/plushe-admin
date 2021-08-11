<template>
  <div :class="b()">
    <div :class="b('search')" ref="search-box">
      <avue-form v-if="operationBtn" :option="operationBtn" @commonHandle="commonHandleCrud"></avue-form>
      <avue-form
        :class="b('search-form')"
        ref="search-form"
        v-if="searchFrom && getClick('list')"
        :option="searchFrom"
        v-model="searchValue"
        @keyupEnter="keyupEnter"
        @commonHandle="commonHandleCrud"
      ></avue-form>
    </div>
    <slot name="tablePre" ref="tablePre"></slot>
    <div v-if="getClick('list')" :class="b('table')">
      <el-table
        ref="tableRef"
        :class="b('table-box')"
        :data="tableData"
        widht="100%"
        :height="500"
        border
        :load="option.load"
        :tree-props="option.treeProps || { children: 'children', hasChildren: 'hasChildren' }"
        :lazy="!!option.load"
        v-loading="loading"
        :row-key="option.rowKey || 'id'"
        :highlight-current-row="option.highlightCurrentRow"
        @row-click="commonHandleCrud('row-click', $event)"
        @selection-change="selectionChange('selection-change', $event)"
      >
        <el-table-column v-if="option.tableExpand" type="expand">
          <template #default="props">
            <slot name="tableExpand" :data="props.row"></slot>
          </template>
        </el-table-column>
        <el-table-column key="selection" type="selection" min-width="40" v-if="option.tableSelection"> </el-table-column>
        <el-table-column
          key="index"
          type="index"
          :index="indexPage"
          min-width="0"
          width="50"
          label="序号"
          fixed
          align="center"
          v-if="!option.tableIndex"
        >
        </el-table-column>
        <el-table-column
          v-for="columnItem in columnList"
          :key="columnItem.prop || columnItem.key"
          :label="columnItem.label"
          :min-width="columnItem.minWidth"
          :prop="columnItem.prop"
          :sortable="columnItem.sortable"
          :show-overflow-tooltip="columnItem.showOverflowTooltip"
        >
          <template #default="{ row }">
            <slot :name="row.prop" :row="row" v-if="columnItem.slot"></slot>
            <template v-else-if="columnItem.viewType == 'img'">
              <span v-if="!row[columnItem.viewProp || columnItem.prop]">--</span>
              <el-image
                v-else
                class="img"
                fit="contain"
                :preview-src-list="
                  previewSrc(row[columnItem.viewProp || columnItem.prop])
                    ? [previewSrc(row[columnItem.viewProp || columnItem.prop])]
                    : undefined
                "
                :src="row[columnItem.viewProp || columnItem.prop]"
                @click.stop=""
              >
                <template #placeholder>
                  <div class="el-loading-spinner"><i class="el-icon-loading"></i></div>
                </template>
              </el-image>
            </template>
            <template v-else-if="columnItem.viewType == 'url'">
              <a :href="row[columnItem.prop]" target="_blank">{{ row[columnItem.prop] }}</a>
            </template>
            <template v-else-if="columnItem.viewType == 'imgs'">
              <span v-if="!row[columnItem.viewProp || columnItem.prop] || !row[columnItem.viewProp || columnItem.prop][0]">--</span>
              <template v-else>
                <el-image
                  class="img"
                  fit="contain"
                  v-for="(imgItem, index) in row[columnItem.viewProp || columnItem.prop]"
                  :preview-src-list="previewSrc(imgItem.picUrl) ? [previewSrc(imgItem.picUrl)] : undefined"
                  :key="index"
                  :src="imgItem.picUrl"
                  @click.stop=""
                >
                  <template #placeholder>
                    <div class="el-loading-spinner"><i class="el-icon-loading"></i></div>
                  </template>
                </el-image>
              </template>
            </template>
            <template v-else-if="columnItem.viewType == 'input'">
              <!-- <el-tooltip class="item" effect="dark" content="回车确认" placement="top">
                <template> -->
              <el-input
                class="table-iput"
                v-model="row[columnItem.prop]"
                @keyup.enter="keyupEnterInput(row, columnItem)"
                v-loading="row.inputLoading"
                tabindex="0"
              ></el-input>
              <!-- </template>
              </el-tooltip> -->
              <!-- <span>回车确定</span> -->
              <!-- <el-button>确定</el-button> -->
            </template>
            <template v-else-if="columnItem.viewType == 'copy'">
              <span>{{ getViewContent(row, columnItem) }}</span>
              <el-button type="text" size="small" @click="toCopy(row[columnItem.prop])">复制</el-button>
            </template>
            <div class="text" v-else v-html="getViewContent(row, columnItem)"></div>
          </template>
        </el-table-column>
        <el-table-column key="fixed-right" v-if="snglBtn && snglBtnWidth" fixed="right" label="操作列" :width="snglBtnWidth">
          <template #default="scope">
            <template v-for="snglItem in snglBtn.formItemList" :key="snglItem.key">
              <el-popconfirm
                :class="b('operation')"
                v-if="snglItem.key.includes('PoP') && getClick(snglItem.btnName)"
                :title="`确定${getViewContent(scope.row, snglItem)}吗？`"
                @confirm="operationFun(snglItem, scope.row)"
              >
                <template #reference>
                  <span>
                    {{ getViewContent(scope.row, snglItem) }}
                  </span>
                </template>
              </el-popconfirm>
              <span
                v-if="!snglItem.key.includes('PoP') && getClick(snglItem.btnName)"
                :class="b('operation') + ' ' + snglItem.key"
                @click.stop="operationFun(snglItem, scope.row)"
                >{{ getViewContent(scope.row, snglItem) }}
              </span>
            </template>
          </template>
        </el-table-column>
        <template #empty>
          <svg
            style="width: 12em; height: 12em; vertical-align: middle; fill: currentColor; overflow: hidden"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="9595"
          >
            <path
              d="M855.6 427.2H168.5c-12.7 0-24.4 6.9-30.6 18L4.4 684.7C1.5 689.9 0 695.8 0 701.8v287.1c0 19.4 15.7 35.1 35.1 35.1H989c19.4 0 35.1-15.7 35.1-35.1V701.8c0-6-1.5-11.8-4.4-17.1L886.2 445.2c-6.2-11.1-17.9-18-30.6-18zM673.4 695.6c-16.5 0-30.8 11.5-34.3 27.7-12.7 58.5-64.8 102.3-127.2 102.3s-114.5-43.8-127.2-102.3c-3.5-16.1-17.8-27.7-34.3-27.7H119c-26.4 0-43.3-28-31.1-51.4l81.7-155.8c6.1-11.6 18-18.8 31.1-18.8h622.4c13 0 25 7.2 31.1 18.8l81.7 155.8c12.2 23.4-4.7 51.4-31.1 51.4H673.4zM819.9 209.5c-1-1.8-2.1-3.7-3.2-5.5-9.8-16.6-31.1-22.2-47.8-12.6L648.5 261c-17 9.8-22.7 31.6-12.6 48.4 0.9 1.4 1.7 2.9 2.5 4.4 9.5 17 31.2 22.8 48 13L807 257.3c16.7-9.7 22.4-31 12.9-47.8zM375.4 261.1L255 191.6c-16.7-9.6-38-4-47.8 12.6-1.1 1.8-2.1 3.6-3.2 5.5-9.5 16.8-3.8 38.1 12.9 47.8L337.3 327c16.9 9.7 38.6 4 48-13.1 0.8-1.5 1.7-2.9 2.5-4.4 10.2-16.8 4.5-38.6-12.4-48.4zM512 239.3h2.5c19.5 0.3 35.5-15.5 35.5-35.1v-139c0-19.3-15.6-34.9-34.8-35.1h-6.4C489.6 30.3 474 46 474 65.2v139c0 19.5 15.9 35.4 35.5 35.1h2.5z"
              p-id="9596"
            ></path>
          </svg>
          <!-- <div class="empty">
            <img src="@/assets/images/table_empty.png" />
          </div> -->
        </template>
      </el-table>
      <Pagination v-if="!option.pageHide" :page="page" @commonHandle="commonHandleCrud" />
    </div>
    <slot name="tableBeh" ref="tableBeh"></slot>
    <el-dialog
      top="5vh"
      :title="dialogTitle"
      v-model="dialogVisibility"
      width="80%"
      :before-close="handleClose"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <avue-form v-model="dialogValue" :option="dialogOption" @commonHandle="commonHandleCrud" ref="dialogForm">
        <template v-for="item in slotList" :key="item.key || item.prop" v-slot:[item.key]="slotValue">
          <slot :name="item.key" :formValue="slotValue.formValue"></slot>
        </template>
      </avue-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog top="5vh" title="导入" destroy-on-close v-model="exportVisibility" width="400px">
      <el-upload
        class="upload-demo"
        :on-success="onSuccess"
        :http-request="httpRequest"
        drag
        :limit="1"
        action=""
        v-loading="uploadLoading"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </el-dialog>
    <slot name="default"></slot>
  </div>
</template>
<script>
import permission from './permission';
import create from '../../core/create';
import customHttpRequest from '../../core/httpRequest';
import Pagination from './Pagination';
import Dialog from './Dialog';
import { isEqual, cloneDeep, flattenDeep, debounce } from 'lodash';
import { Base64 } from 'js-base64';
import useClipboard from 'vue-clipboard3';
export default create({
  name: 'crud',
  props: {
    modelValue: {},
    fieldMap: {
      type: Object,
      default: () => ({
        id: 'id',
        status: 'status',
      }),
    },
    option: {
      type: Object,
      default: () => {},
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    page: {
      type: Object,
      default: () => {
        return {
          pageNum: 1,
          pageSize: 20,
          total: 0,
        };
      },
    },
    class: {
      type: String,
      default: '',
    },
  },
  emits: ['commonHandle', 'update:modelValue'],
  inheritAttrs: false,
  watch: {
    option: {
      handler() {
        this.init();
      },
      immediate: true,
    },
    tableData() {
      this.$nextTick(() => {
        if (!this.$refs.tableRef) return;
        this.$refs.tableRef.doLayout();
      });
    },
    searchValue: {
      handler(val) {
        this.$emit('update:modelValue', val);
      },
      deep: true,
    },
    modelValue: {
      handler(val) {
        if (!isEqual(val, this.searchValue)) {
          this.searchValue = val;
        }
      },
      deep: true,
      immediate: true,
    },
    dialogValue: {
      handler(val) {
        if (val && Object.keys(val).length) {
          this.$emit('commonHandle', 'dialogValue', val);
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      searchValue: {},
      searchFrom: null,
      operationBtn: null,
      snglBtn: null,
      dialogVisibility: false,
      dialogEdit: false,
      dialogValue: {},
      inputLoading: false,
      exportVisibility: false,
      uploadLoading: false,
    };
  },
  methods: {
    toCopy(val) {
      const { toClipboard } = useClipboard();
      toClipboard(val);
      this.$message.success('复制成功!');
    },
    indexPage(index) {
      const { pageNum, pageSize } = this.page;
      return index + 1 + (pageNum - 1) * pageSize;
    },
    getClick(btnName) {
      if (!btnName) return true;
      const { permissionList } = this.$store.getters;
      if (!permissionList) return false;
      const { menuId } = this.$route.meta;
      if (!permissionList[menuId]) return false;
      if (permissionList[menuId].includes(btnName)) return true;
    },
    toggleRowSelection(rows) {
      this.$refs.tableRef.clearSelection();
      rows.forEach((row) => {
        this.$refs.tableRef.toggleRowSelection(row);
      });
    },
    onSuccess(response, file) {
      this.$emit('commonHandle', 'uploadCallback', file, () => {
        this.uploadLoading = false;
        this.exportVisibility = false;
      });
    },
    httpRequest(option) {
      this.uploadLoading = true;
      // option.onProgress(e)
      const { file } = option;
      return customHttpRequest('import_temp_file', file);
    },
    previewSrc(val) {
      const str = 'https://img.plushe.com/';
      if (!val || !val.includes(str)) return;
      const obj = JSON.parse(Base64.decode(val.split(str)[1]));
      delete obj.edits.resize.width;
      delete obj.edits.resize.height;
      const newStr = `${str}${Base64.encode(JSON.stringify(obj))}`;
      return newStr === val ? undefined : newStr;
    },
    initForm(formArr) {
      if (formArr.length === 0) return null;
      return {
        formItemList: formArr.map((formItem) => {
          const key = formItem;
          const value = this.option[formItem];
          // 初始化表格行
          if (typeof key === 'object') {
            return {
              ...formItem,
              key: formItem.key || formItem.prop,
              rules: false,
              disabled: false,
            };
          } else if (typeof value === 'function') {
            return {
              key,
              btnName: formItem ? permission[formItem] : '',
              formatter: value,
            };
          } else {
            // 增删改查
            let btnContent;
            let icon;
            let type = 'default';
            const btnName = permission[key];
            switch (btnName) {
              case 'list':
                btnContent = '搜索';
                icon = `icon-seach`;
                type = 'danger';
                break;
              case 'upload':
                btnContent = typeof value == 'string' ? value : '导入';
                icon = `icon-daoru`;
                type = 'danger';
                break;
              case 'down':
                btnContent = '下载模板';
                icon = `icon-xiazai`;
                break;
              case 'urlAdd':
                btnContent = typeof value == 'string' ? value : '新增';
                icon = `el-icon-circle-plus`;
                type = 'success';
                break;
              case 'add':
                btnContent = typeof value == 'string' ? value : '新增';
                icon = `el-icon-circle-plus`;
                break;
              case 'delete':
                btnContent = '删除';
                icon = `icon-delete`;
                break;
              case 'update':
                btnContent = value || '批量修改';
                icon = `icon-edit`;
                break;
              default:
                btnContent = value;
                break;
            }
            return {
              key,
              icon,
              type,
              btnName,
              btnContent,
              editType: 'button',
            };
          }
        }),
      };
    },
    init() {
      const { column } = this.option;
      const searchArr = [];
      const snglArr = [];
      const operationArr = [];
      Object.keys(this.option).forEach((item) => {
        if (item.includes('Btn')) operationArr.push(item);
        else if (item.includes('Sngl')) snglArr.push(item);
      });
      column.forEach((item) => {
        const tempItem = { ...item };
        if (tempItem.editType == 'wangeditor') {
          tempItem.editType = 'input';
          tempItem.type = '';
          tempItem.rules = '';
        }
        if (item.search) searchArr.push(tempItem);
      });
      if (searchArr.length != 0) {
        searchArr.push({
          editType: 'button',
          key: 'seachBtn',
          icon: `icon-seach`,
          type: 'danger',
          btnName: 'list',
          btnContent: '搜索',
        });
      } else if (operationArr.length != 0) {
        operationArr.push({
          editType: 'button',
          key: 'seachBtn',
          icon: `icon-seach`,
          type: 'danger',
          btnName: 'list',
          btnContent: '搜索',
        });
      }
      if (searchArr.length) {
        searchArr.push({
          editType: 'button',
          key: 'resetBtn',
          btnName: 'list',
          icon: `icon-qingkong`,
          btnContent: '清空',
        });
      }
      this.searchFrom = this.initForm(searchArr);
      if (this.searchFrom) {
        this.searchFrom.inline = true;
      }
      this.snglBtn = this.initForm(snglArr);
      this.operationBtn = this.initForm(operationArr);
      if (this.operationBtn) {
        this.operationBtn.inline = true;
      }
    },
    getViewContent(rowCcontent, columnItem) {
      // 按钮名称存在,直接返回
      if (columnItem.btnContent) {
        return columnItem.btnContent;
      }
      const { prop, viewProp, formatter, Dict, multiple } = columnItem;
      const key = rowCcontent[prop];
      // 自定义渲染顺序 1.viewProp 2.formatter 3.Dict
      if (viewProp) {
        return rowCcontent[viewProp];
      } else if (typeof formatter === 'function') {
        return formatter(rowCcontent);
      } else if (Array.isArray(Dict)) {
        if (!key) return '--';
        let value = '';
        flattenDeep(Dict).forEach((item) => {
          if (!isNaN(key)) {
            if (item.id == key) {
              value = item.label;
            }
          } else if (key.includes(item.id)) {
            value += item.label + ',';
          }
        });
        return value;
      } else if (Dict) {
        let value = '';
        if (multiple) {
          key.forEach((item) => {
            value += Dict[item] + ',';
          });
        } else {
          value = Dict[key];
        }
        if (!value) return '--';
        if (typeof value === 'string') return value;
        const status = value.status || '';
        return `${value.value}<i class="iconfont icon-circle ${status}"></i>`;
      } else if (prop === 'timeArr') {
        return `${rowCcontent.startTime} / ${rowCcontent.endTime}`;
      }
      return key === 0 ? '0' : key || '--';
    },
    operationFun(item, row) {
      this.commonHandleCrudDebounce(item.key, row);
    },
    // 不能防抖,选中问题
    selectionChange(key, value) {
      this.commonHandleCrud(key, value);
    },
    commonHandleCrud(key, value = {}, callFun) {
      if (key === 'viewSngl' || key === 'editSngl' || key === 'addBtn') {
        this.dialogValue = { ...value };
        this.dialogVisibility = true;
        this.dialogEdit = key !== 'viewSngl';
      } else if (key == 'resetBtn') {
        this.$refs['search-form'].resetFields();
      } else if (key.includes('importBtn')) {
        this.exportVisibility = true;
      }
      this.$emit('commonHandle', key, value, callFun);
    },
    commonHandleCrudDebounce: debounce(
      function (key, value = {}, callFun) {
        if (key === 'viewSngl' || key === 'editSngl' || key === 'addBtn') {
          this.dialogValue = { ...value };
          this.dialogVisibility = true;
          this.dialogEdit = key !== 'viewSngl';
        } else if (key == 'resetBtn') {
          this.$refs['search-form'].resetFields();
        } else if (key.includes('importBtn') || key.includes('ImportBtn')) {
          this.exportVisibility = true;
        }
        this.$emit('commonHandle', key, value, callFun);
      },
      1000,
      { leading: true, trailing: false }
    ),
    keyupEnter() {
      this.commonHandleCrudDebounce('query');
    },
    keyupEnterInput(row, columnItem) {
      const { rules, prop } = columnItem;
      if (rules) {
        let str = '';
        rules.forEach((item) => {
          if (!item.pattern.test(row[prop])) {
            str = item.message;
          }
        });
        if (str) return this.$message.warning(str);
      }
      row.inputLoading = true;
      this.commonHandleCrud(`keyupEnterInput-${prop}`, row, () => {
        row.inputLoading = false;
      });
    },
    handleClose() {
      this.dialogValue = {};
      this.dialogVisibility = false;
    },
    submit() {
      if (!this.$refs.dialogForm.validate()) return;
      this.commonHandleCrudDebounce(this.dialogStr, this.dialogValue, this.handleClose);
    },
  },
  computed: {
    snglBtnWidth() {
      if (!this.snglBtn) return 0;
      const arr = this.snglBtn.formItemList.map((item) => {
        return item.btnContent || item.formatter({});
      });
      const extent = arr.join('').length * 11 + arr.length * 16 + 10;
      return extent < 80 ? 80 : extent;
    },
    columnList() {
      const { column = [] } = this.option || {};
      return cloneDeep(column.filter((item) => !item.hide)).map((item) => {
        item.minWidth = item.minWidth || 100;
        item.showOverflowTooltip = true;
        if (item.editType == 'img') {
          item.viewType = 'img';
          item.showOverflowTooltip = false;
        } else if (item.editType == 'imgs') {
          item.viewType = 'imgs';
          item.showOverflowTooltip = false;
        } else if (item.editType == 'url') {
          item.viewType = 'url';
        }
        return item;
      });
    },
    dialogOption() {
      const { column = [], dialogFormOption = {} } = this.option || {};
      return {
        ...dialogFormOption,
        formItemList: column
          .filter((item) => item.editShow || (!item.editHide && !item.hide))
          .map((item) => {
            item.minWidth = item.minWidth || 100;
            return item;
          }),
      };
    },
    dialogTitle() {
      const { id } = this.fieldMap;
      if (this.dialogValue[id]) {
        return '编辑';
      }
      return this.dialogEdit ? '新增' : '查看';
    },
    dialogStr() {
      const { id } = this.fieldMap;
      return this.dialogValue[id] ? 'update' : 'add';
    },
    slotList() {
      if (this.dialogOption) {
        return this.dialogOption.formItemList.filter((item) => item.editSlot);
      }
      return [];
    },
  },
  mounted() {
    const { permissionList } = this.$store.getters;
    if (permissionList) this.permissionArr = permissionList[this.$route.meta.menuId];
  },
  components: {
    Pagination,
    Dialog,
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
