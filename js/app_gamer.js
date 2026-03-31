/**
 * Lógica Clínica del Triage (Algoritmo ESI)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Actualizar el número del dolor de forma reactiva a medida que la barra se mueve
    const painInput = document.getElementById('pat-pain');
    const painVal = document.getElementById('pain-val');

    painInput.addEventListener('input', (e) => {
        const val = e.target.value;
        painVal.textContent = val + '/10';
        painInput.style.setProperty('--pain-percent', (val * 10) + '%');
    });
});

// Función para navegar entre las "pantallas" del juego
function openMode(modeId) {
    // Ocultar todos los paneles
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

    let target = '';
    if (modeId === 'main') target = 'main-menu';
    if (modeId === 'patient') target = 'patient-menu';
    if (modeId === 'professional') target = 'professional-menu';
    if (modeId === 'result') target = 'result-screen';

    // Mostrar el panel elegido
    document.getElementById(target).classList.add('active');
}

// Núcleo de cálculo: Algoritmo de Triage
function calculateESI(source) {
    let esi = 5;
    let desc = "";

    if (source === 'patient') {
        const pain = parseInt(document.getElementById('pat-pain').value);
        const walk = document.getElementById('pat-walk').value;
        const conscious = document.getElementById('pat-conscious').value;
        const time = document.getElementById('pat-time').value;
        const breath = document.getElementById('pat-breath').checked;
        const bleed = document.getElementById('pat-bleed').checked;
        const chest = document.getElementById('pat-chest').checked;
        const trauma = document.getElementById('pat-trauma').checked;
        const fever = document.getElementById('pat-fever').checked;

        // Reglas ESI Avanzadas para el Paciente
        if (conscious === 'unconscious' || breath || bleed) {
            esi = 1;
            desc = "¡Alerta Crítica! Status K.O. o Riesgo vital inminente. ¡Requiere reanimación y curación inmediata!";
        } else if (conscious === 'altered' || chest || (pain >= 8 && time !== 'weeks') || trauma) {
            esi = 2;
            desc = "¡Alerta Rápida! Riesgo vital alto, dolor crítico o trauma severo. Requiere atención médica en menos de 10 minutos.";
        } else if (walk === 'no' || fever) {
            esi = 3;
            desc = "Nivel 3. Requiere evaluación completa y múltiples recursos (Laboratorio, RX). Condición inestable.";
        } else if (pain >= 4 || time === 'minutes' || time === 'hours') {
            esi = 4;
            desc = "Nivel 4. Dolor moderado o afección de inicio reciente. Requiere evaluación, usualmente con un recurso simple.";
        } else {
            esi = 5;
            desc = "Nivel 5. Afección crónica o leve (días/semanas) sin signos de alarma visual. Tratamiento de baja complejidad.";
        }

    } else if (source === 'professional') {
        const resus = document.getElementById('prof-resus').checked;
        const risk = document.getElementById('prof-risk').checked;
        const resources = document.getElementById('prof-resources').value;
        const vitals = document.getElementById('prof-vitals').checked;

        // Reglas ESI estrictas para Enfermería
        if (resus) {
            esi = 1;
            desc = "ESI 1: Reanimación inmediata requerida. Compromiso inminente o actual de Vía aérea, Respiración o Circulación.";
        } else if (risk) {
            esi = 2;
            desc = "ESI 2: Situación de alto riesgo documentado, letargo, confusión profunda o dolor visceral severo. Debe ser evaluado por médico urgentemente.";
        } else if (resources === 'many') {
            // El sub-algoritmo ESI dicta que dentro de ESI 3, si signos vitales son peligrosos, sube triage a ESI 2
            if (vitals) {
                esi = 2;
                desc = "ESI 2: Aunque solo requiere recursos, el paciente entra en ZONA DE PELIGRO por Signos Vitales alterados (Desviación HR/RR/SaO2). Categoría promovida por seguridad.";
            } else {
                esi = 3;
                desc = "ESI 3: Paciente estable pero requiere MUCHOS RECURSOS (Laboratorios múltiples, Imágenes complejas, Vía IV, Especialista).";
            }
        } else if (resources === '1') {
            esi = 4;
            desc = "ESI 4: Paciente leve, requiere solamente UN CLÚSTER de recursos (Ej: Solo sutura simple, o Solo Rayos X, o Solo examen de orina).";
        } else {
            esi = 5;
            desc = "ESI 5: Sin requerimientos de recursos extra a la evaluación o prescripción del médico (Ej. reevaluación de herida, prescripción repetida).";
        }
    }

    // Proyectar resultado
    showResult(esi, desc);
}

function showResult(esi, desc) {
    const resDiv = document.getElementById('esi-result');
    // Para cambiar el color dinámicamente mediante CSS, limpiamos clases viejas y agregamos la nueva `esi-X`
    resDiv.className = `esi-box esi-${esi}`;
    resDiv.textContent = `Prioridad: ESI ${esi}`;

    document.getElementById('esi-desc').textContent = desc;
    openMode('result');
}
