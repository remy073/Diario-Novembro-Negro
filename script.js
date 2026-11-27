/* ===============================================================
   RAÍZES & VOZES — SCRIPT.JS

   O JavaScript controla:
   1. Abertura e fechamento do formulário
   2. Criação dos registros e formatação das datas
   3. Salvamento no navegador (localStorage)
   4. Botão "Ver registros anteriores"
   5. Destaque do menu de navegação

   IMPORTANTE: localStorage guarda dados apenas neste navegador.
   Não é um banco de dados nem sincroniza entre dispositivos.
   =============================================================== */

// 01. ELEMENTOS DO HTML E CHAVE DO ARMAZENAMENTO
const modal = document.getElementById('modal-backdrop');
const form = document.getElementById('entry-form');
const entryList = document.getElementById('entry-list');
const storageKey = 'raizes-vozes-registros-v1';

// 02. ABRIR / FECHAR O FORMULÁRIO
function openModal() {
  modal.hidden = false;
  document.getElementById('entry-title').focus();
}
function closeModal() { modal.hidden = true; }
document.getElementById('new-entry').addEventListener('click', openModal);
document.getElementById('cancel-entry').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });

// 03. FORMATAR A DATA E MONTAR O HTML DE UM REGISTRO
function formattedDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric', weekday: 'long'
  }).toLocaleUpperCase('pt-BR');
}
function createEntry(entry, insertAtTop = true) {
  const article = document.createElement('article');
  article.className = 'entry';
  const date = document.createElement('p');
  date.className = 'entry-date';
  date.textContent = formattedDate(entry.date);
  const heading = document.createElement('h3');
  heading.textContent = entry.title;
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = entry.category;
  const description = document.createElement('p');
  description.className = 'entry-description';
  description.textContent = entry.description;
  const footer = document.createElement('div');
  footer.className = 'entry-footer';
  const footLeft = document.createElement('span');
  footLeft.textContent = '✎ Registro pessoal';
  const footRight = document.createElement('span');
  footRight.textContent = entry.date.split('-').reverse().join('/');
  footer.append(footLeft, footRight);
  article.append(date, heading, tag, description, footer);
  if (insertAtTop) entryList.prepend(article); else entryList.append(article);
  return article;
}
// 04. LER REGISTROS SALVOS NO NAVEGADOR
function readStoredEntries() {
  try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); }
  catch { return []; }
}
readStoredEntries().slice().reverse().forEach((entry) => createEntry(entry));

// 05. SALVAR UM NOVO REGISTRO
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const entry = {
    title: document.getElementById('entry-title').value.trim(),
    date: document.getElementById('entry-date').value,
    category: document.getElementById('entry-category').value,
    description: document.getElementById('entry-description').value.trim()
  };
  if (!entry.title || !entry.date || !entry.description) return;
  createEntry(entry);
  try {
    const entries = readStoredEntries();
    entries.push(entry);
    localStorage.setItem(storageKey, JSON.stringify(entries));
  } catch (error) { console.warn('Não foi possível salvar localmente:', error); }
  form.reset();
  closeModal();
  document.getElementById('registros').scrollIntoView({ behavior: 'smooth' });
});

// 06. MOSTRAR UM REGISTRO ANTIGO DE EXEMPLO
const more = document.getElementById('load-more');
more.addEventListener('click', () => {
  const article = createEntry({
    title: 'O início das atividades',
    date: '2026-11-12',
    category: 'Atividade',
    description: 'Começamos a organizar nossos estudos sobre a história, a identidade e as contribuições da população negra para a sociedade brasileira.'
  }, false);
  more.disabled = true;
  more.textContent = 'Todos os registros de exemplo exibidos';
  article.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// 07. MARCAR O ITEM DE MENU SELECIONADO
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'));
    link.classList.add('active');
  });
});
