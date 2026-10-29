document.addEventListener('DOMContentLoaded', () => {
  // 1. Mouse Spotlight Cursor Glow
  const glow = document.getElementById('cursor-glow');
  if (glow) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      glow.style.transform = `translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(animateGlow);
    }
    requestAnimationFrame(animateGlow);
  }

  // 2. Architecture Tabs Switching
  const tabBtns = document.querySelectorAll('.arch-tab-btn');
  const tabPanes = document.querySelectorAll('.arch-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // 3. Email Copy with Floating Toast Notification
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  if (copyBtn && toast) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email') || 'ranvirrox5999@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast(`Copied ${email} to clipboard!`);
      } catch (err) {
        // Fallback for non-https or older browser permissions
        const textArea = document.createElement("textarea");
        textArea.value = email;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          showToast(`Copied ${email} to clipboard!`);
        } catch (e) {
          showToast(`Please write to: ${email}`);
        }
        document.body.removeChild(textArea);
      }
    });
  }

  function showToast(message) {
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // 4. Dynamic GitHub Live Stats Sync
  async function syncGitHubStats() {
    try {
      // Fetch public repos data
      const res = await fetch('https://api.github.com/users/RanvirRox/repos?per_page=100');
      if (!res.ok) return;
      const repos = await res.json();
      if (!Array.isArray(repos)) return;

      let totalStars = 0;
      let ekaKeyStars = null;
      let gceStars = null;

      repos.forEach(repo => {
        const stars = repo.stargazers_count || 0;
        totalStars += stars;
        if (repo.name === 'EkaKey-autocorrect-globally') {
          ekaKeyStars = stars;
        } else if (repo.name === 'GCE-Wifi-AutoLogin') {
          gceStars = stars;
        }
      });

      // Update Pinned Project Star counters dynamically
      if (ekaKeyStars !== null) {
        const ekakeyEl = document.querySelector('#stars-ekakey .star-count');
        if (ekakeyEl) ekakeyEl.textContent = ekaKeyStars;
        const heroEkakeyEl = document.getElementById('hero-ekakey-stars');
        if (heroEkakeyEl) heroEkakeyEl.textContent = `${ekaKeyStars}+`;
      }

      if (gceStars !== null) {
        const gceEl = document.querySelector('#stars-gce .star-count');
        if (gceEl) gceEl.textContent = gceStars;
      }

      // Update Public Repos count
      const reposCountEl = document.getElementById('hero-public-repos');
      if (reposCountEl && repos.length > 0) {
        reposCountEl.textContent = `${repos.length}+`;
      }
    } catch (e) {
      // Gracefully silent fallback to existing static values if offline or rate limited
      console.log('GitHub stats fallback to static values.');
    }
  }

  syncGitHubStats();

  // 5. Subtle Card Tilt / Highlight effect on hover
  const interactiveCards = document.querySelectorAll('.project-card, .repo-card, .skill-card');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
});
