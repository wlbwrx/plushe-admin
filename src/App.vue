<template>
  <router-view v-if="isRouterAlive" />
</template>

<script>
import request from '@/utils/request';
export default {
  computed: {},
  provide () {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true,
      cur_hash: '',
    };
  },
  methods: {
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
    getHash() {
      const cur_srcipt_list = document.querySelector('link[as="script"]');
        // .getElementsByTagName('body')[0]
        // .getElementsByTagName('script');
      const cur_src_list = cur_srcipt_list.href.split('/');
      this.cur_hash = cur_src_list[cur_src_list.length - 1];
      request.get(`${window.location.protocol}//${window.location.host}/`).then(response => {
        let el = document.createElement('html');
        el.innerHTML = response;
        const new_srcipt_list = el.querySelector('link[as="script"]');
        const new_src_list = new_srcipt_list.href.split('/');
        const new_hash = new_src_list[new_src_list.length - 1];
        if (this.cur_hash !== new_hash) {
          this.$confirm('检测到系统更新,请刷新后使用', '系统更新', {
            confirmButtonText: '确定',
            cancelButtonText: '稍后',
          })
            .then(_ => {
              window.location.reload();
            })
            .catch(_ => {
              setTimeout(() => {
                this.getHash();
              }, 10000);
            });
        } else {
          setTimeout(() => {
            this.getHash();
          }, 7000);
        }
        el = null;
      });
    },
  },
  mounted() {
    if (process.env.NODE_ENV !== 'development') {
      this.getHash();
    }
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
