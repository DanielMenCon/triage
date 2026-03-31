# Plan de Proyecto Clínico Universitaria (Triage y Portal)

El objetivo es desarrollar una versión profesional y seria del sistema de Triage, orientada a una clínica universitaria, con accesibilidad WCAG AA y alto rigor semántico en el código para evaluación académica.

## Estructura Base Clínica

Desarrollaremos los tres pilares del sitio a nivel profesional.

### 1. index.html
Se implementará HTML5 semántico puro de acuerdo a los requerimientos de la evaluación. Contendrá:
- `<header>` y `<nav>`: Barra de navegación con logo y menús principales.
- `<main>`: Contenedor principal.
  - `<section id="portada">`: Hero y bienvenida a la clínica.
  - `<section id="nosotros">`: Conócenos (Información sobre las instalaciones y profesionales).
  - `<section id="mision">`: Nuestra Misión y Visión orientada al servicio de salud.
  - `<section id="triage">`: La función central ESI y portal de evaluación.
  - `<section id="contacto">`: Datos de contacto institucionales, horarios y mapa abstracto.
- `<footer>`: Pie de página y enlaces legales.

**Importante:** Todo el HTML estará minuciosamente comentado (`<!-- COMENTARIO -->`) indicando el propósito y la semántica de cada sección.

## Metodología y Benchmarking (Diseño Centrado en el Cliente)
Para garantizar la credibilidad y usabilidad de esta maqueta, se tomaron como modelo directo tres de las principales instituciones de salud del país: **Clínica Dávila, Clínica Alemana y Clínica Bupa Santiago**. 
De este riguroso análisis se extrajo un modelo que responde a las necesidades reales de los clientes de salud:
1. **Acceso Rápido:** Implementación de Top-bar para Reserva Médico y Mi Portal.
2. **Estructura Médica:** Desglose claro de las Especialidades (modelo Bupa).
3. **Sentido de Urgencia:** Banner 24/7 con Tiempos de Espera para el Triage (modelo estandarizado).
4. **Respaldo Institucional:** Fomento de la Investigación Académica (modelo Alemana).
5. **Valor Añadido:** Blog de Prevención que educa activamente a la comunidad.

### 2. css/style.css
Diseño limpio ("medicalizado") utilizando blancos, azules corporativos y verdes salud. 
Prioridad absoluta en cumplir contraste certificado (WCAG AA) para discapacidades visuales. Se excluirán elementos "Gamer" (fuentes pixeladas, animaciones bruscas) por tipografías serias (`Roboto`, `Inter`) y bordes redondeados limpios.

### 3. js/app.js
Se clonará el motor matemático del índice de Triage (ESI) usado en el proyecto original, retirando todas las referencias de videojuegos RPG (Stamina, HP, Status). Las variables ahora usarán terminología estricta de salud (Escala de Dolor Visual (EVA), Movilidad Ambulatoria, Nivel de Conciencia - Glasgow).

## Registro de Avances
- [x] Renombrar archivos Gamer (`index_gamer.html`, `style_gamer.css`, `app_gamer.js`)
- [ ] Creación de `index.html` Clínico con comentarios semánticos
- [ ] Creación de `css/style.css` Clínico (WCAG AA)
- [ ] Creación de `js/app.js` Clínico (Traducción terminológica)
