let fileData = [];

// Seleccionar el botón de agregar
const agregar = document.getElementById('agregar');
// const nombre = document.getElementById('nombre')

// Agregar un evento de click al botón de agregar
agregar.addEventListener('click', async function () {
    // Obtener los valores de los campos de entrada
    const fileName = document.getElementById("fileName").value;

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
        document.getElementById("fileName").value = '';

        // Actualizar el contador de tareas completadas
        updateCompletedCount();
    }
});

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

// Función para guardar una tarea en el servidor
async function guardarTareas(nuevaTarea) {
    try {
        const response = await fetch("http://localhost:3000/api/task/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevaTarea)
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Error al guardar la tarea:", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        return null;
    }
}

// Función para eliminar un archivo subido de la lista
async function deleteUploadedFile(fileId) {
    try {
        const response = await fetch("http://localhost:3000/api/task/" + fileId, {
            method: "DELETE"
        });

        if (response.ok) {
            return true;
        } else {
            console.error("Error al eliminar la tarea:", response.statusText);
            return false;
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        return false;
    }
}

// Función para actualizar el contador de tareas completadas
function updateCompletedCount() {
    const completedCount = fileData.length;
    document.getElementById("completedCount").textContent = completedCount;
}
