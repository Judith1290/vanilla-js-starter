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



// Función para extraer tareas del servidor
async function extraerTarea() {
    try {
        const response = await fetch("http://localhost:3000/api/task/");
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Error al extraer las tareas:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        return [];
    }
}
export{guardarTareas,deleteUploadedFile,extraerTarea};
