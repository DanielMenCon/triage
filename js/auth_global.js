/* 
  ============================================================================
  PROYECTO CLINICO UNIVERSITARIO - MANEJO GLOBAL DE SESIÓN
  ============================================================================
  Archivo: auth_global.js
  Páginas: index.html, triage.html, registro.html (TODAS las páginas)
  
  Responsabilidad ÚNICA de este archivo:
    - Verificar si hay un usuario logueado en localStorage
    - Si hay sesión activa: reemplazar los enlaces de la barra superior (top-bar)
      por un menú personalizado con el nombre del usuario, acceso a "Mi Portal"
      y botón de "Cerrar Sesión"
    - Si no hay sesión: no hacer nada (dejar los enlaces por defecto del HTML)
  
  Nota WCAG 2.1:
    - Los colores del menú inyectado cumplen con los ratios de contraste mínimos
    - Texto oscuro sobre fondo claro (#f0f4f8) = Ratio > 4.5:1 (Nivel AA)
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar si hay un usuario activo guardado en la memoria local del navegador
    //    JSON.parse convierte el texto almacenado de vuelta a un objeto JavaScript
    const usuarioActivo = JSON.parse(localStorage.getItem('usuario_activo'));
    
    // 2. Buscar el contenedor de los enlaces en la barra superior
    //    Este elemento tiene id="top-user-menu" y existe en las 3 páginas del sitio
    const topUserMenu = document.getElementById('top-user-menu');

    // Solo ejecutar si HAY sesión activa Y el elemento existe en la página
    if (usuarioActivo && topUserMenu) {
        // 3. MANIPULACIÓN DEL DOM: Reemplazar los enlaces genéricos por el menú de usuario
        //    Se usa innerHTML para inyectar HTML nuevo dentro del contenedor
        //    Colores ajustados para cumplir WCAG 2.1 (Fondo claro vs Texto Oscuro)
        topUserMenu.innerHTML = `
            <span class="top-link" style="color: var(--text-dark); cursor: default; margin-right: 1rem;">
                👤 Hola, <strong style="color: var(--primary-blue);">${usuarioActivo.username}</strong>
            </span>
            <a href="registro.html?tab=portal" class="top-link highlight-link">⚙️ Mi Portal</a>
            <a href="#" id="btn-global-logout" class="top-link" style="color: var(--alert-red); font-weight: bold;">🚪 Cerrar Sesión</a>
        `;

        // 4. Asignar el evento de clic al nuevo botón de cerrar sesión
        const btnLogoutGlobal = document.getElementById('btn-global-logout');
        if (btnLogoutGlobal) {
            btnLogoutGlobal.addEventListener('click', (e) => {
                e.preventDefault(); // Evitar que el enlace "#" haga scroll hacia arriba
                
                // Borrar la sesión de la memoria local del navegador
                localStorage.removeItem('usuario_activo');
                
                // Redirigir a la página de registro/login para que vea la pantalla de acceso
                window.location.href = 'registro.html';
            });
        }
    }
    // Si no hay usuario activo, no se ejecuta nada y los enlaces del HTML quedan intactos
});
