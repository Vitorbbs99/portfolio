document.addEventListener('DOMContentLoaded', function () {
  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const goTopBtn = document.querySelector('.gotop');
  if (goTopBtn) {
    const toggleGoTop = () => {
      if (window.scrollY > 100) {
        goTopBtn.classList.add('active');
      } else {
        goTopBtn.classList.remove('active');
      }
    };
    toggleGoTop();
    window.addEventListener('scroll', debounce(toggleGoTop, 100));
    goTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const cursor = document.querySelector('#cursor');
  const cursorBorder = document.querySelector('#cursor-border');
  if (cursor && cursorBorder) {
    let currentPos = { x: 0, y: 0 };
    let targetPos = { x: 0, y: 0 };

    document.addEventListener('mousemove', (e) => {
      currentPos.x = e.clientX;
      currentPos.y = e.clientY;
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    const updateCursor = () => {
      targetPos.x += (currentPos.x - targetPos.x) / 8;
      targetPos.y += (currentPos.y - targetPos.y) / 8;
      cursorBorder.style.transform = `translate(${targetPos.x}px, ${targetPos.y}px)`;
      requestAnimationFrame(updateCursor);
    };
    requestAnimationFrame(updateCursor);

    document.querySelectorAll('a').forEach((link) => {
      link.addEventListener('mouseenter', () => cursorBorder.classList.add('hovered'));
      link.addEventListener('mouseleave', () => cursorBorder.classList.remove('hovered'));
    });
  }

  const progressWrap = document.querySelector('.progress-wrap');
  const progressPath = document.querySelector('.progress-wrap path');
  if (progressPath && progressWrap) {
    const pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

    const updateProgress = () => {
      const scroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pathLength - (scroll * pathLength) / height;
      progressPath.style.strokeDashoffset = progress;

      if (scroll > 50) {
        progressWrap.classList.add('active-progress');
      } else {
        progressWrap.classList.remove('active-progress');
      }
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();

    progressWrap.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const headerFull = document.querySelector('.header-full');
  if (headerFull) {
    const toggleHeaderFull = () => {
      if (window.scrollY > 100) {
        headerFull.classList.add('active');
      } else {
        headerFull.classList.remove('active');
      }
    };
    toggleHeaderFull();
    window.addEventListener('scroll', debounce(toggleHeaderFull, 50));
  }
});

window.addEventListener('load', () => {
  const counters = document.querySelectorAll('.stat-number');
  const duration = 1500; // Tempo total da animação em milissegundos

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-count'); // O sinal de + converte string para número
    const increment = target / (duration / 16); // Baseado em ~60fps (16ms por frame)

    let current = 0;

    const updateCount = () => {
      current += increment;

      if (current < target) {
        counter.innerText = Math.ceil(current);
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target;
      }
    };

    updateCount();
  });
});

document.addEventListener('DOMContentLoaded', function() {
  
  const observerOptions = {
    threshold: 0.2 // Dispara quando 20% do elemento estiver visível
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Para de observar após aparecer (opcional, remova se quiser que suma ao sair)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Seleciona todos os elementos que devem "revelar"
  const hiddenElements = document.querySelectorAll('.reveal');
  hiddenElements.forEach(el => observer.observe(el));
});



document.addEventListener('click', function (e) {
  // 1. Acha o link mais próximo do clique que comece com #
  const anchor = e.target.closest('a[href^="#"]');
  
  if (anchor) {
    const targetId = anchor.getAttribute('href');
    
    // Ignora links vazios
    if (targetId === '#' || targetId === '#0') return;

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      // 2. Para o salto brusco do navegador
      e.preventDefault();

      // 3. Pega a posição do elemento na página
      // Ajuste o 'headerOffset' se você tiver um menu fixo no topo
      const headerOffset = 90; 
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // 4. Executa o scroll
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}, { passive: false }); // Garante que o preventDefault() funcione