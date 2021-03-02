<!--
 * @Author: your name
 * @Date: 2021-01-31 11:40:12
 * @LastEditTime: 2021-01-31 11:51:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vite-Vue3-Vuex4-electron-TypeScript-tailwindcss\READMD.md
-->

## Create project
  - yarn create @vitejs/app
    - project name
    - vue-ts
  - add package
    - @types/node
    - electron
    - electron-builder
    - autoprefixer
    - tailwindcss
    - postcss
    - 

## git branch
## Problem
  - [add `node` to the types field in your tsconfig](https://ask.csdn.net/questions/7388635)

  - ![](Unable%20find%20Electron%20App%20at.png)
    - 没有在 package.json 中写 `"main":"src/main/_.js",`

## Test
  - ipc 通信通过两个渲染进程来进行测试