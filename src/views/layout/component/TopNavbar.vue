<template>
  <div class="top-navbar">
    <div class="nav">
      <!-- <i :class="['icon', isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']" @click="triggerCollapse"></i> -->
      <breadcrumb></breadcrumb>
    </div>
    <el-dropdown trigger="click">
      <div class="user-wrapper">
        <span class="name">{{ userName }}</span>
        <i class="el-icon-caret-bottom" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <span>个人中心</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb.vue';

export default {
  props: {},
  components: {
    Breadcrumb,
  },
  data() {
    return {};
  },
  setup() {},
  computed: {
    isCollapse: function() {
      return !this.$store.getters.sidebar.opened;
    },
    userName: function() {
      const { name, shopsName } = this.$store.getters.user;
      return `${name}(${shopsName})`;
    },
  },
  methods: {
    // 切换是否折叠：
    triggerCollapse() {
      this.$store.dispatch('ToggleSideBar');
    },
    // 退出登陆：
    logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$store.dispatch('FedLogOut').then(() => {
          setTimeout(() => {
            location.reload();
          }, 1000);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.top-navbar {
  position: fixed;
  left: 200px;
  top: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  line-height: 50px;
  box-shadow: 0px -1px 0px 0px #f5f7fa inset;
  background: #fff;
  padding-right: 20px;
  transition: left 0.28s;
  .nav {
    display: flex;
    align-items: center;
    padding-left: 30px;
    .icon {
      font-size: 36px;
      cursor: pointer;
      margin: 0 6px;
    }
  }

  .user-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;

    .name {
      padding: 0 10px;
    }
  }
}
</style>
