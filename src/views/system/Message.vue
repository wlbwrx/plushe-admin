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
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option } from './const/message';
// import { LS } from '@utils/index';

export default {
  name: 'Message',
  props: {},
  mixins: [crud],
  components: {},
  computed: {
    option() {
      return option(this);
    },
  },
  data() {
    return {
      COM_HTTP: http,
    };
  },
  setup() {},
  methods: {
    delFunParamsHandle(parms) {
      return {
        templateId: parms.messageTemplateId,
        language: parms.language,
      };
    },
    updataLater() {
      this.$store.dispatch('GetPageGetEmailTemplate');
    },
  },
};
</script>

<style lang="scss" scoped></style>
