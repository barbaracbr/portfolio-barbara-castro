/* ================================================================
   BÁRBARA CASTRO — PORTFÓLIO EDITORIAL
   script.js — Interações, validações e animações
   Vanilla JavaScript puro (sem frameworks ou bibliotecas)
   ================================================================ */


/* ----------------------------------------------------------------
   1. NAVBAR — sombra ao rolar + link ativo por seção
---------------------------------------------------------------- */

const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

/* Adiciona sombra na navbar ao rolar para baixo */
window.addEventListener('scroll', function () {
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  /* Atualiza o link ativo conforme a seção visível */
  destacarLinkAtivo();
});

/* Verifica qual seção está no viewport e marca o link correspondente */
function destacarLinkAtivo() {
  const secoes = document.querySelectorAll('section[id]');
  let secaoAtual = '';

  secoes.forEach(function (secao) {
    /* Considera seção "ativa" quando seu topo está acima do meio da tela */
    const topo = secao.offsetTop - 100;
    if (window.scrollY >= topo) {
      secaoAtual = secao.getAttribute('id');
    }
  });

  navLinks.forEach(function (link) {
    link.classList.remove('active');
    /* Compara o href do link com o id da seção atual */
    if (link.getAttribute('href') === '#' + secaoAtual) {
      link.classList.add('active');
    }
  });
}


/* ----------------------------------------------------------------
   2. MENU MOBILE — hambúrguer abre/fecha o menu
---------------------------------------------------------------- */

const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu   = document.getElementById('mobileMenu');
const mobileLinks  = document.querySelectorAll('.mobile-link');

/* Alterna a visibilidade do menu ao clicar no hambúrguer */
hamburgerBtn.addEventListener('click', function () {
  const estaAberto = mobileMenu.classList.contains('open');

  if (estaAberto) {
    fecharMenuMobile();
  } else {
    abrirMenuMobile();
  }
});

function abrirMenuMobile() {
  mobileMenu.classList.add('open');
  hamburgerBtn.classList.add('open');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
}

function fecharMenuMobile() {
  mobileMenu.classList.remove('open');
  hamburgerBtn.classList.remove('open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
}

/* Fecha o menu ao clicar em qualquer link mobile */
mobileLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    fecharMenuMobile();
  });
});

/* Fecha o menu ao clicar fora dele */
document.addEventListener('click', function (evento) {
  const clicouForaDoMenu = !mobileMenu.contains(evento.target);
  const clicouForaDoBtn  = !hamburgerBtn.contains(evento.target);

  if (clicouForaDoMenu && clicouForaDoBtn && mobileMenu.classList.contains('open')) {
    fecharMenuMobile();
  }
});


/* ----------------------------------------------------------------
   3. SCROLL SUAVE — links de âncora com offset para a navbar
---------------------------------------------------------------- */

document.querySelectorAll('a[href^="#"]').forEach(function (ancora) {
  ancora.addEventListener('click', function (evento) {
    const alvoId = this.getAttribute('href');

    /* Ignora links sem alvo válido */
    if (alvoId === '#' || alvoId === '') return;

    const alvo = document.querySelector(alvoId);
    if (!alvo) return;

    evento.preventDefault();

    /* Calcula posição levando em conta a altura da navbar fixa */
    const alturaNavbar = navbar.offsetHeight;
    const posicaoAlvo  = alvo.getBoundingClientRect().top + window.scrollY - alturaNavbar;

    window.scrollTo({
      top: posicaoAlvo,
      behavior: 'smooth'
    });
  });
});


/* ----------------------------------------------------------------
   4. REVEAL ON SCROLL — animação fadeUp ao entrar no viewport
---------------------------------------------------------------- */

/* Adiciona a classe 'reveal' nos elementos que devem ser animados */
const elementosAnimaveis = document.querySelectorAll(
  '.sobre__content, .formacao__item, .projeto-card, .habilidades__col, .hero__bottom'
);

elementosAnimaveis.forEach(function (el) {
  el.classList.add('reveal');
});

/* IntersectionObserver dispara quando o elemento entra na tela */
const observador = new IntersectionObserver(
  function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        /* Para de observar após animar (economiza recursos) */
        observador.unobserve(entrada.target);
      }
    });
  },
  {
    threshold: 0.15   /* Dispara quando 15% do elemento está visível */
  }
);

elementosAnimaveis.forEach(function (el) {
  observador.observe(el);
});


/* ----------------------------------------------------------------
   5. FORMULÁRIO DE CONTATO — validação + simulação de envio
---------------------------------------------------------------- */

const formulario     = document.getElementById('contactForm');
const campoNome      = document.getElementById('nome');
const campoEmail     = document.getElementById('email');
const campoMensagem  = document.getElementById('mensagem');
const erroNome       = document.getElementById('erroNome');
const erroEmail      = document.getElementById('erroEmail');
const erroMensagem   = document.getElementById('erroMensagem');
const modal          = document.getElementById('formModal');
const btnFecharModal = document.getElementById('modalClose');

/* --- Funções auxiliares de validação --- */

/* Verifica se o campo está preenchido (não vazio após trim) */
function campoVazio(valor) {
  return valor.trim() === '';
}

/* Valida formato de e-mail com expressão regular */
function emailValido(email) {
  /* Padrão: texto @ texto . texto */
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/* Exibe mensagem de erro em um campo */
function mostrarErro(campoInput, spanErro, mensagem) {
  spanErro.textContent = mensagem;
  campoInput.classList.add('error');
}

/* Limpa o erro de um campo */
function limparErro(campoInput, spanErro) {
  spanErro.textContent = '';
  campoInput.classList.remove('error');
}

/* Limpa todos os erros do formulário */
function limparTodosErros() {
  limparErro(campoNome,     erroNome);
  limparErro(campoEmail,    erroEmail);
  limparErro(campoMensagem, erroMensagem);
}

/* --- Validação em tempo real (ao sair do campo) --- */

campoNome.addEventListener('blur', function () {
  if (campoVazio(this.value)) {
    mostrarErro(this, erroNome, 'Por favor, informe seu nome.');
  } else {
    limparErro(this, erroNome);
  }
});

campoEmail.addEventListener('blur', function () {
  if (campoVazio(this.value)) {
    mostrarErro(this, erroEmail, 'Por favor, informe seu e-mail.');
  } else if (!emailValido(this.value)) {
    mostrarErro(this, erroEmail, 'Informe um e-mail válido (ex: nome@dominio.com).');
  } else {
    limparErro(this, erroEmail);
  }
});

campoMensagem.addEventListener('blur', function () {
  if (campoVazio(this.value)) {
    mostrarErro(this, erroMensagem, 'Por favor, escreva sua mensagem.');
  } else {
    limparErro(this, erroMensagem);
  }
});

/* --- Envio do formulário --- */

formulario.addEventListener('submit', function (evento) {
  /* Impede o envio padrão do formulário (recarregar página) */
  evento.preventDefault();

  /* Limpa erros anteriores antes de revalidar */
  limparTodosErros();

  var temErro = false;

  /* Valida cada campo */
  if (campoVazio(campoNome.value)) {
    mostrarErro(campoNome, erroNome, 'Por favor, informe seu nome.');
    temErro = true;
  }

  if (campoVazio(campoEmail.value)) {
    mostrarErro(campoEmail, erroEmail, 'Por favor, informe seu e-mail.');
    temErro = true;
  } else if (!emailValido(campoEmail.value)) {
    mostrarErro(campoEmail, erroEmail, 'Informe um e-mail válido (ex: nome@dominio.com).');
    temErro = true;
  }

  if (campoVazio(campoMensagem.value)) {
    mostrarErro(campoMensagem, erroMensagem, 'Por favor, escreva sua mensagem.');
    temErro = true;
  }

  /* Se houver qualquer erro, interrompe o envio */
  if (temErro) return;

  /* --- Simulação de envio bem-sucedido --- */
  /* Limpa os campos do formulário */
  formulario.reset();

  /* Exibe o modal de confirmação */
  abrirModal();
});

/* --- Modal de confirmação --- */

function abrirModal() {
  modal.classList.add('visible');
  modal.setAttribute('aria-hidden', 'false');
  /* Foco no botão de fechar para acessibilidade */
  btnFecharModal.focus();
}

function fecharModal() {
  modal.classList.remove('visible');
  modal.setAttribute('aria-hidden', 'true');
}

/* Fecha o modal ao clicar no botão "Fechar" */
btnFecharModal.addEventListener('click', function () {
  fecharModal();
});

/* Fecha o modal ao pressionar Escape */
document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape' && modal.classList.contains('visible')) {
    fecharModal();
  }
});


/* ----------------------------------------------------------------
   6. TICKER — pausa a animação ao passar o mouse
---------------------------------------------------------------- */

const tickerTrack = document.querySelector('.ticker__track');

if (tickerTrack) {
  tickerTrack.addEventListener('mouseenter', function () {
    this.style.animationPlayState = 'paused';
  });

  tickerTrack.addEventListener('mouseleave', function () {
    this.style.animationPlayState = 'running';
  });
}


/* ----------------------------------------------------------------
   7. ANO DINÂMICO no footer (mantém sempre atualizado)
---------------------------------------------------------------- */

/* Seleciona o primeiro span do footer e atualiza o ano */
(function () {
  var footerSpans = document.querySelectorAll('.footer span');
  if (footerSpans.length > 0) {
    var anoAtual = new Date().getFullYear();
    footerSpans[0].textContent = '© ' + anoAtual + ' Bárbara Castro';
  }
})();
