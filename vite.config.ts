/*
 * @Author: your name
 * @Date: 2021-10-28 17:55:17
 * @LastEditTime: 2022-10-18 18:39:20
 * @LastEditors: Yixeu
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /planet-m/vite.config.ts
 */
import legacyPlugin from 'vite-plugin-legacy'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import { injectHtml } from 'vite-plugin-html';
import viteCompression from "vite-plugin-compression";
import Lunar from '@bilibili/rollup-plugin-lunar';

export default ({ mode }) => {

  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    base: './',
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        extensions: [".tsx", ".ts", ".js", ".json"]
      },
    },

    server: {
      proxy: {
        '/api': {
          target: 'http://uat-bbplanet.bilibili.co',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      // proxy: {
      //   '/api': {
      //     target: 'http://10.23.229.67:8081',
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, '')
      //   }
      // },

      open: '/'
    },

    build: {
      outDir: 'dist',
      sourcemap:true,
      productionSourcemap: false,
      cssCodeSplit: true, //启用/禁用 CSS 代码拆分
      assetsInlineLimit: 1024,
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },

    optimizeDeps: {
      include: ['lodash'],
    },
    plugins: [
      injectHtml({
        injectData: {
          htmlWebpackPlugin: {
            options: {
              isProd: env.VITE_APP_ENV ? true : false
            }
          },
          title: '同事吧'
        }
      }),
      legacyPlugin({
        targets: [
          '> 0.5%',
          'last 2 versions',
          'Firefox ESR',
          'not dead',
        ],
        ignoreBrowserslistConfig: false,
        corejs: false,
      }),
      viteCompression(),
      reactRefresh(),
      Lunar({
        appid: 'dc3398ad4a1aea8aaea1e74081d6c875',
        env: function () {  // env同时支持函数和字符串 这里也可以直接写'uat'|'pre'|'prod'
          var env = 'prod';
          var host = location.host;
          if (!!~host.indexOf('uat')) {
            env = 'uat';
          } else if (!!~host.indexOf('pre')) {
            env = 'pre';
          }
          return env;
        },
        sourcemap: false,
        ignoreErrMsg: ["Uncaught SyntaxError: Unexpected token '.'", "ReferenceError: Can't find variable: WeixinJSBridge", "Script error."]
      }),
    ]
  } as any)
}
