//#region Constantes

//#region LOGICA

var map = null;
var markers = [];
const globalArray = [];
cargarArrayGlobal();

//#endregion

//#region VISTA

const tipoDeBusquedaHTML =
  "<fieldset class='form-group animated fadeIn' id='panelGenerado'><div class='row'><legend class='animated fadeIn col-form-legend col-sm-4'>Tipo de busqueda</legend><div class='col-sm-8'><div class='form-check'><label class='form-check-label'><input class='form-check-input' type='radio' name='tipoBusqueda' value='nombre' onchange='generarTipoBusqueda()'> Nombre</label></div><div class='form-check'><label class='form-check-label'><input class='form-check-input' type='radio' name='tipoBusqueda' value='pais' onchange='generarTipoBusqueda()'> Pais</label></div></div></div></fieldset><div class='form-group row animated fadeIn' id='contenedorBusqueda'></div>";
const tipoDeBusquedaHTMLProfesores =
  "<fieldset class='form-group animated fadeIn' id='panelGenerado'><div class='form-group row animated fadeIn' id='contenedorBusqueda'></div>";
const tipoBusquedaPais =
  "<label for='inputPais'class='col-sm-4 col-form-label animated fadeIn'>Paises</label><div class='animated fadeIn col-sm-8'><select id='inputPais' class='form-control' onchange='filtroPorPais(this)'></select></div>";
const checkboxesCiclos =
  "<div class='col-sm-4 animated fadeIn'>Nombre de ciclos</div><div class='col-sm-8 animated fadeIn' id='contenedorCheckboxes'></div>";
const botonBuscar =
  "<div id='btnBuscarDiv' class='buttons text-center buttonbuscar animated fadeIn'><button type='button' class='btn btn-success' id='btnBuscar' data-toggle='modal' data-target='#busquedaModal' onclick='buscar()' ><i class='fa fa-search' aria-hidden='true'></i> Buscar</button></div>";

const containerGeneracion = document.getElementById("panelGenerado");

//#endregion

//#endregion

//#region Vista

function generarBusqueda(e) {
  /// Si la busqueda es grado medio o grado superior generar el tipo de busqueda de alumnos
  if (e.value == "Grado Medio" || e.value == "Grado Superior") {
    containerGeneracion.innerHTML = tipoDeBusquedaHTML;
    /// Sino agregar el tipo de busqueda de alumnos.
  } else if (e.value == "Profesorado") {
    containerGeneracion.innerHTML = tipoDeBusquedaHTMLProfesores;
    /// Agregar el combobox de paises directamente.
    generarComboboxPaises();
  } else {
    /// Si no se selecciona ninguno del dos borrar todo lo anterior.
    containerGeneracion.innerHTML = "";
  }
  window.scrollTo(0, document.body.scrollHeight);
}

function generarCheckboxesCiclos(e) {
  /// Conseguir el contenedor
  let container = document.getElementById("contenedorBusqueda");

  /// Agregarle elementos de bootstrap
  container.insertAdjacentHTML("beforeend", checkboxesCiclos);

  /// obtener el contenedor de checkboxes
  let contenedorCheckboxes = document.getElementById("contenedorCheckboxes");

  /// Array donde estaran los ciclos filtrados para añadir
  let filteredByCiclos = [];

  /// Añadir al array los ciclos filtrados por el tipo
  for (let i = 0; i < globalArray.length; i++) {
    let tipo = globalArray[i].tipo;
    let tipofiltro = e.value;
    if (tipo == tipofiltro) {
      let ciclo = globalArray[i].ciclo;
      /// Ignorar los repetidos
      if (filteredByCiclos.indexOf(ciclo) == -1) {
        filteredByCiclos.push(ciclo);
      }
    }
  }

  let div = document.createElement("div");
  div.className = "form-check";

  let label = document.createElement("label");
  label.className = "form-check-label";

  let input = document.createElement("input");
  input.type = "checkbox";
  input.name = "ciclo";
  input.className = "form-check-input";
  input.value = "Todos";
  input.id = "todos";

  input.addEventListener("change", checkAll, false);

  let text = document.createTextNode("Todos");

  label.appendChild(input);
  label.appendChild(text);
  div.appendChild(label);
  contenedorCheckboxes.appendChild(div);

  /// Por cada item en el array filtrado agregar el checkbox, hay que agregar mas cosas de bootstrap.
  for (let index = 0; index < filteredByCiclos.length; index++) {
    let div = document.createElement("div");
    div.className = "form-check";

    let label = document.createElement("label");
    label.className = "form-check-label";

    let input = document.createElement("input");
    input.type = "checkbox";
    input.name = "ciclo";
    input.className = "form-check-input";
    input.value = filteredByCiclos[index];
    input.addEventListener("change", filtroPorCiclo, false);

    let text = document.createTextNode(filteredByCiclos[index]);

    label.appendChild(input);
    label.appendChild(text);
    div.appendChild(label);
    contenedorCheckboxes.appendChild(div);
  }
}

function checkAll() {
  /// Si el checkbox todos se activa, activa todos los checkboxes, sino los desactiva
  var checkboxes = document.querySelectorAll('input[name="ciclo"]');
  var todos = document.getElementById("todos");
  if (todos.checked) {
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].type == "checkbox") {
        checkboxes[i].checked = true;
      }
    }
  } else {
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].type == "checkbox") {
        checkboxes[i].checked = false;
      }
    }
  }
  /// Esto activa o desactiva el boton de busqueda si los activa o no
  filtroPorCiclo();
}

function generarComboboxPaises() {
  /// Contenedor busqueda
  let container = document.getElementById("contenedorBusqueda");

  /// Añadirle el tipo de busqueda pais, es un combobox
  container.insertAdjacentHTML("beforeend", tipoBusquedaPais);

  /// Conseguir ese combobox
  let paisesSelect = document.getElementById("inputPais");

  /// Añadirle el primer option de seleccione un pais
  var opt = document.createElement("option");
  opt.innerHTML = "Seleccione un pais";
  opt.value = "ninguno";
  paisesSelect.appendChild(opt);

  /// Array para añadirle al combobox
  let paisesByTipo = [];

  /// Conseguir el valor del tipo movilidad, GS GM o Profesorado
  let e = document.getElementById("inputTipoMovilidad").value;

  /// Añadir al paisesByTipo los pasies de ese tipo movildiad
  for (let i = 0; i < globalArray.length; i++) {
    let tipo = globalArray[i].tipo;
    let tipofiltro = e;
    if (tipo == tipofiltro) {
      let pais = globalArray[i].pais;
      /// Ignorando los que ya estan añadidos
      if (paisesByTipo.indexOf(pais) == -1) {
        /// Añadirlo al array
        paisesByTipo.push(pais);
      }
    }
  }

  /// Por cada item agregar un option al combobox
  for (var i = 0; i < paisesByTipo.length; i++) {
    var opt = document.createElement("option");
    opt.value = paisesByTipo[i];
    opt.innerHTML = paisesByTipo[i];
    paisesSelect.appendChild(opt);
  }

  window.scrollTo(0, document.body.scrollHeight);
}

function generarTipoBusqueda() {
  /// Dependiendo del tipo de busqueda y tipo de movilidad generar busqueda por ciclos o paises
  let e = document.querySelector('input[name="tipoBusqueda"]:checked');
  let mov = document.getElementById("inputTipoMovilidad");
  clearBusqueda("contenedorBusqueda");
  if (e.value == "nombre") {
    generarCheckboxesCiclos(mov);
  } else {
    generarComboboxPaises();
  }

  window.scrollTo(0, document.body.scrollHeight);
}

function clearBusqueda(div) {
  /// Limpia todos los hijos de un padre div
  var myNode = document.getElementById(div);
  if (myNode != null) {
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
  }

  window.scrollTo(0, document.body.scrollHeight);
}

function filtroPorPais(e) {
  /// Value es el valor del textbox paises
  let value = e.value;
  var myNode = document.getElementById("btnBuscarDiv");

  /// Si el boton existe, borrarlo
  if (myNode != null) {
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
    document
      .getElementById("contenedorBusqueda")
      .removeChild(document.getElementById("btnBuscarDiv"));
  }
  // Si el boton existe y el valor introducido no es ninguno, añadir el boton
  if (value != null && value != "ninguno") {
    let container = document.getElementById("contenedorBusqueda");
    container.insertAdjacentHTML("beforeend", botonBuscar);
  }

  window.scrollTo(0, document.body.scrollHeight);
}

function filtroPorCiclo() {
  /// Conseguir los checkboxes  de nombre de ciclos
  var checkedBoxes = document.querySelectorAll('input[name="ciclo"]:checked');

  /// Boton buscar
  var myNode = document.getElementById("btnBuscarDiv");

  /// Si hay cursos cargados y el boton buscar es nulo
  if (checkedBoxes.length > 0 && myNode == null) {
    /// Agregar el boton
    let container = document.getElementById("contenedorBusqueda");
    container.insertAdjacentHTML("beforeend", botonBuscar);
  } else if (checkedBoxes.length == 0 && myNode != null) {
    /// Sino borrar todo
    if (myNode != null) {
      while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
      }
      document
        .getElementById("contenedorBusqueda")
        .removeChild(document.getElementById("btnBuscarDiv"));
    }
  }
  window.scrollTo(0, document.body.scrollHeight);
}

//#endregion

//#region Logica

function cargarArrayGlobal() {
  /// Crear un array con objetos tipo movilidad
  for (let index = 0; index < data.length; index++) {
    const e = data[index];
    var m = new movilidad(e.tipo, e.ciclo, e.pais, e.ciudad);
    globalArray.push(m);
  }
}

function buscar() {
  /// Esto es meramente estetico par aminorar lo que el usuario ve debido a los erroes de google maps con bootstrap
  var mapsDiv = document.getElementById("googleMap");
  mapsDiv.className = "animated fadeIn";  

  /// Array final que se va a utilizar para mostrar en el google maps
  let finalArrayFiltered = [];

  /// Saber el tipo de movilidad
  let tipoMovilidad = document.getElementById("inputTipoMovilidad").value;

  if (document.querySelector('input[name="tipoBusqueda"]:checked') != null) {
    /// Saber el tipo de busqueda selccionada
    let tipoBusqueda = document.querySelector(
      'input[name="tipoBusqueda"]:checked'
    ).value;

    /// Si es tipo nombre
    if (tipoBusqueda == "nombre") {
      /// Array para filtrar el global
      let arrayFiltered = [];
      /// Saber que checkboxes se han clicado
      let ciclosCheckboxes = document.querySelectorAll(
        "input[name='ciclo']:checked"
      );
      /// Array para guardar los nombres
      let ciclosNombres = [];
      /// Por cada checkbox añadir el value a array de nombres
      ciclosCheckboxes.forEach(e => {
        ciclosNombres.push(e.value);
      });

      /// Filtrar el array global y mostrar en el mapa
      arrayFiltered = globalArray.filter(e => e.tipo === tipoMovilidad);

      /// Filtrar el array por cada ciclo
      ciclosNombres.forEach(ciclo => {
        let a = arrayFiltered.filter(e => e.ciclo === ciclo);

        /// Por cada filtro, agregar los elementos al array final
        a.forEach(element => {
          finalArrayFiltered.push(element);
        });
      });
    } else if (tipoBusqueda == "pais") {
      /// Array para filtrar el global
      let arrayFiltered = [];

      /// Filtrar el array global por tipo movilidad, en este caso es pais
      arrayFiltered = globalArray.filter(e => e.tipo === tipoMovilidad);

      /// Conseguir el pais introducido en el combobox
      let pais = document.getElementById("inputPais").value;

      /// Filtrar el array filtrado anteriormente por tipo movilidad por pais
      finalArrayFiltered = arrayFiltered.filter(e => e.pais === pais);
    }
  } else {
    /// Filtrar el array global por tipo movilidad, en este caso es profesorado
    arrayFiltered = globalArray.filter(e => e.tipo === tipoMovilidad);

    /// Conseguir el pais introducido en el combobox
    let pais = document.getElementById("inputPais").value;

    /// FIltrar el array por pais
    finalArrayFiltered = arrayFiltered.filter(e => e.pais === pais);
  }

  /// Borrar todos los marcadores
  markers.forEach(element => {
    element.setMap(null);
  });

  /// Google maps tiene problemas con los display none utilizado en bootstrap, esta documentado en
  /// github y stackoverflow, asi que uso el evento trigger resize que hace que se recargue el maps al final
  /// de realiza toda la logica y añadir, aparte tambien se centra.
  setTimeout(function() {
    /// event trigger
    google.maps.event.trigger(map, "resize");
    /// Centrar el mapa de nuevo, maps funciona mal cuando se agregan cosas asi que hay que recentrar
    map.setCenter(new google.maps.LatLng(48.1326095, 18.174334));
  }, 1000);

  finalArrayFiltered.forEach(element => {
    /// Utilizar API de google incluye el geocoder, que pasandole una direccion devuelve LAT y LNG
    var geocoder = new google.maps.Geocoder();
    /// Builder del string a enviar
    var string = element.ciudad + ", " + element.pais;
    var ciclo = element.ciclo;

    geocoder.geocode({ address: string }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var myCenter = new google.maps.LatLng(
          /// Resultados asignados a myCenter
          results[0].geometry.location.lat(),
          results[0].geometry.location.lng()
        );
        /// Nuevo marcador
        var marker = new google.maps.Marker({
          /// Posicion es myCenter
          position: myCenter,
          /// Animacion
          animation: google.maps.Animation.BOUNCE,
          contentString: ciclo
        });

        /// Añadir a el mapa
        marker.setMap(map);

        marker.addListener("click", function() {
          /// Inforwindow para el marcador
          var infowindow = new google.maps.InfoWindow({
            content: ciclo
          });

          /// Mensaj
          infowindow.open(map, marker);
        });

        markers.push(marker);
      } else {
        /// Algo fue mal
      }
    });
  });

  /// Google maps tiene problemas con los display none utilizado en bootstrap, esta documentado en
  /// github y stackoverflow, asi que uso el evento trigger resize que hace que se recargue el maps al final
  /// de realiza toda la logica y añadir, aparte tambien se centra.
  setTimeout(function() {
    /// event trigger
    google.maps.event.trigger(map, "resize");
    /// Centrar el mapa de nuevo, maps funciona mal cuando se agregan cosas asi que hay que recentrar
    map.setCenter(new google.maps.LatLng(48.1326095, 18.174334));
  }, 1000);
}

function myMap() {
  var latlng = new google.maps.LatLng(48.1326095, 18.174334);

  var zoom = 4;
  if (Modernizr.mq("(max-device-width : 480px)")) {
    zoom = 3;
    document.getElementById("googleMap").style = "height:400px";
  } else if (Modernizr.mq("(min-width : 1224px)")) {
    zoom = 4;
  } else if (Modernizr.mq("(min-width : 1824px)")) {
    zoom = 4;
  }

  console.log(zoom);

  var mapProp = {
    zoom: zoom,
    center: latlng
  };
  map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

function cargarListaMovilidadesModal() {
  let e = document.getElementById("panelListaMovilidades");

  globalArray.forEach(element => {
    let li = document.createElement("li");
    let stringbuilder =
      element.tipo +
      " - " +
      element.ciclo +
      " - " +
      element.ciudad +
      ", " +
      element.pais;

    li.innerText = stringbuilder;
    li.className = "list-group-item";
    e.appendChild(li);
  });

  let infoe = document.getElementById("panelListaMovilidadesInfo");
  infoe.innerText =
    "A continuacion se encuentra la lista con todas las movilidades, en total hay " +
    globalArray.length +
    " movilidades.";
}

function cargarListaMovilidadModalModificar() {
  let e = document.getElementById("modalModificarMovilidad");
  let o = document.createElement("option");
  o.innerText = "Seleccione una opcion";
  o.value = "ninguno";
  e.appendChild(o);
  globalArray.forEach(element => {
    let o = document.createElement("option");
    let stringbuilder =
      element.tipo +
      " - " +
      element.ciclo +
      " - " +
      element.ciudad +
      ", " +
      element.pais;
    o.value = element.id;
    o.innerText = stringbuilder;
    e.appendChild(o);
  });
}

function cargaListaMovilidadesModificarSelect(e) {
  let input = globalArray.filter(element => element.id === e.value);

  let inputTipo = document.getElementById("modalModificarTipoMovilidad");
  let inputNombre = document.getElementById("modalModificarNombreCiclo");
  let inputPais = document.getElementById("modalModificarPais");
  let inputCiudad = document.getElementById("modalModificarCiudad");
  let botonModificar = document.getElementById("modalModificarBoton");
  let botonEliminar = document.getElementById("modalEliminarBoton");

  if (e.value != "ninguno") {
    let id = input[0].id;
    let tipo = input[0].tipo;
    let nombre = input[0].ciclo;
    let pais = input[0].pais;
    let ciudad = input[0].ciudad;

    inputTipo.disabled = false;
    inputTipo.value = tipo;

    inputNombre.disabled = false;
    inputNombre.value = nombre;

    inputPais.disabled = false;
    inputPais.value = pais;

    inputCiudad.disabled = false;
    inputCiudad.value = ciudad;

    botonModificar.disabled = false;
    botonEliminar.disabled = false;
  } else {
    inputTipo.disabled = true;
    inputTipo.value = "Movilidad";

    inputNombre.disabled = true;
    inputNombre.value = "";

    inputPais.disabled = true;
    inputPais.value = "";

    inputCiudad.disabled = true;
    inputCiudad.value = "";

    botonModificar.disabled = true;
    botonEliminar.disabled = true;
  }
}

function comprobarNuevaMovilidad() {
  let botonNuevo = document.getElementById("modalNuevoBoton");

  let inputTipo = document.getElementById("modalNuevoTipoMovilidad");
  let inputNombre = document.getElementById("modalNuevoNombreCiclo");
  let inputPais = document.getElementById("modalNuevoPais");
  let inputCiudad = document.getElementById("modalNuevoCiudad");
  if (
    inputTipo.value == null ||
    inputTipo.value == "" ||
    inputNombre.value == null ||
    inputNombre.value == "" ||
    inputPais.value == null ||
    inputPais.value == "" ||
    inputCiudad.value == null ||
    inputCiudad.value == ""
  ) {
    botonNuevo.disabled = true;
  } else if(inputTipo.value != null && inputNombre.value != null && inputPais.value != null && inputCiudad.value != null) {
    botonNuevo.disabled = false;
  }
}

cargarListaMovilidadesModal();
cargarListaMovilidadModalModificar();

//#endregion
