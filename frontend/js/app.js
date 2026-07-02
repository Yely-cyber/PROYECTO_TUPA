// URL base del backend 
const API_URL = 'http://localhost:3000/api/procedimientos';

async function cargarProcedimientos() {
  const tbody = document.querySelector('#tabla-procedimientos tbody');
  try {
    const respuesta = await fetch(API_URL);
    const datos = await respuesta.json();

    tbody.innerHTML = '';
    datos.forEach(proc => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${proc.id}</td>
        <td>${proc.nombre}</td>
        <td>${proc.descripcion ?? ''}</td>
        <td>${proc.costo ?? ''}</td>
        <td>${proc.plazo ?? ''}</td>
      `;
      tbody.appendChild(fila);
    });
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="5">Error al conectar con el servidor: ${error.message}</td></tr>`;
  }
}

document.addEventListener('DOMContentLoaded', cargarProcedimientos);
