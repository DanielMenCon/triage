Generar versiones optimizadas y redimensionadas de las imágenes (Windows)

Requisitos:
- ImageMagick (`magick`) o `imagemagick` disponible en PATH
- opcional: `cwebp` (libwebp) para mejor conversión WebP

Comandos (PowerShell):

# crear varias anchuras y convertir a PNG/WEBP
$src = "images/medical_team.png"
magick $src -resize 720x -strip -interlace Plane -quality 85 images/medical_team-720.png
magick $src -resize 480x -strip -interlace Plane -quality 85 images/medical_team-480.png
magick $src -resize 320x -strip -interlace Plane -quality 85 images/medical_team-320.png

# convertir PNG a WebP (si tiene cwebp)
cwebp -q 80 images/medical_team-720.png -o images/medical_team-720.webp
cwebp -q 80 images/medical_team-480.png -o images/medical_team-480.webp
cwebp -q 80 images/medical_team-320.png -o images/medical_team-320.webp

# ejemplos para el mapa
$src2 = "images/campus_map.png"
magick $src2 -resize 1024x -strip -interlace Plane -quality 85 images/campus_map-1024.png
magick $src2 -resize 640x -strip -interlace Plane -quality 85 images/campus_map-640.png
magick $src2 -resize 320x -strip -interlace Plane -quality 85 images/campus_map-320.png

cwebp -q 80 images/campus_map-1024.png -o images/campus_map-1024.webp
cwebp -q 80 images/campus_map-640.png -o images/campus_map-640.webp
cwebp -q 80 images/campus_map-320.png -o images/campus_map-320.webp

# Iconos - generar @2x
magick images/icon_cardio.png -resize 128x images/icon_cardio@2x.png
magick images/icon_trauma.png -resize 128x images/icon_trauma@2x.png
magick images/icon_pedia.png -resize 128x images/icon_pedia@2x.png
magick images/icon_mater.png -resize 128x images/icon_mater@2x.png

# convertir iconos a webp (opcional)
cwebp -q 90 images/icon_cardio.png -o images/icon_cardio.webp
cwebp -q 90 images/icon_cardio@2x.png -o images/icon_cardio@2x.webp

Notas:
- Ajusta la calidad (`-quality` o `-q`) según el balance tamaño/definición que necesites.
- Para producción, revisa las imágenes generadas y elimina archivos no usados.
- Si no tienes `cwebp`, ImageMagick puede escribir WebP directamente con: `magick input.png -quality 80 output.webp`.

Python (opción alternativa sin ImageMagick):

1) Instala Pillow:

```powershell
pip install pillow
```

2) Ejecuta el script Python que generará PNG/WebP y variantes (ya incluido en el repo):

```powershell
python scripts\optimize_images.py
```

El script crea archivos como `medical_team-720.png`, `medical_team-720.webp`, `campus_map-640.png`, `icon_cardio@2x.png`, `icon_cardio.webp`, etc. Revisa la carpeta `images/` después de ejecutar.

Después de generar los archivos, confirma que existen los archivos en `images/` para que los `srcset` en `index.html` apunten correctamente.