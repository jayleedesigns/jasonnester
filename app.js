const portfolioData = [
  { name: 'East River Cobras Team Identity', category: 'branding', type: 'Brand Identity', year: 2026, featured: true },
  { name: "Sam's Pizza Website + Menu Refresh", category: 'web', type: 'Website Design', year: 2025, featured: true },
  { name: 'OnCall Services Promo Launch Video', category: 'video', type: 'Video + Motion', year: 2026, featured: true },
  { name: 'Gemini Creative Launch Highlights', category: 'social', type: 'Social Content', year: 2026, featured: true },
  { name: 'Gemini Creative Service Explainer Set', category: 'video', type: 'Video + Motion', year: 2025, featured: false },
  { name: 'Gemini Creative Client Portal UI', category: 'web', type: 'Website Design', year: 2024, featured: false },
  { name: 'Gemini Creative Brand Guidelines', category: 'branding', type: 'Brand Identity', year: 2024, featured: false },
  { name: 'Gemini Creative Retainer Social Pack', category: 'social', type: 'Social Content', year: 2025, featured: false }
];

const grid = document.getElementById('portfolioGrid');
const chips = [...document.querySelectorAll('.chip')];
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');

let filter = 'all';
let sortBy = 'featured';
let query = '';

function renderPortfolio() {
  const items = portfolioData
    .filter((item) => filter === 'all' || item.category === filter)
    .filter((item) => item.name.toLowerCase().includes(query) || item.type.toLowerCase().includes(query))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'newest') return b.year - a.year;
      if (a.featured !== b.featured) return Number(b.featured) - Number(a.featured);
      return b.year - a.year;
    });

  grid.innerHTML = items
    .map(
      (item) => `
      <article class="portfolio-item card" data-category="${item.category}">
        <h3>${item.name}</h3>
        <small>${item.type} • ${item.year}</small>
      </article>`
    )
    .join('');

  if (items.length === 0) {
    grid.innerHTML = '<p class="card">No projects match this filter.</p>';
  }
}

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    filter = chip.dataset.filter;
    renderPortfolio();
  });
});

sortSelect.addEventListener('change', () => {
  sortBy = sortSelect.value;
  renderPortfolio();
});

searchInput.addEventListener('input', () => {
  query = searchInput.value.trim().toLowerCase();
  renderPortfolio();
});

const form = document.getElementById('funnelForm');
const steps = [...document.querySelectorAll('.funnel-step')];
const stepNodes = [...document.querySelectorAll('.step')];
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
let currentStep = 0;

function showStep(index) {
  steps.forEach((el, i) => {
    el.hidden = i !== index;
  });
  stepNodes.forEach((el, i) => {
    el.classList.toggle('is-current', i === index);
  });
  backBtn.disabled = index === 0;
  nextBtn.hidden = index === steps.length - 1;
  submitBtn.hidden = index !== steps.length - 1;
}

nextBtn.addEventListener('click', () => {
  const fields = [...steps[currentStep].querySelectorAll('input, select, textarea')];
  const valid = fields.every((field) => field.reportValidity());
  if (!valid) return;
  if (currentStep < steps.length - 1) {
    currentStep += 1;
    showStep(currentStep);
  }
});

backBtn.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep -= 1;
    showStep(currentStep);
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Thank you! Your request has been captured.');
  form.reset();
  currentStep = 0;
  showStep(currentStep);
});

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
});

const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop.style.display = window.scrollY > 500 ? 'grid' : 'none';
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.getElementById('year').textContent = new Date().getFullYear();
showStep(currentStep);
renderPortfolio();
