// ALGUNAS VARIABLES GLOBALES PARA MODIFICACION RAPIDA
const P = "partida";
const F = "final";
const anchoBaseElementos = 40;
const misImagenes = {
    robot1: "img/robotlupe.png",
    arboles: "img/arboles.png",
    pasto: "img/pasto.png",
    cofre: "img/cofrecerrado.png",
    lodo: "img/lodo.png"
}

const matCrud = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, P, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// JUEGO
const configuracionJuego = {
    anchoBaseElementos: anchoBaseElementos,
    nombre: "Mi Juego!",
    matrizCruda: matCrud,
    modo: "prerun",
    errorsHalt: true,
    showMov:false,
    // pathImageUrl: "asdasd",
    // wallImageUrl:"asd",
    wallCollideMessage: "¡OH NO!<br>¡Choqué contra un árbol!",
    boundsCollideMessage: "¡OH NO!<br>¡Imposible!" 
}
// const miJuego = new Juego(anchoBaseElementos, "Laberinto", matCrud, "");
const miJuego = new Juego(configuracionJuego);
const escenario = miJuego.crearEscenario(document.getElementById("elemento-escenario"));

// PERSOJANES

const lupeData = {
    tipoPersonaje: "JUGABLE",
    yaCreadoEnHtml: false,
    elementoHTML: null,
    idUsarHTML: "robot1",
    yaConImagenEnHtml: false,
    imagenenHTML: null,
    urlImagenCrear: misImagenes.robot1,
    debeTenerTooltips: true,
    coordenadaX: 1,
    coordenadaY: 1, // Begins at 0
    zindex:3,
};


const cofreData = {
    tipoPersonaje: "COFRE",
    yaCreadoEnHtml: false,
    elementoHTML: null,
    idUsarHTML: "cofre",
    yaConImagenEnHtml: false,
    imagenenHTML: null,
    urlImagenCrear: misImagenes.cofre,
    debeTenerTooltips: true,
    coordenadaX: 6,
    coordenadaY: 3, // Begins at 0
    zindex: 2,
};

const lodoData = {
    tipoPersonaje: "LODO",
    yaCreadoEnHtml: false,
    elementoHTML: null,
    idUsarHTML: "lodo-1",
    yaConImagenEnHtml: false,
    imagenenHTML: null,
    urlImagenCrear: misImagenes.lodo,
    debeTenerTooltips: false,
    coordenadaX: 1,
    coordenadaY: 3, // Begins at 0
    zindex: 2,
};

const miLupe = miJuego.agregarPersonaje("Lupe", lupeData);
miLupe.collisions[0] = {with:"LODO", advanceFactor: 0.7, handler: function(){miLupe.morir()} }
// miLupe.collisions[1] = {with: "MAIZ", advanceFactor: 1, handler: function(){if(miLupe.encendida)}}
const miLodo = miJuego.agregarPersonaje("Lodo", lodoData);


const miCofre = miJuego.agregarPersonaje("Cofre", cofreData);

// Finjo recibir pasos del alumno apilados en sortable
miJuego.pasosPreprogramadosOriginal = [{de:"idrobot", direccion:"abajo", veces:"1"}, {de:"idRobot", direccion:"derecha", veces:"2"}];

