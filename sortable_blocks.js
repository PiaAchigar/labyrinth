/*--------------------Sortable--sendOrders()---BTN-erase()----------- */
document.addEventListener("DOMContentLoaded", (e) => {
  //e.preventDefault();
  console.log("readyy");
  let lista = document.getElementById("dhs-lista");
  let lista2 = document.getElementById("dhs-lista2");
  let erase = document.getElementById("dhs-erase");
  let sortable = new Sortable(lista, {
    group: {
      name: "shared",
      pull: "clone",
      put: false,
    },
    sort: false,
    animation: 500,
    //chosenClass: true,
    //draggClass: false,
    //ghostClass: false,
  });

  /*Segundo ul : dh-lista2*/
  let sortable2 = new Sortable(lista2, {
    group: {
      name: "shared",
      pull: true,
    },
    sort: true,
    animation: 400,
    easing: "cubic-bezier(1, 0, 0, 1)",
    store: {
      set: function (sortable) {
        const ordenes = sortable.toArray();
        //console.log(ordenes.join("|"));
        localStorage.setItem("lista-ordenes", ordenes.join("|"));
      },
    },
  });
  /*Agrego otro grupo sortable para la eliminacion*/
  /** Cuando llevo un li al tachito de basura, se elimina */
  Sortable.create(lista2, {
    group: {
      name: "erased",
      pull: true,
    },
    sort: false,
    animation: 550,
  });

  let eraseed = Sortable.create(erase, {
    group: {
      name: "erased",
      pull: false,
      put: true,
    },
    animation: 550,
    forceFallback: false,
    fallbackClass: "sortable-fallback",
  });
  // onEnd: function (evt) {
  //   var itemEl = evt.item;
  //   erase.innerHTML=""
  //   console.log(itemEl);
  // },
  //seconsole.log(Object.keys(eraseed));
});





