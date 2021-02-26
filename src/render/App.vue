<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + Vite" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { Event,Emitter } from "../common/utils/base/event";
import { ipcRenderer } from "electron";
export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  },
  setup(){
    ipcRenderer.send('ipc:hello','hello')

    let emit = new Emitter({
      onFirstListenerAdd:(...args:any[])=>{
        console.trace(args)
      }
    })
    console.log(emit);
    console.log(emit.event);
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>