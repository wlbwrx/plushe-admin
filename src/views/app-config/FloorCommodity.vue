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
import { http, option } from './const/floor-commodity';
import { mapGetters } from 'vuex';

export default {
  name: 'FloorCommodity',
  props: {},
  mixins: [crud],
  components: {},
  computed: {
    ...mapGetters(['productCategoryList']),
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
  methods: {},
  mounted() {},
  created() {},
};
</script>

<style lang="scss" scoped></style>
