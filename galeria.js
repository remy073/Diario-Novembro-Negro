/* RAÍZES & VOZES — interação do álbum. Não é necessário cadastrar fotos aqui.
   O visualizador reutiliza automaticamente as imagens e legendas do HTML. */
const visor = document.querySelector('#visualizador');
const ampliada = document.querySelector('#foto-ampliada');
const trilho = visor.querySelector('.trilho');

function abrirAlbum(album, indice = 0) {
  visor.querySelector('h2').textContent = album.querySelector('h2').textContent;
  trilho.replaceChildren();
  album.querySelectorAll('.mosaico .foto').forEach(foto => {
    const item = document.createElement('button');
    item.type = 'button';
    const copia = foto.cloneNode(true);
    copia.removeAttribute('tabindex');
    copia.removeAttribute('role');
    const legenda = document.createElement('span');
    legenda.className = 'legenda';
    legenda.textContent = foto.querySelector('figcaption').textContent;
    item.append(copia, legenda);
    const img = copia.querySelector('img');
    const caminho = img && !img.hidden && img.getAttribute('src');
    item.addEventListener('click', () => {
      if (!caminho) { return; } // Espaço reservado: nenhuma foto cadastrada ainda.
      ampliada.querySelector('img').src = caminho;
      ampliada.querySelector('img').alt = img.alt;
      ampliada.querySelector('p').textContent = legenda.textContent;
      ampliada.showModal();
    });
    trilho.append(item);
  });
  visor.showModal();
  const alvo = trilho.children[indice];
  trilho.scrollTo({left: alvo.offsetLeft - trilho.offsetLeft, behavior:'instant'});
}

document.querySelectorAll('.album').forEach(album => {
  album.querySelector('.abrir-album').addEventListener('click', () => abrirAlbum(album));
  album.querySelectorAll('.mosaico .foto').forEach((foto, i) => {
    foto.tabIndex = 0;
    foto.setAttribute('role','button');
    foto.addEventListener('click', () => abrirAlbum(album,i));
    foto.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirAlbum(album,i); }
    });
  });
});
// As setas apenas deslocam a faixa de fotos; o toque funciona nativamente.
visor.querySelector('.anterior').onclick = () => trilho.scrollBy({left:-trilho.clientWidth*.8});
visor.querySelector('.seguinte').onclick = () => trilho.scrollBy({left:trilho.clientWidth*.8});
for (const janela of [visor, ampliada]) {
  janela.querySelector('.fechar').onclick = () => janela.close();
  janela.addEventListener('click', e => { if (e.target === janela) { const r = janela.getBoundingClientRect(); if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom) janela.close(); } });
}
