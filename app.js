// =========================
// CONFIGURAÇÕES INICIAIS
// =========================
let cfg = { dark: false, name: '', greet: '' };
let tasks = [], notes = [], events = {}, habits = [], conquistas = [];
let tutorialShown = localStorage.getItem('tutorialShown') === 'true';

// Carregar dados salvos
function load() {
  try { tasks = JSON.parse(localStorage.getItem('o_tasks')) || []; } catch(e){}
  try { notes = JSON.parse(localStorage.getItem('o_notes')) || []; } catch(e){}
  try { events = JSON.parse(localStorage.getItem('o_events')) || {}; } catch(e){}
  try { habits = JSON.parse(localStorage.getItem('o_habits')) || []; } catch(e){}
  try { conquistas = JSON.parse(localStorage.getItem('o_conquistas')) || []; } catch(e){}
}
function save() {
  localStorage.setItem('o_tasks', JSON.stringify(tasks));
  localStorage.setItem('o_notes', JSON.stringify(notes));
  localStorage.setItem('o_events', JSON.stringify(events));
  localStorage.setItem('o_habits', JSON.stringify(habits));
  localStorage.setItem('o_conquistas', JSON.stringify(conquistas));
}

// =========================
// TUTORIAL INICIAL
// =========================
function showTutorial() {
  if (!tutorialShown) {
    document.getElementById('tutorial').classList.add('active');
  }
}
function closeTutorial() {
  document.getElementById('tutorial').classList.remove('active');
  localStorage.setItem('tutorialShown', 'true');
  tutorialShown = true;
}
window.onload = showTutorial;

// =========================
// GESTOS DE DESLIZAR NA AGENDA
// =========================
let startX = 0, startY = 0;
document.getElementById('sec-agenda').addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});
document.getElementById('sec-agenda').addEventListener('touchend', e => {
  let dx = e.changedTouches[0].clientX - startX;
  let dy = e.changedTouches[0].clientY - startY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (Math.abs(dx) > 50) {
      if (e.target.closest('#cal-main')) {
        // deslizar dentro da agenda → troca mês/semana/dia
        if (dx > 0) prevPeriod(); else nextPeriod();
      } else {
        // deslizar fora → troca aba
        if (dx > 0) swTab('tasks', document.getElementById('tb-tasks'));
        else swTab('notes', document.getElementById('tb-notes'));
      }
    }
  }
});

// =========================
// EXCLUSÃO COM CONFIRMAÇÃO
// =========================
function confirmDelete(type, id) {
  if (confirm("Deseja realmente excluir este " + type + "?")) {
    if (type === 'tarefa') tasks = tasks.filter(t => t.id !== id);
    if (type === 'evento') delete events[id];
    if (type === 'nota') notes = notes.filter(n => n.id !== id);
    save();
    renderAll();
  }
}

// =========================
// SALVAMENTO AUTOMÁTICO DE NOTAS
// =========================
document.addEventListener('backbutton', function() {
  if (document.getElementById('nev').classList.contains('open')) {
    saveNote();
    closeNote();
  }
}, false);

// =========================
// HÁBITOS + EMOJIS + SUGESTÕES
// =========================
const habitEmojis = ['💪','📚','🧘','🥗','🚰','🏃','🛏️','🧹','🎧','✍️','🕹️','🎨'];
const habitSugestoes = ['Beber 2L de água','Ler 20 páginas','Meditar 10 min','Caminhar 30 min','Dormir antes das 23h'];

function renderHabitForm() {
  let body = document.getElementById('hf-body');
  body.innerHTML = `
    <div>
      <label>Nome do hábito</label>
      <input type="text" id="habit-name"/>
    </div>
    <div>
      <label>Emoji</label>
      <div>${habitEmojis.map(e=>`<button onclick="setHabitEmoji('${e}')">${e}</button>`).join('')}</div>
      <input type="text" id="habit-emoji" placeholder="Ou insira manualmente"/>
    </div>
    <div>
      <label>Sugestões</label>
      <ul>${habitSugestoes.map(s=>`<li onclick="setHabitSugestao('${s}')">${s}</li>`).join('')}</ul>
    </div>
  `;
}
function setHabitEmoji(e){ document.getElementById('habit-emoji').value = e; }
function setHabitSugestao(s){ document.getElementById('habit-name').value = s; }

// =========================
// CONQUISTAS / BADGES
// =========================
const badgesDisponiveis = [
  {id:'h10', titulo:'10 hábitos concluídos'},
  {id:'h30', titulo:'30 dias consecutivos'},
  {id:'h50', titulo:'50 hábitos concluídos'},
  {id:'d5', titulo:'5 dias consecutivos'}
];

function checkBadges() {
  let concluidos = habits.filter(h=>h.done).length;
  if (concluidos >= 10 && !conquistas.includes('h10')) conquistas.push('h10');
  if (concluidos >= 50 && !conquistas.includes('h50')) conquistas.push('h50');
  save();
}

function openConquistas() {
  let html = '<h2>Conquistas</h2>';
  badgesDisponiveis.forEach(b=>{
    let conquistada = conquistas.includes(b.id);
    html += `<div>${conquistada ? '🏅' : '⚪'} ${b.titulo}</div>`;
  });
  alert(html);
}

// =========================
// RENDERIZAÇÃO
// =========================
function renderAll() {
  // aqui você chama suas funções originais de renderização
  // ex: renderTasks(), renderNotes(), renderAgenda(), renderHabits()
