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