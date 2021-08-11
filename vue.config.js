const externalConfig = require('./src/config/cdn');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'; // 是否生产环境

module.exports = {
  publicPath: '/', // 如果应用被部署在一个子路径上，http://www.my-app.com/my-app/,则publicPath: '/my-app/'
  outputDir: 'dist', // 构建打包时的输出文件名, 默认dist
  lintOnSave: IS_DEVELOPMENT,
  devServer: {
    open: false, // 'Google Chrome'直接打开谷歌， 设置true为打开默认浏览器
    port: 8082,
    hot: true,
    // compress: true, // 对所有服务启用gzip压缩
    overlay: {
      warnings: false,
      errors: true, // 屏幕上显示错误
    },
    proxy: {
      '/raise': {
        target: 'http://192.168.8.91:10007',
        pathRewrite: {
          '^/': '',
        },
      },
      '/shenwei': {
        target: 'http://192.168.8.91:10007',
        pathRewrite: {
          '^/': '',
        },
      },
      '/wind': {
        target: 'http://192.168.8.86:10007',
        pathRewrite: {
          '^/wind': '',
        },
      },
      '/dev': {
        target: 'http://dev.oms.oa.plushe.com',
        pathRewrite: {
          '^/dev': '',
        },
      },
      '/test': {
        target: 'http://sit.oa.plushe.com',
        pathRewrite: {
          '^/test': '',
        },
      },
      '/uat': {
        target: 'http://uat.oa.plushe.com',
        pathRewrite: {
          '^/uat': '',
        },
      },
      '/prod': {
        target: 'http://oa.plushe.com',
        pathRewrite: {
          '^/prod': '',
        },
      },
    },
  },
  productionSourceMap: false, // 关闭 source map
  configureWebpack: config => {
    // 设置webpack别名
    config.resolve.alias = Object.assign(config.resolve.alias, {
      '@router': '@/router',
      '@views': '@/views',
      '@layout': '@/views/layout',
      '@components': '@/components',
      '@http': '@/utils/request',
      '@store': '@/store',
      '@mixins': '@/mixins',
      '@constants': '@/constants',
      '@utils': '@/utils',
      '@api': '@/api',
      '@image': '@/assets/image',
    });
    if (!IS_DEVELOPMENT) {
      const externals = {};
      externalConfig.forEach(item => {
        if (item.name) externals[item.name] = item.scope;
      });
      config.externals = externals;
    }
    if (!IS_DEVELOPMENT && process.env.GZIP) {
      // 导入压缩插件
      const CompressionWebpackPlugin = require('compression-webpack-plugin');
      // 添加到插件
      config.plugins = (config.plugins || []).concat(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]', // 压缩的文件名
          algorithm: 'gzip', // 压缩格式
          test: /.(js|css)$/, // 匹配.js .css后缀的文件才进行压缩
          threshold: 10240, //
          minRatio: 0.8, //
          deleteOriginalAssets: false, // 是否删除对应的源文件（不确定服务器那边是否开启了gzip，设置为false， true:删除 false:不删除）
        })
      );
    }
    // 生产环境-压缩设置为真
    if (process.env.VUE_APP_PROJECT == 'pro' && config.optimization.minimizer) {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log'];
    }
  },
  chainWebpack: config => {
    // 生产环境-html插件配置调整
    config.plugin('html').tap(args => {
      args[0].cdnConfig = IS_DEVELOPMENT ? [] : externalConfig;
      args[0].title = 'plushe - admin';
      return args;
    });
    config.module
      .rule('images')
      .use('url-loader')
      .tap(options => {
        options.limit = 10 * 1024;
        return options;
      });
    config.module
      .rule('pug')
      .test(/\.pug$/)
      .use('pug-html-loader')
      .loader('pug-html-loader')
      .end();
    if (!IS_DEVELOPMENT && process.env.VUE_APP_ANALYZER) {
      config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
    }
  },
};
