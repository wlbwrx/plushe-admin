import asyncRoutes from '@/router/modules';
import constantRoutes from '@/router/public';
import router from '@/router/index.js';
import { getAdminInfo } from '@api/user';

const permission = {
  state: {
    routes: [], // 完整的路由信息
    addRoutes: [], // 新增的路由
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit, getters }, data) {
      return new Promise((resolve, reject) => {
        getAdminInfo()
          .then(res => {
            const { menuList, username, platformShopInfo, roleList, permissionList } = res;
            const { platformList } = getters.dict;
            const roles = roleList.map(v => v.name);
            commit('SET_ROLES', roles);
            commit('SET_SHOPSID', String(platformShopInfo.shopsId || ''));
            commit('SET_platformId', String(platformShopInfo.platformId || 1));
            commit('SET_NAME', username);
            commit('SET_shopsName', platformShopInfo.shopsName || platformList[platformShopInfo.platformId] || '平台管理员');
            const permissionListMenu = {};
            permissionList.forEach(v => {
              if (!permissionListMenu[v.menuId]) {
                permissionListMenu[v.menuId] = [];
                permissionListMenu[v.menuId].push(v.permissionName);
              } else {
                permissionListMenu[v.menuId].push(v.permissionName);
              }
            });
            commit('SET_permissionList', permissionListMenu);
            const accessdRoutes = asyncRoutes.filter(v => {
              if (hasPermission(menuList, v)) {
                if (v.children && v.children.length > 0) {
                  v.children = v.children.filter(child => {
                    if (hasPermission(menuList, child)) {
                      return child;
                    }
                    return false;
                  });
                  if (v.children.length === 0) return false;
                  return v;
                } else {
                  return v;
                }
              }
              return false;
            });
            sortRouters(accessdRoutes);
            commit('SET_ROUTES', accessdRoutes);
            accessdRoutes.forEach(element => {
              router.addRoute(element);
            });
            resolve(accessdRoutes);
          })
          .catch(_ => {
            const accessdRoutes = asyncRoutes.filter(v => {
              if (asyncRoutes) {
                if (v.children && v.children.length > 0) {
                  v.children = v.children.filter(child => {
                    if (asyncRoutes) {
                      return child;
                    }
                    return false;
                  });
                  if (v.children.length === 0) return false;
                  return v;
                } else {
                  return v;
                }
              }
              return false;
            });
            sortRouters(accessdRoutes);
            commit('SET_ROUTES', accessdRoutes);
            accessdRoutes.forEach(element => {
              router.addRoute(element);
            });
            resolve(accessdRoutes);
          });
      });
    },
  },
};

// 判断是否有权限访问该菜单
function hasPermission(menus, route) {
  if (!route) return;
  if (route.name) {
    const currMenu = getMenu(route.name, menus);
    if (currMenu != null) {
      // 设置菜单的标题、图标和可见性
      if (currMenu.menuId != null && currMenu.menuId !== '') {
        route.meta.menuId = currMenu.menuId;
      }
      if (currMenu.title != null && currMenu.title !== '') {
        route.meta.title = currMenu.title;
      }
      if (currMenu.icon != null && currMenu.title !== '') {
        route.meta.icon = currMenu.icon;
      }
      if (currMenu.hidden != null) {
        route.hidden = currMenu.hidden !== 1;
      }
      if (currMenu.sort != null && currMenu.sort !== '') {
        route.sort = currMenu.sort;
      }
      return true;
    } else {
      route.sort = 0;
      if (route.hidden !== undefined && route.hidden === true) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return true;
  }
}

// 根据路由名称获取菜单
function getMenu(name, menus) {
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i];
    if (name === menu.name) {
      return menu;
    }
  }
  return null;
}

// 对菜单进行排序
function sortRouters(accessedRouters) {
  for (let i = 0; i < accessedRouters.length; i++) {
    const router = accessedRouters[i];
    if (router.children && router.children.length > 0) {
      router.children.sort(compare('sort'));
    }
  }
  accessedRouters.sort(compare('sort'));
}

// 降序比较函数
function compare(p) {
  return function(m, n) {
    const a = m[p];
    const b = n[p];
    return b - a;
  };
}

export default permission;
