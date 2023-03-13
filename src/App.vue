<template>
<div class="container">
      <div class="card">
        <ruleta-page></ruleta-page>
    </div>

</div>

</template>

<script>

import RuletaPage from './components/RuletaPageComponent.vue'


export default {
  name: 'App',
  components: {
    RuletaPage
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
