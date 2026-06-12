function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (type ? ' ' + type : '');
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3200);
}

const overlay = document.getElementById('modal-overlay');
const modalBody = document.getElementById('modal-body');

document.getElementById('modal-close').onclick = tutupModal;
overlay.addEventListener('click', e => { if (e.target === overlay) tutupModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') tutupModal(); });

function tutupModal() {
  overlay.hidden = true;
  document.body.style.overflow = '';
}

function bukaModal(html) {
  modalBody.innerHTML = html;
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function bukaDaftarModal(plan, price) {
  bukaModal(`
    <h3>Daftar Paket ${plan}</h3>
    <p class="modal-sub">${price} · Isi data kamu untuk konfirmasi pendaftaran.</p>
    <div class="form-group">
      <label for="m-nama">Nama Lengkap</label>
      <input type="text" id="m-nama" placeholder="Nama lengkapmu">
      <span class="field-error" id="m-err-nama"></span>
    </div>
    <div class="form-group">
      <label for="m-email">Email</label>
      <input type="email" id="m-email" placeholder="email@kamu.com">
      <span class="field-error" id="m-err-email"></span>
    </div>
    <div class="form-group">
      <label for="m-hp">No. HP / WhatsApp</label>
      <input type="tel" id="m-hp" placeholder="08xxxxxxxxxx">
      <span class="field-error" id="m-err-hp"></span>
    </div>
    <button class="btn-submit" onclick="submitDaftar('${plan}')">Konfirmasi Pendaftaran</button>
  `);
}

function submitDaftar(plan) {
  const nama = document.getElementById('m-nama');
  const email = document.getElementById('m-email');
  const hp = document.getElementById('m-hp');
  let ok = true;

  function setErr(el, errEl, msg) {
    if (msg) { el.classList.add('invalid'); errEl.textContent = msg; ok = false; }
    else { el.classList.remove('invalid'); el.classList.add('valid'); errEl.textContent = ''; }
  }

  setErr(nama, document.getElementById('m-err-nama'),
    !nama.value.trim() ? 'Nama tidak boleh kosong.' :
    nama.value.trim().length < 2 ? 'Nama terlalu pendek.' : '');

  setErr(email, document.getElementById('m-err-email'),
    !email.value.trim() ? 'Email tidak boleh kosong.' :
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? 'Format email tidak valid.' : '');

  const hpVal = hp.value.replace(/\D/g, '');
  setErr(hp, document.getElementById('m-err-hp'),
    !hp.value.trim() ? 'Nomor HP tidak boleh kosong.' :
    !/^08\d{8,11}$/.test(hpVal) ? 'Masukkan nomor HP yang valid (contoh: 081234567890).' : '');

  if (!ok) return;

  bukaModal(`
    <div class="modal-success">
      <div class="check">✅</div>
      <h3>Pendaftaran Diterima!</h3>
      <p>Halo <strong>${nama.value.trim()}</strong>, pendaftaran paket <strong>${plan}</strong> kamu sudah kami terima.<br><br>Tim kami akan menghubungi kamu di <strong>${hp.value.trim()}</strong> atau <strong>${email.value.trim()}</strong> dalam 1×24 jam.</p>
    </div>
  `);
  showToast('Pendaftaran berhasil dikirim! 🎉', 'success');
}

function validateField(inputEl, errEl, rules) {
  const val = inputEl.value.trim();
  for (const [test, msg] of rules) {
    if (!test(val)) {
      inputEl.classList.add('invalid');
      inputEl.classList.remove('valid');
      errEl.textContent = msg;
      return false;
    }
  }
  inputEl.classList.remove('invalid');
  inputEl.classList.add('valid');
  errEl.textContent = '';
  return true;
}

const namaInput  = document.getElementById('nama');
const emailInput = document.getElementById('email');
const pesanInput = document.getElementById('pesan');

namaInput.addEventListener('blur', () => validateField(namaInput, document.getElementById('err-nama'), [
  [v => v.length > 0, 'Nama tidak boleh kosong.'],
  [v => v.length >= 2, 'Nama terlalu pendek.'],
]));

emailInput.addEventListener('blur', () => validateField(emailInput, document.getElementById('err-email'), [
  [v => v.length > 0, 'Email tidak boleh kosong.'],
  [v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Format email tidak valid.'],
]));

pesanInput.addEventListener('blur', () => validateField(pesanInput, document.getElementById('err-pesan'), [
  [v => v.length > 0, 'Pesan tidak boleh kosong.'],
  [v => v.length >= 10, 'Pesan terlalu singkat (minimal 10 karakter).'],
]));

function kirimPesan() {
  const btn = document.getElementById('btn-submit');
  const v1 = validateField(namaInput, document.getElementById('err-nama'), [
    [v => v.length > 0, 'Nama tidak boleh kosong.'],
    [v => v.length >= 2, 'Nama terlalu pendek.'],
  ]);
  const v2 = validateField(emailInput, document.getElementById('err-email'), [
    [v => v.length > 0, 'Email tidak boleh kosong.'],
    [v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Format email tidak valid.'],
  ]);
  const v3 = validateField(pesanInput, document.getElementById('err-pesan'), [
    [v => v.length > 0, 'Pesan tidak boleh kosong.'],
    [v => v.length >= 10, 'Pesan terlalu singkat (minimal 10 karakter).'],
  ]);

  if (!v1 || !v2 || !v3) {
    showToast('Mohon perbaiki form sebelum mengirim.', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Mengirim...';

  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = 'Kirim Pesan';
    namaInput.value = '';
    emailInput.value = '';
    pesanInput.value = '';
    [namaInput, emailInput, pesanInput].forEach(el => el.classList.remove('valid', 'invalid'));
    showToast('Pesan berhasil terkirim! Kami akan segera membalas. 📩', 'success');
  }, 1500);
}

function copyPhone() {
  navigator.clipboard.writeText('0812-3456-7890').then(() => {
    showToast('Nomor HP disalin ke clipboard! 📋', 'success');
  }).catch(() => {
    showToast('Nomor: 0812-3456-7890', '');
  });
}

function bukaWA() {
  window.open('https://wa.me/6281234567890?text=Halo%20Mantap%20Gym%2C%20saya%20ingin%20tanya%20tentang%20membership.', '_blank');
  showToast('Membuka WhatsApp...', '');
}

function bukaMaps() {
  window.open('https://maps.google.com/?q=Jl.+Suhat+No.123+Malang', '_blank');
}

const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top');
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  navbar.classList.toggle('scrolled', y > 40);
  scrollTopBtn.classList.toggle('visible', y > 400);

  let current = '';
  sections.forEach(s => {
    if (y >= s.offsetTop - 100) current = s.id;
  });
  navItems.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  hamburger.innerHTML = open ? '&times;' : '&#9776;';
});

navItems.forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', false);
  hamburger.innerHTML = '&#9776;';
}));

const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));
