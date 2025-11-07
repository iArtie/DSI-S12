// Constantes para elementos del DOM
const tabla = document.getElementById("tablaEstudiantes");
const form = document.getElementById("formEstudiante");
const idInput = document.getElementById("id");
const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const edadInput = document.getElementById("edad");
 
 
async function obtenerEstudiantes() {
  try {
    const response = await fetch('https://dsi-strapi.onrender.com/api/estudiantes');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data.data);
    return data.data;
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    return [];
    }
    }
 
 
 
function cargarTabla (estudiantes) {
  tabla.innerHTML = "";
  if (estudiantes.length == 0) {
    tabla.innerHTML = "<tr><td colspan='5' class='text-center'>No hay estudiantes registrados.</td></tr>";
    return;
  }
  estudiantes.forEach(est => {
    const fila = `
      <tr data-id="${est.id}"> [cite: 206]
        <td>${est.id}</td> [cite: 207]
        <td>${est.Nombre}</td> [cite: 208]
        <td>${est.Apellido}</td> [cite: 209]
        <td>${est.edad}</td> [cite: 210]
        <td>
          <button class="btn btn-sm btn-warning btn-editar">Editar</button> [cite: 212]
          <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button> [cite: 213]
        </td>
      </tr>
    `;
    tabla.innerHTML += fila;
  });
}
 
   
async function init() {
  const estudiantes = await obtenerEstudiantes();
  cargarTabla(estudiantes);
}
 
async function agregarEstudiante (estudiante){
  try {
    const response = await fetch('https://dsi-strapi.onrender.com/api/estudiantes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: estudiante })
    });
 
    if (!response.ok) {
      throw new Error('Error al agregar el estudiante.');
    }
   
    await init(); // Recargar la tabla
    form.reset(); // Limpiar el formulario
 
  } catch (error) {
    console.error('Error en agregarEstudiante:', error);
  }
}
 
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const docId = idInput.value;
  const nombre = nombreInput.value.trim();
  const apellido = apellidoInput.value.trim();
  const edad = edadInput.value.trim();
 
  if (!nombre || !apellido || !edad) {
    alert('Por favor, complete todos los campos.');
    return;
  }
 
  const estudianteData = {
    Nombre: nombre,
    Apellido: apellido,
    edad: parseInt(edad, 10)
  };
 
  if (docId) {
    await actualizarEstudiante(docId, estudianteData);
  } else {
    await agregarEstudiante(estudianteData);
  }
 
  form.reset();
  await init();
});
 
function cargarTabla (estudiantes) {
  tabla.innerHTML = "";
  if (estudiantes.length == 0) {
    tabla.innerHTML = "<tr><td colspan='5' class='text-center'>No hay estudiantes registrados.</td></tr>";
    return;
  }
  estudiantes.forEach(est => {
    const fila = `
      <tr data-document-id="${est.documentId}">
        <td>${est.id}</td>
        <td>${est.Nombre}</td>
        <td>${est.Apellido}</td>
        <td>${est.edad}</td>
        <td>
          <button class="btn btn-sm btn-warning btn-editar">Editar</button>
          <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
        </td>
      </tr>
    `;
    tabla.innerHTML += fila;
  });
}
 
// Lógica para poblar el formulario al editar
tabla.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btn-editar')) {
    // ... Lógica de Editar (rellenar formulario)
    const fila = e.target.closest('tr');
    const docId = fila.dataset.documentId;
    const nombre = fila.children[1].textContent;
    const apellido = fila.children[2].textContent;
    const edad = fila.children[3].textContent;
    idInput.value = docId;
    nombreInput.value = nombre;
    apellidoInput.value = apellido;
    edadInput.value = edad;
  } else if (e.target.classList.contains('btn-eliminar')) {
    const fila = e.target.closest('tr');
    const docId = fila.dataset.documentId;
    if (confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
      await eliminarEstudiante(docId);  
      await init(); // Recargar la tabla después de eliminar
      }
  }
});
 
 
async function actualizarEstudiante (docId, estudiante) {
  try {
    const response = await fetch(`https://dsi-strapi.onrender.com/api/estudiantes/${docId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: estudiante })
    });
    if (!response.ok) throw new Error('Error al actualizar el estudiante.');
  } catch (error) {
    console.error('Error en actualizarEstudiante:', error);    
  }
}
 
async function eliminarEstudiante(docId) {
  try {
    const response = await fetch(`https://dsi-strapi.onrender.com/api/estudiantes/${docId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar el estudiante.');
  } catch (error) {
    console.error("Error en eliminarEstudiante:", error);
  }
}
 
init();