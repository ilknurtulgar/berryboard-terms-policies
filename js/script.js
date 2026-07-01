/* İLETİŞİM FORMU */
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const targetEmail = "ilknur.softwaredev@gmail.com";
    const subject = encodeURIComponent(`BerryBoard Support Request from ${name}`);
    const body = encodeURIComponent(`${message}\n\n---\nUser Email: ${email}`);

    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  });
}

/* INTERAKTIF SAYFA KODLARI (SLIDER VE OK BUTONU) */
document.addEventListener("DOMContentLoaded", () => {
  const syncSlidesTrack = document.getElementById('syncSlidesTrack');
  const syncSlides = document.querySelectorAll('.sync-slide');
  const syncCards = document.querySelectorAll('.sync-card');
  const featuresSection = document.getElementById('features');
  const scrollBtn = document.getElementById("floatingScrollBtn");
  const glowEl = document.getElementById('featuresBgGlow');

  if (!syncSlidesTrack || syncSlides.length === 0 || syncCards.length === 0 || !featuresSection) return;

  let activeIndex = 0;
  const totalSlides = syncCards.length;

  const glowConfigs = [
    { background: "radial-gradient(circle, rgba(224, 92, 138, 0.18) 0%, transparent 70%)", left: "30%", top: "40%", scale: "1" },
    { background: "radial-gradient(circle, rgba(140, 92, 224, 0.18) 0%, transparent 70%)", left: "70%", top: "60%", scale: "1.2" },
    { background: "radial-gradient(circle, rgba(244, 160, 190, 0.18) 0%, transparent 70%)", left: "40%", top: "30%", scale: "0.9" },
    { background: "radial-gradient(circle, rgba(224, 92, 138, 0.15) 0%, transparent 70%)", left: "25%", top: "70%", scale: "1.1" },
    { background: "radial-gradient(circle, rgba(140, 92, 224, 0.15) 0%, transparent 70%)", left: "50%", top: "50%", scale: "1.3" }
  ];

  // Ana Kaydırma Fonksiyonu
  function goToSlide(index) {
    activeIndex = index;

    // Tüm slayt bloğunu dikey olarak kaydır
    const slideHeight = syncSlides[0].offsetHeight;
    syncSlidesTrack.style.transform = `translateY(-${index * slideHeight}px)`;

    // Arka Plan Işık Geçişini Güncelle
    if (glowEl && glowConfigs[index]) {
      const config = glowConfigs[index];
      glowEl.style.background = config.background;
      glowEl.style.left = config.left;
      glowEl.style.top = config.top;
      glowEl.style.transform = `translate(-50%, -50%) scale(${config.scale})`;
    }

    // Sınıfları (Parlaklık/Silikleşme) Güncelle
    syncCards.forEach((card, idx) => {
      if (idx === index) {
        card.classList.add('active-card');
      } else {
        card.classList.remove('active-card');
      }
    });
  }

  function scrollToSlideIndex(idx) {
    const rect = featuresSection.getBoundingClientRect();
    const sectionHeight = featuresSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    const totalScrollable = sectionHeight - viewportHeight;
    const sectionTop = window.scrollY + rect.top;
    const targetScrollY = sectionTop + (idx / (totalSlides - 1)) * totalScrollable;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  }

  // Sayfa Kaydırmasını Dinleyen Fonksiyon
  function handleScroll() {
    const rect = featuresSection.getBoundingClientRect();
    const sectionHeight = featuresSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    const totalScrollable = sectionHeight - viewportHeight;
    const scrolled = -rect.top;

    let progress = scrolled / totalScrollable;
    progress = Math.max(0, Math.min(1, progress));

    let index = Math.floor(progress * totalSlides);
    if (index >= totalSlides) {
      index = totalSlides - 1;
    }

    if (index !== activeIndex) {
      goToSlide(index);
    }
  }

  window.addEventListener('scroll', handleScroll);
  // İlk yüklemede çalıştır
  handleScroll();

  /* YUKARI KAYDIRMA BUTONU KONTROLLERİ */
  if (scrollBtn) {
    const sections = [
      document.querySelector(".hero"),
      featuresSection,
      document.getElementById("support")
    ].filter(Boolean);

    const updateScrollBtn = () => {
      const scrollPos = window.scrollY + window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;

      if (totalHeight - scrollPos < 50) {
        scrollBtn.classList.add("up");
      } else {
        scrollBtn.classList.remove("up");
      }
    };

    window.addEventListener("scroll", updateScrollBtn);
    updateScrollBtn();

    scrollBtn.addEventListener("click", () => {
      const scrollPos = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight;
      const scrollBottom = scrollPos + window.innerHeight;

      if (totalHeight - scrollBottom < 50) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const currentScroll = window.scrollY;
      const featuresTop = featuresSection.offsetTop;
      const featuresHeight = featuresSection.offsetHeight;
      const totalScrollable = featuresHeight - window.innerHeight;

      // Eğer sticky features alanının içindeysek, bir sonraki slayta kaydır
      if (currentScroll >= featuresTop - 10 && currentScroll < featuresTop + totalScrollable - 10) {
        const nextIndex = activeIndex + 1;
        if (nextIndex < totalSlides) {
          scrollToSlideIndex(nextIndex);
          return;
        }
      }

      // Normal bölüm geçişi
      let nextSection = null;
      for (const section of sections) {
        const sectionTop = section.offsetTop;
        if (sectionTop > currentScroll + 10) {
          nextSection = section;
          break;
        }
      }

      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollBy({
          top: window.innerHeight,
          behavior: "smooth"
        });
      }
    });
  }
});
