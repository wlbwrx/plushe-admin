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
import { http, option } from './const/model';

export default {
  name: 'CommodityModel',
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
        id: 'modelId',
        status: 'status',
      },
    };
  },
  setup() {},
  methods: {
    customCrudParamsHandle(parms) {
      const { heightCm, bustCm, waistCm, hipsCm } = parms;
      if (Number(heightCm) >= 1000 || Number(bustCm) >= 1000 || Number(waistCm) >= 1000 || Number(hipsCm) >= 1000) {
        this.$message.warning('尺码小于1000');
        return false;
      }
      // if (!heightCm && !bustCm && !waistCm && !hipsCm) {
      //   this.$message.warning('至少填一个尺寸信息');
      //   return false;
      // }
      return parms;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
