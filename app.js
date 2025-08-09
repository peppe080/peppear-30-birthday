
// Simple password gate (front-end only; not secure)
(function(){
  const gate = document.getElementById('password-gate');
  const input = document.getElementById('pw-input');
  const btn = document.getElementById('pw-btn');
  const correct = 'gin mare'; // case-insensitive compare

  function openSite(){
    gate.style.display = 'none';
    sessionStorage.setItem('peppear_access', '1');
  }

  if (sessionStorage.getItem('peppear_access') === '1') {
    gate.style.display = 'none';
  }

  btn.addEventListener('click', () => {
    const val = (input.value || '').trim().toLowerCase();
    if (val === correct) {
      openSite();
    } else {
      btn.textContent = 'Password errata';
      setTimeout(()=> btn.textContent = 'Entra', 1500);
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btn.click();
  });
})();

// Checklist state with localStorage
(function(){
  const boxes = document.querySelectorAll('[data-check]');
  boxes.forEach((box) => {
    const key = 'peppear_check_' + box.id;
    const saved = localStorage.getItem(key);
    if (saved === '1') box.checked = true;
    box.addEventListener('change', () => {
      localStorage.setItem(key, box.checked ? '1' : '0');
    })
  })
})();

// Sondaggio ironico (simple client-side tally)
(function(){
  const form = document.getElementById('poll-form');
  const resultEl = document.getElementById('poll-results');
  const key = 'peppear_poll';
  const data = JSON.parse(localStorage.getItem(key) || '{"A":0,"B":0,"C":0,"D":0,"voted":false}');

  if (data.voted) {
    showResults();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (data.voted) return;
    const choice = form.querySelector('input[name=opt]:checked');
    if (!choice) return;
    data[choice.value]++;
    data.voted = true;
    localStorage.setItem(key, JSON.stringify(data));
    showResults();
  });

  function showResults(){
    form.querySelectorAll('input').forEach(i => i.disabled = true);
    const total = (data.A + data.B + data.C + data.D) || 1;
    resultEl.textContent = 'Risultati locali: ' +
      `A: ${Math.round(100*data.A/total)}% · ` +
      `B: ${Math.round(100*data.B/total)}% · ` +
      `C: ${Math.round(100*data.C/total)}% · ` +
      `D: ${Math.round(100*data.D/total)}%`;
  }
})();
