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
import { http, option } from './const/authority';
export default {
  name: 'Authority',
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
    updataLater() {
      this.$store.dispatch('GetAuthorityList');
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
