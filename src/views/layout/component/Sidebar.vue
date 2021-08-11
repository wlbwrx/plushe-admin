<template>
  <div class="has-logo iconfont">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        router
        mode="vertical"
      >
        <template v-for="item in menuList">
          <router-link :to="item.path" v-if="!item.children" :key="item.path">
            <el-menu-item :index="item.path" :key="item.path">
              <i :class="item.meta.icon" class="sub-el-icon"></i>
              <template #title>{{ item.meta.title }}</template>
            </el-menu-item>
          </router-link>
          <el-submenu :index="item.meta.icon" :key="item.meta.key" v-else>
            <template #title>
              <i :class="item.meta.icon" class="sub-el-icon"></i>
              <span>{{ item.meta.title }}</span>
            </template>
            <router-link :to="element.path" v-for="element in item.children" :key="element.path">
              <el-menu-item :index="element.path">{{ element.meta.title }}</el-menu-item>
            </router-link>
          </el-submenu>
        </template>
        <!-- <sidebar-item v-for="(route, index) in menuList" :key="index" :item="route" /> -->
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
// import SidebarItem from './SidebarItem';
import Logo from './Logo';
// import { mapGetters } from 'vuex';
import variables from '@/assets/styles/variables.scss';

export default {
  name: 'Sidebar',
  props: {},
  components: { Logo },
  data() {
    return {};
  },
  setup() {},
  created() {},
  computed: {
    // ...mapGetters(['menuList']),
    menuList() {
      return this.$store.getters.menuList
        .filter(item => {
          if (item.children) {
            item.children = item.children.filter(item => !item.hidden && !item.indexHidden);
            if (item.children.length == 1) {
              return item.children[0];
            } else if (item.children.length == 0) {
              return false;
            }
          }
          return !item.hidden;
        });
        // .map(item => (item.children && item.children.length == 0 ? item.children[0] : item));
    },
    isCollapse() {
      return !this.$store.getters.sidebar.opened;
    },
    // 当前活跃的菜单：
    activeMenu() {
      return this.$route.path;
    },
    variables() {
      return variables;
    },
  },
  methods: {
    // 若是只有一个子路由：
    hasOneChild(item) {
      return item.children && item.children.length == 1;
    },
  },
};
</script>

<style lang="scss" scoped></style>
