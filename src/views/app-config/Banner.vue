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
    <BaseViewTopic v-model="viewCommodityVisi" :currentCategory="viewForm" />
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option } from './const/banner';

export default {
  name: 'Banner',
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
        id: 'id',
        status: 'enable',
      },
      viewCommodityVisi: false,
      viewForm: {},
    };
  },
  setup() {},
  methods: {
    viewTopicSnglFun(data) {
      this.viewForm = { ...data, name: (this.topicList.filter((item) => item.id == data.topicId)[0] || {}).label };
      this.viewCommodityVisi = true;
    },
    customFormattingData(data) {
      return data.map((item) => ({
        ...item,
        sort: String(item.sort),
      }));
    },
    customCrudParamsHandle(parms) {
      parms.sort = parms.sort || 9999;
      parms.internalUrl = parms.internalUrl || '';
      return parms;
    },
  },
};
</script>

<style lang="scss" scoped></style>
