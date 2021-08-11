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
import { http, option } from './const/instagram';
import { mapGetters } from 'vuex';

export default {
  name: 'Banner',
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
  methods: {
    customFormattingData(data) {
      return data.map(item => ({
        ...item,
        sort: String(item.sort),
      }));
    },
    customCrudParamsHandle(parms) {
      delete parms.modifyTime;
      delete parms.createTime;
      parms.sort = parms.sort || 9999;
      parms.internalUrl = parms.internalUrl || '';
      return parms;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
