class Juego {
  constructor(gameConfigObj) {
    this.anchoBaseElementos = gameConfigObj.anchoBaseElementos;
    this.errorsHalt = gameConfigObj.errorsHalt; // SEGUIR POR ACA!!
    this.nombre = gameConfigObj.nombre; 
    this.matrizCruda = gameConfigObj.matrizCruda;
    this.showMovimientos = gameConfigObj.showMov;
    this.modo = gameConfigObj.modo;
    this.wallCollideMessage = gameConfigObj.wallCollideMessage;
    this.boundsCollideMessage = gameConfigObj.boundsCollideMessage;
    // this.wallImageUrl = gameConfigObj.wallImageUrl;
    // this.pathImageUrl = gameConfigObj.pathImageUrl

    this.escenario; // class Escenario
    this.personajes = []; // [class Personaje,]
    
    this.pasoActual = 0; // Contador de pasos "turnos"
    this.pasosPreprogramadosOriginal = []; // [{de: "fulano", pasos:[]}, {}, {}]
    this.pasosPreprogramadosTraducidos = []; // ["abajo","izquierda","derecha"]
    this.movimientosYaValidados = []; // ["abajo","decir_choqué"];
  }
  crearEscenario(elementoHTML){
    this._crearEscenario(elementoHTML);
  }
  _crearEscenario(elementoHTML) {
    this.escenario = new Escenario(
      this.matrizCruda,
      elementoHTML,
      this.anchoBaseElementos,
      true
    );
    return this.escenario;
  }
  agregarPersonaje(nameId, configObj) {
    // robot-1 , lupeObjet
    configObj.anchoBase = this.anchoBaseElementos;
    const person = new Personaje(nameId, configObj, this);
    this.personajes.push(person);
    return person
  }
  getPersonaje(nameId) {
    return this.personajes.find((p) => p.nameId == nameId);
  }
  traducirPasosPreprogramadosOriginal() {
    //cambia los "derecha7" por tres repeticiones de lo mismo.
  }
  recorrerPasosPreprogramadosSoloValidando() {
    // va pusheando al YaValidados
    // return{x:"un objeto con el status de la validacion para el mensaje final"}
  }

}

class Escenario {
  constructor(
    matrizCruda,
    elementoHTML = false,
    unidadAnchoDeseada = false,
    crearCasilleros = true
  ) {
    this.matrizCruda = matrizCruda; // Crudo de casilleros a crear
    this.objetosCasilleros = []; // La matriz de objetos Casilleros
    for (let f of this.matrizCruda) {
      let newRow = [];
      for (let c of f) {
        try {
          c = c.toUpperCase();
        } catch {}
        switch (c) {
          case 1:
          case "1":
          case "P":
          case "PARED":
            newRow.push(new Casillero("wall", false));
            break;
          case 0:
          case "0":
          case "C":
          case "CAMINO":
            newRow.push(new Casillero("path", true));
            break;
          case "E":
          case "ENTRADA":
          case "PARTIDA":
            newRow.push(new Casillero("path", true, ["IN"]));
            break;
          case "S":
          case "SALIDA":
          case "FINAL":
            newRow.push(new Casillero("path", true, ["OUT"]));
          default:
            break;
        }
      }
      this.objetosCasilleros.push(newRow);
    }
    if (elementoHTML && unidadAnchoDeseada) {
      this.renderizarLaberinto(elementoHTML, unidadAnchoDeseada);
      if (crearCasilleros) {
        this.crearElementosCasilleros();
      }
    }
  }
  isPath(posF, posC) {
    if (this.matrizCruda[posF][posC] == 0) {
      return true;
    }
    return false;
  }
  renderizarLaberinto(elementoHTML, unidadAnchoDeseada) {
    this.unidadAncho = unidadAnchoDeseada;
    this.anchoTotal = this.unidadAncho * this.matrizCruda[0].length;
    this.altoTotal = this.unidadAncho * this.matrizCruda.length;
    this.elementoHTML = elementoHTML;
    this.elementoHTML.style.width = this.anchoTotal + "px";
    this.elementoHTML.style.height = this.altoTotal + "px";
  }
  crearElementosCasilleros() {
    for (let f = 0; f < this.objetosCasilleros.length; f++) {
      for (let c = 0; c < this.objetosCasilleros[f].length; c++) {
        let sq = document.createElement("DIV");
        sq.classList.add("casillero");
        let myId = "cas-" + f + "-" + c;
        sq.setAttribute("id", myId);
        let casActual = this.objetosCasilleros[f][c];
        casActual.idElemento = myId;
        let tipoCasActual = casActual.type;
        sq.classList.add(tipoCasActual);
        sq.style.width = this.unidadAncho + "px";
        sq.style.height = this.unidadAncho + "px";
        this.elementoHTML.appendChild(sq);
      }
    }
  }
}

class Casillero {
  constructor(type, walkable, occupants = []) {
    this.type = type;
    this.walkable = walkable; // boolean
    this.occupants = occupants;
  }
  getElementHTML() {
    if (this.idElemento) {
      return document.getElementById(this.idElemento);
    } else {
      return false;
    }
  }

}

class Personaje {
  constructor(nombreId, configObj, juego) {
    // TIPOS [JUGABLE, FUEGOS, COFRES, MONEDAS, ENTRADA, SALIDA]
    //tipoPersonaje: viende dentro de configObj
    this.alive = true;
    this.configObj = configObj;
    this.juego = juego;
    this.nameId = nombreId;
    configObj.juego = this.juego;
    this.collisions = [];
    this.interfaz = new INTERFAZ_PERSONAJE(configObj);
    // this.cas_y_actual = configObj.coordenadaY;
    // this.cas_x_actual = configObj.coordenadaX;
    this.actualizarCasillerosJuego(
      configObj.coordenadaY,
      configObj.coordenadaX,
      true
    );

    this.vidas = configObj.vidas;
    this.intervaloPasosAutoRun;

    this.stylePropChanges = [
      {
        top: this.interfaz.elementoHTML.style.top,
        left: this.interfaz.elementoHTML.style.left,
      },
    ];
    this.stepActual = 0;
    //Personajes.push(configObj);
  }

  actualizarCasillerosJuego(nuevaY, nuevaX, isFirstStep = false) {
    if (!isFirstStep) {
      const indice = this.casilleroActual.occupants.indexOf(this);
      if (indice > -1) {
        this.casilleroActual.occupants.splice(indice, 1);
      }
    }
    this.cas_y_actual = nuevaY;
    this.cas_x_actual = nuevaX;
    this.casilleroActual =
      this.juego.escenario.objetosCasilleros[nuevaY][nuevaX];
    this.casilleroActual.occupants.push(this);
  }
  chequearValidezMovimiento(nuevaY, nuevaX) {
    // Chequea tanto por ""existencia"" como por walkability
    const existe =       
      nuevaY >= 0 &&
      nuevaX >= 0 &&
      nuevaY < this.juego.escenario.objetosCasilleros.length &&
      nuevaX < this.juego.escenario.objetosCasilleros[nuevaY].length;
    // const casilleroObservado = this.juego.escenario.objetosCasilleros[nuevaY][nuevaX];
    const isWalkable = existe &&  this.juego.escenario.objetosCasilleros[nuevaY][nuevaX].walkable;
    let advanceFactor;
    let mensaje;
    if(!existe){
      advanceFactor = 0.35;
      mensaje = this.juego.boundsCollideMessage
    } else if (!isWalkable) {
      advanceFactor = 0.45;
      mensaje = this.juego.wallCollideMessage 
    } else {
      advanceFactor = 1
    }

    // Interacciones


    return {
      existe,
      // casilleroObservado,
      isWalkable,
      advanceFactor,
      mensaje
    };
  }
  moverArriba() {
    const cas_y_nuevo = this.cas_y_actual - 1;
    const cas_x_nuevo = this.cas_x_actual;
    const chequeo = this.chequearValidezMovimiento(cas_y_nuevo, cas_x_nuevo);
    if (chequeo.isWalkable) {
      // chequeamos las interacciones (fueguitos, salidas, "ganaste" etc)
      // hacemos los movimientos en lógica y en interfaz
      this.actualizarCasillerosJuego(cas_y_nuevo, cas_x_nuevo);
      const nuevaXPos = cas_x_nuevo*this.juego.anchoBaseElementos;
      const nuevaYPos = cas_y_nuevo*this.juego.anchoBaseElementos;
      this.interfaz.moverPersonajeHTML(nuevaYPos, nuevaXPos);
      if (this.juego.showMovimientos) {
        this.juego.panelMensajes.show("Se ejecuto la fn moverArriba()", "normal");
      }
    }
  }
  moverAbajo() {
    const cas_y_nuevo = this.cas_y_actual + 1;
    const cas_x_nuevo = this.cas_x_actual;
    const chequeo = this.chequearValidezMovimiento(cas_y_nuevo, cas_x_nuevo);
    if (chequeo.isWalkable) {
      // chequeamos las interacciones (fueguitos, salidas etc)
      // hacemos los movimientos en lógica y en interfaz
      this.actualizarCasillerosJuego(cas_y_nuevo, cas_x_nuevo);
      const nuevaXPos = cas_x_nuevo*this.juego.anchoBaseElementos;
      const nuevaYPos = cas_y_nuevo*this.juego.anchoBaseElementos;
      this.interfaz.moverPersonajeHTML(nuevaYPos, nuevaXPos);
      if (this.juego.showMovimientos) {
        this.juego.panelMensajes.show("Se ejecuto la fn moverAbajo()", "normal");
      }
    }
  }
  moverDerecha() {
    const cas_y_original = this.cas_y_actual 
    const cas_x_original = this.cas_x_actual;

    const cas_y_nuevo = cas_y_original;
    const cas_x_nuevo = cas_x_original + 1;

    const chequeo = this.chequearValidezMovimiento(cas_y_nuevo, cas_x_nuevo);
    if (chequeo.isWalkable) {
      // chequeamos las interacciones (fueguitos, salidas etc)
      // hacemos los movimientos en lógica y en interfaz
      this.actualizarCasillerosJuego(cas_y_nuevo, cas_x_nuevo);
    } else {
      this.decir(chequeo.mensaje);
      this.morir();
    }
    const avance = chequeo.advanceFactor * this.juego.anchoBaseElementos;
    const nuevaXPos = cas_x_original*this.juego.anchoBaseElementos + avance;
    const nuevaYPos = cas_y_original*this.juego.anchoBaseElementos;
    this.interfaz.moverPersonajeHTML(nuevaYPos, nuevaXPos);
    if (this.juego.showMovimientos) {
      this.juego.panelMensajes.show("Se ejecuto la fn moverDerecha()", "normal");
    }
  }
  moverIzquierda() {
    const cas_y_nuevo = this.cas_y_actual;
    const cas_x_nuevo = this.cas_x_actual - 1;
    const chequeo = this.chequearValidezMovimiento(cas_y_nuevo, cas_x_nuevo);
    if (chequeo.isWalkable) {
      // chequeamos las interacciones (fueguitos, salidas etc)
      // hacemos los movimientos en lógica y en interfaz
      this.actualizarCasillerosJuego(cas_y_nuevo, cas_x_nuevo);
      const nuevaXPos = cas_x_nuevo*this.juego.anchoBaseElementos;
      const nuevaYPos = cas_y_nuevo*this.juego.anchoBaseElementos;
      this.interfaz.moverPersonajeHTML(nuevaYPos, nuevaXPos);
      if (this.juego.showMovimientos) {
        this.juego.panelMensajes.show("Se ejecuto la fn moverIzquierda()", "normal");
      }
    }
  }
  decir(texto, milisegundos=3000) {
      this.interfaz.elementoTextoTooltip.innerHTML = texto;
      this.interfaz.elementoHTML.classList.add("tooltipVisible");
      setTimeout(() => {
        this.interfaz.elementoHTML.classList.remove("tooltipVisible");
      }, milisegundos);
  }
  restarVida() {}
  morir() {
    this.alive = false;
  }
}

class INTERFAZ_PERSONAJE {
  constructor(configObj) {
    this.configObj = configObj;
    this.anchoBase = configObj.anchoBase;
    if (configObj.yaCreadoEnHtml) {
      this.elementoHTML = configObj.elementoHTML;
    } else {
      this.elementoHTML = document.createElement("DIV");
      this.elementoHTML.id = configObj.idUsarHTML;
      configObj.juego.escenario.elementoHTML.appendChild(this.elementoHTML)
    }
    
    this.elementoHTML.classList.add("personaje");
    this.elementoHTML.style.zIndex=configObj.zindex;
    
    // ANCHOS
    this.elementoHTML.style.width = this.anchoBase + "px";
    this.elementoHTML.style.height = this.anchoBase + "px";
    // this.elementoHTML.backgroundColor = configObj.colorFondo;
    this.elementoHTML.style.top = configObj.coordenadaY * this.anchoBase + "px";
    this.elementoHTML.style.left =
    configObj.coordenadaX * this.anchoBase + "px";
    this.elementoHTML.style.borderRadius = "5px";
    this.elementoHTML.style.transition = "all 0.5s";
    
    if (configObj.debeTenerTooltips) {
      this.elementoHTML.classList.add("tooltip");
      this.elementoTextoTooltip = document.createElement("DIV");
      this.elementoTextoTooltip.id = this.elementoHTML.id + "-txtTltp"; // OJO ACA
      this.elementoTextoTooltip.classList.add("tooltiptext");
      this.elementoTextoTooltip.innerText = "...";
      this.elementoHTML.appendChild(this.elementoTextoTooltip);
    }
    
    if (configObj.yaConImagenEnHtml) {
      this.imagenAnidada = this.elementoHTML.querySelector("IMG");
    } else {
      this.imagenAnidada = document.createElement("IMG");
      this.imagenAnidada.src = configObj.urlImagenCrear;
      this.imagenAnidada.style.width = "100%";
      this.imagenAnidada.style.height = "100%";
      this.imagenAnidada.style.boxSizing = "border-box";
      this.imagenAnidada.style.padding = "2px";
      this.elementoHTML.appendChild(this.imagenAnidada);
    }
  }
  moverPersonajeHTML(posY, posX){
    this.elementoHTML.style.top = posY + "px";
    this.elementoHTML.style.left = posX + "px";
  }
}


