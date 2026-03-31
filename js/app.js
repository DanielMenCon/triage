/* 
  PROYECTO CLINICO UNIVERSITARIO - LÓGICA ESI Y SEGURIDAD
*/

document.addEventListener('DOMContentLoaded', () => {
    // Escucha interactiva para los rangos de Dolor (Paciente y Clínico)
    setupRangeDisplay('pat-pain', 'pat-pain-display');
    setupRangeDisplay('clin-pain', 'pain-val-display');
});

function setupRangeDisplay(inputId, displayId) {
    const painRange = document.getElementById(inputId);
    const painDisplay = document.getElementById(displayId);

    if (painRange && painDisplay) {
        painRange.addEventListener('input', (e) => {
            painDisplay.textContent = `${e.target.value}/10`;
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

// ---- SISTEMA DE PESTAÑAS (TABS) ----
function showTab(tabId) {
    // Ocultar todos los tabs
    const tabs = document.querySelectorAll('.triage-content');
    tabs.forEach(tab => tab.classList.add('hidden'));

    // Mostrar el solicitado
    document.getElementById(tabId).classList.remove('hidden');

    // Deseleccionar botones
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => btn.classList.replace('btn-primary', 'btn-outline'));

    // Asignar color al botón activo
    const activeBtn = Array.from(btns).find(b => b.getAttribute('onclick').includes(tabId));
    if (activeBtn) {
        activeBtn.classList.replace('btn-outline', 'btn-primary');
    }
}

// ---- SISTEMA DE LOGIN DE PROFESIONALES ----
function attemptLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    if (user === 'admin' && pass === '1234') {
        errorMsg.style.display = 'none';

        // Limpiar campos por seguridad
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';

        // Revelar sistema ESI Profesional
        showTab('prof-tab');

        alert("Autenticación exitosa. Bienvenido al panel de salud profesional ESI.");
    } else {
        errorMsg.style.display = 'block';
    }
}

// ---- EVALUACIÓN BÁSICA DEL PACIENTE (PÚBLICO) ----
function calculatePatient() {
    const pain = parseInt(document.getElementById('pat-pain').value);
    const conscious = document.getElementById('pat-conscious').value;
    const timeEvo = document.getElementById('pat-time').value;

    const breath = document.getElementById('pat-breath').checked;
    const bleed = document.getElementById('pat-bleed').checked;
    const chest = document.getElementById('pat-chest').checked;
    const trauma = document.getElementById('pat-trauma').checked;
    const fever = document.getElementById('pat-fever').checked;

    let result = "";
    let colorClass = "";

    // Lógica similar al triage gamer original pero para el portal paciente
    if (conscious === 'unconscious' || breath || bleed || chest) {
        result = "Condición de Riesgo Inminente. Será derivado al reanimador de forma inmediata. Diríjase a urgencias ya.";
        colorClass = "esi-1";
    } else if (conscious === 'altered' || pain >= 8 || timeEvo === 'minutes' || trauma || fever) {
        result = "Condición de Alta Prioridad. Tiempo estimado de categorización y espera: 15 a 30 minutos.";
        colorClass = "esi-2";
    } else if (pain >= 5) {
        result = "Condición de Atención Media. Tiempo estimado de categorización y espera: 30 a 60 minutos.";
        colorClass = "esi-3";
    } else {
        result = "Condición Leve a Baja. Tiempo estimado de categorización y espera: 2 a 4 horas en sala general.";
        colorClass = "esi-5";
    }

    const resContainer = document.getElementById('patient-result');
    resContainer.className = `result-container ${colorClass}`;
    resContainer.style.color = "white";
    resContainer.innerHTML = `<h4 style="color:white; font-size:1.4rem;">Orientación para usted:</h4><p style="font-size:1.1rem; margin-top:10px;">${result}</p>`;
    resContainer.classList.remove('hidden');
}


// ---- ALGORITMO ESI (PROFESIONALES) ----
function calculateESI() {
    const isApneic = document.getElementById('clin-breath').checked;
    const isBleeding = document.getElementById('clin-bleed').checked;
    const isChestPain = document.getElementById('clin-chest').checked;
    const isVitalsCompromised = document.getElementById('clin-vitals').checked;

    const consciousness = document.getElementById('clin-conscious').value;
    const walk = document.getElementById('clin-walk').value;

    const painLevel = parseInt(document.getElementById('clin-pain').value);
    const timeEvo = document.getElementById('clin-time').value;
    const resources = document.getElementById('clin-resources').value;

    let finalESI = 5;
    let explanation = "Atención No Urgente. Derivación rápida.";

    if (isApneic || isBleeding || consciousness === 'unconscious' || isVitalsCompromised) {
        finalESI = 1;
        explanation = "Nivel 1: RESUCITACIÓN. Existe inminente peligro de muerte o deterioro severo. Requiere box de reanimación y atención inmediata.";
    }
    else if (isChestPain || consciousness === 'altered' || painLevel >= 7 || timeEvo === 'minutes') {
        finalESI = 2;
        explanation = "Nivel 2: EMERGENCIA. Alto riesgo de deterioro. Atención médica urgente en < 15 minutos.";
    }
    else {
        if (resources === 'many') {
            finalESI = 3;
            explanation = "Nivel 3: URGENCIA. Signos vitales estables, pero requiere múltiples recursos diagnósticos.";
        } else if (resources === '1') {
            finalESI = 4;
            explanation = "Nivel 4: MENOS URGENTE. Requiere solo un recurso diagnóstico o terapéutico menor.";
        } else {
            finalESI = 5;
            explanation = "Nivel 5: NO URGENTE. Examen clínico único.";
        }
    }

    showProfResults(finalESI, explanation);
}

function showProfResults(esiLevel, descText) {
    const resultScreen = document.getElementById('prof-result-screen');
    const resultBox = document.getElementById('prof-esi-result');
    const resultDesc = document.getElementById('prof-esi-desc');

    resultBox.className = 'esi-box';
    resultBox.classList.add(`esi-${esiLevel}`);
    resultBox.textContent = `ESI ${esiLevel}`;
    resultDesc.textContent = descText;
    resultScreen.classList.remove('hidden');
}
