/* 
  ============================================================================
  PROYECTO CLINICO UNIVERSITARIO - MÓDULOS DEL PORTAL DEL PACIENTE
  ============================================================================
  Archivo: portal.js
  Página:  registro.html
  
  Responsabilidades de este archivo:
    1. Almacenar las estructuras de datos simuladas (Mock Data) de exámenes y horas
    2. Manejar la navegación interna del portal (Dashboard → Exámenes → Horas → Volver)
    3. Renderizar dinámicamente las tablas de datos usando JavaScript (DOM)
  
  Dependencias:
    - Se carga en registro.html DESPUÉS de registro.js
    - Utiliza las clases CSS definidas en global.css (.data-table, .badge)
    - Utiliza las clases CSS definidas en registro.css (.portal-submodule, .expanded)
  
  Nota para modificaciones:
    - Para agregar un nuevo examen, añadir un objeto al arreglo 'datosExamenes'
    - Para agregar una nueva hora, añadir un objeto al arreglo 'datosHoras'
    - Los datos son de prueba (Mock). En un proyecto real se obtendrían de un servidor.
*/

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // SECCIÓN 1: ESTRUCTURAS DE DATOS SIMULADAS (MOCK DATA)
    // =========================================================================
    // Arreglos de Objetos que simulan la información que vendría de una base de datos.
    // Cada elemento del arreglo es un Objeto Literal con propiedades específicas.
    
    /**
     * datosExamenes - Arreglo de objetos que representa los resultados médicos del paciente.
     * Propiedades de cada objeto:
     *   - fecha:  {string} Fecha del examen en formato DD/MM/YYYY
     *   - tipo:   {string} Nombre del examen realizado
     *   - estado: {string} 'Disponible' (puede verse) o 'En Proceso' (aún no listo)
     *   - medico: {string} Nombre del médico que solicitó el examen
     */
    const datosExamenes = [
        { fecha: '02/05/2026', tipo: 'Hemograma Completo', estado: 'Disponible', medico: 'Dra. Silva' },
        { fecha: '15/04/2026', tipo: 'Perfil Lipídico', estado: 'Disponible', medico: 'Dra. Silva' },
        { fecha: '08/05/2026', tipo: 'Radiografía Tórax', estado: 'En Proceso', medico: 'Dr. Rojas' }
    ];

    /**
     * datosHoras - Arreglo de objetos que representa las citas médicas agendadas.
     * Propiedades de cada objeto:
     *   - fecha:        {string} Fecha de la cita
     *   - hora:         {string} Hora de la cita
     *   - especialidad: {string} Área médica de la consulta
     *   - doctor:       {string} Nombre del especialista asignado
     *   - box:          {string} Número del box o consultorio
     */
    const datosHoras = [
        { fecha: '12/05/2026', hora: '10:30', especialidad: 'Medicina General', doctor: 'Dr. Rojas', box: 'Box 12' },
        { fecha: '28/05/2026', hora: '15:00', especialidad: 'Cardiología', doctor: 'Dra. Silva', box: 'Box 4' }
    ];

    // =========================================================================
    // SECCIÓN 2: CAPTURA DE ELEMENTOS DEL DOM
    // =========================================================================
    const btnVerExamenes = document.getElementById('btn-ver-examenes');   // Botón "Resultados de Exámenes" en el portal
    const btnVerHoras = document.getElementById('btn-ver-horas');         // Botón "Mis Horas Médicas" en el portal
    const botonesVolver = document.querySelectorAll('.btn-volver-portal'); // Todos los botones "⬅ Volver al Panel"

    // =========================================================================
    // SECCIÓN 3: NAVEGACIÓN INTERNA DEL PORTAL
    // =========================================================================
    
    /**
     * navegarPortal(destinoId)
     * Función que controla la navegación SPA (Single Page Application) dentro del portal.
     * Oculta todas las pestañas y muestra solo la solicitada.
     * Además, expande o contrae el contenedor blanco según el tipo de vista.
     * @param {string} destinoId - ID del div a mostrar (ej: 'tab-examenes', 'tab-horas', 'tab-portal')
     */
    function navegarPortal(destinoId) {
        // Ocultar todas las pestañas de contenido
        const tabs = document.querySelectorAll('.auth-content');
        tabs.forEach(tab => tab.classList.add('hidden'));

        // Mostrar solo la pestaña de destino
        const destino = document.getElementById(destinoId);
        if(destino) destino.classList.remove('hidden');

        // Ajustar el tamaño del contenedor blanco (.auth-container)
        // Las tablas de datos necesitan más espacio horizontal (clase 'expanded')
        const authContainer = document.querySelector('.auth-container');
        if (authContainer) {
            if (destinoId === 'tab-examenes' || destinoId === 'tab-horas') {
                // Expandir: el contenedor pasa de 550px a 850px de ancho
                authContainer.classList.add('expanded');
            } else {
                // Contraer: volver al tamaño normal del portal/formularios
                authContainer.classList.remove('expanded');
            }
        }
    }

    // --- Asignación de eventos a los botones del portal ---
    
    // Al hacer clic en "Resultados de Exámenes": generar la tabla y navegar
    if (btnVerExamenes) btnVerExamenes.addEventListener('click', () => {
        renderizarExamenes();         // Primero construir el HTML de la tabla
        navegarPortal('tab-examenes'); // Luego mostrar la pestaña
    });

    // Al hacer clic en "Mis Horas Médicas": generar la tabla y navegar
    if (btnVerHoras) btnVerHoras.addEventListener('click', () => {
        renderizarHoras();           // Primero construir el HTML de la tabla
        navegarPortal('tab-horas');   // Luego mostrar la pestaña
    });

    // Todos los botones "⬅ Volver al Panel" regresan al dashboard principal
    botonesVolver.forEach(btn => {
        btn.addEventListener('click', () => navegarPortal('tab-portal'));
    });

    // =========================================================================
    // SECCIÓN 4: FUNCIONES DE RENDERIZADO DINÁMICO
    // =========================================================================
    // Estas funciones toman los arreglos de datos y generan tablas HTML completas
    // usando template literals (backticks) e inyección al DOM con innerHTML.
    
    /**
     * renderizarExamenes()
     * Recorre el arreglo 'datosExamenes' y genera una tabla HTML con los resultados.
     * Cada fila incluye un badge de color según el estado y un botón de acción.
     */
    function renderizarExamenes() {
        const contenedor = document.getElementById('contenedor-examenes');
        if (!contenedor) return; // Protección si el elemento no existe

        // Construir el encabezado de la tabla
        let html = `
        <div class="data-table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Examen</th>
                        <th>Médico Solicitante</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Recorrer cada examen del arreglo y generar una fila <tr>
        datosExamenes.forEach(examen => {
            // Elegir el color del badge según el estado del examen
            const badgeClass = examen.estado === 'Disponible' ? 'badge-success' : 'badge-warning';
            
            // Mostrar botón "Ver PDF" solo si el examen está disponible
            const btnHtml = examen.estado === 'Disponible' 
                ? `<button class="btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.85rem;">Ver PDF</button>` 
                : `<span style="color: var(--text-muted); font-size: 0.85rem;">Pendiente</span>`;

            // Concatenar la fila al HTML usando interpolación de variables (${})
            html += `
                <tr>
                    <td>${examen.fecha}</td>
                    <td><strong>${examen.tipo}</strong></td>
                    <td>${examen.medico}</td>
                    <td><span class="badge ${badgeClass}">${examen.estado}</span></td>
                    <td>${btnHtml}</td>
                </tr>
            `;
        });

        // Cerrar las etiquetas de la tabla
        html += `</tbody></table></div>`;
        
        // INYECCIÓN AL DOM: Reemplazar el contenido del contenedor con la tabla generada
        contenedor.innerHTML = html;
    }

    /**
     * renderizarHoras()
     * Recorre el arreglo 'datosHoras' y genera una tabla HTML con las citas médicas.
     * Todas las horas se muestran con badge "Confirmada" (dato simulado).
     */
    function renderizarHoras() {
        const contenedor = document.getElementById('contenedor-horas');
        if (!contenedor) return;

        // Construir el encabezado de la tabla
        let html = `
        <div class="data-table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Fecha y Hora</th>
                        <th>Especialidad</th>
                        <th>Especialista</th>
                        <th>Ubicación</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Recorrer cada hora del arreglo y generar una fila
        datosHoras.forEach(hora => {
            html += `
                <tr>
                    <td><strong>${hora.fecha}</strong><br><span style="color: var(--text-muted);">${hora.hora}</span></td>
                    <td>${hora.especialidad}</td>
                    <td>${hora.doctor}</td>
                    <td>${hora.box}</td>
                    <td><span class="badge badge-info">Confirmada</span></td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;
        contenedor.innerHTML = html;
    }
});
