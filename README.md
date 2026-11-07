# Portfolio de William Rodriguez Pantoja

Landing estática con seis casos de proyecto, experiencia profesional, tecnologías, formación y contacto. Los casos distinguen los productos desplegados, las demostraciones y las integraciones pendientes de validar.

## Archivos

- `index.html`: contenido, navegación, metadatos y formulario.
- `assets/styles.css`: diseño adaptable, temas claro y oscuro, y estados del formulario.
- `assets/main.js`: tema, menú móvil, formulario y animación de portada y proyectos.
- `assets/projects/`: ilustración de portada sobre desarrollo y diseño de aplicaciones, con recorte móvil, más el diseño de la carta digital, los diagramas públicos y los logotipos.
- `assets/vendor/`: GSAP y ScrollTrigger 3.15.1, copias de los archivos `dist` del [paquete oficial](https://www.npmjs.com/package/gsap) bajo la [licencia estándar de GSAP](https://gsap.com/standard-license/).
- `assets/favicon.svg`: icono del sitio.

No requiere instalación de dependencias ni compilación. Los recursos usan rutas relativas para funcionar bajo `/Landing-Page/` en GitHub Pages.

## Ver la página localmente

Desde la carpeta del repositorio, ejecutar con Python 3:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8000/`. Detener el servidor con `Ctrl+C`.

## Actualizar contenido

1. Editar las secciones correspondientes de `index.html`. Mantener los identificadores de sección, formulario y controles que usa `assets/main.js`.
2. Cambiar el diseño en `assets/styles.css` y el comportamiento en `assets/main.js` cuando sea necesario.
3. Actualizar el estado y el stack de cada caso a partir de su repositorio. Si cambia el correo o dominio del portfolio, actualizar los enlaces de contacto o `og:url`, respectivamente.
4. Comprobar la página en móvil y escritorio, ambos temas, movimiento reducido, enlaces internos, correo, teléfono y formulario.

Los diagramas de Grill Ecuador y Facturación electrónica se basan en sus carpetas `.archify`. El esquema de Grill España adapta el mapa de Grill al diseño fiscal documentado para España. Los SVG muestran flujos de producto y omiten detalles de infraestructura privada. La imagen de la carta viene de la propuesta «Brasa nocturna» del sitio web de Grill.

La paleta toma los colores de `grill-django/frontend/src/styles/foundation.css`. Los logotipos proceden de las aplicaciones Grill Restaurant y Modern Store y se muestran sobre fondo claro para conservar sus colores.

La galería fija sus tres casos destacados en pantallas amplias con puntero preciso. El índice vertical, el contenido de los diagramas y los controles de la página están disponibles con movimiento reducido, en pantallas pequeñas o si GSAP no carga.

## Publicar o actualizar en GitHub Pages

Repositorio: [warodriguez18/Landing-Page](https://github.com/warodriguez18/Landing-Page).

1. Revisar los cambios antes de publicarlos:

   ```powershell
   git status
   git diff --check
   git diff
   ```

2. Añadir únicamente los archivos de la landing y crear un commit:

   ```powershell
   git add index.html assets/styles.css assets/main.js assets/projects/ assets/vendor/ README.md
   git commit -m "Update portfolio content, design and navigation"
   git push origin main
   ```

3. En GitHub, entrar en **Settings → Pages → Build and deployment**. Para esta página estática, seleccionar **Source: Deploy from a branch**, **Branch: main**, carpeta **/(root)** y pulsar **Save**, si no está ya configurado así. Si el repositorio usa un flujo de GitHub Actions propio, revisar ese flujo antes de cambiar la fuente.
4. Abrir **Actions** y esperar a que termine correctamente el despliegue de Pages.
5. Visitar [la landing publicada](https://warodriguez18.github.io/Landing-Page/). Si aparece una versión anterior, recargar sin caché con `Ctrl+F5`.
6. Repetir la revisión de navegación móvil, temas, enlaces y formulario sobre la versión publicada.

Referencia oficial: [configurar la fuente de publicación de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Formulario y contacto

El formulario conserva el endpoint existente de Formspree: `https://formspree.io/f/xeaqnqpy`. Valida los campos obligatorios, evita envíos simultáneos, muestra el resultado y conserva el texto si el envío falla. Tras 15 segundos interrumpe la espera y permite reintentar. Sin JavaScript utiliza el envío HTML nativo a Formspree.

Para verificar la entrega real después de publicar, enviar un mensaje propio y confirmar su llegada en la cuenta receptora y en el panel de Formspree. Las pruebas con respuestas simuladas verifican la interfaz, pero no acreditan que el endpoint esté activo ni que llegue el correo. El formulario comunica que el nombre, correo y mensaje pasan por Formspree; correo y teléfono permiten contacto directo.

LinkedIn puede exigir inicio de sesión o bloquear comprobaciones automatizadas. Revisar manualmente que el enlace abra el perfil correcto.

## Verificación de la landing

El 7 de noviembre de 2026 se comprobó la landing con Chromium y Playwright bajo `/Landing-Page/`. La revisión cubrió diez anchuras entre 320 y 1920 px, los seis casos, las cuatro vistas de arquitectura y diseño, los dos logotipos, los temas, la navegación con teclado, el movimiento reducido y el uso sin JavaScript. Se inspeccionaron la portada en escritorio y móvil y las etapas intermedias de la galería. El formulario se probó con respuestas simuladas de éxito y error.

### Verificación anterior

Comprobaciones realizadas el 2 de octubre de 2026 con Chromium y Playwright:

- Nueve tamaños de pantalla entre 320 y 1440 píxeles sin desbordamiento horizontal; revisión visual en móvil y escritorio.
- Menú móvil, navegación a secciones, tecla Escape, foco en el destino y acceso al contenido con teclado.
- Tema claro/oscuro en todas las superficies, persistencia al recargar y respuesta a la preferencia del sistema.
- Almacenamiento bloqueado, contenido y navegación sin JavaScript, y preferencia de movimiento reducido.
- Formulario con respuestas interceptadas: validación de vacíos, correo y espacios, bloqueo de envíos simultáneos, éxito, error HTTP, fallo de red, reintento y tiempo de espera de 15 segundos. No se enviaron mensajes reales.
- Recursos CSS, JavaScript y favicon con respuesta HTTP 200, también bajo la ruta `/Landing-Page/`; anclas existentes e identificadores únicos. Estructura HTML y sintaxis JavaScript verificadas. Consola limpia al cargar la página.
- GitHub respondió HTTP 200. LinkedIn respondió HTTP 999 y requiere comprobación manual. La entrega real de Formspree queda pendiente de verificación en la cuenta receptora.

## Comprobaciones de mantenimiento

- Pantallas estrechas y escritorio sin desbordamiento horizontal.
- Menú móvil con apertura/cierre, tecla Escape y navegación a una sección.
- Cambio de tema y persistencia al recargar; funcionamiento si el navegador bloquea el almacenamiento.
- Acceso con teclado, foco visible y preferencia de movimiento reducido.
- Campos obligatorios, correo inválido y mensajes que solo contienen espacios.
- Estados de envío, éxito, error de red y tiempo de espera del formulario.
- Recursos locales y anclas sin enlaces rotos; consola sin errores.
- Revisión de entrega real de Formspree y acceso a LinkedIn en la versión pública.
