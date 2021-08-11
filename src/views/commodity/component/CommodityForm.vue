<template>
  <el-dialog
    top="5vh"
    :title="`${status == 1 ? '新增' : '编辑'}商品`"
    :before-close="beforeClose"
    destroy-on-close
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    v-model="dialogVisible"
    width="80%"
  >
    <el-form ref="editForm" :model="editForm" :rules="rules" label-width="120px" :style="{ width: '90%' }">
      <el-form-item label="商品名称" prop="name">
        <el-input maxlength="60" v-model="editForm.name"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number :max="99999" :min="0" v-model="editForm.sort"></el-input-number>
      </el-form-item>
      <el-form-item label="SPU编码" prop="productNo">
        <el-input maxlength="10" :disabled="!!editForm.id" placeholder="空则自动生成" v-model="editForm.productNo"></el-input>
      </el-form-item>
      <el-form-item label="所属品牌" prop="brand">
        <el-select v-model="editForm.brand" placeholder="请选择">
          <el-option :label="item" :value="index" :key="index" v-for="(item, index) in brandsList"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属类目" prop="category">
        <el-cascader :show-all-levels="false" :options="categoryList" v-model="editForm.category" :props="{ value: 'id' }"></el-cascader>
      </el-form-item>
      <el-form-item label="基础属性" v-if="primaryList.length">
        <template v-for="(item, index) in primaryList" :key="item.id">
          <div v-if="item.group" style="display: inline-block; font-size: 14px; margin-right: 20px; color: #606266">{{ item.name }}</div>
          <el-checkbox-group v-model="editForm.primary[index]" v-if="!item.group">
            <div style="display: inline-block; font-size: 14px; margin-right: 20px; color: #606266">{{ item.name }}</div>
            <el-checkbox v-for="element in item.list" :label="element.id" :key="element.id">{{ element.val }}</el-checkbox>
          </el-checkbox-group>
          <el-cascader v-else v-model="editForm.primary[index]" :props="{ multiple: true }" :options="item.groupList"></el-cascader>
        </template>
      </el-form-item>
      <el-form-item label="附加属性" v-if="secondaryList.length">
        <template v-for="(item, index) in secondaryList" :key="item.id">
          <div v-if="item.group" style="display: inline-block; font-size: 14px; margin-right: 20px; color: #606266">{{ item.name }}</div>
          <el-checkbox-group v-model="editForm.secondary[index]" v-if="!item.group">
            <div style="display: inline-block; font-size: 14px; margin-right: 20px; color: #606266">{{ item.name }}</div>
            <el-checkbox v-for="element in item.list" :label="element.id" :key="element.id">{{ element.val }}</el-checkbox>
          </el-checkbox-group>
          <el-cascader v-else v-model="editForm.secondary[index]" :props="{ multiple: true }" :options="item.groupList"></el-cascader>
          <br />
        </template>
      </el-form-item>
      <el-form-item label="商品描述" prop="productDesc">
        <el-input type="textarea" placeholder="请输入商品描述" v-model="editForm.productDesc"></el-input>
      </el-form-item>
      <el-form-item label="商品标签" prop="productLabel">
        <el-tag :key="tag" v-for="tag in tags.list" closable :disable-transitions="false" @close="handleClose(tag)">
          {{ tag }}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="tags.visible"
          v-model="tags.inputValue"
          ref="saveTagInput"
          size="small"
          type="textarea"
          placeholder="注：标签之间用英文逗号隔开，如：test,test2"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </el-form-item>
      <el-form-item label="seo标题" prop="seoTitle">
        <el-input maxlength="60" placeholder="请输入seo标题" v-model="editForm.seoTitle"></el-input>
      </el-form-item>
      <el-form-item label="seo描述" prop="seoDesc">
        <el-input maxlength="60" placeholder="请输入seo描述" v-model="editForm.seoDesc"></el-input>
      </el-form-item>
      <el-form-item label="产品配图" prop="picValue">
        <el-row>
          <span style="marginright: 10px">关联属性</span>
          <el-select v-model="editForm.picValue" placeholder="请选择产品配图属性">
            <el-option v-for="(item, index) in selOrigin" :key="index" :label="item.name" :value="index"> </el-option>
          </el-select>
        </el-row>
        <template v-if="!isNaN(editForm.picValue) && selOrigin[editForm.picValue]">
          <el-row type="flex">
            <span style="width: 150px">属性值名称</span>
            <span>产品图片(2~20张)</span>
          </el-row>
          <el-row v-for="element in selOrigin[editForm.picValue].list" :key="element.id" type="flex">
            <span style="width: 150px; color: #3b91c8">{{ element.val }}</span>
            <div class="img-box">
              <BaseSelectImg v-model="element.fileList" :formItem="{ limit: 20, belongRootId: '0' }" />
              <div class="pic-title-wrap">
                <ul class="pic-title-list">
                  <li v-for="(item, index) of element.fileList" :key="index" class="list">
                    <el-input v-model="item.picTitle" :placeholder="`图片${index+1}标题`"></el-input>
                  </li>
                </ul>
              </div>
            </div>
            <el-cascader
              v-model="element.modelList"
              :options="modelOptions"
              :show-all-levels="false"
              :props="{ multiple: true, checkStrictly: true }"
              clearable
              style="height: 100%;"
              @change="modelChange($event, element)"
            ></el-cascader>
          </el-row>
        </template>
      </el-form-item>
      <el-form-item label="详情图片" prop="tipPic">
        <BaseSelectImg v-model="editForm.tipPic" :formItem="{ limit: 20, belongRootId: 4 }" />
      </el-form-item>
      <el-form-item label="DPA图片" prop="dpaPic">
        <BaseSelectImg v-model="editForm.dpaPic" :formItem="{ limit: 1, belongRootId: 2 }" />
      </el-form-item>
      <!-- <el-form-item label="价格组成" prop="costShowType">
        <el-radio-group v-model="editForm.costShowType">
          <el-radio :label="1">展示</el-radio>
          <el-radio :label="0">不展示</el-radio>
        </el-radio-group>
        <el-row type="flex">
          <div v-for="item in compositionList" :key="item" style="margin: 0 30px 20px 0;">
            <span>{{ item.name }}</span>
            <span style="margin: 0 5px 0 5px;">$</span>
            <el-input maxlength="13" v-model="editForm[item.key]" :style="{ width: '100px' }"></el-input>
          </div>
        </el-row>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="beforeClose">取 消</el-button>
        <!-- <el-button @click="submit()">存草稿</el-button> -->
        <el-button type="primary" @click="submit(true)">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { RULE } from '@utils/validators';
import { http } from '../const/categories';
import { transitionTreeArray } from '@utils/index';
import { mapGetters } from 'vuex';
import { cloneDeep, flattenDeep } from 'lodash';
import { imageHandler } from '@/utils/index';

export default {
  props: ['currentRow', 'status'],
  emits: ['update:status', 'submit'],
  data() {
    return {
      originData: null,
      originList: [],
      categoryNo: '',
      modelOptions: [], // 模特列表
      rules: {
        name: [RULE.required],
        category: [RULE.required],
        // costShowType: [RULE.required],
        brand: [RULE.required],
        // tipPic: [RULE.required],
        picValue: [RULE.required],
        productNo: [RULE.character],
        // productNo: [{ pattern: /^[A-Z]{3,3}\d{7,7}/, message: `SPU为三位大写字母+7位数字`, trigger: ['blur', 'change'] }],
      },
      editForm: {
        primary: [],
        secondary: [],
        // costShowType: 1,
        materialsCost: '',
        hardwareCost: 1.5,
        laborCost: 14.57,
        dutiesCost: 6.59,
        ransportCost: 0.64,
        traditionalRetailPrice: '',
        transportCost: '',
        picValue: '',
        tipPicUrl: '',
      },
      dialogVisible: false,
      compositionList: [
        {
          name: 'Materials',
          key: 'materialsCost',
        },
        {
          name: 'Hardware',
          key: 'hardwareCost',
        },
        {
          name: 'Labor',
          key: 'laborCost',
        },
        {
          name: 'Duties',
          key: 'dutiesCost',
        },
        {
          name: 'traditionalRetail',
          key: 'traditionalRetailPrice',
        },
        {
          name: 'transport',
          key: 'transportCost',
        },
      ],
      // 产品标签相关
      tags: {
        list: [],
        visible: false,
        inputValue: '',
      },
      initialize: true,
    };
  },
  created() {
    this.getModelList();
  },
  watch: {
    // 回显参数处理
    currentRow(val) {
      if (!val) {
        this.initialize = false;
        return;
      }
      const { productCateOne, productCateTwo, productCateThree, attrValRelList, brand, dpaPicKey } = val;

      // 回显商品详情图:
      const tipPic = val.tipPicKey
        ? val.tipPicKey.map((item) => {
            return {
              picUrl: imageHandler(0, item),
              picKey: item,
            };
          })
        : '';
      if (!attrValRelList) return;
      this.editForm = {
        ...val,
        tipPic: tipPic,
        dpaPic: dpaPicKey ? [{ picUrl: imageHandler(1, dpaPicKey), picKey: dpaPicKey }] : '',
        brand: String(brand),
        category: [productCateOne, productCateTwo, productCateThree],
        // primary: attrValRelList.filter(item => item.attrType == 1).map(item => item.attrValId),
        // secondary: attrValRelList.filter(item => item.attrType == 2).map(item => item.attrValId),
      };
      this.originData = cloneDeep(val);
      // 产品标签：
      if (this.editForm.productLabel) {
        this.tags.list = this.editForm.productLabel.split(',');
      }
    },
    'editForm.category'(val) {
      if (!val || !val[2]) return;
      const vm = this.$loading();
      http
        .getProductCategoryEx({
          id: val[2],
        })
        .then((res) => {
          setTimeout(() => {
            vm.close();
          }, 50);
          if (this.originList.length != 0) {
            this.originData = null;
            this.editForm.primary = [];
            this.editForm.secondary = [];
          }
          this.categoryNo = res.categoryNo;
          if (!res.attributes || res.attributes.length == 0) return this.$message.warning('该类目下无属性,请检查');
          this.editForm.primary = [...Array(res.attributes.filter((item) => item.attrType == 1).length)].map((_) => []);
          this.editForm.secondary = [...Array(res.attributes.filter((item) => item.attrType == 2).length)].map((_) => []);
          const { picsList = [], attrValRelList = [], productModels = [] } = this.originData || {};
          const primary = attrValRelList.filter((item) => item.attrType == 1).map((item) => item.attrValId);
          const secondary = attrValRelList.filter((item) => item.attrType == 2).map((item) => item.attrValId);
          this.originList = res.attributes.map((item, index) => {
            const groupList = item.vals.reduce((pre, current) => {
              if (primary.includes(current.id)) {
                this.editForm.primary[index] = this.editForm.primary[index] || [];
                if (item.group) {
                  this.editForm.primary[index].push([current.attrId, current.id]);
                } else {
                  this.editForm.primary[index].push(current.id);
                }
              }
              if (secondary.includes(current.id)) {
                const secondaryIndex = index - this.editForm.primary.length;
                this.editForm.secondary[secondaryIndex] = this.editForm.secondary[secondaryIndex] || [];
                if (item.group) {
                  this.editForm.secondary[secondaryIndex].push([current.attrId, current.id]);
                } else {
                  this.editForm.secondary[secondaryIndex].push(current.id);
                }
              }
              pre[current.groupName] = pre[current.groupName] || [];
              pre[current.groupName].push(current);
              return pre;
            }, {});

            if (item.group) {
              item.groupList = Object.keys(groupList).map((element) => ({
                label: element,
                value: groupList[element][0].attrId,
                children: groupList[element].map((sign) => ({
                  ...sign,
                  label: sign.val,
                  value: sign.id,
                })),
              }));
            }

            item.list = item.vals.map((element, i) => {
              return {
                ...element,
                fileList: picsList
                  .filter((single) => single.attrValId == element.id)
                  .map((item) => ({
                    ...item,
                    picKey: item.picKey,
                    picUrl: imageHandler(1, item.picKey),
                  })),
                modelList: productModels
                  .filter((single) => single.attrValId == element.id)
                  .map((item) => (item.modelSize ? [item.modelId, item.modelSize] : [item.modelId])),
              };
            });
            return item;
          });

          setTimeout(() => {
            this.initialize = false;
          }, 0);
        })
        .catch((_) => {
          console.log('err', _);
          setTimeout(() => {
            this.initialize = false;
          }, 0);
          this.$message.warning('网络错误或数据异常');
        });
    },
    'editForm.primary': {
      handler(newVal, oldVal) {
        console.log('editForm.primary', this.initialize);
        if (newVal && newVal.length && !this.initialize) {
          this.editForm.picValue = undefined;
        }
      },
      deep: true,
    },
    status(val) {
      if (val) {
        this.$store.dispatch('getProductCategoryList');
        this.getModelList();
      }
      this.dialogVisible = Boolean(val);
    },
    selOrigin(val) {
      if (!this.initialize || this.editForm.picValue) return;
      const { picsList } = this.originData || {};
      if (picsList) {
        const attrId = picsList.map((item) => item.attrId)[0];
        val.forEach((item, index) => {
          if (item.id == attrId) {
            this.editForm.picValue = index;
          }
        });
      }
    },
  },
  computed: {
    ...mapGetters(['brandsList']),
    categoryList() {
      const arr = transitionTreeArray(
        this.$store.getters.productCategoryList
          .map((item) => ({
            ...item,
            disabled: item.categoryStatus != 1,
          }))
          .filter((item) => item.levels != 0)
      );
      return arr.filter((item) => {
        if (item.children) {
          item.children = item.children.filter((item) => item.children);
          return item.children.length != 0;
        }
      });
    },
    primaryList() {
      const arr = cloneDeep(this.originList.filter((item) => item.attrType == 1 && item.attrStatus == 1));
      arr.forEach((item, index, Arr) => {
        Arr[index].list.sort((a, b) => a.sorts - b.sorts);
      });
      arr.sort((a, b) => a.sorts - b.sorts);
      return arr;
    },
    secondaryList() {
      const arr = cloneDeep(this.originList.filter((item) => item.attrType == 2 && item.attrStatus == 1));
      arr.forEach((item, index, Arr) => {
        Arr[index].list.sort((a, b) => a.sorts - b.sorts);
        // Arr[index].list.push({
        //   id: '',
        //   val: '清空',
        // });
      });
      arr.sort((a, b) => a.sorts - b.sorts);
      return arr;
    },
    selOrigin() {
      const { primary } = this.editForm;
      const flattenDeepList = flattenDeep(primary);
      const arr = this.originList
        .map((item) => ({
          ...item,
          list: item.list.filter((element) => flattenDeepList.includes(element.id)),
        }))
        .filter((item) => item.list.length != 0);
      return arr;
    },
  },
  methods: {
    handleClose(tag) {
      this.tags.list = this.tags.list.filter((item) => item != tag);
    },
    handleInputConfirm() {
      this.tags.visible = false;
      const vals = this.tags.inputValue.split(',');
      vals.forEach((tag) => {
        if (tag && tag.trim() != '') this.tags.list.push(tag);
      });
      this.tags.inputValue = '';
    },
    showInput() {
      this.tags.visible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    beforeClose(fun) {
      this.initialize = true;
      this.originData = null;
      this.editForm = {
        primary: [],
        secondary: [],
        // costShowType: 1,
        materialsCost: '',
        hardwareCost: 1.5,
        laborCost: 14.57,
        dutiesCost: 6.59,
        ransportCost: 0.64,
        traditionalRetailPrice: '',
        transportCost: '',
        picValue: '',
        dpaPicUrl: '',
      };
      this.tags = {
        list: [],
        visible: false,
        inputValue: '',
      };
      this.originList = [];
      this.$emit('update:status', 0);
      // if (fun) fun();
    },
    modelChange(val) {
      const arr = val.map((item) => item[0]);
      if (new Set(arr).size !== arr.length) {
        this.$message.warning('模特商品尺寸只能选择一项或模特与尺寸不用一起选');
      }
    },
    submit() {
      // return;
      let errStr = '';
      const { secondary, primary } = this.editForm;
      const flattenDeepList = flattenDeep(primary);
      const flattenDeepListSecondary = flattenDeep(secondary);
      const relList = [];
      const picsList = [];
      const productModelsList = [];
      try {
        // if (!id && productNo && !productNo.includes(this.categoryNo)) errStr = `SPU编码以类目编码${this.categoryNo}开头`;
        if (!this.selOrigin[this.editForm.picValue]) errStr = '请选择关联属性';
        const { attrValRelList = [], picsList: picsListOrigin = [], productModels = [] } = this.currentRow || {};
        this.originList.forEach((item) => {
          // 添加属性数组
          item.list.forEach((element) => {
            if (flattenDeepListSecondary.includes(element.id) || flattenDeepList.includes(element.id)) {
              relList.push({
                id: (attrValRelList.filter((item) => item.attrValId == element.id)[0] || {}).id,
                attrId: item.id,
                name: item.name,
                attrValId: element.id,
                attrType: item.attrType,
                // picSort: element.picSort,
                attrValStatus: 1,
              });
            }
          });
        });
        this.selOrigin[this.editForm.picValue].list.forEach((element) => {
          if (element.fileList && element.fileList.length > 1) {
            element.fileList.forEach((single, index) => {
              picsList.push({
                id: (picsListOrigin.filter((item) => item.attrValId == element.id)[index] || {}).id,
                attrId: this.selOrigin[this.editForm.picValue].id,
                attrValId: element.id,
                attrType: this.selOrigin[this.editForm.picValue].attrType,
                picKey: single.picKey,
                picSort: picsList.length,
                // picUrl: single.picUrl,
                val: element.val,
                picTitle: single.picTitle,
              });
            });
          } else {
            errStr = `请给${element.val}属性值至少配两张图`;
          }
          // 模特信息处理
          if (element.modelList) {
            const arr = element.modelList.map((sign) => sign[0]);
            if (new Set(arr).size !== arr.length) {
              errStr = '模特商品尺寸只能选择一项或模特与尺寸不用一起选';
            }
            element.modelList.forEach((sign, index) => {
              productModelsList.push({
                id: (productModels.filter((item) => item.attrValId == element.id)[index] || {}).id,
                attrId: this.selOrigin[this.editForm.picValue].id,
                attrValId: element.id,
                modelId: sign[0],
                modelSize: sign[1] || '',
              });
            });
          }
        });
        if (this.selOrigin.filter((sign) => sign.attrType == 1).length > 3) errStr = '基础属性最多选三种';
        relList.forEach((item, index, arr) => {
          arr[index].picSort = index;
        });
        picsList.forEach((item, index, arr) => {
          arr[index].picSort = arr[index].picSort || index;
        });
        // this.compositionList.forEach(item => {
        //   // 校验金额输入框内容
        //   if (!/^([0-9]|[1-9]\d+)(\.\d{1,2})?$/.test(this.editForm[item.key])) errStr = `${item.name}为数字且限制2位小数`;
        // });
      } catch (error) {
        return this.$message.warning(errStr);
      }
      if (errStr) return this.$message.warning(errStr);

      this.$refs['editForm'].validate((valid) => {
        if (!valid) return;
        this.editForm.productLabel = this.tags.list.join(','); // 产品标签
        const { category, tipPic, sort, dpaPic } = this.editForm;
        // 最终的请求需要的参数:
        const obj = {
          ...this.editForm,
          sort: sort || 9999,
          relList,
          productCateOne: category[0],
          productCateTwo: category[1],
          productCateThree: category[2],
          picsList,
          productModels: productModelsList,
          productStatus: 3, // spu修改状态为草稿
          tipPicKey: tipPic && tipPic[0] ? tipPic.map((item) => item.picKey) : [],
          dpaPicKey: dpaPic && dpaPic[0] ? dpaPic[0].picKey : '',
          dpaPic: undefined, // 删除不必要的属性
          tipPic: undefined,
        };
        if (errStr) return this.$message.warning(errStr);
        /*
          this.compositionList.forEach(item => {
            // 金额除100
            if (this.editForm[item.key] != 0) {
              obj[item.key] = this.editForm[item.key] * 100;
            } else {
              obj[item.key] = 0;
            }
          });
        */
        const parmsList = [
          'brand',
          'costShowType',
          'dpaPicKey',
          'dutiesCost',
          'hardwareCost',
          'laborCost',
          'materialsCost',
          'name',
          'picsList',
          'productCateFour',
          'productCateOne',
          'productCateTwo',
          'productCateThree',
          'productDesc',
          'productLabel',
          'productModels',
          'productNo',
          'productStatus',
          'relList',
          'seoDesc',
          'seoTitle',
          'sort',
          'tipPicKey',
          'traditionalRetailPrice',
          'transportCost',
        ];
        Object.keys(obj).forEach((item) => {
          if (!parmsList.includes(item)) {
            delete obj[item];
          }
        });
        this.$emit('submit', obj, this.beforeClose);
      });
    },
    getModelList() {
      Promise.all([http.reqModel(), http.getSizeValNames()]).then((res) => {
        const [tempModel, tempSize] = res;
        this.modelOptions = tempModel.list.map((item) => {
          return {
            value: item.modelId,
            label: item.modelName,
            children: tempSize.map((element) => ({
              value: element,
              label: `${element}(${item.modelName})`,
            })),
          };
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.img-box{
  max-width: 550px;
  overflow-x: auto;
}
.pic-title-wrap {
  width: 100%;
  display: flex;
}
.pic-title-list {
  max-width: 550px;
  margin-bottom: 20px;
  padding-right: 80px;
  display: flex;
  flex-wrap: wrap;
  .list {
    width: 80px;
    margin-right: 8px;
  }
}
.el-tag {
  margin-right: 10px;
}
</style>
