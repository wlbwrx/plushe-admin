// import { toRefs } from 'vue';
import { isEqual } from 'lodash';
// import { cloneDeep } from 'lodash';

export default {
  emits: ['update:modelValue', 'commonHandle'], // vue3 modelValue warning
  inheritAttrs: false,
  watch: {
    formItem: {
      handler() {
        this.init();
      },
      immediate: true,
    },
    fieldValue: {
      handler(newVal, oldVal) {
        // console.log(`${this.name} - fieldValue`, cloneDeep(newVal));
        // console.log(`${this.name} - oldVal`, oldVal);
        if (newVal === undefined) return;
        if (this.name == 'avue-cascader' && Array.isArray(newVal)) {
          const { multiple, checkStrictly } = this.props || {};
          if (multiple && checkStrictly) {
            const strArr = newVal.map(item => item.join());
            console.log('strArr', strArr);
            try {
              strArr.forEach(item => {
                strArr.forEach(element => {
                  if (item !== element && item.includes(element)) {
                    this.$message.warning('已存在关联属性,不可重复选择');
                    throw Error();
                  }
                });
              });
            } catch (error) {
              if (oldVal && newVal.length > oldVal.length) {
                // this.fieldValue = oldVal;
                this.$emit(
                  'update:modelValue',
                  oldVal.map(item => (Array.isArray(item) ? item[2] || item[1] || item[0] : item)),
                  this.key
                );
              }
              return;
            }
          }
          this.$emit(
            'update:modelValue',
            newVal.map(item => (Array.isArray(item) ? item[2] || item[1] || item[0] : item)),
            this.key
          );
        } else if (this.name === 'avue-upload') {
          if (!Array.isArray(newVal)) return;
          setTimeout(() => {
            this.syncElUpload(newVal);
          }, 0);
        } else {
          this.$emit('update:modelValue', newVal, this.key);
        }
      },
      immediate: false,
      deep: true,
    },
    modelValue: {
      handler(newVal) {
        // console.log(`${this.name} - modelValue`, cloneDeep(newVal));
        if (this.fieldValue && isEqual(newVal, this.fieldValue)) return;
        if (this.name == 'avue-cascader') {
          if (!Array.isArray(newVal)) return;
          if (newVal[0] === undefined) return (this.fieldValue = undefined);
          if (this.fieldValue.length == newVal.length) return;
          const { Dict, options } = this.formItem;
          const defaultValue = [];
          (Dict || options).forEach(item => {
            if (newVal.includes(item.id)) {
              defaultValue.push([item.id]);
            }
            if (item.children) {
              item.children.forEach(element => {
                if (newVal.includes(element.id)) {
                  defaultValue.push([item.id, element.id]);
                }
                if (element.children) {
                  element.children.forEach(signl => {
                    if (newVal.includes(signl.id)) {
                      defaultValue.push([item.id, element.id, signl.id]);
                    }
                  });
                }
              });
            }
          });
          if (defaultValue.length && defaultValue.length == this.fieldValue.length && this.fieldValue) return;
          this.fieldValue = defaultValue;
        } else if (this.name === 'avue-upload') {
          if (!Array.isArray(newVal)) return;
          this.fieldValue = newVal.map((item, index) => ({
            ...item,
            uid: item.uid || index,
          }));
        } else {
          this.$nextTick(_ => {
            this.fieldValue = newVal && !isNaN(newVal) ? String(newVal) : newVal;
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  props: {
    formItem: {
      default: () => {},
    },
    modelValue: {},
  },
  created() {},
  data() {
    return {
      key: '',
      name: this.$options.name,
      fieldValue: undefined,
      disabled: false,
      clearable: true,
      showAllLevels: true,
      placeholder: '',
      options: [],
    };
  },
  methods: {
    init() {
      // console.log('init', this.name, { ...this.formItem });
      if (!this.formItem) return;
      const objectItem = this.formItem;
      const { defaultValue, Dict, remoteFun, props, key, editType } = objectItem;
      Object.keys(objectItem).forEach(inputItem => {
        if (inputItem === 'defaultValue' && this.fieldValue === undefined && !this.modelValue) {
          let fieldValue = defaultValue;
          if (Array.isArray(defaultValue)) {
            fieldValue = [...defaultValue];
          } else if (!isNaN(defaultValue)) {
            fieldValue = String(defaultValue);
          }
          this.$nextTick(_ => {
            this.fieldValue = fieldValue;
            this.$emit('update:modelValue', fieldValue, key);
          });
        } else if (inputItem === 'Dict' && editType == 'cascader') {
          this.options = Dict;
        } else if (inputItem === 'Dict' && Array.isArray(Dict)) {
          this.options = Dict.map(item => ({
            key: item.key || item.id,
            value: item.value || item.label,
            disabled: item.disabled || false,
          }));
        } else if (inputItem === 'Dict' && Dict) {
          this.options = Object.keys(Dict).map(item => ({
            key: item,
            value: Dict[item].value ? Dict[item].value : Dict[item],
          }));
        } else if (inputItem === 'remoteFun' && remoteFun) {
          this.remoteFun = remoteFun;
          this.filterable = true;
          this.remote = true;
        } else if (inputItem === 'props' && this.props && props) {
          Object.assign(this.props, props);
        } else if (objectItem[inputItem] !== undefined) {
          this[inputItem] = objectItem[inputItem];
        }
      });
      if (objectItem.editType === 'date-picker' && objectItem.type === 'datetime') {
        this.defaultTime = undefined;
      }
    },
  },
};
