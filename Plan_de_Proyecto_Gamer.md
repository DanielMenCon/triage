# Plan de Implementación: Triage Web Dashboard

Desarrollaremos una página interactiva y responsiva (HTML/CSS/JS) basada en la escala de categorización médica ESI (Emergency Severity Index), tematizada íntegramente con referencias a videojuegos RPG retro estilo Final Fantasy.

## Requisitos del Usuario
- **Funcionalidad Dual:**
  - *Entrada Paciente:* Preguntas intuitivas y ágiles para el usuario final (nivel de dolor, síntomas visuales de gravedad).
  - *Entrada Profesional:* Parámetros médicos estructurados para profesional de enfermería (signos vitales en rangos, recursos estimados a usar, evaluación de estado de alerta).
- **Resultado Matemático (JS):** El motor lógico interno calcula y clasifica a la persona en un nivel ESI sugerido (1 al 5) usando la pauta clínica estricta real pero mostrándolo en términos "gamers".

## Estilo Visual Elegido
**Opción Final Fantasy / RPG Clásico:** 
- Pantallas tipo menú de videojuegos ochenteros (fondos azul noche con bordes grises sólidos y blancos). 
- Letras celestes y doradas tipo Pixel Art. 
- Alusiones a terminología RPG de sanación (HP Perdido, Stamina, Status K.O., Phoenix Down).

## Archivos Generados del Proyecto (`triage_gamer`)
1. **`index.html`**: El esqueleto de la página. Contiene el diseño semántico de los distintos Paneles de Menú (Inicio, Paciente, Modo Clínico de Enfermería y la Pantalla del Oráculo de Diagnósticos).
2. **`css/style.css`**: Toda la belleza de la página. Genera la paleta oscura, los cajones de diálogo retro, el comportamiento de parpadeo de peligro a los Triage categoría 1 y la fuente importada de Google Fonts ("Press Start 2P").
3. **`js/app.js`**: El cerebro técnico. Este archivo atrapa la información seleccionada por el usuario (variables), procesa la lógica estricta con funciones `if/else`, y clasifica dinámicamente si un caso amerita Resucitación, urgencia, o si se puede derivar con tranquilidad sin recursos.

## Progreso Actual y Próximos Pasos
- **Logrado (Marzo 2026):** 
  - Rediseño inmersivo del Menú Principal con "Tarjetas de Selección de Rol" interactivas.
  - Amplio ajuste de contraste en paletas y UI para verificar el **cumplimiento con normativas de accesibilidad WCAG AA**.
  - Reorganización de la arquitectura de la aplicación distribuyendo archivos a `css/` y `js/`.
  - Incorporación de animaciones flotantes constantes y Sprites de ambientación (Libro Mágico y el Caballero Enfermero Azul).
  - Refinamiento completo del **Formulario de Paciente** (barra de vida HP funcional, iconos mágicos, selectores retro).
  - Expansión de la lógica de evaluación: Se agregaron variables reales de urgencia (Tiempo, Hemorragia, Asfixia, Trauma) al cerebro (`app.js`) para lograr un cálculo riguroso del índice ESI.

- **Para la Próxima Sesión:**
  1. Rediseñar el aspecto interno de la sección de **"Magia Clínica"** (Formulario del Profesional).
  2. Darle efectos de victoria / peligro al **Oráculo de Resultados** (pantalla final de Categorización ESI).
  3. *Opcional*: Añadir efectos de sonido inmersivos de fantasía.

