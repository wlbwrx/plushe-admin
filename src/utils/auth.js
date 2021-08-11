import Cookie from 'js-cookie';
let dname = 'oa.plushe.com';
if (process.env.NODE_ENV === 'development') {
  dname = document.domain;
}
const TokenKey = 'loginToken';
export function getToken() {
  return Cookie.get(TokenKey, { domain: dname });
}

export function setToken(token) {
  return Cookie.set(TokenKey, token, { domain: dname, expires: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000) });
}

export function removeToken() {
  return Cookie.remove(TokenKey, { domain: dname });
}
