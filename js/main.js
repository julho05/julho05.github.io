/* ==========================================================================
   Central Contabilidade — main.js
   Vanilla JS, sem dependências.
   ========================================================================== */
(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     Menu mobile
     ---------------------------------------------------------------------- */
  function iniciarMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-nav]");
    var overlay = document.querySelector("[data-overlay]");
    if (!toggle || !nav) return;

    function definirEstado(aberto) {
      nav.setAttribute("data-aberto", String(aberto));
      toggle.setAttribute("aria-expanded", String(aberto));
      if (overlay) overlay.setAttribute("data-ativo", String(aberto));
      document.body.classList.toggle("sem-scroll", aberto);
    }

    toggle.addEventListener("click", function () {
      definirEstado(nav.getAttribute("data-aberto") !== "true");
    });

    if (overlay) {
      overlay.addEventListener("click", function () {
        definirEstado(false);
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") definirEstado(false);
    });

    // Fecha ao navegar
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) definirEstado(false);
    });

    // Reseta ao voltar para desktop
    var mq = window.matchMedia("(min-width: 1025px)");
    var aoMudar = function (ev) {
      if (ev.matches) definirEstado(false);
    };
    if (mq.addEventListener) mq.addEventListener("change", aoMudar);
    else mq.addListener(aoMudar);
  }

  /* ----------------------------------------------------------------------
     Submenu (hover no desktop, clique no mobile)
     ---------------------------------------------------------------------- */
  function iniciarSubmenus() {
    var itens = document.querySelectorAll("[data-submenu]");
    var ehDesktop = function () {
      return window.matchMedia("(min-width: 1025px)").matches;
    };

    Array.prototype.forEach.call(itens, function (item) {
      var botao = item.querySelector(".nav__botao-submenu");
      if (!botao) return;

      function abrir(estado) {
        item.classList.toggle("nav__item--aberto", estado);
        botao.setAttribute("aria-expanded", String(estado));
      }

      botao.addEventListener("click", function (e) {
        e.preventDefault();
        abrir(!item.classList.contains("nav__item--aberto"));
      });

      item.addEventListener("mouseenter", function () {
        if (ehDesktop()) abrir(true);
      });
      item.addEventListener("mouseleave", function () {
        if (ehDesktop()) abrir(false);
      });

      // Acessibilidade: fecha ao sair com Tab
      item.addEventListener("focusout", function (e) {
        if (ehDesktop() && !item.contains(e.relatedTarget)) abrir(false);
      });
    });

    document.addEventListener("click", function (e) {
      if (!ehDesktop()) return;
      Array.prototype.forEach.call(itens, function (item) {
        if (!item.contains(e.target)) {
          item.classList.remove("nav__item--aberto");
          var b = item.querySelector(".nav__botao-submenu");
          if (b) b.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  /* ----------------------------------------------------------------------
     FAQ acordeão
     ---------------------------------------------------------------------- */
  function iniciarFaq() {
    var perguntas = document.querySelectorAll(".faq__pergunta");
    Array.prototype.forEach.call(perguntas, function (btn) {
      btn.addEventListener("click", function () {
        var aberto = btn.getAttribute("aria-expanded") === "true";
        var resposta = document.getElementById(
          btn.getAttribute("aria-controls")
        );
        btn.setAttribute("aria-expanded", String(!aberto));
        if (resposta) resposta.setAttribute("data-aberto", String(!aberto));
      });
    });
  }

  /* ----------------------------------------------------------------------
     Máscara de telefone
     ---------------------------------------------------------------------- */
  function iniciarMascaraTelefone() {
    var campos = document.querySelectorAll('input[type="tel"]');
    Array.prototype.forEach.call(campos, function (campo) {
      campo.addEventListener("input", function () {
        var v = campo.value.replace(/\D/g, "").slice(0, 11);
        if (v.length > 6) {
          campo.value =
            "(" +
            v.slice(0, 2) +
            ") " +
            v.slice(2, v.length === 11 ? 7 : 6) +
            "-" +
            v.slice(v.length === 11 ? 7 : 6);
        } else if (v.length > 2) {
          campo.value = "(" + v.slice(0, 2) + ") " + v.slice(2);
        } else if (v.length > 0) {
          campo.value = "(" + v;
        } else {
          campo.value = "";
        }
      });
    });
  }

  /* ----------------------------------------------------------------------
     Validação + envio via WhatsApp
     Sem backend: monta a mensagem e abre o WhatsApp da empresa.
     Para trocar por envio real, ver README.
     ---------------------------------------------------------------------- */
  var WHATSAPP = "5547933896522";

  function iniciarFormularios() {
    var forms = document.querySelectorAll("[data-form-contato]");
    Array.prototype.forEach.call(forms, function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var valido = true;

        var campos = form.querySelectorAll("[data-campo]");
        Array.prototype.forEach.call(campos, function (wrapper) {
          var input = wrapper.querySelector("input, select, textarea");
          if (!input) return;
          var ok = input.checkValidity() && input.value.trim() !== "";
          wrapper.setAttribute("data-invalido", String(!ok));
          if (!ok && valido) {
            valido = false;
            input.focus();
          }
        });

        if (!valido) return;

        var dados = new FormData(form);
        var linhas = ["*Novo contato pelo site*", ""];
        dados.forEach(function (valor, chave) {
          if (String(valor).trim() !== "") {
            linhas.push("*" + chave + ":* " + valor);
          }
        });

        var url =
          "https://wa.me/" +
          WHATSAPP +
          "?text=" +
          encodeURIComponent(linhas.join("\n"));
        window.open(url, "_blank", "noopener");

        var btn = form.querySelector('button[type="submit"]');
        if (btn) {
          var original = btn.innerHTML;
          btn.innerHTML = "Abrindo o WhatsApp...";
          btn.disabled = true;
          setTimeout(function () {
            btn.innerHTML = original;
            btn.disabled = false;
            form.reset();
          }, 2500);
        }
      });
    });
  }

  /* ----------------------------------------------------------------------
     Revelar ao rolar
     ---------------------------------------------------------------------- */
  function iniciarRevelar() {
    var alvos = document.querySelectorAll(".revelar");
    if (!alvos.length) return;

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      Array.prototype.forEach.call(alvos, function (el) {
        el.setAttribute("data-visivel", "true");
      });
      return;
    }

    var obs = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.setAttribute("data-visivel", "true");
            obs.unobserve(entrada.target);
          }
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.08 }
    );

    Array.prototype.forEach.call(alvos, function (el, i) {
      el.style.transitionDelay = (i % 3) * 90 + "ms";
      obs.observe(el);
    });
  }

  /* ----------------------------------------------------------------------
     Ano no rodapé
     ---------------------------------------------------------------------- */
  function iniciarAno() {
    var els = document.querySelectorAll("[data-ano]");
    var ano = new Date().getFullYear();
    Array.prototype.forEach.call(els, function (el) {
      el.textContent = ano;
    });
  }

  /* ----------------------------------------------------------------------
     Boot
     ---------------------------------------------------------------------- */
  function iniciar() {
    iniciarMenu();
    iniciarSubmenus();
    iniciarFaq();
    iniciarMascaraTelefone();
    iniciarFormularios();
    iniciarRevelar();
    iniciarAno();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
