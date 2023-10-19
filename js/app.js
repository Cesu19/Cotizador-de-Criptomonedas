const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');

const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda:'',
    criptomoneda: ''
}
// Crear un Promise 
const obtenerCriptomonedas = criptomonedas => new Promise (resolve => {
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFomulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);

} )

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=50&tsym=USD';

    fetch(url)
     .then(respuesta => respuesta.json())
     .then(resultado => obtenerCriptomonedas(resultado.Data))
     .then( criptomonedas => selectCriptomonedas(criptomonedas))
}
function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach( cripto => {
        const{ FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName+ ` (${Name})`;
        criptomonedasSelect.appendChild(option);
    })
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}

function submitFomulario(e) {
    
    e.preventDefault();

    // Validar
    const { moneda, criptomoneda} = objBusqueda;

    if(moneda ==='' || criptomoneda ==='' ){
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    // Consultar la API con los resultados
    consultarAPI();
}

function mostrarAlerta(msg) {
    const existeError = document.querySelector('.error');

    if(!existeError){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
    
        //Mensaje de error
        divMensaje.textContent = msg;
    
        formulario.appendChild(divMensaje);
    
        setTimeout( () =>{
            divMensaje.remove();
        },3000);
    }
  
}

function consultarAPI(){
    const { moneda , criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then( cotizacion =>{
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda] [moneda]);
        })
}

function mostrarCotizacionHTML(cotizacion){

    limpiarHTML();
    
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCY24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('p')
    precio.classList.add('precio');
    precio.innerHTML = `El valor es :<span>${PRICE}</span>`;

    const precioHight = document.createElement('p'); 
    precioHight.innerHTML = `Precio más alto del día :<span>${HIGHDAY}</span>`;

    const precioLow = document.createElement('p'); 
    precioLow.innerHTML = `Precio más bajo del día :<span>${LOWDAY}</span>`;

    const variacion24hs = document.createElement('p'); 
    variacion24hs.innerHTML = `Variación últimas 24hs :<span>${CHANGEPCY24HOUR}</span>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Última actualización :<span>${LASTUPDATE}</span>`
    
    resultado.appendChild(precio)
    resultado.appendChild(precioHight)
    resultado.appendChild(precioLow)
    resultado.appendChild(variacion24hs)
    resultado.appendChild(ultimaActualizacion)

}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}