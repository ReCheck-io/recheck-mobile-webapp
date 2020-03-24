<template>
  <div dark id="app">
    <app-toolbar></app-toolbar>
    <router-view style="margin-top:4rem"/>
     <br><br>
    <app-footer></app-footer>
    <Progress />
    <AppError />
  </div>
</template>

<script>
import AppFooter from './components/AppFooter'
import AppToolbar from './components/AppToolbar'
import Progress from './components/Progress.vue'
import AppError from './components/AppError.vue'

export default {
  name: 'App',
  components: {AppToolbar, AppFooter, Progress, AppError}
}
</script>

<style>
html {
  overflow-y: auto;
  background-color: rgb(193, 192, 197);
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height:100vh;
  color: #2c3e50;
  text-decoration: none;
  overflow-y:auto;
}
</style>
