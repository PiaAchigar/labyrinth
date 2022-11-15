
function sendOrders() {
    //que guarde los elementosItemsOrdenes,  fijaste: valorDeOrden y si tiene inputs
    /*busco en localStorage cunado aprieto el btn, para no pegarle al dom*/
    //ordenes: arriba|arriba|derecha
    const ordenes = localStorage.getItem("lista-ordenes");
    console.log(ordenes);
    //Luego de recuperar las ordenes, limpio el storagen
    localStorage.setItem("lista-ordenes", "");
    const ordenesDespues = localStorage.getItem("lista-ordenes");
    console.log(ordenesDespues)
    //validar el casillero sigiente y despues mandar a mover
    return ordersInObjects(ordenes == "" ? null : ordenes.split("|"))
    
  }
  function ordersInObjects(arrOfOrders){
    const { nombre, personajes } = miJuego//sacar
    const pasosDelAlumno = []
    const de = personajes[0].nameId //Lupe
    if(arrOfOrders){
        arrOfOrders.forEach((order, index)=>{
            const ord = {
                de, // por defecto, en este juego, siempre será para Lupe.
                numeroDeBloque: index, // el numero de bloque leido (orden)
                valorPrincipal: order, // o abajo, derecha, etc. (string)
                valorParametro: [] // para cuando tengamos bloques como "mover 10/20/30 pasos". En nuestro caso, no hay nada.  como en scratch pasa [tiempo,texto]     
            }
            pasosDelAlumno.push(ord)
        })
    }else{
        //console.log(nombre, ": no hay ordenes para ejecutar")
        Swal.fire({
            title: 'Debes arrastrar las ordenes primero :)',
            text: '¿Continuamos?',
            icon: 'warning',
            confirmButtonText: 'ok',
            color: 'white',
            background:"gray",
            confirmButtonColor:"green"
          })
        //Swal.fire('No instanciaste nunguna orden aún :(')
        return null
    }
    return pasosDelAlumno
  }
  function erase() {
    let elem = document.querySelector("#dhs-lista2");
    //let elemErase = document.querySelector("#dhs-erase");
    elem.innerHTML = "";
    //elemErase.innerHTML="";
    localStorage.setItem("lista-ordenes", "");
  }
