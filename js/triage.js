/* 
  PROYECTO CLINICO UNIVERSITARIO - LÓGICA ESI Y SEGURIDAD
  Este archivo maneja exclusivamente la página de urgencias (triage.html).
*/

// Aseguramos que el DOM cargue completamente antes de asignar eventos.
document.addEventListener('DOMContentLoaded', () => {
    // Escucha interactiva para los rangos de Dolor (Paciente y Clínico).
    // Esto vincula la barra deslizante (input type="range") con el número que se muestra en pantalla.
    setupRangeDisplay('pat-pain', 'pat-pain-display');
    setupRangeDisplay('clin-pain', 'pain-val-display');
});

/**
 * Función que toma un input de rango (slider) y actualiza visualmente el número en pantalla.
 * @param {string} inputId - ID del input type="range"
 * @param {string} displayId - ID del elemento donde se mostrará el número (ej: 5/10)
 */
function setupRangeDisplay(inputId, displayId) {
    const painRange = document.getElementById(inputId);
    const painDisplay = document.getElementById(displayId);

    // Si ambos elementos existen en la página...
    if (painRange && painDisplay) {
        
        // Cada vez que el usuario mueve la barra (evento 'input')
        painRange.addEventListener('input', (e) => {
            
            // Actualiza el texto en pantalla concatenando el valor con "/10"
            painDisplay.textContent = `${e.target.value}/10`;
            
            // Lógica de UX: Si el dolor es 7 o mayor, se pinta de color rojo alerta.
            // Si es menor a 7, se pinta del color azul primario.
            if (e.target.value >= 7) {
                painDisplay.style.color = 'var(--alert-red)';
                painDisplay.style.borderColor = 'var(--alert-red)';
            } else {
                painDisplay.style.color = 'var(--primary-blue)';
                painDisplay.style.borderColor = 'var(--secondary-blue)';
            }
        });
    }
}

// ==========================================
// SISTEMA DE PESTAÑAS (TABS)
// ==========================================
// Función que oculta y muestra secciones (Paciente vs Profesionales)
function showTab(tabId) {
    // 1. Ocultar todos los contenidos de triage
    const tabs = document.querySelectorAll('.triage-content');
    tabs.forEach(tab => tab.classList.add('hidden'));

    // 2. Mostrar la pestaña específica que se solicitó
    document.getElementById(tabId).classList.remove('hidden');

    // 3. Quitar el estado activo (poniendo clase 'outline') a todos los botones
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => btn.classList.add('outline'));

    // 4. Buscar el botón que se presionó y quitarle el outline (dejarlo relleno de color)
    const activeBtn = Array.from(btns).find(b => b.getAttribute('onclick').includes(tabId));
    if (activeBtn) {
        activeBtn.classList.remove('outline');
    }
}

// ==========================================
// SISTEMA DE LOGIN DE PROFESIONALES
// ==========================================
// Esta función simula un login para proteger el algoritmo ESI clínico
function attemptLogin() {
    // Capturamos los valores del usuario y contraseña
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
    // Capturamos los elementos visuales (mensaje de error y botón)
    const errorMsg = document.getElementById('login-error');
    const loginBtn = document.querySelector('#login-form button');

    // UX (Feedback visual): Deshabilitar botón temporalmente y mostrar texto "Verificando..."
    const originalText = loginBtn.textContent;
    loginBtn.innerHTML = '<span class="spinner"></span> Verificando...';
    loginBtn.disabled = true; // Evita que hagan doble click
    errorMsg.classList.add('hidden'); // Ocultar errores previos

    // Usamos setTimeout para simular latencia de red (como si consultara a un servidor de verdad)
    setTimeout(() => {
        // Restaurar el botón a la normalidad
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;

        // Validación simple (Usuario: admin / Pass: 1234)
        if (user === 'admin' && pass === '1234') {
            
            // Limpiar campos por seguridad (evita que alguien lea la contraseña si dejas el PC)
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';

            // Mostrar el panel secreto (Algoritmo ESI Profesional)
            showTab('prof-tab');

            // Mostrar notificación flotante de éxito
            showToast("Autenticación exitosa. Bienvenido al panel ESI.");
        } else {
            // Mostrar mensaje de error si los datos son incorrectos
            errorMsg.classList.remove('hidden');
        }
    }, 1000); // Demora de 1 segundo (1000 ms)
}

// ==========================================
// NOTIFICACIÓN FLOTANTE (TOAST)
// ==========================================
// Crea un mensaje temporal en la esquina de la pantalla.
function showToast(message) {
    // 1. Crear un elemento <div> desde JavaScript
    const toast = document.createElement('div');
    toast.className = 'toast-notification'; // Le asignamos la clase para que tome los estilos CSS
    
    // 2. Insertamos el mensaje con un checkmark
    toast.innerHTML = `<span>✅</span> <span>${message}</span>`;
    
    // 3. Añadimos el div al final del <body> para que aparezca en pantalla
    document.body.appendChild(toast);

    // 4. Programamos su destrucción (desaparece tras 3 segundos)
    setTimeout(() => {
        toast.classList.add('fade-out'); // Inicia animación de ocultar
        setTimeout(() => toast.remove(), 300); // Lo borramos del HTML tras la animación
    }, 3000);
}

// ==========================================
// EVALUACIÓN BÁSICA DEL PACIENTE (PÚBLICO)
// ==========================================
// Lógica que evalúa el formulario que llenan los pacientes
function calculatePatient() {
    
    // 1. CAPTURA DEL DOM: Extraemos los valores. (parseInt convierte el texto a número).
    const pain = parseInt(document.getElementById('pat-pain').value);
    const conscious = document.getElementById('pat-conscious').value;
    const timeEvo = document.getElementById('pat-time').value;

    // Los checkboxes se verifican con ".checked" (devuelve true o false)
    const breath = document.getElementById('pat-breath').checked;
    const bleed = document.getElementById('pat-bleed').checked;
    const chest = document.getElementById('pat-chest').checked;
    const trauma = document.getElementById('pat-trauma').checked;
    const fever = document.getElementById('pat-fever').checked;

    let result = "";
    let colorClass = "";

    // 2. LÓGICA DE DECISIÓN CLÍNICA
    // Si hay síntomas críticos vitales (inconsciencia, sin respirar, sangrado profuso o dolor de pecho)
    if (conscious === 'unconscious' || breath || bleed || chest) {
        result = "Condición de Riesgo Inminente. Será derivado al reanimador de forma inmediata. Diríjase a urgencias ya.";
        colorClass = "esi-1"; // Rojo
    
    // Si hay riesgo alto pero no inminente
    } else if (conscious === 'altered' || pain >= 8 || timeEvo === 'minutes' || trauma || fever) {
        result = "Condición de Alta Prioridad. Tiempo estimado de categorización y espera: 15 a 30 minutos.";
        colorClass = "esi-2"; // Naranja
    
    // Dolor moderado
    } else if (pain >= 5) {
        result = "Condición de Atención Media. Tiempo estimado de categorización y espera: 30 a 60 minutos.";
        colorClass = "esi-3"; // Amarillo
    
    // Condiciones leves
    } else {
        result = "Condición Leve a Baja. Tiempo estimado de categorización y espera: 2 a 4 horas en sala general.";
        colorClass = "esi-5"; // Verde
    }

    // 3. RENDERIZADO DEL RESULTADO
    const resContainer = document.getElementById('patient-result');
    resContainer.className = `result-container ${colorClass}`;
    resContainer.style.color = "white";
    
    // Prevención de XSS (Cross-Site Scripting): Construimos elementos de forma segura usando
    // document.createElement y textContent en vez de usar innerHTML con concatenación directa.
    resContainer.innerHTML = ''; // Limpiar cualquier resultado anterior
    
    const title = document.createElement('h4');
    title.style.color = "white";
    title.style.fontSize = "1.4rem";
    title.textContent = "Orientación para usted:";
    
    const desc = document.createElement('p');
    desc.style.fontSize = "1.1rem";
    desc.style.marginTop = "10px";
    desc.textContent = result;
    
    // Añadimos los elementos recién creados dentro del contenedor
    resContainer.appendChild(title);
    resContainer.appendChild(desc);
    
    // Mostramos el contenedor (quitando la clase hidden)
    resContainer.classList.remove('hidden');
}


// ==========================================
// ALGORITMO ESI (PROFESIONALES)
// ==========================================
// Lógica que evalúa el triage formal utilizado por médicos/enfermeros
function calculateESI() {
    // 1. CAPTURA DEL DOM (Variables booleanas true/false)
    const isApneic = document.getElementById('clin-breath').checked;
    const isBleeding = document.getElementById('clin-bleed').checked;
    const isChestPain = document.getElementById('clin-chest').checked;
    const isVitalsCompromised = document.getElementById('clin-vitals').checked;

    // Variables de texto
    const consciousness = document.getElementById('clin-conscious').value;
    const walk = document.getElementById('clin-walk').value;
    const timeEvo = document.getElementById('clin-time').value;
    const resources = document.getElementById('clin-resources').value;
    
    // Variables numéricas
    const painLevel = parseInt(document.getElementById('clin-pain').value);

    // Valores por defecto
    let finalESI = 5;
    let explanation = "Atención No Urgente. Derivación rápida.";

    // 2. LÓGICA ESI INTERNACIONAL
    // Nivel 1: Riesgo Vital Inminente
    if (isApneic || isBleeding || consciousness === 'unconscious' || isVitalsCompromised) {
        finalESI = 1;
        explanation = "Nivel 1: RESUCITACIÓN. Existe inminente peligro de muerte o deterioro severo. Requiere box de reanimación y atención inmediata.";
    }
    // Nivel 2: Alto Riesgo
    else if (isChestPain || consciousness === 'altered' || painLevel >= 7 || timeEvo === 'minutes') {
        finalESI = 2;
        explanation = "Nivel 2: EMERGENCIA. Alto riesgo de deterioro. Atención médica urgente en < 15 minutos.";
    }
    // Si no es Nivel 1 ni 2, la decisión se toma en base a la cantidad de Recursos que utilizará el paciente
    else {
        if (resources === 'many') {
            finalESI = 3;
            explanation = "Nivel 3: URGENCIA. Signos vitales estables, pero requiere múltiples recursos diagnósticos (Sangre, Rayos X, Scanner).";
        } else if (resources === '1') {
            finalESI = 4;
            explanation = "Nivel 4: MENOS URGENTE. Requiere solo un recurso diagnóstico o terapéutico menor.";
        } else {
            finalESI = 5;
            explanation = "Nivel 5: NO URGENTE. Examen clínico único. Sin riesgo inminente.";
        }
    }

    // Llamamos a la función que dibuja el resultado en pantalla
    showProfResults(finalESI, explanation);
}

// Función encargada de pintar el resultado ESI clínico en la interfaz
function showProfResults(esiLevel, descText) {
    const resultScreen = document.getElementById('prof-result-screen');
    const resultBox = document.getElementById('prof-esi-result');
    const resultDesc = document.getElementById('prof-esi-desc');

    // Resetear las clases y añadir la del nivel correspondiente (ej: esi-1 pintará rojo)
    resultBox.className = 'esi-box';
    resultBox.classList.add(`esi-${esiLevel}`);
    
    // Inyectar texto
    resultBox.textContent = `ESI ${esiLevel}`;
    resultDesc.textContent = descText;
    
    // Hacer visible el contenedor
    resultScreen.classList.remove('hidden');
}
