<template>
  <el-dialog top="5vh" :title="type == 1 ? 'SKU售后' : '整单售后'" v-model="dialogVisible" width="40%">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="商品名称" v-if="type == 1">
        {{ row.productName }}
      </el-form-item>
      <el-form-item label="订单编号" v-else>
        {{ order.orderSn }}
      </el-form-item>
      <el-form-item label="售后类型" prop="returnType">
        <el-select v-model="form.returnType" :disabled="!!only && type == 0" placeholder="请选择" @change="changeRetrunType">
          <el-option v-for="(label, value) in returnTypes" :key="value" :label="label" :value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退款数量" v-if="type == 1" prop="returnNum">
        <el-input-number
          v-model="form.returnNum"
          :disabled="row.productQuantity <= 1 || form.returnType == 3"
          :min="1"
          :max="row.productQuantity"
          label="退款数量"
        ></el-input-number>
      </el-form-item>
      <el-form-item :label="`退款金额(${$t('currencySymbol')})`" prop="returnAmount">
        <el-input :disabled="form.returnType <= 1 || form.returnType == 3" v-model="form.returnAmount" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="售后原因" prop="returnReasonId">
        <el-select v-model="form.returnReasonId" placeholder="请选择">
          <el-option v-for="(label, value) in Dict.returnReasonId" :key="value" :label="label" :value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="售后备注" prop="handleNote">
        <el-input type="textarea" v-model="form.handleNote" :maxlength="120" show-word-limit placeholder="请输入120字长度"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" :disabled="isDisabled">提 交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { http, Dict } from '../const/list';

export default {
  props: {
    // 退款入口：1--点击商品(SKU)，0 点击整单售后按钮
    type: {
      type: Number,
      default: 1,
    },
    modelValue: {
      type: Boolean,
    },
    // 单个商品的信息
    row: {
      type: Object,
    },
    // 订单整体信息
    order: {
      type: Object,
    },
    // 仅能选择一个退款类型，禁用
    only: {
      type: String,
    },
  },
  emits: ['update:modelValue', 'submit'],
  data() {
    const checkReturnAmountYuan = (rule, value, callback) => {
      const reg = /(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1,2}$)/;
      if (!reg.test(value)) {
        callback(new Error('请输入正确的金额'));
      }
      if (this.type == 0) {
        if (value > (this.order.totalPayAmountYuan || this.order.countPayPriceYuan)) {
          callback(new Error('超过该笔订单付款总额' + this.order.totalPayAmountYuan || this.order.countPayPriceYuan));
        } else {
          callback();
        }
      } else {
        if (value > (this.row.totalAmountYuan || this.row.countPayPriceYuan)) {
          callback(new Error('超过该笔订单金额上限' + (this.row.totalAmountYuan || this.row.countPayPriceYuan)));
        } else {
          callback();
        }
      }
    };
    return {
      returnTypes: {}, // 退款类型
      form: {
        returnType: undefined, // 退款类型
        returnAmount: undefined, // 退款金额
        returnReasonId: undefined, // 退款原因
        handleNote: undefined, // 退款备注
        returnNum: undefined, // 退货数量
      },
      rules: {
        returnType: [
          {
            required: true,
            message: '请选择售后类型',
            trigger: 'change',
          },
        ],
        returnReasonId: [
          {
            required: true,
            message: '请选择退款原因',
            trigger: 'change',
          },
        ],
        returnNum: [
          {
            required: true,
            message: '请填写',
            trigger: 'blur',
          },
        ],
        returnAmount: [
          {
            required: true,
            validator: checkReturnAmountYuan,
            trigger: ['blur', 'change'],
          },
        ],
      },
      Dict: Dict,
      isDisabled: false, // 提交按钮是否被禁用状态
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.modelValue;
      },
      set(value) {
        for (const key in this.form) {
          this.form[key] = undefined;
        }
        this.$refs['form'].resetFields();
        this.$emit('update:modelValue', value);
      },
    },
  },
  watch: {
    type: {
      handler(newVal) {
        const obj = {};
        for (const key in Dict.returnType) {
          if (newVal == 1) {
            if (key >= 3) {
              obj[key] = Dict.returnType[key];
            }
          } else {
            if (key < 3) {
              obj[key] = Dict.returnType[key];
            }
          }
        }
        this.returnTypes = obj;
      },
      immediate: true,
    },
    only: {
      handler(newVal) {
        if (newVal) {
          this.form.returnType = newVal + '';
          this.form.returnAmount = newVal == 0 ? this.order.totalPayAmountYuan : undefined; // 整单全部退含运费，回显固定金额
        }
      },
      immediate: true,
    },
    modelValue: {
      handler(newVal) {
        console.log('modelValue', newVal);
        if (newVal) {
          if (this.type == 1) {
            this.form.returnType = '4';
            this.form.returnAmount = '';
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 退款类型发生更改时：
    changeRetrunType(value) {
      if (value == 0) {
        // 整单全部退（含运费）
        this.form.returnAmount = this.order.totalPayAmountYuan;
      } else if (value == 1) {
        // 整单全部退（不含运费）
        this.form.returnAmount = this.order.totalPayAmountYuan - this.order.freightAmountYuan;
      } else if (value == 2 || value == 4) {
        // 整单部分退 or SKU部分退
        this.form.returnAmount = '';
        this.form.returnNum = value == 4 ? 1 : undefined;
      } else {
        // SKU 全部退
        this.form.returnAmount = this.row.totalAmountYuan || this.row.countPayPriceYuan;
        this.form.returnNum = this.row.productQuantity;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 注意金额类的 key 是不带 Yuan结尾，但是值其实是 含有Yuan 结尾的金额
          const keys = [
            'orderId',
            'orderSn',
            'totalPayAmount',
            'freightAmount',
            'orderStatus',
            'orderItemId',
            'skuNo',
            'productName',
            'productNo',
            'countPayPrice',
          ];
          const params = {
            totalAmount: this.row.totalAmountYuan || '',
          };
          for (const key in this.order) {
            if (keys.includes(key)) {
              if (key.includes('Amount') || key.includes('Price')) {
                params[key] = this.order[key + 'Yuan'];
              } else {
                params[key] = this.order[key];
              }
            }
            if (key == 'id') {
              params.orderId = this.order.id;
            }
          }
          if (this.type == 1) {
            for (const key in this.row) {
              if (keys.includes(key)) {
                if (key.includes('Amount') || key.includes('Price')) {
                  params[key] = this.row[key + 'Yuan'];
                } else {
                  params[key] = this.row[key];
                }
              }
            }
            // 将商品的id 回传给后台：
            if (!params.orderItemId) params.orderItemId = this.row.id;
          }
          this.isDisabled = true;
          Object.assign(params, this.form);
          http
            .returnOrder(params)
            .then((row) => {
              this.$message.success('提交成功！');
              this.dialogVisible = false;
              this.$emit('submit', this.order);
              this.isDisabled = false;
            })
            .catch((_) => {
              this.isDisabled = false;
            });
        }
      });
    },
  },
};
</script>

<style></style>
