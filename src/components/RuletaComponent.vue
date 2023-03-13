<template>
      <div class="row">
        <div class="col-12">
          <div class="p-4">
              <h2>{{message}}</h2>
          </div>
        </div>
        <div class="col-md-7 text-center">
          <canvas id="canvas" width="500" height="500"></canvas>
        </div>
        <div class="col-md-5 mb-3">
          <div class="card">
            <div class="card-body">


                          <div class="card-title">
                          Configure Su Apuesta
                          </div>

                      <hr>
                      <div class="row"> 
                            <div class="col-12 mb-2">
                                <label>Monto apuesta:</label>
                                <input type="number" v-model="apuesta.montoApuesta" step="0.1" min="1" class="form-control">
                            </div>
                      </div>
                      <hr>
                      <div class="row">
                          <div class="col-12 mb-2">
                            Color
                          </div>
                           <div class="col-12 mb-2">
                              <label><input type="radio" class="form-check-input" v-model="apuesta.color" name="color" value="0"> ROJO </label>
                          </div>
                          <div class="col-12 mb-2">
                              <label><input type="radio" class="form-check-input" v-model="apuesta.color" name="color" value="1"> NEGRO </label>
                          </div>
                      </div>
                      <hr>
                      <div class="row">
                          <div class="col-12 mb-2">
                            Tipo Numero
                          </div>
                          <div class="col-12 mb-2">
                              <label><input type="radio" v-model="apuesta.tipoNumero" class="form-check-input" name="parImpar" value="0"> PAR </label>
                          </div>
                          <div class="col-12 mb-2">
                              <label><input type="radio" v-model="apuesta.tipoNumero" class="form-check-input" name="parImpar" value="1"> IMPAR </label>
                          </div>
                          <div class="col-12 mb-2">
                              <label><input type="radio" v-model="apuesta.tipoNumero" class="form-check-input" name="parImpar" value="2"> NINGUNO </label>
                          </div>
                      </div>
                      <hr>
                        <div class="row">
                          <div class="col-12 mb-2">
                            <label>Ingresar Numero</label>
                              <input type="number" v-model="apuesta.numero" class="form-control" min="0" max="36" >
                          </div>

                      </div>

            </div>
          </div>
            <br>
            <button class="btn btn-outline-dark" @click="girarRuleta">GIRAR RULETA</button>
        </div>
      </div>
</template>
<script>
// import { computed } from 'vue'
export default {
  data() {
    return {
      options:[],
      apuesta:{color: 0,tipoNumero:2,numero:"",montoApuesta:1},
      startAngle: 0,
      ctx: '',
      spinTime: 0,
      spinTimeTotal: 0,
      spinAngleStart: 0,
      message:'',
      lastResult : {}
    }  
  },
  computed :{
    //metodo computado para calcular 
    arc: function () {
      const self = this;
        return Math.PI / (self.options.length / 2);
        } 
  },
   async mounted(){
    const self = this;
    await self.obtenerNumeros();
    self.dibujarRuleta();
  },
  methods:{
    obtenerNumeros: async function(){
      const self = this;
      const api = "https://localhost:44395/api/Ruleta/GetNumerosAzar";
      const response = await fetch(api);
      const numeros = await response.json();
      self.options = numeros;
    },
    dibujarRuleta: function () {
      const self = this;

        const canvas = document.getElementById("canvas");
        if (canvas.getContext) {

          //tamaño del borde externo de la circunferencia para la ruleta
          const bordeExternoCirc = 200;

          //tamaño del borde interno de la circunferencia para la ruleta
          const bordeInternoCirc = 90;

          //posicion de los numeros en la ruleta
          const textRadius = 160;

          // obtener el contexto del lienzo
          self.ctx = canvas.getContext("2d");

          //limpia el contexto 
          self.ctx.clearRect(0,0,500,500);

          //definir color de las lineas que se trazaran el dibujo
          self.ctx.strokeStyle = "#513b1e";
          //definir grosor de linea
          self.ctx.lineWidth = 5;

          //definir estilo de fuentes para texto en el lienzo
          self.ctx.font = 'bold 14px Helvetica, Arial';

          // bucle para añadir los numeros a la ruleta
          for(let i = 0; i < self.options.length; i++) {


            //========================> se incia el proceso de trazar las circunferencias

            const angle = self.startAngle + i * self.arc;
            // definir color para el fondo de la secciones internas de la circunferencia
            self.ctx.fillStyle = self.options[i].color;

            // inicia las trazas
            self.ctx.beginPath();
            self.ctx.arc(250, 250, bordeExternoCirc, angle, (angle + self.arc), false);
            self.ctx.arc(250, 250, bordeInternoCirc, (angle + self.arc), angle, true);

            //realiza el dibujo de las lineas trazadas anteriormente
            self.ctx.stroke();

            // Rellenar la circunferencia
            self.ctx.fill();

            //guardar el estado actual del dibujo
            self.ctx.save();
            //<======================== fin del proceso de trazar las circunferencias

          //========================> se incia el proceso para ubicar los numeros en la ruleta
          // cambiando color de relleno
            self.ctx.fillStyle = "white";

            // mover coordenadas en el contexto
            self.ctx.translate(
                          (250 + Math.cos(angle + self.arc / 2) * textRadius), //calculando eje x
                          (250 + Math.sin(angle + self.arc / 2) * textRadius)  //calculando eje y
                          );
            // Rotar el contexto del canvas en grados calculados
            self.ctx.rotate(angle + self.arc / 2 + Math.PI / 2);

            // texto numero que se mostrar en la ruleta
            const text = self.options[i].numero;

            // dinujar texto en el contexto
            self.ctx.fillText(text, -self.ctx.measureText(text).width / 2, 0);

            // Restaurar el estado anterior del contexto de dibujo
            self.ctx.restore();

              //<======================== fin del proceso para ubicar los numeros en la ruleta
          } 

          //Dibujar la flecha de seleccion de numero ganador
          self.ctx.fillStyle = "#42d392"; // color de fondo 
          self.ctx.beginPath();
          self.ctx.moveTo(250 - 4, 250 - (bordeExternoCirc + 5));
          self.ctx.lineTo(250 + 4, 250 - (bordeExternoCirc + 5));
          self.ctx.lineTo(250 + 4, 250 - (bordeExternoCirc - 5));
          self.ctx.lineTo(250 + 9, 250 - (bordeExternoCirc - 5));
          self.ctx.lineTo(250 + 0, 250 - (bordeExternoCirc - 13));
          self.ctx.lineTo(250 - 9, 250 - (bordeExternoCirc - 5));
          self.ctx.lineTo(250 - 4, 250 - (bordeExternoCirc - 5));
          self.ctx.lineTo(250 - 4, 250 - (bordeExternoCirc + 5));

          // realizar ek dibujo de las trazas de la flecha de seleccion
          self.ctx.fill();
        }
      },
    girarRuleta: async function () {

        const self = this;
        const isValid = await self.guardarApuesta();

        if(!isValid) return false;


      self.spinAngleStart = Math.random() * 10 + 10;
      self.spinTime = 0;
      self.spinTimeTotal = Math.random() * 3 + 4 * 1000;
      self.rotarCirculo();
    },

    rotarCirculo: function () {
      const self = this;

      self.spinTime += 30;

      if(self.spinTime >= self.spinTimeTotal) {
        self.detenerRotacion();
        return;
      }
      const spinAngle = self.spinAngleStart - calcular(self.spinTime, 0, self.spinAngleStart, self.spinTimeTotal);
      self.startAngle += (spinAngle * Math.PI / 180);
      self.dibujarRuleta();

      self.spinTimeout = setTimeout(() => self.rotarCirculo(),30);
    },

    detenerRotacion: function () {
      const self = this;

      clearTimeout(self.spinTimeout);
      const degrees = self.startAngle * 180 / Math.PI + 90;
      const arcd = self.arc * 180 / Math.PI;
      const index = Math.floor((360 - degrees % 360) / arcd);
      self.ctx.save();

      const resultado ={
        tipoNumero : (index  % 2 == 0 ? 0 : 1),
        color :(self.options[index].color == 'red' ? 0 : 1),
        numero: parseInt(self.options[index].numero)
      }
     self.obtenerPremio(resultado)?.then(resultado => {
      self.lastResult = resultado;

      self.message = `Resultado: ${(self.options[index].numero  % 2 == 0 ? 'Par':'Impar')} | ${self.options[index].color} | ${self.options[index].numero}
               ======>  Jugador ${resultado.ganaPremio ? "Gana" : "Pierde"} ${resultado.montoPremio}`
     });


    },
      guardarApuesta:async function(){
      const self = this;

      const api = "https://localhost:44395/api/Ruleta/GuardarUsuarioApuesta";

      const apuesta = self.apuesta;

      if(!(self.apuesta.montoApuesta)){
        alert("Debe colocar un monto mayor a cero")
        return false;
      }
      const config = {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify(apuesta)
                  }

      const response = await fetch(api,config);

      if(!response.ok){
        const error = await response.json();
        console.log(error);
         return false;
      }
      return true;
    },
    obtenerPremio:async function(resultado){

      const api = "https://localhost:44395/api/Ruleta/GetPremio";
      const config = {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify(resultado)
                  }

      const response = await fetch(api,config);

      return await response.json();

    }

  }
}

  const calcular = (t, b, c, d) => {
    const ts = (t/=d)*t;
    const tc = ts*t;
    return b+c*(tc + -3*ts + 3*t);
  }
</script>