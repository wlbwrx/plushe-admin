import { login, logout } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
import i18n from '@/language';

const user = {
  state: {
    token: getToken(),
    name: '',
    shopsName: '',
    shopsId: '',
    platformId: '',
    roles: [],
    permissionList: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_SHOPSID: (state, shopsId) => {
      state.shopsId = shopsId;
    },
    SET_permissionList: (state, permissionList) => {
      state.permissionList = permissionList;
    },
    SET_platformId: (state, platformId) => {
      state.platformId = platformId;
      i18n.global.locale = platformId == 3 ? 'ja-JP' : 'en-US';
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    },
    SET_shopsName: (state, shopsName) => {
      state.shopsName = shopsName;
    },
  },

  actions: {
    // 登录：--- 拿到token
    Login({ commit, dispatch }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(res => {
            const tokenStr = res.token;
            setToken(tokenStr);
            commit('SET_TOKEN', tokenStr);
            resolve();
          })
          .catch(_ => {});
      });
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        removeToken();
        resolve();
      });
    },
    // 前端 登出
    FedLogOut({ commit, state }) {
      return logout({token: state.token}).then(res => {
        commit('SET_TOKEN', '');
        removeToken();
        // resolve();
      });
    },
  },
};

export default user;
