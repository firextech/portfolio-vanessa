# Portfolio: cómo está hecho, qué falta y cómo se publica

Página propia, sin frameworks ni dependencias. Tres archivos y dos carpetas de imágenes: se abre
haciendo doble clic en `index.html` y se sube tal cual a cualquier hosting.

| Archivo | Qué es |
|---|---|
| `index.html` | El contenido |
| `styles.css` | Todo el diseño. Para cambiar colores, el bloque `:root` del principio |
| `app.js` | Todo el movimiento. Comentado en español |
| `img/` · `icons/` | Su retrato y los logotipos de herramientas |
| `favicon.svg` · `share.jpg` | Icono de pestaña e imagen de previsualización al compartir |
| `shots/` | Capturas a 1440, 768 y 390 px |

## 1. Qué cuenta la página

El eje es **lo que ha estudiado, puesto frente a lo que piden las ofertas**. Sin sector, sin nicho
y sin una sola cifra de resultados inventada. **Formación y experiencia son secciones separadas.**

1. **Héroe** — quién es y la propuesta en una línea, con su retrato.
2. **Cinta de asignaturas** — las doce asignaturas que más pesan, en movimiento continuo.
3. **Competencias** — tres frentes, y en cada tarjeta las asignaturas concretas que lo sostienen.
4. **Formación** — cuatro cifras y los dos títulos, cada uno desplegable con **el temario completo**
   y las herramientas: Google Analytics 4, Google Ads, HubSpot, Metricool, Ubersuggest y WordPress.
5. **Experiencia** — línea de tiempo con los dos empleos. De Quémono: SEO, branding y redes
   sociales, que son las funciones confirmadas por ella.
6. **Proyectos** — tres entregas de asignatura, marcadas como **ejercicio académico**. Están para
   enseñar qué sabe producir de principio a fin, y se sustituyen por el TFG y el TFM cuando estén.
7. **Medición** — banda oscura con la retícula animada y las cuatro preguntas que responde con datos.
8. **Enfoque** — la admisión honesta, encendiéndose palabra a palabra.
9. **Cierre** — la llamada a escribirle por LinkedIn.

## 2. Qué se mueve

| Dónde | Qué hace |
|---|---|
| Al cargar | El héroe entra escalonado y la foto se descubre de arriba abajo |
| Barra superior | Una línea de progreso marca cuánto queda de página; el enlace de la sección en pantalla se subraya |
| Al bajar | Cada bloque sube y se funde al entrar, con retardo entre los elementos de una misma fila |
| Formación | Los cuatro números suben desde cero la primera vez que se ven |
| Desplegables | Abren con transición de altura y el `+` gira hasta convertirse en `–` |
| Experiencia | La línea vertical se va rellenando de color según bajas, y cada hito enciende su punto |
| Medición | Una retícula con señales recorriendo sus líneas, dibujada en canvas |
| Enfoque | La frase pasa de medio tono a tinta palabra a palabra |
| Héroe | La foto hace un paralaje suave al desplazarse |
| Punteros | Tarjetas que se levantan, iconos que giran un poco, enlaces que se subrayan solos |

**Accesibilidad.** Todo respeta `prefers-reduced-motion`: con esa preferencia activada no se mueve
nada y los números aparecen directamente en su valor. Sin JavaScript la página se ve entera y
quieta. Los desplegables son `<details>` nativos, así que funcionan con teclado y lector de pantalla.

**Rendimiento.** La retícula del canvas solo se dibuja mientras esa sección está en pantalla; el
resto son transiciones de CSS. No hay librerías externas: solo la tipografía de Google Fonts.

## 3. Lo que falta

### Fotografías propias
Hay **una sola fotografía**: su retrato. Con material suyo la página sube mucho:
1. Tres o cuatro piezas de trabajo (una campaña, un plan de contenidos, una pantalla de informe con
   los números cambiados). Sustituirían las tarjetas de Proyectos por casos reales.
2. Un segundo retrato de contexto, trabajando.
3. Capturas del TFG y del TFM.

### Datos
- **TFG y TFM**: título y tema. Hay una línea en Proyectos que ya anuncia que irán ahí.
- **Quémono**: las tres áreas están. Falta con qué herramientas y sobre cuánto contenido.
- **Herramientas**: las del máster vienen declaradas por el programa. Las de la carrera (Adobe) por
  el plan de estudios. **Si alguna no la defendería en una entrevista, se quita.**

## 4. Cómo se edita

- **Textos**: directamente en `index.html`.
- **Colores**: el bloque `:root` de `styles.css`, arriba del todo.
- **Añadir un desplegable**: copia un bloque `<details class="acc">` entero y cambia el contenido.
- **Añadir una tarjeta de proyecto**: copia un `<article class="proj">`.
- **Quitar una animación**: en `styles.css`, borra el atributo `data-rv` del elemento en el HTML.
- **Un número nuevo que suba**: `<span data-count="42">42</span>`.

## 5. Cómo se publica gratis

- **Netlify Drop** (lo más rápido, sin cuenta técnica): entra en `app.netlify.com/drop` y arrastra
  la carpeta `04-portfolio` entera. Te da una URL al momento, y la puedes renombrar en
  *Site settings → Change site name*.
- **GitHub Pages**: repositorio público `vanessacgmez.github.io`, sube el contenido de la carpeta a
  la raíz y activa *Settings → Pages → main / root*.
- **Cloudflare Pages**: conecta el repositorio de GitHub. HTTPS y CDN gratis.

Después, en los tres casos:
1. Descomenta la línea `canonical` de `index.html` y pon la URL real.
2. Pega la URL en un mensaje de LinkedIn y comprueba que sale `share.jpg` con el título. Si se
   cachea mal, refréscala en el *Post Inspector* de LinkedIn.
3. Pon la URL en el perfil, en la sección Destacado.

Un dominio propio (`vanessacasogomez.com`) cuesta entre 10 y 15 € al año y se conecta a cualquiera
de los tres en cinco minutos.
