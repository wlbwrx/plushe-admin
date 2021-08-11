export function login() {
  const OaSystemEnums = {
    dev: 'http://dev.oa.plushe.com', //  3001 oms 3002 OA
    sit: 'http://sit.oa.plushe.com',
    uat: 'http://uat.oa.plushe.com',
    prod: 'http://oa.plushe.com',
  };
  const host = window.location.href;
  const envs = Object.keys(OaSystemEnums);
  let platform = OaSystemEnums['prod'];
  envs.forEach(v => {
    if (host.indexOf(v) > -1) {
      platform = OaSystemEnums[v];
    }
  });
  window.location.href = platform + '/#/login?redirect=' + host;
}
