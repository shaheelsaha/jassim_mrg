/* ══════════════════════════════════════════════════════════
   H. SHAIKH JASSIM & M. FAHIMA — WEDDING INVITATION
   Exact implementation matching https://ivoryfinal.vercel.app/
   ══════════════════════════════════════════════════════════ */

/* Wedding settings */
const WEDDING = { year: 2026, month: 12, day: 20, hour: 11, minute: 30, label: 'Nikkah' };
const MUSIC_START = 0;
const WALIMA = null;

const opener = document.getElementById('opener');
const openBtn = document.getElementById('openBtn');
const video = document.getElementById('openingVideo');
const bgMusic = document.getElementById('bgMusic');
const website = document.getElementById('website');
const scratchCard = document.getElementById('scratchCard');
const scratchCanvas = document.getElementById('scratchCanvas');
const confettiCanvas = document.getElementById('confetti');
const sparkles = document.getElementById('sparkles');
const musicToggle = document.getElementById('musicToggle');
const mIconOn = document.getElementById('mIconOn');
const mIconOff = document.getElementById('mIconOff');

let opened = false, scratched = false, drawing = false, scratchStarted = false;
let shown = false;

function showWebsite() {
  if (shown) return;
  shown = true;
  opener.classList.add('done');
  setTimeout(() => {
    opener.classList.add('hidden');
    website.classList.remove('hidden');
    website.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'auto';
    if (musicToggle) musicToggle.classList.remove('hidden');
    setupScratch();
    buildCalendar();
    startCountdown();
    startReveals();
    startSparkles();
    window.scrollTo(0, 0);
  }, 650);
}

/* Floating gold sparkles + drifting rose petals */
function startSparkles() {
  if (!sparkles || sparkles.dataset.on) return;
  sparkles.dataset.on = '1';
  sparkles.classList.remove('hidden');
  const r = (a, b) => a + Math.random() * (b - a);
  for (let i = 0; i < 26; i++) {
    const d = document.createElement('i'), sz = r(3, 8);
    d.style.cssText = `left:${r(0, 100)}%;width:${sz}px;height:${sz}px;--sx:${r(-30, 30)}px;animation-duration:${r(9, 19)}s;animation-delay:${r(0, 14)}s`;
    sparkles.appendChild(d);
  }
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('b');
    p.style.cssText = `left:${r(0, 100)}%;--sx:${r(-50, 50)}px;animation-duration:${r(14, 24)}s;animation-delay:${r(0, 18)}s;transform-origin:center`;
    sparkles.appendChild(p);
  }
}

function startReveals() {
  document.querySelectorAll('.reveal').forEach(el => [...el.children].forEach((c, i) => c.style.setProperty('--i', i)));
  const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(e => obs.observe(e));
}

/* Tap to Open Handler */
if (openBtn) {
  openBtn.addEventListener('click', async () => {
    if (opened) return;
    opened = true;
    openBtn.classList.add('clicked');
    if (video) {
      video.currentTime = 0;
      video.muted = true;
    }
    // Start music on tap
    if (bgMusic) {
      try {
        bgMusic.currentTime = MUSIC_START;
        bgMusic.loop = true;
        bgMusic.volume = 1;
        await bgMusic.play();
        if (musicToggle) musicToggle.classList.add('playing');
      } catch (e) { }
    }
    // Play opening envelope video
    if (video) {
      try {
        await video.play();
      } catch (e) {
        showWebsite();
      }
      setTimeout(showWebsite, ((isFinite(video.duration) && video.duration) || 3) * 1000 + 2000);
    } else {
      showWebsite();
    }
  });
}

if (video) {
  video.addEventListener('ended', showWebsite);
  video.addEventListener('error', showWebsite);
  const vsrc = video.querySelector('source');
  if (vsrc) vsrc.addEventListener('error', showWebsite);
}

/* Music Toggle Button */
if (musicToggle && bgMusic) {
  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().catch(() => { });
      musicToggle.classList.add('playing');
      if (mIconOn) mIconOn.style.display = 'block';
      if (mIconOff) mIconOff.style.display = 'none';
    } else {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
      if (mIconOn) mIconOn.style.display = 'none';
      if (mIconOff) mIconOff.style.display = 'block';
    }
  });
}

/* Calendar with Burgundy Heart on Wedding Date */
const HEART = '<svg viewBox="0 0 32 30" aria-hidden="true"><path d="M16 29C14 27.5 1 18.5 1 9.5 1 4.5 4.8 1.5 8.8 1.5c3 0 5.5 1.7 7.2 4.3 1.7-2.6 4.2-4.3 7.2-4.3C27.2 1.5 31 4.5 31 9.5 31 18.5 18 27.5 16 29z"/></svg>';
function buildCalendar() {
  const grid = document.getElementById('calGrid');
  if (!grid || grid.dataset.built) return;
  grid.dataset.built = '1';
  const y = WEDDING.year, m = WEDDING.month - 1;
  const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
  const calMonth = document.getElementById('calMonth');
  if (calMonth) calMonth.textContent = new Date(y, m, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  let html = '';
  for (let i = 0; i < first; i++) html += '<span class="day"></span>';
  for (let d = 1; d <= days; d++) {
    if (d === WEDDING.day) html += `<span class="day heart">${HEART}<b>${d}</b></span>`;
    else if (WALIMA && WALIMA.year === y && WALIMA.month - 1 === m && d === WALIMA.day) html += `<span class="day ring"><b>${d}</b></span>`;
    else html += `<span class="day"><b>${d}</b></span>`;
  }
  grid.innerHTML = html;
}

/* Wedding Countdown */
function startCountdown() {
  const els = {
    d: document.getElementById('cdD'),
    h: document.getElementById('cdH'),
    m: document.getElementById('cdM'),
    s: document.getElementById('cdS')
  };
  const target = new Date(WEDDING.year, WEDDING.month - 1, WEDDING.day, WEDDING.hour, WEDDING.minute, 0).getTime();
  let lastVals = {};
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      if (els.d) els.d.textContent = '0';
      if (els.h) els.h.textContent = '00';
      if (els.m) els.m.textContent = '00';
      if (els.s) els.s.textContent = '00';
      return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    const cur = { d: '' + d, h: pad(h), m: pad(m), s: pad(s) };
    for (const k of ['d', 'h', 'm', 's']) {
      if (els[k] && lastVals[k] !== cur[k]) {
        els[k].textContent = cur[k];
        els[k].classList.remove('tick');
        void els[k].offsetWidth;
        els[k].classList.add('tick');
      }
    }
    lastVals = cur;
  }
  tick();
  setInterval(tick, 1000);
}

/* Scratch to Reveal Card */
function setupScratch() {
  if (!scratchCanvas || !scratchCard) return;
  const rect = scratchCard.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = rect.width, H = rect.height;
  scratchCanvas.width = W * dpr;
  scratchCanvas.height = H * dpr;
  const c = scratchCanvas.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Metallic gold coating
  const grad = c.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#8c6420');
  grad.addColorStop(0.25, '#d4a843');
  grad.addColorStop(0.5, '#f5e298');
  grad.addColorStop(0.75, '#b8892f');
  grad.addColorStop(1, '#7a5418');
  c.fillStyle = grad;
  c.fillRect(0, 0, W, H);

  // Decorative border
  c.strokeStyle = 'rgba(255,255,255,0.4)';
  c.lineWidth = 1;
  c.strokeRect(10, 10, W - 20, H - 20);

  // Engraved gold text
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillStyle = '#4a2c00';
  c.font = '600 13px Montserrat, sans-serif';
  c.letterSpacing = '3px';
  c.fillText('✦ SCRATCH TO REVEAL ✦', W / 2, H / 2 - 10);
  c.font = 'italic 12px "Cormorant Garamond", serif';
  c.letterSpacing = '1px';
  c.fillStyle = '#6a4208';
  c.fillText('Swipe gently with your finger', W / 2, H / 2 + 18);
}

function point(e) {
  const r = scratchCanvas.getBoundingClientRect();
  const t = e.touches ? e.touches[0] : e;
  return { x: t.clientX - r.left, y: t.clientY - r.top };
}

let lastPoint = null;
function eraseAt(p) {
  const c = scratchCanvas.getContext('2d');
  c.globalCompositeOperation = 'destination-out';
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.lineWidth = 38;
  if (lastPoint) {
    c.beginPath(); c.moveTo(lastPoint.x, lastPoint.y); c.lineTo(p.x, p.y); c.stroke();
  }
  c.beginPath(); c.arc(p.x, p.y, 19, 0, Math.PI * 2); c.fill();
  lastPoint = p;
}

function scratch(e) {
  if (!drawing) return;
  e.preventDefault();
  scratchStarted = true;
  eraseAt(point(e));
  checkScratch();
}

let lastCheck = 0;
function checkScratch(force) {
  if (scratched) return;
  const now = performance.now();
  if (!force && now - lastCheck < 140) return;
  lastCheck = now;
  const c = scratchCanvas.getContext('2d');
  const d = c.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
  let clear = 0, total = 0;
  for (let i = 3; i < d.length; i += 20) {
    total++;
    if (d[i] < 30) clear++;
  }
  if (clear / total > 0.38) {
    scratched = true;
    scratchCard.classList.add('revealed');
    launchConfetti();
  }
}

if (scratchCanvas) {
  scratchCanvas.addEventListener('pointerdown', e => {
    drawing = true;
    lastPoint = null;
    scratchCanvas.setPointerCapture(e.pointerId);
    scratch(e);
  });
  scratchCanvas.addEventListener('pointermove', scratch);
  scratchCanvas.addEventListener('pointerup', e => {
    drawing = false;
    checkScratch(true);
    lastPoint = null;
    try { scratchCanvas.releasePointerCapture(e.pointerId); } catch (_) { }
  });
  scratchCanvas.addEventListener('pointercancel', () => { drawing = false; lastPoint = null; });
}
window.addEventListener('resize', () => { if (!scratched && !scratchStarted) setupScratch(); });

/* Confetti Burst */
function launchConfetti() {
  if (!confettiCanvas) return;
  const c = confettiCanvas, x = c.getContext('2d');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = innerWidth * dpr; c.height = innerHeight * dpr;
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
  const W = innerWidth, H = innerHeight;
  const palette = ['#b08a3e', '#d9b86a', '#f3dda0', '#6b1425', '#9b2335', '#e8a5ae', '#fbeedd', '#ffffff'];
  const bits = [];

  function burst(px, py, n, spread, power) {
    for (let i = 0; i < n; i++) {
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * spread;
      const sp = Math.random() * power + power * 0.35;
      bits.push({
        x: px, y: py,
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        w: Math.random() * 7 + 4, h: Math.random() * 11 + 5,
        rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4,
        a: 1, fade: 0.0022 + Math.random() * 0.002,
        sway: Math.random() * 6.28,
        color: palette[Math.floor(Math.random() * palette.length)],
        shape: Math.floor(Math.random() * 3)
      });
    }
  }

  const shots = [[0.5, 0.5, 240, 2.6, 20], [0.1, 0.7, 180, 1.6, 22], [0.9, 0.7, 180, 1.6, 22], [0.5, 0.4, 220, 3.2, 22]];
  shots.forEach((s, i) => setTimeout(() => burst(W * s[0], H * s[1], s[2], s[3], s[4]), i * 380));

  function draw() {
    x.clearRect(0, 0, W, H);
    for (let i = bits.length - 1; i >= 0; i--) {
      const b = bits[i];
      b.vx *= 0.992; b.vy += 0.2; if (b.vy > 7) b.vy = 7;
      b.sway += 0.06; b.x += b.vx + Math.sin(b.sway) * 0.7; b.y += b.vy; b.rot += b.vr; b.a -= b.fade;
      if (b.a <= 0 || b.y > H + 30) { bits.splice(i, 1); continue; }
      x.save();
      x.globalAlpha = b.a;
      x.translate(b.x, b.y);
      x.rotate(b.rot);
      x.fillStyle = b.color;
      if (b.shape === 0) x.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      else if (b.shape === 1) { x.beginPath(); x.arc(0, 0, b.w * 0.45, 0, 6.283); x.fill(); }
      else { x.scale(1, Math.abs(Math.sin(b.sway))); x.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); }
      x.restore();
    }
    if (bits.length) requestAnimationFrame(draw);
    else x.clearRect(0, 0, W, H);
  }
  requestAnimationFrame(draw);
}

document.body.style.overflow = 'hidden';
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => { if (!scratched) setupScratch(); });
}

/* ══════════════════════════════════════════════════════════
   FIREBASE RSVP INTEGRATION
   ══════════════════════════════════════════════════════════ */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC6EbcxqNfYlw-_IEszmxegqkPe9q_NcRA",
  authDomain: "jassim-mrg.firebaseapp.com",
  projectId: "jassim-mrg",
  storageBucket: "jassim-mrg.firebasestorage.app",
  messagingSenderId: "753984860709",
  appId: "1:753984860709:web:40d213086ab677e96405cc",
  measurementId: "G-PXYRG50CLH"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const rsvpContainer = document.getElementById('rsvp-form-container');
const rsvpYesResponse = document.getElementById('rsvp-yes-response');
const rsvpNoResponse = document.getElementById('rsvp-no-response');
const yesBtn = document.getElementById('btn-yes');
const noBtn = document.getElementById('btn-no');

async function submitRSVP(attending) {
  if (rsvpContainer) rsvpContainer.style.display = 'none';
  if (attending && rsvpYesResponse) {
    rsvpYesResponse.style.display = 'block';
  } else if (!attending && rsvpNoResponse) {
    rsvpNoResponse.style.display = 'block';
  }
  try {
    await addDoc(collection(db, "rsvps"), {
      attending,
      timestamp: new Date()
    });
  } catch (e) {
    console.error("RSVP error:", e);
  }
}

if (yesBtn) yesBtn.addEventListener('click', () => submitRSVP(true));
if (noBtn) noBtn.addEventListener('click', () => submitRSVP(false));
