import { createStore } from 'vuex'

export default createStore({
  state: {
    usuario:{nombre:"",monto:0.0,existeUsuario:false},
    premio:{},
    juegoGuardado:true
  },
  mutations: {
    updateUsuario(state,usuario){
      state.usuario = usuario;
      console.log("state",state.usuario)
    },
    updateUsuarioMonto(state,premio){
      state.usuario.monto +=  premio.montoPremio
      state.premio = premio;
      console.log("state",state.premio)
    },
    saveJuego(state,value){
      state.juegoGuardado = value;
    }
  }
})
