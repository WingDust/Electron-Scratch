/*
 * @Author: your name
 * @Date: 2021-01-31 11:22:17
 * @LastEditTime: 2021-01-31 14:51:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vite-Vue3-Vuex4-electron-TypeScript-tailwindcss\src\render\main.ts
 */
import { createApp } from 'vue'
// TypeScript error? Run VSCode command
// TypeScript: Select TypeScript version - > Use Workspace Version
import App from './App.vue'
import { store } from "./store/index";



/** 滑动条 */
import "./css/SpecificImpact/scrollbar.css"
// import "./css/GlobalImpact/global.scss"


const app = createApp(App)
// app.use(router)
app.use(store)
app.mount('#app')