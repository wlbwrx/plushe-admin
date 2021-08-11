<template>
  <avue-crud
    ref="crud"
    :option="option"
    v-model="formData"
    :table-data="tableList"
    :page="page"
    :loading="loading"
    @commonHandle="commonHandle"
  >
    <AttributeForm v-model="status" :attributeDate="attributeDate" @submit="submit" />
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option } from './const/attribute';
import AttributeForm from './component/AttributeForm';
export default {
  name: 'Attribute',
  props: {},
  mixins: [crud],
  components: {
    AttributeForm,
  },
  computed: {
    option() {
      return option(this);
    },
  },
  data() {
    return {
      COM_HTTP: http,
      status: 0,
      attributeDate: false,
      fieldMap: {
        status: 'attrStatus',
        id: 'id',
      },
    };
  },
  setup() {},
  methods: {
    updataLater() {
      this.$store.dispatch('getAttribute');
    },
    addCustBtnFun() {
      this.status = 1;
    },
    editCustSnglFun(parms) {
      this.COM_HTTP.getAttrVals({
        attrId: parms.id,
      }).then(res => {
        this.attributeDate = { ...parms, vals: res };
        this.status = 2;
      });
    },
    submit() {
      const form = arguments[0];
      const beforeClose = arguments[1];
      const str = form.id ? 'updataFun' : 'addFun';
      this[str](form).then(_ => {
        if (beforeClose) beforeClose();
        this.status = 0;
        setTimeout(() => {
          this.searchFun();
        }, 1000);
      });
    },
    customParameterHandle(arr) {
      return arr.concat(['vals', 'showStyle', 'group']);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
