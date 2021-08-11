<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) of leveList" :key="index">
      <span
        class="no-link"
        v-if="index == leveList.length - 1 || item.redirect == 'noRedirect'"
        >{{ item.meta.title }}</span
      >
      <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {},
  components: {},
  data() {
    return {
      leveList: [],
    };
  },
  setup() {},
  created() {
    this.getBreadcrumb();
  },
  watch: {
    $route(_) {
      this.getBreadcrumb();
    },
  },
  methods: {
    // 获取路由对应的列表路径：
    getBreadcrumb() {
      let matched = this.$route.matched;
      const name = matched[0] && matched[0].name;
      if (name != 'Home') {
        matched = [
          {
            path: '/home',
            meta: {
              title: '首页',
            },
          },
        ].concat(matched);
      } else {
        this.leveList = [
          {
            meta: {
              title: '首页',
            },
          },
        ];
        return;
      }
      this.leveList = matched.filter((item) => {
        return item.meta && item.meta.title;
      });
    },
    handleLink(item) {
      this.$router.push(item.path);
    },
  },
};
</script>

<style lang="scss" scoped>
.no-link {
  color: #999;
}
</style>
