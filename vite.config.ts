/*
 * @Author: your name
 * @Date: 2021-01-31 11:22:17
 * @LastEditTime: 2021-01-31 14:57:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vite-Vue3-Vuex4-electron-TypeScript-tailwindcss\vite.config.ts
 */
import { join } from "path";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  root:join(__dirname,'src/render'),
  plugins: [vue()],
  optimizeDeps:{
    exclude:['keyevent','fs','path']
  }
})
