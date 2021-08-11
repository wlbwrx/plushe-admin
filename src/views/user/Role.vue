<template>
  <avue-crud
    class="role"
    ref="crud"
    :option="option"
    v-model="formData"
    :table-data="tableList"
    :page="page"
    :loading="loading"
    @commonHandle="commonHandle"
  >
    <el-dialog top="5vh" title="绑定菜单" v-model="dialogVisible" width="30%">
      <el-tree :data="treeData" :default-checked-keys="checkedList" show-checkbox ref="tree" node-key="id" accordion> </el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="amend">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option } from './const/role';
import { mapGetters } from 'vuex';

export default {
  name: 'Role',
  props: {},
  mixins: [crud],
  components: {},
  computed: {
    ...mapGetters(['menuTreeList']),
    ...mapGetters(['resourceList']),
    option() {
      return option(this);
    },
    treeData() {
      return this.str === 'Menu' ? this.menuTreeList : this.resourceList;
    },
  },
  data() {
    return {
      COM_HTTP: http,
      checkedList: [],
      dialogVisible: false,
      str: 'Menu',
      // fieldMap: {
      //   status: 'roleStatus',
      //   id: 'id'
      // }
    };
  },
  setup() {},
  methods: {
    updataLater() {
      this.$store.dispatch('GetRoleList');
    },
    menuSnglFun(parms) {
      this.str = 'Menu';
      this.COM_HTTP[`reqList${this.str}`](parms).then(res => {
        if (this.$refs.tree) this.$refs.tree.setCheckedKeys([]);
        this.checkedList = res.filter(item => item.level != 0).map(item => item.id);
        this.dialogVisible = true;
      });
    },
    authoritySnglFun(parms) {
      this.str = 'Resource';
      this.COM_HTTP[`reqList${this.str}`](parms).then(res => {
        this.checkedList = res.map(item => item.id);
        this.dialogVisible = true;
      });
    },
    amend() {
      if (this.$refs.tree.getCheckedKeys().length === 0) return this.$message.warning('至少选择一项');
      this.COM_HTTP[`reqAlloc${this.str}`]({
        ids: this.$refs.tree.getCheckedKeys(),
        roleId: this.currentRow.id,
      }).then(_ => {
        this.$message.success('修改成功');
        this.dialogVisible = false;
        setTimeout(() => {
          this.searchFun();
        }, 1000);
      });
    },
  },
  mounted() {
    this.$store.dispatch('GetMenuTreeList');
    this.$store.dispatch('GetAuthorityList');
  },
};
</script>

<style lang="scss" scoped></style>
