<template>
  <div>
    <template v-if="path">
      <app-link :to="path">
        <el-menu-item :index="path || icon" class="submenu-title-noDropdown" popper-append-to-body>
          <Item :icon="icon" />
          <template #title>{{ title }}</template>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :key="item.meta.icon" :index="item.meta.icon" popper-append-to-body>
      <template #title>
        <Item :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <SidebarItem v-for="child in item.children" :key="child.path || child.icon" :is-nest="true" :item="child" class="nest-menu" />
    </el-submenu>
  </div>
</template>

<script>
import Item from './Item';
import AppLink from './Link';

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  setup(props) {
    const { item } = props; // eslint-disable-line
    let path, title, icon;
    if (!item.children) {
      return {
        path: item.path,
        title: item.meta.title,
        icon: item.meta.icon,
      };
    }
    item.children.some(item => {
      if (item.hidden) return;
      if (path) {
        path = '';
        title = '';
        icon = '';
        return true;
      }
      path = item.path;
      title = item.meta.title;
      icon = item.meta.icon;
    });
    return {
      path,
      title,
      icon,
    };
  },
  methods: {},
};
</script>
