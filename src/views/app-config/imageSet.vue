<template>
  <div class="image-set">
      <ul class="image-item" v-if="getClick('list')">
          <li v-for="(item, index) in list" :key="index">
              <h2>{{item.type===3?'首页宣传图':'商品详情推荐图'}}</h2>
              <div class="image-item-link">
                  <div class="image-item-img">
                      <!-- <img :src="item.picKey" /> -->
                      <el-image :src="item.picUrl"></el-image>
                      <span>链接： {{item.internalUrl}}</span>
                  </div>
                  <span v-if="getClick('edit')" class="image-item-edit" @click="editFun(item)">编辑</span>
              </div>
          </li>
      </ul>
      <el-dialog top="10%" width="60%" v-model="dialogVisible" title="编辑图片配置">
        <ul class="submit">
            <li>
                <span>* 图片</span>
                <!-- :limit="1" -->
                <el-upload
                action=""
                class="upload"
                :show-file-list="false"
                :on-success="onSuccess"
                :http-request="httpRequest"
                drag
                v-loading="uploadLoading"
                list-type="picture-card">
                <img v-if="picUrl" :src="picUrl" class="avatar">
                <i v-else class="el-icon-plus"></i>
                </el-upload>
            </li>
            <li>
                <span>* 链接</span>
                <el-input v-model="param.internalUrl" placeholder="请输入内容"></el-input>
            </li>
        </ul>
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
import { http } from './const/imageSet';
import { imageHandler } from '@/utils/index';
import permission from '@/mixins/permission';
import customHttpRequest from '@/components/avue/core/httpRequest';
// import { mapGetters } from 'vuex';

export default {
  name: 'Banner',
  props: {},
  components: {},
  mixins: [permission],
  computed: {
    // ...mapGetters(['brandsList']),
  },
  data() {
    return {
        picKey: '',
        picUrl: '',
        param: {
            internalUrl: '',
        },
        dialogVisible: false,
        uploadLoading: false,
        list: [],
        COM_HTTP: http
    };
  },
  setup() {},
  created() {
      this.getList();
  },
  methods: {
      getList() {
          this.COM_HTTP['reqList']({pageNum: 1, pageSize: 100}).then((res) => {
            this.list = res.list.map(item => {
                item['picUrl'] = imageHandler(0, item.picKey);
                return item;
            }).filter((v) => v.type === 3 || v.type === 4);
        });
      },
    onSuccess(response, file) {
        const {picKey, picUrl} = response;
        this.uploadLoading = false;
        this.picKey = picKey;
        this.picUrl = picUrl;
    },
    async submit() {
        const {picKey, picUrl} = this;
        this.param['picKey'] = picKey;
        this.param['picUrl'] = picUrl;
        this.COM_HTTP['reqUpdate'](this.param).then((res) => {
            this.dialogVisible = false;
            this.getList();
        });
    },
    editFun(item) {
        const {picKey, picUrl} = item;
        this.picKey = picKey;
        this.picUrl = picUrl;
        this.param = item;
        this.dialogVisible = true;
    },
    httpRequest(option) {
        this.uploadLoading = true;
        const { file } = option;
        return customHttpRequest('import_temp_file', file);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.image-item{
    li{
        margin:40px 20px 0 20px;
    }
    h2{font-size:14px;font-weight: normal;}
    .image-item-link{display: flex;margin-top:10px;justify-content: space-between;
        .image-item-img{display:flex;align-items: center;
            span{margin-left:20px;}
        }
        .image-item-edit{cursor: pointer;}
    }
}
.upload {
  :deep() {
    //   .el-upload{
    //     width: 80px;
    //     height: 80px;
    //     display: inline-block;
    // }
    .el-upload-dragger,.el-upload {
      width: 80px;
      height: 80px;
      img{width:100%;height:100%;}
    }
  }
}
.el-icon-plus {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fbfdff;
  font-size: 20px;
  color: #999;

  .limitTxt,
  .uploading {
    position: absolute;
    bottom: 10%;
    left: 0;
    width: 100%;
    font-size: 14px;
    text-align: center;
  }
}
.submit{
    li{display: flex;margin-bottom:20px;
        span{width:80px;}
        .upload-demo{width:200px;
        }
    }
}
</style>
