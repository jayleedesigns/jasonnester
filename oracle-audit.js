const appState = {
  step: 'input',
  url: '',
  competitorUrl: '',
  email: '',
  date: '',
  time: '',
  score: 82
};

const METRICS = [
  { label: 'Speed Alchemy', value: 94 },
  { label: 'SEO Spells', value: 71 },
  { label: 'Visual Magic', value: 85 },
  { label: 'Conversion', value: 64 }
];

const DATE_OPTIONS = ['Mon 30', 'Tue 31', 'Wed 01', 'Thu 02', 'Fri 03', 'Sat 04'];
const TIME_OPTIONS = ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'];

const stepEls = [...document.querySelectorAll('.audit-step')];
const websiteUrl = document.getElementById('websiteUrl');
const competitorUrl = document.getElementById('competitorUrl');
const reportEmail = document.getElementById('reportEmail');
const auditForm = document.getElementById('auditForm');
const scanTarget = document.getElementById('scanTarget');
const scanProgress = document.getElementById('scanProgress');
const scanPercent = document.getElementById('scanPercent');
const metricGrid = document.getElementById('metricGrid');
const auditAnalyzedFor = document.getElementById('auditAnalyzedFor');
const listenReportBtn = document.getElementById('listenReportBtn');
const rivalCard = document.getElementById('rivalCard');
const rivalText = document.getElementById('rivalText');
const generateVisionBtn = document.getElementById('generateVisionBtn');
const mockupArea = document.getElementById('mockupArea');
const goBookingBtn = document.getElementById('goBookingBtn');
const dateChoices = document.getElementById('dateChoices');
const timeChoices = document.getElementById('timeChoices');
const finalizeBtn = document.getElementById('finalizeBtn');
const backToReportBtn = document.getElementById('backToReportBtn');
const successSummary = document.getElementById('successSummary');
const nextSteps = document.getElementById('nextSteps');
const newAuditBtn = document.getElementById('newAuditBtn');

function setStep(step) {
  appState.step = step;
  stepEls.forEach((el) => {
    el.hidden = el.dataset.step !== step;
  });
}

function renderMetrics() {
  metricGrid.innerHTML = METRICS.map((metric) => `
    <article class="audit-card metric-card">
      <p>${metric.label}</p>
      <strong>${metric.value}%</strong>
    </article>
  `).join('');
}

function startAudit() {
  let progress = 0;
  setStep('scanning');
  scanTarget.textContent = `Casting spells on ${appState.url}`;
  const timer = setInterval(() => {
    progress += 4;
    const bounded = Math.min(progress, 100);
    scanProgress.style.width = `${bounded}%`;
    scanPercent.textContent = `${bounded}%`;
    if (bounded >= 100) {
      clearInterval(timer);
      buildReport();
      setStep('report');
    }
  }, 120);
}

function buildReport() {
  renderMetrics();
  auditAnalyzedFor.textContent = `Analyzed for ${appState.url}`;
  if (appState.competitorUrl) {
    rivalCard.hidden = false;
    rivalText.textContent = `You: ${appState.score} • Rival: 71 (${appState.competitorUrl})`;
  } else {
    rivalCard.hidden = true;
  }
}

function speakReport(text) {
  if (!('speechSynthesis' in window)) {
    alert('Text-to-speech is not supported in this browser.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function generateMockupDataUrl() {
  const headline = appState.url.replace(/^https?:\/\//, '').slice(0, 28) || 'yourbrand.com';
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'>
    <defs>
      <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
        <stop offset='0%' stop-color='#4f46e5'/>
        <stop offset='100%' stop-color='#7c3aed'/>
      </linearGradient>
    </defs>
    <rect width='1200' height='675' fill='#0f172a'/>
    <circle cx='970' cy='90' r='280' fill='url(#g)' fill-opacity='0.4'/>
    <rect x='80' y='130' rx='24' width='1040' height='420' fill='rgba(15,23,42,.75)' stroke='rgba(255,255,255,.2)'/>
    <text x='130' y='240' fill='white' font-size='62' font-family='Inter,Arial,sans-serif' font-weight='700'>Future Hero Concept</text>
    <text x='130' y='305' fill='#cbd5e1' font-size='38' font-family='Inter,Arial,sans-serif'>${headline}</text>
    <rect x='130' y='360' width='260' height='62' rx='30' fill='url(#g)'/>
    <text x='180' y='401' fill='white' font-size='28' font-family='Inter,Arial,sans-serif'>Book Strategy</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function renderChoices(container, options, type) {
  container.innerHTML = options
    .map((value) => `<button type="button" class="choice" data-${type}="${value}">${value}</button>`)
    .join('');
}

function updateFinalizeState() {
  finalizeBtn.disabled = !(appState.date && appState.time);
}

auditForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!auditForm.reportValidity()) return;
  appState.url = websiteUrl.value.trim();
  appState.competitorUrl = competitorUrl.value.trim();
  appState.email = reportEmail.value.trim();
  startAudit();
});

listenReportBtn.addEventListener('click', () => {
  speakReport(
    `Greetings. Gemini Oracle scanned ${appState.url}. Speed is strong, but conversion charms are fading. Focus on mobile call-to-action placement to improve local conversion.`
  );
});

generateVisionBtn.addEventListener('click', () => {
  generateVisionBtn.disabled = true;
  generateVisionBtn.textContent = 'Generating...';
  setTimeout(() => {
    mockupArea.innerHTML = `<img alt="AI generated hero concept" src="${generateMockupDataUrl()}" />`;
    generateVisionBtn.textContent = 'Generated ✓';
  }, 700);
});

goBookingBtn.addEventListener('click', () => setStep('booking'));

backToReportBtn.addEventListener('click', () => setStep('report'));

dateChoices.addEventListener('click', (event) => {
  const choice = event.target.closest('[data-date]');
  if (!choice) return;
  appState.date = choice.dataset.date;
  [...dateChoices.children].forEach((node) => node.classList.toggle('is-selected', node === choice));
  updateFinalizeState();
});

timeChoices.addEventListener('click', (event) => {
  const choice = event.target.closest('[data-time]');
  if (!choice) return;
  appState.time = choice.dataset.time;
  [...timeChoices.children].forEach((node) => node.classList.toggle('is-selected', node === choice));
  updateFinalizeState();
});

finalizeBtn.addEventListener('click', () => {
  setStep('success');
  successSummary.textContent = `Your strategy session for ${appState.url} is booked for ${appState.date} at ${appState.time}.`;
  nextSteps.innerHTML = `
    <li>✅ A meeting link will be sent to <strong>${appState.email}</strong>.</li>
    <li>✅ We'll review ${appState.competitorUrl || 'your top competitors'} before the call.</li>
    <li>✅ Be ready to define your brand's conversion goals.</li>
  `;
  speakReport(`Excellent choice. Your session is confirmed for ${appState.date} at ${appState.time}.`);
});

newAuditBtn.addEventListener('click', () => {
  auditForm.reset();
  appState.url = '';
  appState.competitorUrl = '';
  appState.email = '';
  appState.date = '';
  appState.time = '';
  scanProgress.style.width = '0%';
  scanPercent.textContent = '0%';
  generateVisionBtn.disabled = false;
  generateVisionBtn.textContent = '✨ Generate';
  mockupArea.innerHTML = "<p>Click generate to preview your brand's future hero section.</p>";
  renderChoices(dateChoices, DATE_OPTIONS, 'date');
  renderChoices(timeChoices, TIME_OPTIONS, 'time');
  updateFinalizeState();
  setStep('input');
});

renderChoices(dateChoices, DATE_OPTIONS, 'date');
renderChoices(timeChoices, TIME_OPTIONS, 'time');
updateFinalizeState();
setStep('input');
