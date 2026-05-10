/* 
  ============================================================================
  PROYECTO CLINICO UNIVERSITARIO - LÓGICA DE LA PÁGINA PRINCIPAL
  ============================================================================
  Archivo: index.js
  Página:  index.html
  
  Responsabilidad ÚNICA de este archivo:
    - Controlar el carrusel de imágenes de la sección Hero (portada)
    - Rotación automática cada 4 segundos
    - Navegación manual con botones "Anterior" y "Siguiente"
    - Efecto de transición suave (fade) al cambiar de imagen
  
  Nota para modificaciones:
    - Para agregar una imagen nueva al carrusel, añadir la ruta al arreglo 'imagenes'
    - Las imágenes deben estar en la carpeta /images/
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // ARREGLO DE IMÁGENES DEL CARRUSEL
    // =========================================================================
    // Cada elemento es una ruta relativa a una imagen en la carpeta /images/
    // El carrusel las recorre de forma cíclica (al llegar al final, vuelve al inicio)
    const imagenes = [
        "images/clinic_hero.png",  // Imagen original del proyecto (portada clínica)
        "images/carrusel_1.png",   // Imagen generada: Instalaciones modernas
        "images/carrusel_2.png",   // Imagen generada: Sala de urgencias
        "images/carrusel_3.png"    // Imagen generada: Especialidades médicas
    ];

    // =========================================================================
    // VARIABLES DE CONTROL
    // =========================================================================
    let indiceActual = 0;   // Índice de la imagen que se muestra actualmente (empieza en 0)
    const imagenElemento = document.getElementById('imagen-carrusel'); // Elemento <img> del DOM
    const btnAnterior = document.getElementById('btn-anterior');       // Botón "◀" (flecha izquierda)
    const btnSiguiente = document.getElementById('btn-siguiente');     // Botón "▶" (flecha derecha)
    let intervaloCarrusel; // Variable que almacena el ID del setInterval (para poder cancelarlo)

    // =========================================================================
    // FUNCIÓN PRINCIPAL: CAMBIAR IMAGEN
    // =========================================================================
    /**
     * cambiarImagen(direccion)
     * Función modular que actualiza la imagen mostrada en el carrusel.
     * Se expone en window para poder ser llamada desde otros contextos si es necesario.
     * @param {number} direccion - 1 para avanzar (siguiente), -1 para retroceder (anterior)
     */
    window.cambiarImagen = function(direccion) {
        if (!imagenElemento) return; // Protección: si el elemento no existe, no hacer nada

        // Actualizar el índice sumando la dirección (+1 o -1)
        indiceActual += direccion;

        // LÓGICA CÍCLICA: Si el índice se sale del rango, dar la vuelta
        if (indiceActual >= imagenes.length) {
            indiceActual = 0; // Si pasamos la última imagen, volver a la primera
        } else if (indiceActual < 0) {
            indiceActual = imagenes.length - 1; // Si retrocedemos antes de la primera, ir a la última
        }

        // EFECTO DE TRANSICIÓN (Fade):
        // 1. Hacer transparente la imagen actual (opacity = 0)
        imagenElemento.style.opacity = 0;
        
        // 2. Después de 200ms (cuando ya es invisible), cambiar el src y volver a hacerla visible
        setTimeout(() => {
            imagenElemento.src = imagenes[indiceActual]; // Cambiar la fuente de la imagen en el DOM
            imagenElemento.style.opacity = 1;            // Restaurar la opacidad (fade-in)
        }, 200);
    };

    // =========================================================================
    // CARRUSEL AUTOMÁTICO
    // =========================================================================
    
    /**
     * iniciarCarruselAutomatico()
     * Inicia un temporizador que avanza la imagen automáticamente cada 4 segundos.
     * setInterval ejecuta la función cada X milisegundos de forma indefinida.
     */
    function iniciarCarruselAutomatico() {
        intervaloCarrusel = setInterval(() => {
            cambiarImagen(1); // Avanzar a la siguiente imagen
        }, 4000); // 4000ms = 4 segundos
    }

    /**
     * resetearTemporizador()
     * Reinicia el temporizador automático.
     * Se llama cuando el usuario hace clic manual en los botones,
     * para que los 4 segundos empiecen a contar desde cero.
     */
    function resetearTemporizador() {
        clearInterval(intervaloCarrusel);  // Cancelar el temporizador actual
        iniciarCarruselAutomatico();       // Iniciar uno nuevo
    }

    // =========================================================================
    // EVENTOS DE LOS BOTONES DEL CARRUSEL
    // =========================================================================
    if (btnAnterior && btnSiguiente) {
        // Botón "◀ Anterior": retroceder una imagen y reiniciar el temporizador
        btnAnterior.addEventListener('click', () => {
            cambiarImagen(-1);
            resetearTemporizador();
        });
        // Botón "▶ Siguiente": avanzar una imagen y reiniciar el temporizador
        btnSiguiente.addEventListener('click', () => {
            cambiarImagen(1);
            resetearTemporizador();
        });
    }

    // =========================================================================
    // INICIALIZACIÓN: Arrancar el carrusel automático al cargar la página
    // =========================================================================
    iniciarCarruselAutomatico();
});
