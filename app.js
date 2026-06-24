document.addEventListener("DOMContentLoaded", () => {
  // Seleciona todos os links internos que começam com #
  const links = document.querySelectorAll('a[href^="#"]');

  function getScrollTop(element) {
    const rect = element.getBoundingClientRect();
    return rect.top + window.pageYOffset;
  }

  function smoothScrollTo(targetY, duration = 600) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;

    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Ease function for smoothness
      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      window.scrollTo(0, startY + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();

        // Fallback for browsers that don't support scrollIntoView with smooth
        try {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } catch {
          // Custom smooth scroll
          smoothScrollTo(getScrollTop(targetElement));
        }
      }
    });
  });
});

// Icones dos skills

document.querySelectorAll(".boxSkills > div").forEach((skillBox) => {
  skillBox.addEventListener("mouseenter", function () {
    const skill = skillBox.classList[0];
    document.querySelectorAll(".definicao").forEach((def) => {
      if (def.classList.contains(skill)) {
        setTimeout(() => {
          def.style.display = "flex";
          def.style.opacity = "0";
          def.style.transition = "opacity 0.3s ease-in-out"; // Smooth transition
          requestAnimationFrame(() => {
            def.style.opacity = "1";
          });
        }, 200);
      } else {
        def.style.transition = "opacity 0.3s ease-in-out"; // Smooth transition
        def.style.opacity = "0";
        setTimeout(() => {
          def.style.display = "none";
        }, 200);
      }
    });
  });
});

// ── Formulário de contato — EmailJS ───────────────────────
// Substitua os três placeholders abaixo pelos seus dados em:
// https://dashboard.emailjs.com

const EMAILJS_SERVICE_ID = "service_ge8lhmf"; // Email Services → Service ID
const EMAILJS_TEMPLATE_ID = "template_mhqmj18"; // Email Templates → Template ID
const EMAILJS_PUBLIC_KEY = "hXWjX-vOYpVOfUBHo"; // Account → API Keys → Public Key

// Inicialização obrigatória — sem isso o emailjs.send() falha
emailjs.init(EMAILJS_PUBLIC_KEY);

document
  .getElementById("contato-enviar")
  .addEventListener("click", async () => {
    const nome = document.getElementById("contato-nome").value.trim();
    const sobrenome = document.getElementById("contato-sobrenome").value.trim();
    const email = document.getElementById("contato-email").value.trim();
    const assunto = document.getElementById("contato-assunto").value.trim();
    const mensagem = document.getElementById("contato-mensagem").value.trim();
    const feedback = document.getElementById("contato-feedback");
    const btn = document.getElementById("contato-enviar");

    // Reseta feedback anterior
    feedback.classList.remove("visivel", "erro");
    feedback.querySelector("i").className = "fa-solid fa-circle-check";
    feedback.querySelector("span").textContent = "";

    // Validação
    if (!nome || !sobrenome || !email || !assunto || !mensagem) {
      mostrarFeedback(
        feedback,
        "fa-circle-exclamation",
        "Preencha todos os campos.",
        true,
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarFeedback(
        feedback,
        "fa-circle-exclamation",
        "E-mail inválido.",
        true,
      );
      return;
    }

    // Estado de carregamento
    btn.disabled = true;
    btn.textContent = "Enviando...";

    const templateParams = {
      nome: `${nome} ${sobrenome}`,
      email: email,
      assunto: assunto,
      mensagem: mensagem,
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
      );

      mostrarFeedback(
        feedback,
        "fa-circle-check",
        "Mensagem enviada com sucesso! Assim que possível entrarei em contato!",
        false,
      );
      limparFormulario();
    } catch (err) {
      console.error("EmailJS erro:", err);
      mostrarFeedback(
        feedback,
        "fa-circle-exclamation",
        "Erro ao enviar. Tente novamente.",
        true,
      );
    } finally {
      btn.disabled = false;
      btn.textContent = "Enviar mensagem";
    }
  });

function mostrarFeedback(el, icone, texto, isErro) {
  el.querySelector("i").className = `fa-solid ${icone}`;
  el.querySelector("span").textContent = texto;
  el.classList.add("visivel");
  if (isErro) {
    el.classList.add("erro");
  } else {
    el.classList.remove("erro");
  }
  setTimeout(() => {
    el.classList.remove("visivel");
  }, 2000);
}

function limparFormulario() {
  [
    "contato-nome",
    "contato-sobrenome",
    "contato-email",
    "contato-assunto",
    "contato-mensagem",
  ].forEach((id) => (document.getElementById(id).value = ""));
}

function redirecionar() {
  document.getElementById("Contato").scrollIntoView({
    behavior: "smooth",
  });
}
