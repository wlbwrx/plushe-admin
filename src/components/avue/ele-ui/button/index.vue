<template>
  <el-button @click.stop="handler" v-if="getClick(btnName) && btnContent" :class="'btn-' + icon" :type="type" :icon="'iconfont ' + icon" :size="size">
    {{ btnContent }}
  </el-button>
</template>

<script>
import create from '../../core/create';
export default create({
  name: 'Button',
  data() {
    return {
      btnName: '',
      type: 'default',
      size: '',
      icon: '',
      nativeType: 'button',
      loading: false,
      plain: false,
      autofocus: false,
      round: false,
      circle: false,
      btnContent: '',
    };
  },
  props: {
    formItem: {
      default: () => {},
    },
  },
  watch: {},
  created() {},
  mounted() {
  },
  methods: {
    getClick(btnName) {
      if (!btnName) return false;
      const {permissionList} = this.$store.getters;
      if (!permissionList) return false;
      const {menuId} = this.$route.meta;
      if (!permissionList[menuId]) return false;
      if (permissionList[menuId].includes(btnName)) return true;
    },
    handler() {
      this.$emit('commonHandle', this.key);
    },
  },
});
</script>
