/* 
  PROYECTO CLINICO UNIVERSITARIO - LÓGICA DE FORMULARIOS DE ACCESO
  Cumplimiento de Actividad Práctica: Registro, Login y Contacto
*/

// DOMContentLoaded asegura que el JavaScript solo se ejecute cuando 
// toda la estructura HTML de la página ya esté cargada y lista.
document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // NAVEGACIÓN POR PESTAÑAS (TABS)
    // =========================================================================
    
    // Asignamos la función a 'window' para que sea accesible desde el HTML (onclick="showAuthTab(...)")
    window.showAuthTab = function(tabId) {
        
        // 1. MANIPULACIÓN DEL DOM: Ocultamos todas las pestañas primero
        const tabs = document.querySelectorAll('.auth-content');
        tabs.forEach(tab => tab.classList.add('hidden')); // Añade clase CSS que oculta el elemento

        // 2. Mostramos solo la pestaña que el usuario solicitó
        const targetTab = document.getElementById(tabId);
        if(targetTab) targetTab.classList.remove('hidden');

        // 3. Estilo de los botones: Ponemos todos en modo "inactivo" (clase outline)
        const btns = document.querySelectorAll('.auth-tabs .tab-btn');
        btns.forEach(btn => btn.classList.add('outline'));

        // 4. Buscamos qué botón fue el presionado y le quitamos el modo "inactivo"
        const activeBtn = Array.from(btns).find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes(tabId));
        if (activeBtn) {
            activeBtn.classList.remove('outline');
        }

        // 5. LIMPIEZA PREVENTIVA: Borramos los datos escritos si el usuario cambia de pestaña
        const forms = document.querySelectorAll('.auth-content form');
        forms.forEach(form => form.reset()); // reset() vacía los inputs

        // Borramos también cualquier mensaje de error previo
        const messages = document.querySelectorAll('.form-mensaje');
        messages.forEach(msg => {
            msg.textContent = '';
            msg.className = 'form-mensaje'; // Devuelve al estado neutro (sin error ni éxito)
        });

        // Reseteamos el contador de caracteres de contacto si existe
        const charCountEl = document.getElementById('char-count');
        if (charCountEl) {
            charCountEl.textContent = '0';
            charCountEl.parentElement.classList.remove('limit-reached');
        }
    };

    // =========================================================================
    // LECTURA DE URL PARA ABRIR PESTAÑA AUTOMÁTICA
    // =========================================================================
    // Usamos URLSearchParams para leer variables en el link (Ej: registro.html?tab=contacto)
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
        const targetId = 'tab-' + tabParam;
        if (document.getElementById(targetId)) {
            // setTimeout le da un brevísimo tiempo al navegador para renderizar antes de cambiar la pestaña
            setTimeout(() => window.showAuthTab(targetId), 50);
        }
    }

    // =========================================================================
    // FUNCIÓN AUXILIAR DE FEEDBACK EN TIEMPO REAL (REUTILIZABLE)
    // =========================================================================
    /**
     * Inserta un mensaje de texto directamente en el HTML.
     * @param {string} elementId - El ID del párrafo <p> donde se mostrará el mensaje.
     * @param {string} message - El texto a mostrar.
     * @param {boolean} isError - Determina el color (rojo si es true, verde si es false).
     */
    function showMessage(elementId, message, isError) {
        const el = document.getElementById(elementId);
        if(!el) return;
        
        // Uso de textContent por seguridad (evita inyección de código maligno a diferencia de innerHTML)
        el.textContent = message;
        
        // Manipulación de clases para cambiar el color
        if (isError) {
            el.className = 'form-mensaje msg-error';
        } else {
            el.className = 'form-mensaje msg-success';
        }
    }

    // =========================================================================
    // REQUISITO A: FORMULARIO DE REGISTRO
    // =========================================================================
    const regForm = document.getElementById('registroForm');
    if (regForm) {
        // Escuchamos el evento 'submit' (cuando se presiona el botón Registrarse)
        regForm.addEventListener('submit', function(event) {
            
            // ❗ VALIDACIÓN PREVENTIVA (Requisito Obligatorio)
            // Detiene el comportamiento natural del navegador de recargar la página.
            event.preventDefault();

            // ❗ MANIPULACIÓN DEL DOM: Captura de valores (Requisito)
            // .trim() se usa para eliminar espacios en blanco accidentales al principio o final.
            const user = document.getElementById('reg-username').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const pass = document.getElementById('reg-password').value;
            const confirm = document.getElementById('reg-confirm').value;

            // Limpiamos cualquier mensaje anterior
            showMessage('reg-mensaje', '', false);

            // 1. Validación de campos vacíos
            if (!user || !email || !pass || !confirm) {
                // El return detiene la ejecución de la función aquí mismo
                return showMessage('reg-mensaje', 'Todos los campos son obligatorios.', true);
            }

            // ❗ VALIDACIÓN REGEX PARA CORREO (Requisito)
            // Esta expresión regular verifica que el texto tenga un "@" y un "." ordenados.
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return showMessage('reg-mensaje', 'El formato del correo electrónico no es válido.', true);
            }

            // 3. Validación de seguridad (Contraseña mínima)
            if (pass.length < 8) {
                return showMessage('reg-mensaje', 'La contraseña debe tener al menos 8 caracteres.', true);
            }

            // 4. Validación de coincidencia de contraseñas
            if (pass !== confirm) {
                return showMessage('reg-mensaje', 'Las contraseñas no coinciden.', true);
            }

            // ❗ FEEDBACK EN TIEMPO REAL (Requisito)
            // Si todo está bien, mostramos un mensaje de éxito en color verde.
            showMessage('reg-mensaje', '¡Registro completado con éxito!', false);
            
            // Limpiamos el formulario tras el éxito
            regForm.reset();
        });
    }

    // =========================================================================
    // REQUISITO B: FORMULARIO DE LOGIN
    // =========================================================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            
            // Validación Preventiva
            event.preventDefault();

            // Captura de datos
            const email = document.getElementById('log-email').value.trim();
            const pass = document.getElementById('log-password').value;

            // Comprobación
            if (!email || !pass) {
                return showMessage('log-mensaje', 'Debes ingresar correo y contraseña.', true);
            }

            // Validación de formato de email con Regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return showMessage('log-mensaje', 'El formato del correo electrónico no es válido.', true);
            }

            // Feedback en Tiempo Real
            showMessage('log-mensaje', '¡Ingreso exitoso! Bienvenido.', false);
            loginForm.reset();
        });
    }

    // =========================================================================
    // REQUISITO C: FORMULARIO DE CONTACTO Y CONTADOR DE CARACTERES
    // =========================================================================
    const contactoForm = document.getElementById('contactoForm');
    const mensajeInput = document.getElementById('cont-mensaje');
    const charCountEl = document.getElementById('char-count');
    const maxChars = 200;

    // Lógica del contador en tiempo real
    if (mensajeInput && charCountEl) {
        
        // El evento 'input' se dispara cada vez que el usuario teclea, borra o pega texto.
        mensajeInput.addEventListener('input', function() {
            
            // Medimos cuántas letras van escritas
            const currentLength = this.value.length;
            
            // Actualizamos el número en el HTML dinámicamente
            charCountEl.textContent = currentLength;

            // Si llegamos o pasamos de 200, le añadimos una clase CSS para ponerlo rojo
            if (currentLength >= maxChars) {
                charCountEl.parentElement.classList.add('limit-reached');
            } else {
                charCountEl.parentElement.classList.remove('limit-reached');
            }
        });
    }

    // Lógica del envío del formulario
    if (contactoForm) {
        contactoForm.addEventListener('submit', function(event) {
            
            // Validación Preventiva
            event.preventDefault();

            // Captura del DOM
            const nombre = document.getElementById('cont-nombre').value.trim();
            const asunto = document.getElementById('cont-asunto').value.trim();
            const mensaje = document.getElementById('cont-mensaje').value.trim();

            if (!nombre || !asunto || !mensaje) {
                return showMessage('cont-feedback', 'Todos los campos son obligatorios.', true);
            }

            // Feedback en tiempo real y limpieza
            showMessage('cont-feedback', 'Tu mensaje ha sido enviado correctamente.', false);
            contactoForm.reset();
            
            // Reiniciamos manualmente el contador de caracteres tras el envío
            charCountEl.textContent = "0";
            charCountEl.parentElement.classList.remove('limit-reached');
        });
    }

});
