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
import { http, option } from './const/menu';
export default {
  name: 'Menu',
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
      fieldMap: {
        status: 'hidden',
        id: 'id',
      },
    };
  },
  setup() {},
  methods: {
    updataLater() {
      this.$store.dispatch('GetMenuTreeList');
    },
    updateStatusParamsHandle(params) {
      const { id, hidden, parentId } = params;
      return {
        id,
        parentId,
        hidden: hidden == 1 ? 0 : 1,
      };
    },
  },
  mounted() {
    this.$store.dispatch('GetMenuTreeList');
  },
};
</script>

<style lang="scss" scoped></style>
