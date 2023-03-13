<template>
    <div class="card-body">
            <h1>Juego de la ruleta</h1>
            <dato-usuario v-on:resultado.once="resultadoEvent"></dato-usuario>
            <hr>
            <ruleta></ruleta>

        </div>
</template>
<script>
import DatoUsuario from './DatoUsuarioComponent.vue'
import Ruleta from './RuletaComponent.vue'

export default {
components: {
    Ruleta,
    DatoUsuario
  }
}
</script>