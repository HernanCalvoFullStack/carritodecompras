// Variables

const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");

let articulosCarrito = [];

cargarEventListener();
function cargarEventListener() {
  // Cuando agrego un curso presionando "Agregar al Carrito"
  listaCursos.addEventListener("click", agregarCurso);

  // Eliminar cursos del carrito
  carrito.addEventListener("click", eliminarCurso);

  // Muestra los cursos de local storage
  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carritoHTML();
  })

  // Vaciar el carrito de compras
  vaciarCarritoBtn.addEventListener("click", () => {
    articulosCarrito = []; // Reseteamos el arreglo del carrito
    limpiarHTML(); // Limpiamos el HTML
  })
}

// Funciones
function agregarCurso(e) {
  e.preventDefault();

  // e.target.classList.contains verifica que estemos haciendo click (debido al listener) en un elemento que tenga cierta clase
  if (e.target.classList.contains("agregar-carrito")) {
    const cursoSeleccionado = e.target.parentElement.parentElement;

    leerDatosCurso(cursoSeleccionado);
  }
}

// Eliminar un curso del carrito
function eliminarCurso(e) {
  if(e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");

    // Eliminar del arreglo de articulosCarrito por el data-id
    articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);
    
    carritoHTML(); // Iteramos sobre el carrito y mostramos el HTML
  }
}

// Lee el contenido del html al que le dimos click y extrae la info del curso
function leerDatosCurso(curso) {
  // Crear un objeto con el contenido del curso actual
  const infoCurso = {
    imagen: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector(".precio span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };
  // Revisar si un elemento ya existe en el carrito
  //.some itera sobre un arreglo de objetos y verifica si un elemento existe en él
  const existe = articulosCarrito.some( curso => curso.id === infoCurso.id );
  
  if(existe) {
    // Actualizamos la cantidad
    //.map crea un nuevo arreglo
    const cursos = articulosCarrito.map( curso => {
      if(curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso; 
      } else {
        return curso;
      }
    })
    articulosCarrito = [...cursos];
  } else {
    // Agregar elementos al carrito utilizando spreed operator
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  
  carritoHTML();
}

// Mostrar el carrito de compras en el HTML
function carritoHTML() {

  // Limpiar el HTML
  limpiarHTML();

  // Recorrer el carrito y generar el HTML
  articulosCarrito.forEach(curso => {

    // Destructuring
    const {imagen, titulo, precio, cantidad} = curso;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${imagen}" width="100"></td>
      <td>${titulo}</td>
      <td>${precio}</td>
      <td>${cantidad}</td>
      <td>
        <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
      </td>
    `;

    //Agregar el HTML del carrito en el tbody
    contenedorCarrito.appendChild(row);
  });

  // Agregar el carrito de compras al HTML
  sincronizarStorage();

}

function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito))
}

// Eliminar los cursos del tbody
// Está función borra un hijo del contenedor padre repetidamente hasta que el contenedor quede vacío 
function limpiarHTML() {
  while(contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild)
  }
}