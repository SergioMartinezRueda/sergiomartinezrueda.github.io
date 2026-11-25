const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const raiz = document.documentElement;
let pendiente = false;

function actualizarEscena() {
  const recorrido = raiz.scrollHeight - window.innerHeight;
  const progreso = recorrido > 0 ? window.scrollY / recorrido : 0;
  raiz.style.setProperty('--p', Math.min(Math.max(progreso, 0), 1).toFixed(3));
  pendiente = false;
}

function alHacerScroll() {
  if (!pendiente) {
    pendiente = true;
    requestAnimationFrame(actualizarEscena);
  }
}

if (!reducirMovimiento) {
  window.addEventListener('scroll', alHacerScroll, { passive: true });
  window.addEventListener('resize', alHacerScroll);
  actualizarEscena();
}

const contenedorPetalos = document.getElementById('petalos');
const NUMERO_PETALOS = 14;

if (contenedorPetalos && !reducirMovimiento) {
  for (let i = 0; i < NUMERO_PETALOS; i++) {
    const petalo = document.createElement('span');
    petalo.className = 'petalo';
    petalo.style.setProperty('--x', `${Math.random() * 110}vw`);
    petalo.style.setProperty('--duracion', `${12 + Math.random() * 10}s`);
    petalo.style.setProperty('--retraso', `${-Math.random() * 20}s`);
    contenedorPetalos.appendChild(petalo);
  }
}

const bloques = document.querySelectorAll('.revelar');

if (reducirMovimiento || !('IntersectionObserver' in window)) {
  bloques.forEach((bloque) => bloque.classList.add('visible'));
} else {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });
  bloques.forEach((bloque) => observador.observe(bloque));
}

const aviso = document.getElementById('desliza');
const siguienteBloque = document.querySelector('#tecnologias .panel');

if (aviso && siguienteBloque && 'IntersectionObserver' in window) {
  const observadorAviso = new IntersectionObserver((entradas) => {
    if (entradas[0].isIntersecting) {
      aviso.classList.add('oculto');
      observadorAviso.disconnect();
    }
  }, { threshold: 0.15 });
  observadorAviso.observe(siguienteBloque);
}

const botonMenu = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

function abrirOCerrarMenu(abrir) {
  menu.classList.toggle('abierto', abrir);

  botonMenu.setAttribute('aria-expanded', String(abrir));
}

botonMenu.addEventListener('click', () => {
  const estaAbierto = botonMenu.getAttribute('aria-expanded') === 'true';
  abrirOCerrarMenu(!estaAbierto);
});

menu.querySelectorAll('a').forEach((enlace) => {
  enlace.addEventListener('click', () => abrirOCerrarMenu(false));
});
