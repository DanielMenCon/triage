/* 
  ============================================================================
  PROYECTO CLINICO UNIVERSITARIO - LÓGICA DE FORMULARIOS DE ACCESO Y SESIÓN
  ============================================================================
  Archivo: registro.js
  Página:  registro.html
  
  Responsabilidades de este archivo:
    1. Sistema de Sesiones (verificar si hay un usuario logueado al cargar la página)
    2. Navegación por pestañas (Registro, Login, Contacto, Portal)
    3. Validación centralizada de formularios (con expresiones regulares)
    4. Formulario de Registro (con persistencia en localStorage)
    5. Formulario de Login (búsqueda de credenciales en localStorage)
    6. Formulario de Contacto (con contador de caracteres)
  
  Dependencias:
    - Se ejecuta únicamente en registro.html
    - Requiere que auth_global.js se cargue ANTES de este archivo
    - El módulo de portal (portal.js) se carga DESPUÉS de este archivo
*/

// ============================================================================
// ARREGLO GLOBAL DE USUARIOS
// ============================================================================
// Intentamos cargar usuarios previamente registrados desde el localStorage.
// Si no existen (primera visita), se inicializa un arreglo vacío.
// JSON.parse convierte el texto almacenado de vuelta a un arreglo de objetos JS.
let usuariosInscritos = JSON.parse(localStorage.getItem('usuarios_clinica')) || [];

// Esperamos a que todo el HTML esté cargado antes de ejecutar la lógica
document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // SECCIÓN 1: SISTEMA DE SESIONES (AUTO-LOGIN Y LOGOUT)
    // =========================================================================
    // Capturamos elementos que necesitaremos para mostrar/ocultar la interfaz
    const authTabsContainer = document.getElementById('auth-tabs-container'); // Contenedor de botones Registro/Login/Contacto
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');     // Botón rojo de cerrar sesión en el portal

    /**
     * verificarSesionActiva()
     * Se ejecuta al cargar la página para determinar qué vista mostrar.
     * - Si hay un usuario activo en localStorage → Muestra el portal del usuario
     * - Si no hay sesión → Muestra la pestaña indicada por la URL (?tab=login) o la de Registro por defecto
     */
    function verificarSesionActiva() {
        const usuarioActivo = JSON.parse(localStorage.getItem('usuario_activo'));
        if (usuarioActivo) {
            // Hay sesión activa → ir directo al portal
            mostrarPortal(usuarioActivo);
        } else {
            // No hay sesión → revisar si la URL indica una pestaña específica
            // Ejemplo: registro.html?tab=login → mostraría la pestaña de login
            const urlParams = new URLSearchParams(window.location.search);
            const tabParam = urlParams.get('tab');
            window.showAuthTab(tabParam ? 'tab-' + tabParam : 'tab-registro');
        }
    }

    /**
     * mostrarPortal(usuario)
     * Transforma la interfaz: oculta los formularios y muestra el dashboard del usuario.
     * @param {Object} usuario - Objeto con las propiedades { username, email, password }
     */
    function mostrarPortal(usuario) {
        // Ocultar los botones de navegación (Registro/Login/Contacto)
        if(authTabsContainer) authTabsContainer.style.display = 'none';
        
        // Ocultar todas las pestañas
        const tabs = document.querySelectorAll('.auth-content');
        tabs.forEach(tab => tab.classList.add('hidden'));

        // Mostrar solo la pestaña del portal e inyectar los datos del usuario
        const portalTab = document.getElementById('tab-portal');
        if(portalTab) {
            portalTab.classList.remove('hidden');
            // Manipulación del DOM: inyectar nombre y correo en los elementos del dashboard
            document.getElementById('portal-user-name').textContent = usuario.username;
            document.getElementById('portal-user-email').textContent = usuario.email;
        }
    }

    // Evento del botón "Cerrar Sesión" dentro del portal
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', () => {
            // 1. Borrar la clave 'usuario_activo' del localStorage (cerrar sesión)
            localStorage.removeItem('usuario_activo');
            
            // 2. Restaurar la interfaz original (volver a mostrar los botones de navegación)
            if(authTabsContainer) authTabsContainer.style.display = 'flex';
            window.showAuthTab('tab-login');
            
            // 3. Mostrar mensaje de confirmación al usuario
            actualizarDOM('log-mensaje', 'Has cerrado sesión exitosamente.', false);
        });
    }

    // =========================================================================
    // SECCIÓN 2: NAVEGACIÓN POR PESTAÑAS (TABS)
    // =========================================================================
    
    /**
     * showAuthTab(tabId)
     * Función global que maneja la navegación entre las pestañas del formulario.
     * Se expone en window para que los botones HTML puedan llamarla con onclick="showAuthTab('tab-login')".
     * @param {string} tabId - El ID del div a mostrar (ej: 'tab-registro', 'tab-login', 'tab-contacto')
     */
    window.showAuthTab = function(tabId) {
        // Protección: si hay sesión activa, no permitir cambiar a otra pestaña
        if(localStorage.getItem('usuario_activo') && tabId !== 'tab-portal') return;

        // Contraer el contenedor si estaba expandido (por los submódulos de exámenes/horas)
        const authContainer = document.querySelector('.auth-container');
        if(authContainer) authContainer.classList.remove('expanded');

        // 1. Ocultar TODAS las pestañas
        const tabs = document.querySelectorAll('.auth-content');
        tabs.forEach(tab => tab.classList.add('hidden'));

        // 2. Mostrar solo la pestaña solicitada
        const targetTab = document.getElementById(tabId);
        if(targetTab) targetTab.classList.remove('hidden');

        // 3. Actualizar el estado visual de los botones de navegación
        //    (el botón activo se pinta sólido, los demás quedan con borde outline)
        const btns = document.querySelectorAll('.auth-tabs .tab-btn');
        btns.forEach(btn => btn.classList.add('outline'));

        // Buscar cuál botón corresponde a la pestaña activa y quitarle el outline
        const activeBtn = Array.from(btns).find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes(tabId));
        if (activeBtn) {
            activeBtn.classList.remove('outline');
        }

        // 4. Limpiar todos los formularios (reset) para evitar datos residuales
        const forms = document.querySelectorAll('.auth-content form');
        forms.forEach(form => form.reset());

        // 5. Limpiar todos los mensajes de feedback (errores o éxitos anteriores)
        const messages = document.querySelectorAll('.form-mensaje');
        messages.forEach(msg => {
            msg.textContent = '';
            msg.className = 'form-mensaje'; // Quitar clases msg-error o msg-success
        });

        // 6. Reiniciar el contador de caracteres del formulario de contacto
        const charCountEl = document.getElementById('char-count');
        if (charCountEl) {
            charCountEl.textContent = '0';
            charCountEl.parentElement.classList.remove('limit-reached');
        }
    };

    // =========================================================================
    // SECCIÓN 3: FUNCIONES MODULARES DE VALIDACIÓN Y DOM
    // =========================================================================

    /**
     * actualizarDOM(elementoId, mensaje, esError)
     * Función reutilizable para inyectar mensajes de feedback en cualquier formulario.
     * @param {string} elementoId - ID del elemento <p> donde se mostrará el mensaje
     * @param {string} mensaje    - Texto a mostrar
     * @param {boolean} esError   - true = texto rojo (error), false = texto verde (éxito)
     */
    function actualizarDOM(elementoId, mensaje, esError) {
        const el = document.getElementById(elementoId);
        if(!el) return; // Protección contra elementos inexistentes
        
        el.textContent = mensaje;
        // Cambiar la clase CSS para aplicar el color correspondiente
        el.className = esError ? 'form-mensaje msg-error' : 'form-mensaje msg-success';
    }

    /**
     * validarDatos(tipoFormulario, datos)
     * Función centralizada de validación para los 3 formularios del sitio.
     * Utiliza expresiones regulares (RegEx) para validar el formato del correo.
     * @param {string} tipoFormulario - 'registro', 'login' o 'contacto'
     * @param {Object} datos          - Objeto con los campos del formulario
     * @returns {Object} - { valido: boolean, mensaje: string }
     */
    function validarDatos(tipoFormulario, datos) {
        // Expresión Regular (RegEx) para validar formato de email
        // Verifica: texto@texto.texto (sin espacios)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // --- Validaciones para el formulario de REGISTRO ---
        if (tipoFormulario === 'registro') {
            // Verificar que ningún campo esté vacío
            if (!datos.user || !datos.email || !datos.pass || !datos.confirm) {
                return { valido: false, mensaje: 'Todos los campos son obligatorios.' };
            }
            // Verificar formato de email con RegEx
            if (!emailRegex.test(datos.email)) {
                return { valido: false, mensaje: 'El formato del correo electrónico no es válido.' };
            }
            // Verificar largo mínimo de contraseña
            if (datos.pass.length < 8) {
                return { valido: false, mensaje: 'La contraseña debe tener al menos 8 caracteres.' };
            }
            // Verificar que ambas contraseñas coincidan
            if (datos.pass !== datos.confirm) {
                return { valido: false, mensaje: 'Las contraseñas no coinciden.' };
            }
            // Evitar registros duplicados: buscar si el email ya existe en el arreglo
            const existeEmail = usuariosInscritos.some(u => u.email === datos.email);
            if (existeEmail) {
                return { valido: false, mensaje: 'Este correo ya está registrado.' };
            }
        } 
        // --- Validaciones para el formulario de LOGIN ---
        else if (tipoFormulario === 'login') {
            if (!datos.email || !datos.pass) {
                return { valido: false, mensaje: 'Debes ingresar correo y contraseña.' };
            }
        }
        // --- Validaciones para el formulario de CONTACTO ---
        else if (tipoFormulario === 'contacto') {
            if (!datos.nombre || !datos.email || !datos.mensaje) {
                return { valido: false, mensaje: 'Todos los campos son obligatorios.' };
            }
            if (!emailRegex.test(datos.email)) {
                return { valido: false, mensaje: 'El formato del correo electrónico no es válido.' };
            }
        }

        // Si pasó todas las validaciones, retornar objeto con valido = true
        return { valido: true, mensaje: '' };
    }

    // =========================================================================
    // SECCIÓN 4: FORMULARIO DE REGISTRO
    // =========================================================================
    const regForm = document.getElementById('registroForm');
    if (regForm) {
        regForm.addEventListener('submit', function(event) {
            // Prevenir el comportamiento por defecto del formulario (no recargar la página)
            event.preventDefault();

            // Capturar los valores de los campos del formulario
            const user = document.getElementById('reg-username').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const pass = document.getElementById('reg-password').value;
            const confirm = document.getElementById('reg-confirm').value;

            // Limpiar mensajes anteriores
            actualizarDOM('reg-mensaje', '', false);

            // Ejecutar la validación centralizada
            const resultadoValidacion = validarDatos('registro', { user, email, pass, confirm });

            // Si la validación falla, mostrar el error y detener la ejecución
            if (!resultadoValidacion.valido) {
                return actualizarDOM('reg-mensaje', resultadoValidacion.mensaje, true);
            }

            // CREACIÓN DE OBJETO LITERAL: Representar al nuevo usuario como un objeto JS
            const nuevoUsuario = { username: user, email: email, password: pass };
            
            // Agregar el nuevo usuario al arreglo global (push)
            usuariosInscritos.push(nuevoUsuario);
            
            // PERSISTENCIA: Guardar el arreglo actualizado en localStorage
            // JSON.stringify convierte el arreglo de objetos a texto para poder almacenarlo
            localStorage.setItem('usuarios_clinica', JSON.stringify(usuariosInscritos));

            // Mostrar mensaje de éxito y limpiar el formulario
            actualizarDOM('reg-mensaje', '¡Registro completado! Ahora puedes iniciar sesión.', false);
            regForm.reset();
            
            // Redirigir automáticamente a la pestaña de Login después de 2 segundos
            setTimeout(() => window.showAuthTab('tab-login'), 2000);
        });
    }

    // =========================================================================
    // SECCIÓN 5: FORMULARIO DE LOGIN (INICIO DE SESIÓN)
    // =========================================================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Capturar credenciales ingresadas
            const email = document.getElementById('log-email').value.trim();
            const pass = document.getElementById('log-password').value;

            // Validar campos obligatorios
            const resultadoValidacion = validarDatos('login', { email, pass });
            if (!resultadoValidacion.valido) {
                return actualizarDOM('log-mensaje', resultadoValidacion.mensaje, true);
            }

            // BÚSQUEDA EN EL ARREGLO: Buscar si existe un usuario con ese email Y esa contraseña
            // .find() recorre el arreglo y devuelve el primer objeto que cumpla ambas condiciones
            const usuarioEncontrado = usuariosInscritos.find(u => u.email === email && u.password === pass);

            if (usuarioEncontrado) {
                // Usuario encontrado → Iniciar sesión guardando sus datos como "usuario_activo"
                localStorage.setItem('usuario_activo', JSON.stringify(usuarioEncontrado));
                actualizarDOM('log-mensaje', 'Autenticando...', false);
                loginForm.reset();
                
                // Transición al portal después de 500ms (efecto de "carga")
                setTimeout(() => mostrarPortal(usuarioEncontrado), 500);
            } else {
                // No se encontró → Mostrar error de credenciales
                actualizarDOM('log-mensaje', 'Correo o contraseña incorrectos.', true);
            }
        });
    }

    // =========================================================================
    // SECCIÓN 6: FORMULARIO DE CONTACTO
    // =========================================================================
    const contactoForm = document.getElementById('contactoForm');
    const mensajeInput = document.getElementById('cont-mensaje');   // Textarea del mensaje
    const charCountEl = document.getElementById('char-count');       // Contador de caracteres

    // Contador de caracteres en tiempo real para el textarea
    // Se actualiza cada vez que el usuario escribe (evento 'input')
    if (mensajeInput && charCountEl) {
        mensajeInput.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCountEl.textContent = currentLength;
            // Si se alcanza el límite de 200 caracteres, pintar el contador de rojo
            if (currentLength >= 200) {
                charCountEl.parentElement.classList.add('limit-reached');
            } else {
                charCountEl.parentElement.classList.remove('limit-reached');
            }
        });
    }

    // Envío del formulario de contacto
    if (contactoForm) {
        contactoForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Capturar valores del formulario
            const nombre = document.getElementById('cont-nombre').value.trim();
            const email = document.getElementById('cont-email').value.trim();
            const mensaje = document.getElementById('cont-mensaje').value.trim();

            // Validar campos
            const resultadoValidacion = validarDatos('contacto', { nombre, email, mensaje });
            if (!resultadoValidacion.valido) {
                return actualizarDOM('cont-feedback', resultadoValidacion.mensaje, true);
            }

            // Mostrar éxito, limpiar formulario y reiniciar contador
            actualizarDOM('cont-feedback', 'Tu mensaje ha sido enviado correctamente.', false);
            contactoForm.reset();
            if (charCountEl) {
                charCountEl.textContent = "0";
                charCountEl.parentElement.classList.remove('limit-reached');
            }
        });
    }

    // =========================================================================
    // INICIALIZACIÓN: Verificar sesión al cargar la página
    // =========================================================================
    verificarSesionActiva();
});
