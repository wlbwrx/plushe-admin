import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import { cloneDeep, debounce } from 'lodash';
import NP from 'number-precision';
import { imageHandler } from '@/utils/index';

export default {
  data() {
    return {
      amountArr: ['fee', 'price', 'discountPrice', 'fixedAmount', 'thresholdAmount', 'maxAmount'],
      COM_HTTP: {}, // 请求定义
      loading: false, // 加载状态
      currentRow: {}, // 单选状态选中行
      isShowFirst: true, // 首次加载是否请求接口
      formData: {}, // 表单数据
      popForm: {}, // 表单弹窗
      extraData: {}, // 表单额外参数, 请求需要
      page: {
        // 分页配置
        pageNum: 1,
        pageSize: 20,
        total: 0,
      },
      fieldMap: {
        id: 'id',
        status: 'status',
      },
      searchParam: {},
      tableList: [], // 列表数据
      selectionList: [], // 多选选中数据
      exportData: false, // 导入的数据
      belongFileDir: 0, // 图片上传所属ID
      picArr: ['picKey', 'coverPicKey', 'coverPicKeyPc', 'listPicH5', 'listPicPc', 'logoPicKey', 'modelPic'], // 图片key值,加Picture为model值
      crudParameter: undefined,
    };
  },
  computed: {
    ...mapGetters(['user', 'dict', 'topicList']),
  },
  created() {
    this.debounceFun();
    if (this.isShowFirst) {
      if (this.$route.query) {
        Object.keys(this.$route.query).forEach(item => {
          this.formData[item] = this.$route.query[item];
        });
      }
      this.$nextTick(() => {
        // 初始化赋值
        this.searchFun();
      });
    }
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
    customFormattingData(tableData) {
      return tableData;
    },
    formattingData(tableData) {
      return tableData.map(item => {
        if (item.startTime) {
          item.timeArr = [item.startTime, item.endTime];
        }
        const timeFormatting = {
          modifyTime: 'YYYY-MM-DD HH:mm:ss',
          loginTime: 'YYYY-MM-DD HH:mm:ss',
          createTime: 'YYYY-MM-DD HH:mm:ss',
          startTime: 'YYYY-MM-DD HH:mm:ss',
          endTime: 'YYYY-MM-DD HH:mm:ss',
          evaluateTime: 'YYYY-MM-DD HH:mm:ss',
        };
        const timeArr = Object.keys(timeFormatting);
        timeArr.forEach(element => {
          if (item[element]) {
            item[element] = dayjs(item[element])
              .tz()
              .format(timeFormatting[element]);
          }
        });
        const picArr = this.picArr;
        picArr.forEach(element => {
          const key = element + 'Url';
          if (!item[element]) return;
          item[key] = imageHandler(0, item[element]);
          item[`${element}Picture`] = [
            {
              picKey: item[element],
              picUrl: item[key],
            },
          ];
        });
        // 初始化为0的topicId
        if (item.topicId !== undefined) {
          item.topicId = item.topicId || '';
        }
        this.amountArr.forEach(element => {
          if (item[element] && !isNaN(item[element])) {
            item[element] = NP.divide(item[element], 100);
          }
        });
        return item;
      });
    },
    // 列表查询参数处理
    searchFunParamsHandle(params = {}) {
      const param = Object.assign({}, this.extraData, this.formData, params); // 接口参数
      const { pageNum, pageSize } = this.page;
      param.pageNum = pageNum;
      param.pageSize = pageSize;
      Object.keys(param).forEach(paramItem => {
        if (param[paramItem] === undefined || param[paramItem] === null || param[paramItem] === '') {
          delete param[paramItem];
        } else if (paramItem == 'timeArr') {
          param.startTime = dayjs(param[paramItem][0]).format('YYYY-MM-DD HH:mm:ss');
          param.endTime = dayjs(param[paramItem][1]).format('YYYY-MM-DD HH:mm:ss');
          delete param.timeArr;
        }
      });
      return param;
    },
    searchFunParamsFiltering(params) {
      return params;
    },
    async searchFun(params) {
      if (this.loading) return;
      this.loading = true;
      if (typeof this.searchFunBefore === 'function') {
        const state = this.searchFunBefore(params);
        if (state === false) {
          // false退出不请求
          this.loading = false;
          return;
        }
      }
      params = this.searchFunParamsHandle(params);
      const param = this.searchFunParamsFiltering(params);
      this.searchParam = param;
      if (!param) {
        this.loading = false;
        return;
      }
      try {
        const res = await this.COM_HTTP.reqList(param);
        if (res.list && Array.isArray(res.list)) {
          this.tableList = this.customFormattingData(this.formattingData(res.list));
        } else if (Array.isArray(res)) {
          this.tableList = this.customFormattingData(this.formattingData(res));
        }
        this.page.total = res.total || 0;
        this.page.pageNum = res.pageNum || 1;
      } finally {
        this.loading = false;
      }
    },
    // 编辑参数处理
    crudParamsHandle(params = {}) {
      const newParams = {};
      Object.keys(params).forEach(item => {
        if (this.crudParameter.includes(item)) newParams[item] = params[item];
      });
      if (params.startTime) {
        newParams.startTime = dayjs(params.startTime).format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
        newParams.endTime = dayjs(params.endTime).format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
      }
      if (params.timeArr) {
        newParams.startTime = dayjs(params.timeArr[0]).format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
        newParams.endTime = dayjs(params.timeArr[1]).format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
        delete newParams.timeArr;
      }
      if (params.evaluateTime) {
        newParams.evaluateTime = dayjs(params.evaluateTime).format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
      }
      // picKey商品图  coverPicKey模块封面 coverPicKeyPc模块封面PC listPicH5模块封面H5 logoPicKey店铺图  modelPic模特图
      const picArr = this.picArr;
      picArr.forEach(element => {
        const key = `${element}Picture`;
        if (!params[key]) return;
        if (params[key] && params[key][0]) {
          newParams[element] = params[key][0].picKey;
          delete newParams[key];
        }
      });
      // 专题类型存在,只能关联链接或专题
      if (params.relType) {
        const { relType, topicId, linkUrl, internalUrl } = params;
        if (relType == 1 && !linkUrl && !internalUrl) {
          this.$message.warning('请输入链接');
          // return false;
        } else if (relType == 2 && !topicId) {
          this.$message.warning('请选择专题');
          return false;
        } else if ((linkUrl || internalUrl) && topicId) {
          this.$message.warning('专题和链接不能同时存在');
          return false;
        } else if (topicId && !this.topicList.find(item => item.id == topicId)) {
          this.$message.warning('专题被停用,请重新选择');
          return false;
        }
        // params.topicId = '';
      }
      this.amountArr.forEach(item => {
        if (params[item] && !isNaN(params[item])) {
          newParams[item] = NP.times(params[item], 100);
        }
      });
      return this.customCrudParamsHandle(newParams);
    },
    customCrudParamsHandle(params) {
      return params;
    },
    async addFun(addItem) {
      const addParams = await this.crudParamsHandle({ ...addItem });
      if (!addParams) return Promise.reject();
      await this.COM_HTTP.reqAdd(addParams);
      this.$message.success('添加成功');
      if (typeof this.updataLater === 'function') this.updataLater();
      setTimeout(() => {
        this.searchFun();
      }, 1000);
    },
    updataFunParamsHandle(params = {}) {
      return params; // 接口参数
    },
    async updataFun(item) {
      let updataParams = await this.crudParamsHandle({ ...item });
      if (!updataParams) return Promise.reject();
      updataParams = this.updataFunParamsHandle(updataParams);
      await this.COM_HTTP.reqUpdate(updataParams);
      this.$message.success('修改成功');
      if (typeof this.updataLater === 'function') this.updataLater();
      setTimeout(() => {
        this.searchFun();
      }, 1000);
    },
    updateStatusParamsHandle(params = {}) {
      const { id, status } = this.fieldMap;
      return {
        [id]: params[id],
        [status]: params[status] == 1 ? 0 : 1,
      };
    },
    async updateSort(params, val) {
      if (this.COM_HTTP.updateSort) {
        await this.COM_HTTP.updateSort(params, val);
      } else {
        await this.COM_HTTP.reqUpdate(params, val);
      }
    },
    async updateStatusFun(item) {
      const updataParams = await this.updateStatusParamsHandle(item);
      if (!updataParams) return;
      await this.COM_HTTP.reqUpdateStatus(updataParams);
      this.$message.success('修改成功');
      if (typeof this.updataLater === 'function') this.updataLater();
      setTimeout(() => {
        this.searchFun();
      }, 1000);
    },
    delFunParamsHandle(params) {
      const { id } = this.fieldMap;
      return { [id]: params[id] }; // 接口参数
    },
    async delFun(delOpt) {
      const delParams = this.delFunParamsHandle(delOpt);
      await this.COM_HTTP.reqDel(delParams);
      this.$message.success('删除成功');
      if (typeof this.updataLater === 'function') this.updataLater();
      setTimeout(() => {
        this.searchFun();
      }, 1000);
    },
    batchDelFunParamsHandle(params) {
      return params;
    },
    async batchDelFun(delOpt) {
      const batchParams = this.batchDelFunParamsHandle(delOpt);
      if (batchParams === false) return;
      await this.COM_HTTP.batchDel(batchParams);
      this.$message.success('删除成功');
      setTimeout(() => {
        this.searchFun();
      }, 1000);
    },
    async downloadTemplateLink() {
      const res = await this.COM_HTTP.getTemplateLink();
      this.downloadFile(res);
    },
    exportBtn(value) {
      // 如果超过1000个，弹出Toast提示“最多只能导出1000个商品”
      if (this.tableList.length === 0) {
        this.$message.warning('没有导出的数据');
        return;
      }
      if (this.page.total > 5000) {
        this.$message.warning('最多只能导出5000个商品');
        return;
      }
      const that = this;
      // XX${this.tableList.length}个
      this.$confirm(`确认导出${this.page.total}个商品?`)
        .then(_ => {
          that.exportDown();
        })
        .catch(_ => {});
    },
    async exportDown() {
      const param = this.searchParam;
      const res = await this.COM_HTTP.getBatchExport(param);
      this.downloadFile(res);
      setTimeout(() => {
        this.$message.success('导出商品信息成功');
      }, 1500);
    },
    downloadFile(url, { fileName = '未命名' } = {}) {
      let link = document.createElement('a');
      link.download = fileName;
      link.style.display = 'none';
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      link = null;
    },
    async uploadCallback(res) {
      this.exportData = await this.COM_HTTP.verifyFile({ s3Key: res.response.picKey });
      if (this.uploadLater) this.uploadLater();
    },
    toggleRowSelection(rows) {
      this.$refs.crud.toggleRowSelection(rows);
    },
    async commonHandle(key, value, callFun) {
      const { id } = this.fieldMap;
      if (key !== 'row-click' && key !== 'dialogValue' && value) {
        console.log(`commonHandle - ${key}`, JSON.parse(JSON.stringify(value)));
      }
      switch (key) {
        case 'current-change': // 页面条数变更
          if (this.page.pageNum === value) return;
          this.page.pageNum = value;
          this.searchFun();
          break;
        case 'size-change': // 页面条数变更
          if (this.page.pageSize === value) return;
          this.page.pageSize = value;
          this.page.pageNum = 1;
          this.searchFun();
          break;
        case 'pageNum-change': // 页面变更
          if (this.page.pageNum === value) return;
          this.page.pageNum = value;
          this.searchFun();
          break;
        case 'row-click': // 当表格某一行被点击时会触发该事件
          this.currentRow = cloneDeep(value);
          if (this.rowClick) {
            console.log(`commonHandle - ${key}`, JSON.parse(JSON.stringify(value)));
            this.rowClick(value);
          }
          break;
        case 'row-switch-click': // 当表格某一行switch被点击时会触发该事件
          break;
        case 'keyupEnter': // 回车查询
          this.page.pageNum = 1;
          this.searchFun();
          break;
        case 'seachBtn': // 查询按钮
          this.page.pageNum = 1;
          this.searchFun();
          break;
        case 'exportBtn': // 按条件导出
          this.exportBtn(value);
          break;
        case 'selection-change': // 当选择项发生变化时会触发该事件
          this.selectionList = value;
          if (this.selectionChange) {
            this.selectionChange(value);
          }
          break;
        case 'delsBtn': // 批量删除
          if (this.selectionList.length === 0) {
            return this.$message.warning('至少选中一项');
          }
          this.batchDelFun({ ids: this.selectionList.map(item => item.id) }, this.selectionList);
          break;
        case 'delSnglPoP': // 单行操作删除
          this.delFun(value);
          break;
        case 'updataSnglPoP': // 状态启用,停用
          this.updateStatusFun(value);
          break;
        case 'update':
          await this.updataFun(value);
          break;
        case 'add':
          await this.addFun(value);
          break;
        case 'addUrlBtn':
          await this.$router.push({
            path: `commodity-batch`,
          });
          break;
        case 'dialogValue':
          this.popForm = value;
          break;
        case 'uploadCallback':
          try {
            await this.uploadCallback(value);
          } catch (error) {
            console.log();
          }
          break;
        case 'downloadBtn':
          await this.downloadTemplateLink();
          break;
        default:
          this.currentRow = { ...value };
          if (typeof this[`${key}Fun`] === 'function') {
            if (key.endsWith('sBtn') && this.selectionList.length === 0) {
              return this.$message.warning('至少选中一项');
            }
            this[`${key}Fun`](value);
          } else if (key.includes('keyupEnterInput')) {
            await this.updateSort(
              {
                [id]: value[id],
                [key.split('keyupEnterInput-')[1]]: value[key.split('keyupEnterInput-')[1]],
              },
              value
            );
            this.$message.success('操作成功');
          } else if (typeof this[`transferFun`] === 'function') {
            // transferFun事件分发
            await this[`transferFun`](key, value);
          }
          break;
      }
      if (callFun) callFun();
    },
    customParameterHandle(arr) {
      return arr;
    },
    debounceFun: debounce(
      function() {
        const { name } = this.$route;
        const topocRoute = ['app-classify', 'app-banner', 'vajra-hurdle', 'flash-sale', 'new-arrivals', 'custom-one', 'custom-two'];
        if (topocRoute.includes(name)) {
          // 更新专题的页面
          this.$store.dispatch('GetTopicList');
        }
        const attachedRoute = ['commodity_list', 'ad-list', 'topic-config'];
        if (attachedRoute.includes(name)) {
          // 更新附加属性
          this.$store.dispatch('getAttachedProperty');
        }
        setTimeout(() => {
          this.crudParameter = this.customParameterHandle(
            this.option.column
              .filter(item => !item.editHide)
              .map(item => item.prop)
              .concat('children', 'timeArr', 'enable', 'type')
          );
        }, 0);
      },
      1000,
      { leading: true, trailing: false }
    ),
  },
};
