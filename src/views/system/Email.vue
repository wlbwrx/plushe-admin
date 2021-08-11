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
import { http, option } from './const/email';

export default {
  name: 'Email',
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
        templateId: parms.emailTemplateId,
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
