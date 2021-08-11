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
import { http, option } from './const/comment';
import { imageHandler } from '@/utils/index';

export default {
  name: 'Comment',
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
    customFormattingData(list) {
      return list.map(item => ({
        ...item,
        evaluatePics: [
          { picUrl: imageHandler(0, item.evaluatePicsOnekey), picKey: item.evaluatePicsOnekey },
          { picUrl: imageHandler(0, item.evaluatePicsTwokey), picKey: item.evaluatePicsTwokey },
          { picUrl: imageHandler(0, item.evaluatePicsThreekey), picKey: item.evaluatePicsThreekey },
        ].filter(item => item.picUrl),
      }));
    },
    customCrudParamsHandle(parms) {
      const [evaluatePicsOnekey = {}, evaluatePicsTwokey = {}, evaluatePicsThreekey = {}] = parms.evaluatePics || [];
      parms.evaluatePicsOnekey = evaluatePicsOnekey.picKey;
      parms.evaluatePicsTwokey = evaluatePicsTwokey.picKey;
      parms.evaluatePicsThreekey = evaluatePicsThreekey.picKey || '';
      return parms;
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped></style>
