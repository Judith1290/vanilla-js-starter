import{guardarTareas,deleteUploadedFile,extraerTarea} from "./index.js"

let fileData = [];

// Seleccionar el botón de agregar y el campo de entrada
const agregar = document.getElementById('agregar');
const fileNameInput = document.getElementById('fileName');

// Agregar un evento de click al botón de agregar
agregar.addEventListener('click', agregarTarea);

// Agregar un evento de tecla presionada al campo de entrada
fileNameInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        agregarTarea();
    }
});

// Función para agregar una tarea
async function agregarTarea() {
    // Obtener los valores de los campos de entrada
    const fileName = fileNameInput.value;

    // Verificar si se han proporcionado los datos necesarios
    if (!fileName) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    // Crear nueva tarea
    const nuevaTarea = { name: fileName };

    // Guardar la nueva tarea en el servidor
    const tareaGuardada = await guardarTareas(nuevaTarea);

    if (tareaGuardada) {
        // Agregar la nueva tarea a fileData
        fileData.push(tareaGuardada[tareaGuardada.length - 1]);

        // Mostrar el archivo en la lista de archivos subidos
        displayUploadedFile(tareaGuardada[tareaGuardada.length - 1]);

        // Limpiar los campos de entrada
        fileNameInput.value = '';

        // Actualizar el contador de tareas completadas
        updateCompletedCount();
    }
}

// Función para mostrar un archivo subido en la lista
function displayUploadedFile(tarea) {
    // Crear elemento <li> para mostrar el archivo subido
    const listItem = document.createElement("li");

    // Crear un span para el nombre del archivo
    const fileText = document.createElement("span");
    fileText.textContent = tarea.name;

    // Agregar botón de eliminar
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.onclick = async function () {
        const deleted = await deleteUploadedFile(tarea.id);
        if (deleted) {
            // Eliminar la tarea de fileData
            fileData = fileData.filter(t => t.id !== tarea.id);
            listItem.parentNode.removeChild(listItem); // Eliminar el elemento de la lista

            // Actualizar el contador de tareas completadas
            updateCompletedCount();
        }
    };

    listItem.appendChild(fileText);
    listItem.appendChild(deleteButton);

    // Mostrar el archivo subido en la lista de archivos subidos
    document.getElementById("selectedFiles").appendChild(listItem);
}
// Función para actualizar el contador de tareas completadas
function updateCompletedCount() {
    const completedCount = fileData.length;
    document.getElementById("completedCount").textContent = completedCount;
}

// Función para mostrar las tareas en la lista al cargar la página
async function mostrarTareas() {
    try {
        const tareas = await extraerTarea();
        tareas.forEach(t => {
            displayUploadedFile(t); // Reutilizar la función existente
            fileData.push(t); // Agregar tarea a fileData
        });
        // Actualizar el contador de tareas completadas
        updateCompletedCount();
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
    }
}

// Inicializar las tareas al cargar la página
window.addEventListener("load", mostrarTareas);
