<template>
  <avue-crud
    ref="crud"
    :option="option"
    v-model="formData"
    :table-data="tableList"
    :fieldMap="fieldMap"
    :page="page"
    :loading="loading"
    @commonHandle="commonHandle"
  >
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option } from './const/shop';
import { mapGetters } from 'vuex';

export default {
  name: 'Shop',
  props: {},
  mixins: [crud],
  components: {},
  computed: {
    ...mapGetters(['brandsList']),
    option() {
      return option(this);
    },
  },
  data() {
    return {
      COM_HTTP: http,
      fieldMap: {
        id: 'id',
        status: 'enable',
      },
    };
  },
  setup() {},
  methods: {},
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
