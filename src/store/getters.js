const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  user: state => state.user,
  permissionList: state => state.user.permissionList,
  sidebar: state => state.app.sidebar,
  dict: state => state.app.dict,
  menuTreeList: state => state.app.menuTreeList,
  resourceList: state => state.app.resourceList,
  topicList: state => state.app.topicList,
  productCategoryList: state => state.app.productCategoryList,
  Attribute: state => state.app.Attribute,
  SizeConfig: state => state.app.SizeConfig,
  CouponList: state => state.app.CouponList,
  roleList: state => state.app.roleList,
  brandsList: state => state.app.brandsList,
  attachedProperty: state => state.app.attachedProperty,
  menuList: state => state.permission.routes.filter(item => !item.hidden),
  routeList: state => state.permission.routes, // 整体的路由表
};

export default getters;
