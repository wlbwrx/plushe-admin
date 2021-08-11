<template>
  <div :class="classObj">
    <sidebar class="sidebar-container"></sidebar>
    <!-- 主要内容显示区域 -->
    <div class="app-main">
      <top-navbar class="navbar-container"></top-navbar>
      <main class="main">
        <router-view v-slot="{ Component }">
          <transition>
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from './component/Sidebar.vue';
import TopNavbar from './component/TopNavbar';

export default {
  components: {
    Sidebar,
    TopNavbar,
  },
  data() {
    return {};
  },
  computed: {
    classObj() {
      return {
        'app-wrapper': true,
        'hide-sidebar': this.isCollapse,
        hideSidebar: this.isCollapse,
        openSidebar: !this.isCollapse,
      };
    },
    isCollapse() {
      return !this.$store.getters.sidebar.opened;
    },
  },
  methods: {
    // 关闭
    hideSideBar() {
      this.$store.dispatch('CloseSideBar');
    },
  },
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  padding-left: 200px;

  &.hide-sidebar {
    padding-left: 54px;

    .sidebar-container {
      width: 54px;
      overflow: hidden;
    }

    .app-main {
      .navbar-container {
        left: 54px;
      }
    }
  }

  &.mobile {
    padding-left: 0 !important;

    // 手机模式下的折叠，就不显示sidebar
    &.hide-sidebar {
      .sidebar-container {
        width: 0 !important;
      }
    }

    .sidebar-container {
      width: 200px !important;
      overflow: hidden;
      transition: all 0.2s ease-in;
    }

    .app-main {
      .navbar-container {
        padding-left: 0 !important;
      }
    }
  }

  .draw-bg {
    position: fixed;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    z-index: 10;
  }

  .app-main {
    position: relative;
    z-index: 1;
    .main {
      width: 100%;
      padding-top: 50px;
      height: 100vh;
      flex: 1;
      display: flex;
      flex-direction: column;
      // padding: 24px 20px;
    }
  }
}
</style>
