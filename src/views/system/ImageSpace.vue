<template>
  <div class="image-space" :class="{ hide: mode != '缩略图模式' }">
    <el-tree
      v-if="getClick('tree')"
      highlight-current
      :props="{ label: 'fileDirName' }"
      :expand-on-click-node="false"
      @node-click="nodeClick"
      :data="folderList"
      node-key="ID"
      ref="folder"
    >
    </el-tree>
    <avue-crud
      ref="crud"
      :option="option"
      v-model="formData"
      :table-data="tableList"
      :page="page"
      :loading="loading"
      @commonHandle="commonHandle"
    >
      <el-dialog top="5vh" :title="`${status == 0 ? '新增文件夹' : '移动文件'}`" v-model="dialogVisible" width="60%">
        <div class="">
          <el-cascader
            :options="selFolderList"
            :props="{ checkStrictly: true, label: 'fileDirName', value: 'ID' }"
            v-model="form.parentId"
            placeholder="请选择上级文件夹"
          >
          </el-cascader>
          <el-input
            v-if="status === 0"
            :style="{ width: '200px', marginLeft: '50px' }"
            placeholder="请输入文件夹名称"
            maxlength="20"
            v-model="form.fileDirName"
          ></el-input>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog top="5vh" title="上传图片" destroy-on-close v-model="exportVisibility" width="400px">
        <el-upload
          class="upload-demo"
          accept="image/*"
          :http-request="httpRequest"
          drag
          :multiple="true"
          :before-upload="beforeUpload"
          action=""
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            <p>将文件拖到此处，或<em>点击上传</em></p>
            <p>仅限jpg、jpeg、png、gif格式的图片</p>
            <p>单张图片不超过6M</p>
            <p>每次上传不超过50张图片</p>
          </div>
        </el-upload>
      </el-dialog>
      <template #tablePre>
        <p v-if="limit" style="padding-left: 25px; color: red;">
          已选{{ checkedCities.length }}张, 可选{{ limit - checkedCities.length }}张
        </p>
        <el-checkbox-group v-model="checkedCities" class="thumbnail" @change="onChange" v-loading="loading">
          <div class="thumbnail_item" v-for="item in tableList" :key="item.id" @click="pushChech(item)">
            <div class="index" v-if="!!belongRootId && checkedCities.includes(item.id)">
              {{ checkedCities.findIndex(element => element == item.id) + 1 }}
            </div>
            <div>
              <el-image :src="item.picUrl" :preview-src-list="item.bigUrl ? [item.bigUrl] : undefined"></el-image>
            </div>
            <p class="name">{{ item.picName || item.fileDirName }}</p>
            <p>{{ item.picDimensions }}</p>
            <p>{{ item.picSize }}</p>
            <el-row type="flex" class="opt" v-if="!belongRootId">
              <span class="move" @click.stop="moveSnglFun(item)">{{ item.type == 2 ? '移动' : '查看' }}</span>
              <span class="down" v-if="item.type == 2" @click.stop="downSnglFun(item)">下载</span>
            </el-row>
            <el-checkbox class="checkbox" :label="item.id" :key="item.id" @click.stop="" v-if="item.type == 2"></el-checkbox>
          </div>
        </el-checkbox-group>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option } from './const/image-space';
import request from '@/utils/request';
import dayjs from 'dayjs';
import { imageHandler, transitionTreeArray } from '@/utils/index';
import { round, debounce } from 'lodash';

export default {
  name: 'ImageSpace',
  props: ['belongRootId', 'limit'],
  mixins: [crud],
  components: {},
  computed: {
    option() {
      return option(this);
    },
    selFolderList() {
      const { belongRootId, shopsId } = this.selectionList[0] || this.currentRow;
      return transitionTreeArray(
        this.originList.map(item => ({
          ...item,
          disabled: (shopsId != undefined && item.shopsId != shopsId) || (belongRootId && item.belongRootId != belongRootId),
        })),
        { id: 'ID' }
      );
    },
    folderList() {
      return transitionTreeArray(
        this.originList.map(item => ({
          ...item,
          disabled: this.belongRootId && item.belongRootId && this.belongRootType[this.belongRootId].id != item.belongRootId,
        })),
        { id: 'ID' }
      );
    },
  },
  watch: {
    dialogVisible(val) {
      if (val === false) {
        this.form = {};
      }
    },
  },
  data() {
    return {
      mode: '列表模式',
      COM_HTTP: http,
      isShowFirst: false,
      dialogVisible: false,
      originList: [],
      options: [],
      form: {},
      extraData: {
        type: '', // 1文件夹, 2图片,
        parentId: '',
        platformShopsId: '',
        belongRootId: '',
      },
      measure: {
        // 1: 3/2,
        2: {
          width: 1,
          height: 1,
        },
        3: {
          width: 1,
          height: 1,
        },
        8: {
          width: 1,
          height: 1,
        },
        9: {
          width: 1,
          height: 1,
        },
      },
      status: 0, // 0新增, 1移动, 2批量移动
      exportVisibility: false,
      graphics: 0,
      currentNode: {},
      checkedCities: [],
      belongRootType: {
        0: {
          name: '商品图',
          id: 1,
        },
        1: {
          name: '属性图',
          id: 2,
        },
        2: {
          name: '首页分类图',
          id: 3,
        },
        3: {
          name: '三级分类图',
          id: 4,
        },
        4: {
          name: '商品详情图',
          id: 5,
        },
        5: {
          name: 'Banner图',
          id: 6,
        },
        6: {
          name: '其他',
          id: 13,
        },
      },
    };
  },
  setup() {},
  methods: {
    pushChech(item) {
      const { id } = item;
      if (item.type == 1) {
        // 点击文件夹
        this.moveSnglFun(item);
        return;
      }
      if (this.checkedCities.includes(id)) {
        this.checkedCities = this.checkedCities.filter(item => item != id);
      } else {
        this.checkedCities.push(id);
      }
      this.syncSel();
    },
    selAllBtnFun() {
      this.checkedCities = this.checkedCities.length == this.tableList.length ? [] : this.tableList.map(item => item.id);
      this.syncSel();
    },
    modeBtnFun() {
      this.mode = this.mode == '缩略图模式' ? '列表模式' : '缩略图模式';
    },
    selectionChange(val) {
      this.checkedCities = val.map(item => item.id);
    },
    syncSel() {
      const arr = this.checkedCities;
      if (arr.length == this.selectionList.length) return;
      this.toggleRowSelection(arr.map(element => this.tableList.find(item => item.id == element)));
    },
    onChange(val) {
      this.syncSel();
      console.log('val', val);
    },
    batchDelFunParamsHandle(list) {
      if (this.selectionList.some(item => item.type == 1)) {
        this.$message.warning('文件夹不能删除, 请取消勾选');
        return false;
      }
      return list;
    },
    customFormattingData(tableData) {
      return tableData
        .map(item => ({
          ...item,
          picUrl:
            item.picUrl ||
            'https://img.plushe.com/eyJidWNrZXQiOiJwcm8tcGx1c2hlIiwia2V5IjoicHJvZHVjdC8yMDIxMDUyMTE4MDYwNDQ3NDgxMDc3LzIwMjEwNTIxMTgwNjA0MDQ3LnBuZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJjb3ZlciJ9fX0=',
          bigUrl: imageHandler(1, item.picKey),
          picSize:
            item.picSize != ''
              ? Number(item.picSize) > 1048576
                ? round(Number(item.picSize) / 1048576, 2) + 'M'
                : round(Number(item.picSize) / 1024, 2) + 'KB'
              : '--',
        }))
        .sort((a, b) => a.type - b.type);
    },
    moveSnglFun(parms) {
      this.currentRow = { ...parms };
      if (parms.type == 2) {
        const arr = [];
        const { ID } = this.currentNode;
        let find = this.originList.find(item => item.ID == ID);
        arr.unshift(find.ID);
        while (find.parentId != -1) {
          find = this.originList.find(item => item.ID == find.parentId);
          arr.unshift(find.ID);
        }
        this.form.parentId = arr;
        this.status = 1;
        this.dialogVisible = true;
      } else if (parms.type == 1) {
        this.setCurrentKey(`${parms.shopsId}${parms.id}`);
        this.nodeClick();
      }
    },
    movesBtnFun() {
      const arr = [];
      const { ID } = this.currentNode;
      let find = this.originList.find(item => item.ID == ID);
      arr.unshift(find.ID);
      while (find.parentId != -1) {
        find = this.originList.find(item => item.ID == find.parentId);
        arr.unshift(find.ID);
      }
      this.form.parentId = arr;
      this.status = 2;
      this.dialogVisible = true;
    },
    addCustBtnFun() {
      const arr = [];
      const { ID } = this.currentNode;
      let find = this.originList.find(item => item.ID == ID);
      arr.unshift(find.ID);
      while (find.parentId != -1) {
        find = this.originList.find(item => item.ID == find.parentId);
        arr.unshift(find.ID);
      }
      this.form.parentId = arr;
      this.status = 0;
      this.dialogVisible = true;
    },
    submit() {
      const { fileDirName, parentId: parentIdList } = this.form;
      if (!parentIdList || !parentIdList[1]) return this.$message.warning('请选择文件夹');
      // 表单选中的文件夹
      const parent = this.originList.find(item => item.ID == parentIdList[parentIdList.length - 1]);
      const { shopsId, id } = this.currentNode; // 左侧选中的文件夹
      if (this.status == 0) {
        if (!fileDirName) return this.$message.warning('请填写文件名称');
        if (parentIdList.length > 3) return this.$message.warning('文件夹最多三级');
        this.addFun({
          platformShopsId: shopsId,
          fileDirName,
          parentId: parent.id,
        }).then(_ => {
          this.dialogVisible = false;
          this.getPictureFileList();
          this.form = {};
        });
      } else if (this.status == 1 || this.status == 2) {
        http['movePictures']({
          currentFileDir: id,
          moveToFileDir: parent.id,
          ids: this.status == 1 ? [this.currentRow.id] : this.selectionList.map(item => item.id),
        }).then(_ => {
          this.$message.success('操作成功');
          this.getPictureFileList();
          this.dialogVisible = false;
          this.form = {};
        });
      }
    },
    getPictureFileList() {
      http.PictureFile().then(res => {
        let arr = [];
        let treeArr = [];
        res.forEach(element => {
          treeArr = element.optPicDirRespList.filter(item => item.parentId === '0');
          arr = arr.concat(
            element.optPicDirRespList.map(item => ({
              ...item,
              ID: `${element.shopsId}${item.id}`,
              parentId: `${element.shopsId}${item.parentId}`,
              shopsId: element.shopsId,
            }))
          );
          arr.push({
            ...element,
            fileDirName: element.fileDirName || element.shopsName || `平台`,
            parentId: -1,
            ID: `${element.shopsId}0`,
          });
        });
        treeArr.forEach(item => {
          switch (item.fileDirName) {
            case '商品图片':
              this.belongRootType[0] = {
                name: item.fileDirName,
                id: item.id,
              };
              break;
            case '属性图片':
              this.belongRootType[1] = {
                name: item.fileDirName,
                id: item.id,
              };
              break;
            case '首页分类图':
              this.belongRootType[2] = {
                name: item.fileDirName,
                id: item.id,
              };
              break;
            case '三级分类图':
              this.belongRootType[3] = {
                name: item.fileDirName,
                id: item.id,
              };
              break;
            case '商品详情图':
              this.belongRootType[4] = {
                name: item.fileDirName,
                id: item.id,
              };
              break;
            case 'Banner图':
              this.belongRootType[5] = {
                name: item.fileDirName,
                id: item.id,
              };
              break;
            case '其他':
              this.belongRootType[6] = {
                name: item.fileDirName,
                id: item.id,
              };
              break;
            default:
              break;
          }
        });
        this.originList = arr;
        if (!this.currentNode.id) {
          const { shopsId } = this.user;
          setTimeout(() => {
            this.setCurrentKey(`${shopsId || 0}${this.belongRootType[0].id}`);
            this.nodeClick();
          }, 0);
        } else {
          setTimeout(() => {
            this.setCurrentKey(this.currentNode.ID);
            this.searchFun();
          }, 0);
        }
      });
    },
    searchFunBefore() {
      if (this.examineSelected()) {
        this.$message.warning('请选择文件夹');
        return false;
      }
    },
    examineSelected() {
      this.currentNode = { ...this.$refs.folder.getCurrentNode() };
      console.log('getCurrentNode', { ...this.currentNode });
      const { id, shopsId, belongRootId } = this.currentNode;
      if (!id) return 1;
      this.extraData.platformShopsId = shopsId;
      this.extraData.belongRootId = belongRootId;
      this.extraData.parentId = id > 0 ? id : '';
      const { overall } = this.formData;
      if (overall) {
        this.extraData.picName = overall;
        delete this.extraData.parentId;
        delete this.extraData.overall;
      } else {
        delete this.extraData.picName;
      }
      if (id < 0) return 2;
      return 0;
    },
    getImageAttr(file) {
      return new Promise((resole, reject) => {
        let height, width;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
          const img = new Image();
          img.src = reader.result;
          img.onload = function() {
            width = img.width;
            height = img.height;
            resole({ width, height });
          };
        };
        setTimeout(() => {
          reject();
        }, 6000);
      });
    },
    async uploadImage(res) {
      const { picKey } = res;
      const { name, size } = res.file;
      console.log('uploadImage', res);
      try {
        const imageAttr = await this.getImageAttr(res.file);
        await request.post('Picture/batchUpload', {
          optPictureRequestList: [
            {
              picDimensions: `${imageAttr.width}*${imageAttr.height}`,
              picKey: picKey,
              picName: name,
              picSize: size,
              picUploadTime: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS ZZ'),
              status: 1,
            },
          ],
          parentId: this.extraData.parentId,
          platformShopsId: this.extraData.platformShopsId,
        });
      } catch (error) {
        this.$message.warning('上传图片出错');
      }
    },
    downSnglFun: debounce(
      function(parms) {
        const { picKey, picName } = parms;
        request.get(`/aws/getS3Link?key=${picKey}`).then(res => {
          this.downloadFile(res, { fileName: picName });
        });
        // const type = picKey.split('.')[1];
        // this.getImgBase64(imageHandler(1, picKey), type)
        //   .then(res => {
        //     this.downloadFile(res, { fileName: picName });
        //   })
        //   .catch(err => {
        //     this.$message.warning(err);
        //   });
      },
      1000,
      { leading: true, trailing: false }
    ),
    getImgBase64(url, type = 'png') {
      return new Promise((resole, reject) => {
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        // image.crossorigin = 'Anonymous';
        image.src = url;
        image.onload = function() {
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, image.width, image.height);
          const URI = canvas.toDataURL(`image/${type}`);
          resole(URI);
        };
        image.onerror = function() {
          reject('下载异常,请联系技术处理');
        };
        setTimeout(() => {
          reject('图片下载超时');
        }, 10000);
      });
    },
    nodeClick(data, node) {
      const { ID } = this.currentNode;
      if (data && (data.disabled || data.ID === ID)) {
        this.setCurrentKey(ID);
        return;
      }
      setTimeout(() => {
        this.searchFun();
      }, 50);
    },
    importImgBtnFun() {
      if (this.examineSelected() != 0) {
        this.$message.warning('请先选择图片文件夹后上传');
        return Promise.reject();
      }
      this.exportVisibility = true;
    },
    async beforeUpload(file) {
      if (file.size > 6 * 1024 * 1024) {
        this.$message.error(`大小限制为6M`);
        return Promise.reject();
      }
      if (!new RegExp('image/jpeg|image/jpg|image/png|image/webp|image/gif').test(file.type)) {
        this.$message.error(`只能上传jpeg,jpg,png,webp格式图片`);
        return Promise.reject();
      }
      const { belongRootId } = this.currentNode;
      const { width: originWidth, height: originHeight } = this.measure[belongRootId] || {};
      if (originWidth) {
        const { width, height } = await this.getImageAttr(file);
        console.log('图片尺寸', { width, height });
        if (width / height !== originWidth / originHeight) {
          this.$message.warning(`${file.name}图片比例为${width}*${height}不允许上传, 应为${originWidth}*${originHeight}`);
          return Promise.reject();
        }
      }
      if (this.graphics == 50) {
        this.$message.error(`最多上传50张图片`);
        return Promise.reject();
      }
      this.graphics++;
      return Promise.resolve();
    },
    httpRequest(option) {
      return http['uploadImg'](option.file).then(picKey => {
        this.uploadImage({ file: option.file, picKey }).then(res => {
          this.graphics--;
          if (this.graphics == 0) {
            this.$message.success('上传成功');
            this.nodeClick();
          }
        });
      });
    },
    enterBtnFun() {
      window.open(`${location.origin}/#/image-space`, '_blank');
    },
    rowClick(parms) {
      if (parms.type == 1) {
        this.setCurrentKey(`${parms.shopsId}${parms.id}`);
        this.nodeClick();
      }
    },
    setCurrentKey(id) {
      // const { shopsId } = this.user;
      console.log('setCurrentKey', id);
      this.$refs.folder.setCurrentKey(id);
    },
  },
  mounted() {
    this.getPictureFileList();
  },
};
</script>

<style lang="scss" scoped>
.image-space {
  flex: 1;
  display: flex;
  position: relative;
  max-height: 100%;
  .opt {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    .move,
    .down {
      flex: 1;
      text-align: center;
      line-height: 24px;
      cursor: pointer;
      background: #f9f9f9;
    }
    .down {
      background: #f0f0f0;
    }
  }
  .index {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 16px;
    line-height: 1;
    color: #409eff;
    border: 1px solid #f5f3f1;
    border-radius: 50%;
    padding: 3px 6px;
  }
  :deep() {
    .avue-crud__table .el-table {
      display: block;
    }
    .el-upload-dragger {
      height: 200px;
    }
    .el-pagination .el-input__inner {
      border-color: #c0c4cc;
    }
    .el-tree {
      min-width: 200px;
      border-right: 1px solid #000;
      overflow-y: auto;
      .el-tree-node__label {
        max-width: 100px;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap;
      }
      .el-tree-node[aria-disabled='true'] {
        background: #f2f2f2;
        .el-tree-node__content {
          cursor: not-allowed;
        }
      }
      .el-tree-node.is-current > .el-tree-node__content {
        background: #409eff;
        color: #fff;
      }
    }
    .el-checkbox__label {
      display: none;
    }
  }
  .thumbnail {
    display: none;
  }
}
.image-space.hide {
  .thumbnail {
    display: flex;
    align-content: flex-start;
  }
  :deep() {
    .avue-crud__table {
      min-height: 88px;
      flex: 0;
      // padding: 0;
    }
    .avue-crud__table .el-table {
      display: none;
    }
  }
}
.thumbnail {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 30px;
  flex: 1;
  overflow-y: auto;
  .thumbnail_item {
    width: 120px;
    height: 150px;
    display: flex;
    font-size: 12px;
    flex-direction: column;
    align-items: center;
    border: 1px solid #000;
    padding: 15px;
    margin-right: 20px;
    position: relative;
    margin-bottom: 20px;
    line-height: 1;
    text-align: center;
    .name {
      font-size: 14px;
      margin-top: 10px;
      height: 15px;
      line-height: 1;
      margin-bottom: 5px;
      overflow: hidden;
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .el-image {
      width: 40px;
      height: 40px;
    }
  }
  .checkbox {
    position: absolute;
    left: 5px;
    top: 5px;
    .el-checkbox__label {
      display: none;
    }
  }
}
</style>
