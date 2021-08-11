export const RULE = {
  required: { required: true, message: `必填项(文本前后不能有空格)`, pattern: /^(?!.*(^\s|\s$))/, trigger: ['change', 'blur'] },
  requiredT: { required: true, message: `必填项`, pattern: /^(?!.*(^\s|\s$))/, trigger: ['change', 'blur'] },
  phone: {
    pattern: /^1[23456789]d{9}$/,
    message: `请输入正确手机`,
    trigger: ['blur', 'change'],
  },
  url: {
    pattern: /\w\.+\w/g,
    message: `请输入正确URL地址`,
    trigger: ['blur', 'change'],
  },
  eMail: {
    pattern: /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/,
    message: `请输入正确邮箱`,
    trigger: ['blur', 'change'],
  },
  bothBlank: {
    pattern: /^(?!.*(^\s|\s$))/,
    message: `请去除两端空格`,
    trigger: ['blur', 'change'],
  },
  eliminateStr: {
    pattern: /^(?!.*(o|O|0))/,
    message: `限制非0oO字符`,
    trigger: ['blur', 'change'],
  },
  numberIntZero: {
    pattern: /^[0-9]\d*$/,
    message: `限制整数`,
    trigger: ['blur', 'change'],
  },
  character: {
    pattern: /^(?!.*\W)/,
    message: `请输入字母数字组合`,
    trigger: ['blur', 'change'],
  },
  numberInt: {
    pattern: /^\+?[1-9][0-9]*$/,
    message: `限制非0整数`,
    trigger: ['blur', 'change'],
  },
  numberInt2: {
    pattern: /^(\-?)\d*$/,
    message: `限制整数(可负数)`,
    trigger: ['blur', 'change'],
  },
  oneDecimal: {
    pattern: /^([0-9]|[1-9]\d+)(\.\d{0,1})?$/,
    message: `限制一位小数内`,
    trigger: ['blur', 'change'],
  },
  twoDecimal: {
    pattern: /^([0-9]|[1-9]\d+)(\.\d{1,2})?$/,
    message: `限制两位小数内`,
    trigger: ['blur', 'change'],
  },
  fixedLengthTwo: {
    min: 2,
    max: 2,
    message: '限2个字符',
    trigger: ['blur', 'change'],
  },
  lengthTwo: {
    min: 0,
    max: 2,
    message: '限2个字符内',
    trigger: ['blur', 'change'],
  },
  lengthFour: {
    min: 0,
    max: 4,
    message: '限4个字符内',
    trigger: ['blur', 'change'],
  },
  lengthFive: {
    min: 0,
    max: 5,
    message: '限5个字符内',
    trigger: ['blur', 'change'],
  },
  lengthSix: {
    min: 0,
    max: 6,
    message: '限6个字符内',
    trigger: ['blur', 'change'],
  },
  lengthEight: {
    min: 0,
    max: 8,
    message: '限8个字符内',
    trigger: ['blur', 'change'],
  },
  lengthTen: {
    min: 0,
    max: 10,
    message: '限10个字符内',
    trigger: ['blur', 'change'],
  },
  lengthEleven: {
    min: 0,
    max: 11,
    message: '限11个字符内',
    trigger: ['blur', 'change'],
  },
  lengthTwelve: {
    min: 0,
    max: 12,
    message: '限12个字符内',
    trigger: ['blur', 'change'],
  },
  lengthFifteen: {
    min: 0,
    max: 15,
    message: '限15个字符内',
    trigger: ['blur', 'change'],
  },
  lengthEighteen: {
    min: 0,
    max: 18,
    message: '限18个字符内',
    trigger: ['blur', 'change'],
  },
  lengthTwenty: {
    min: 0,
    max: 20,
    message: '限20个字符内',
    trigger: ['blur', 'change'],
  },
  lengthTwentyFive: {
    min: 0,
    max: 25,
    message: '限25个字符内',
    trigger: ['blur', 'change'],
  },
  lengthThirty: {
    min: 0,
    max: 30,
    message: '限30个字符内',
    trigger: ['blur', 'change'],
  },
  lengthThirtytwo: {
    min: 0,
    max: 32,
    message: '限32个字符内',
    trigger: ['blur', 'change'],
  },
  lengthFourty: {
    min: 0,
    max: 40,
    message: '限40个字符内',
    trigger: ['blur', 'change'],
  },
  lengthFifty: {
    min: 0,
    max: 50,
    message: '限50个字符内',
    trigger: ['blur', 'change'],
  },
  lengthSixty: {
    min: 0,
    max: 60,
    message: '限60个字符内',
    trigger: ['blur', 'change'],
  },
  lengthEighty: {
    min: 0,
    max: 80,
    message: '限80个字符内',
    trigger: ['blur', 'change'],
  },
  lengthOneHundred: {
    min: 0,
    max: 100,
    message: '限100个字符内',
    trigger: ['blur', 'change'],
  },
  lengthTwoHundred: {
    min: 0,
    max: 200,
    message: '限200 个字符内',
    trigger: ['blur', 'change'],
  },
  lengTwoThousandFifty: {
    min: 0,
    max: 250,
    message: '限250个字符内',
    trigger: ['blur', 'change'],
  },
  lengthFourToThirty: {
    min: 4,
    max: 30,
    message: '长度在4-30个字符',
    trigger: ['blur', 'change'],
  },
  lengthFiveHd: { min: 0, max: 500, message: '限500个字符内', trigger: 'blur' },
  lengTwoThousand: {
    min: 0,
    max: 2000,
    message: '限2000个字符内',
    trigger: ['blur', 'change'],
  },
  arrRequired: { required: true, validator: arr, trigger: ['change'] },
  checkPassword: { validator: checkPassword, trigger: ['blur', 'change'] }, // 验证密码
};

export const VALIDATION = {
  phone: {
    value: /^1[3|4|5|6|7|8|9][0-9]\d{8,8}$/,
    label: '输入的手机号码格式不正确',
  },
  checkPassword: {
    value: /^[A-Z][A-Za-z0-9]{5,17}$/,
    label: '请输入大写字母开头的6-18位英文和数字',
  },
};

// 验证固话
export function phone(rule, val, callback) {
  const { value, label } = VALIDATION.phone;
  if (val && !value.test(val)) {
    callback(new Error(label));
  } else {
    callback();
  }
}
// 验证密码
export function checkPassword(rule, val, callback) {
  const { value, label } = VALIDATION.checkPassword;
  if (val && !value.test(val)) {
    callback(new Error(label));
  } else {
    callback();
  }
}
export function arr(rule, val, callback) {
  if (val && val[0]) {
    callback();
  } else {
    callback(new Error('请选择'));
  }
}
