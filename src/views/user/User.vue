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
    <el-dialog top="5vh" title="绑定角色" v-model="dialogVisible" width="30%">
      <el-tree v-if="dialogVisible" :data="roleList" :default-checked-keys="checkedList" show-checkbox ref="tree" node-key="id" accordion>
      </el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="amend">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog top="5vh" title="重置密码" v-model="paddwordVisible" width="30%">
      <el-input v-model="password"></el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="paddwordVisible = false">取 消</el-button>
          <el-button type="primary" @click="sure">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </avue-crud>
</template>

<script>
import crud from '@/mixins/crud';
import { http, option } from './const/user';
import { mapGetters } from 'vuex';
import { imageHandler } from '@/utils/index';

export default {
  name: 'User',
  props: {},
  mixins: [crud],
  components: {},
  computed: {
    ...mapGetters(['roleList']),
    option() {
      return option(this);
    },
  },
  data() {
    return {
      COM_HTTP: http,
      dialogVisible: false,
      checkedList: [],
      password: '',
      paddwordVisible: false,
    };
  },
  setup() {},
  methods: {
    customFormattingData(list) {
      return list.map(item => ({
        ...item,
        icon: imageHandler(0, item.icon),
        iconPicture: item.icon ? [{ picUrl: imageHandler(0, item.icon), picKey: item.icon }] : [],
      }));
    },
    passSnglFun(parms) {
      this.paddwordVisible = true;
    },
    async adminSnglPoPFun(parms) {
      await this.COM_HTTP.reqUpdate({
        adminStatus: parms.adminStatus == 1 ? 0 : 1,
        id: parms.id,
      });
      this.$message.success('修改成功');
      setTimeout(() => {
        this.searchFun();
      }, 1000);
    },
    roleSnglFun(parms) {
      if (this.$refs.tree) this.$refs.tree.setCheckedKeys([]);
      this.COM_HTTP.reqGetRole(parms).then(res => {
        this.checkedList = res.map(item => item.id);
        this.dialogVisible = true;
      });
    },
    amend() {
      if (this.$refs.tree.getCheckedKeys().length === 0) return this.$message.warning('至少选择一项');
      this.COM_HTTP.reqRoleUpdate({
        roleIds: this.$refs.tree.getCheckedKeys(),
        adminId: this.currentRow.id,
      }).then(_ => {
        this.$message.success('修改成功');
        this.dialogVisible = false;
        setTimeout(() => {
          this.searchFun();
        }, 1000);
      });
    },
    async sure() {
      if (!this.password) return this.$message.warning('请输入密码');
      await this.updataFun({
        password: this.password,
        id: this.currentRow.id,
      });
      this.paddwordVisible = false;
    },
    customCrudParamsHandle(parms) {
      const { shopsId, platformId } = this.user;
      if (shopsId != 0 && shopsId != parms.shopsId) {
        this.$message.warning('只能添加本店铺帐号');
        return false;
      }
      if (parms.iconPicture && parms.iconPicture[0]) {
        parms.icon = parms.iconPicture[0].picKey;
      }
      parms.platformId = platformId;
      return parms;
    },
  },
  mounted() {
    this.$store.dispatch('GetRoleList');
  },
};
</script>

<style lang="scss" scoped></style>
