<template>
    <div class="card-title">
        Configuración usuario
    </div>
    <div class="row mb-3">
        <div class="col-md-4">
            <label>Nombre:</label>
            <input type="text" v-model="usuario.nombre" class="form-control">
        </div>
        <div class="col-auto align-bottom">

            <button class="btn btn-outline-info mt-4" @click="buscarUsuario">Cargar Datos</button>
        </div>
    </div>
      <div class="row mb-3">
        
        <div class="col-md-4">
            <label>Saldo:</label>
            <input type="number" v-model="usuario.monto"  step="0.1" min="1" class="form-control">
        </div>
        <div class="col-md-4 mb-3">
            <button class="btn btn-outline-dark mt-4"  @click="guardarUsuario">Guardar Datos</button>
        </div>
      </div>
</template>
<script>

import { mapState } from "vuex";

export default {
  data() {
    return {
        usuario:{nombre:"",monto:0.0,existeUsuario:false},
        lastUserName:""
    }
    },
      computed :{
        ...mapState(['premio','juegoGuardado']) 
  },
methods: {
    guardarUsuario:async function(){
      const self = this;
// debugger;
      if(!self.juegoGuardado && self.lastUserName != self.$store.state.usuario.nombre){
        const isConfirm =confirm("esta cambiando de usuario, se prederan los datos no guardados. ¿Desea continuar?");

        if(!isConfirm) return false;
      }

        if(!(self.usuario.nombre) || !(self.usuario.monto) ){
            alert("debe colocar un nombre y un monto");
            return false;
        }
        const usuarioData = self.usuario ;
      const api = "http://localhost:8095/api/Ruleta/CreateUpdate";
      const config = {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify(usuarioData)
                  }

      const response = await fetch(api,config);

      if(response.ok){
       const result = await response.json();
       self.usuario.existeUsuario = true;
       self.usuario.monto = result.monto;
      self.lastUserName = self.usuario.nombre;
       self.$store.commit('updateUsuario',self.usuario);
       self.$store.commit('saveJuego',true);
       alert("Se guardó correctamente los datos.")
      }else{
        alert("ha ocurrido un error al guardar usuario");

      }

    },
    buscarUsuario:async function(){
        const self = this;



        if(!(self.usuario.nombre)){
            alert("Debe escribir un nombre para relizar la busqueda");
            return false;
        }


    if(!self.juegoGuardado){
      const isConfirm =confirm("existen resultados que no fueron guardados. ¿Desea continuar?");

      if(!isConfirm) return false;
    }

      const api = "http://localhost:8095/api/Ruleta/GetUsuarioData?nombre="+self.usuario.nombre;
      const response = await fetch(api);
      if(response.status == 404){
        alert("No se encontró usuario");
        return false;
      }
      const usuario = await response.json();
      self.usuario.nombre = usuario.nombre;
      self.usuario.monto = usuario.monto;
      self.usuario.existeUsuario = true;
      self.lastUserName = usuario.nombre;

      self.$store.commit('updateUsuario',self.usuario);

      alert("Se cargaron datos del usuario");
    }
},
}
</script>