<template>
      <div id="App">
         <NavBar/>
      </div>
</template>

<script>
// import route from './router/index';
import NavBar from './components/NavBar.vue';
export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style>
body{
overflow-x: hidden;
}
</style>
