/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {};

  // api接口请求地址
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.103:8081';
  window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.121:8081';
  window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.166:8081';
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.124:8082';
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.122:8081';
  // window.SITE_CONFIG['baseUrl'] = 'http://172.168.1.84:8082';

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();
