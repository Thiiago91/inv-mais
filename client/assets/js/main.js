/*=============== SHOW SIDEBAR ===============*/
const showSidebar = (toggleId, sidebarId, headerId, mainId) => {
    const toggle = document.getElementById(toggleId),
        sidebar = document.getElementById(sidebarId),
        header = document.getElementById(headerId),
        main = document.getElementById(mainId);

    if (toggle && sidebar && header && main) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('show-sidebar');
            document.body.classList.toggle('sidebar-expanded');
            header.classList.toggle('left-pd');
            main.classList.toggle('left-pd');
        });
    }
};
showSidebar('header-toggle', 'sidebar', 'header', 'main');

/*=============== LINK ACTIVE ===============*/
document.querySelectorAll('.sidebar__list a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.sidebar__list a').forEach(l => l.classList.remove('active-link'));
        this.classList.add('active-link');
    });
});

/*=============== DARK LIGHT THEME ===============*/
const themeButton = document.getElementById('theme-button');
const darkTheme = 'dark-theme';
const iconTheme = 'ri-sun-fill';
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-clear-fill' : 'ri-sun-fill';

if (localStorage.getItem('selected-theme')) {
    document.body.classList[localStorage.getItem('selected-theme') === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[localStorage.getItem('selected-icon') === 'ri-moon-clear-fill' ? 'add' : 'remove'](iconTheme);
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
});

/*============================ PARTE ABA ADICIONAR ===========================*/

/* ——————— script.js (versão completa) ——————— */
document.addEventListener('DOMContentLoaded', () => {
  /* ───────── Elementos ─────── */
  const btnAdd          = document.querySelector('.header__add-icon');
  const overlay         = document.getElementById('overlay');
  const modal           = document.getElementById('modalAdicionarAtivo');
  const btnClose        = document.getElementById('closeModalBtn');
  const dataCompraInput = document.getElementById('dataCompra');
  const btnCancelar     = document.querySelector('.modal__actions .cancelar');
  const btnSalvar       = document.querySelector('.modal__actions .salvar');
  const valInput        = document.getElementById('valorAtivo');
  const qtdInput        = document.getElementById('quantidadeAtivo');
  const nomeInput       = document.getElementById('nomeAtivo');
  const totalSpanModal  = document.querySelector('.valor-total span');
  const spanAplicado    = document.querySelector('.valor__aplicado .value');
  const spanHeaderTot   = document.querySelector('.valor__total .value-total');
  const tbody           = document.querySelector('#tabela-ativos tbody');
  const ctx             = document.getElementById('donutChart').getContext('2d');

  /* ───────── Estado ─────── */
  let lista = [];            // [{nome,qtd,valorAtual,precoMedio,valorTotal}]
  let editando = null;       // ref. ao objeto em edição

/* ───────── Gráfico (inicia vazio, sem legenda, tooltip em %) ─────── */
const chart = new Chart(ctx, {
  type: 'doughnut',
  data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
  options: {
    cutout: '60%',
    plugins: {
      legend: { display: false },            // não exibe rótulos sob o gráfico
      tooltip: {
        callbacks: {
          label: ctx => {
            const valor = ctx.raw;
            const total = ctx.dataset.data.reduce((s,v) => s+v, 0);
            const pct   = total ? (valor / total) * 100 : 0;
            return `${pct.toFixed(1)} %`;
          }
        }
      }
    }
  }
});



  /* ───────── Util ─────── */
  const moeda = v => new Intl.NumberFormat('pt-BR',
      {style:'currency',currency:'BRL',minimumFractionDigits:2}).format(v);

  const calcValor   = (q,p) => (!isNaN(q)&&!isNaN(p)? q*p : 0);
  const corAleatoria = () => `hsl(${Math.random()*360} 70% 50%)`;

  /* ───────── Modal helpers ─────── */
  const atualizaTotalModal = () => {
    const q = parseFloat(qtdInput.value);
    const p = parseFloat(valInput.value.replace(/[^\d,.]/g,'').replace(',','.'));
    totalSpanModal.textContent = moeda(calcValor(q,p));
  };

  const resetModal = () => {
    nomeInput.value = '';
    qtdInput.value  = '';
    valInput.value  = '';
    dataCompraInput.value = '';
    totalSpanModal.textContent = moeda(0);
    editando = null;
  };

  /* ───────── Header total ─────── */
  const atualizaHeader = () => {
    const soma = [...tbody.rows].reduce((s,row)=>{
      const v = parseFloat(row.cells[4].innerText
                 .replace('R$','').trim().replace(/\./g,'').replace(',','.'));
      return s+v;
    },0);
    spanAplicado.textContent = moeda(soma);
    spanHeaderTot.textContent = moeda(soma);
  };

  /* ───────── Render linha + atualizar gráfico ─────── */
  const renderLinha = obj => {
    let row = [...tbody.rows].find(r => r.dataset.nomeAtivo === obj.nome);
    if (!row) {
      row = tbody.insertRow();
      row.dataset.nomeAtivo = obj.nome;
      for (let i = 0; i < 5; i++) row.insertCell();
      const acoes = row.insertCell();
      acoes.classList.add('acoes-cell');
      acoes.innerHTML = `
        <i class="ri-pencil-line acao-botao editar-botao"></i>
        <i class="ri-delete-bin-line acao-botao excluir-botao"></i>`;
    }
    row.cells[0].innerText = obj.nome;
    row.cells[1].innerText = obj.quantidade;
    row.cells[2].innerText = moeda(obj.valorAtual);
    row.cells[3].innerText = moeda(obj.precoMedio);
    row.cells[4].innerText = moeda(obj.valorTotal);

    // —— Atualiza gráfico ——
    const idx = chart.data.labels.indexOf(obj.nome);
    if (idx === -1) {                          // novo ativo
        chart.data.labels.push(obj.nome);
        chart.data.datasets[0].data.push(obj.valorTotal);
        chart.data.datasets[0].backgroundColor.push(corVariada());  // ← aqui
    } else {
        chart.data.datasets[0].data[idx] = obj.valorTotal;
    }
    chart.update();
  };
    /* ───────── Cor aleatória ─────── */
let proxHue = 0;
const corVariada = () => {
  const h = proxHue;
  proxHue = (proxHue + 45) % 360;   // avança 45 graus no círculo de cores
  return `hsl(${h} 70% 50%)`;
};


  /* ───────── Adiciona / soma compras ─────── */
  const adicionarOuSomar = ({nome,quantidade,valorAtual}) => {
    let obj = lista.find(a => a.nome === nome);
    if (obj) {
      const totalAnt  = obj.precoMedio * obj.quantidade;
      const totalNovo = quantidade * valorAtual;

      obj.quantidade += quantidade;
      obj.valorAtual  = valorAtual;
      obj.precoMedio  = (totalAnt + totalNovo) / obj.quantidade;
      obj.valorTotal += totalNovo;
    } else {
      obj = {
        nome,
        quantidade,
        valorAtual,
        precoMedio : valorAtual,
        valorTotal : quantidade * valorAtual
      };
      lista.push(obj);
    }
    renderLinha(obj);
    atualizaHeader();
  };

  /* ───────── Eventos Tabela ─────── */
  tbody.addEventListener('click', e=>{
    const row = e.target.closest('tr');
    if (!row) return;
    const nome = row.dataset.nomeAtivo;

    /* Excluir */
    if (e.target.classList.contains('excluir-botao')) {
      lista = lista.filter(a => a.nome !== nome);
      row.remove();

      // remove do gráfico
      const idx = chart.data.labels.indexOf(nome);
      if (idx !== -1) {
        chart.data.labels.splice(idx,1);
        chart.data.datasets[0].data.splice(idx,1);
        chart.data.datasets[0].backgroundColor.splice(idx,1);
        chart.update();
      }

      atualizaHeader();
      return;
    }

    /* ==================== FUNÇÃO EDITAR ==================== */
    if (e.target.classList.contains('editar-botao')) {
      editando = lista.find(a => a.nome === nome);
      if (editando){
        nomeInput.value = editando.nome;
        qtdInput.value  = editando.quantidade;
        valInput.value  = editando.valorAtual.toString().replace('.',',');
        overlay.classList.add('active');
        modal.classList.add('active');
        atualizaTotalModal();
      }
    }
  });

  /* ───────── Botões de modal ─────── */
  const abrirModal = () => {
    const hoje = new Date();
    dataCompraInput.value =
      `${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,'0')}-${String(hoje.getDate()).padStart(2,'0')}`;
    overlay.classList.add('active');
    modal.classList.add('active');
    atualizaTotalModal();
  };
  btnAdd.addEventListener('click', abrirModal);
  [btnClose, btnCancelar].forEach(b=>b.addEventListener('click', ()=>{
    overlay.classList.remove('active');
    modal.classList.remove('active');
    resetModal();
  }));

  /* ───────── Salvar ─────── */
  btnSalvar.addEventListener('click', e=>{
    e.preventDefault();
    const nome = nomeInput.value.trim();
    const qtd  = parseInt(qtdInput.value.trim());
    const val  = parseFloat(valInput.value.replace(/[^\d,.]/g,'').replace(',','.'));

    if (!nome || isNaN(qtd) || isNaN(val)) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    if (editando) {
      editando.quantidade = qtd;
      editando.valorAtual = val;
      editando.precoMedio = val;
      editando.valorTotal = qtd * val;
      renderLinha(editando);
      atualizaHeader();
    } else {
      adicionarOuSomar({nome, quantidade:qtd, valorAtual:val});
    }

    overlay.classList.remove('active');
    modal.classList.remove('active');
    resetModal();
  });

  /* ───────── Inputs dinâmicos ─────── */
  qtdInput.addEventListener('input', atualizaTotalModal);
  valInput.addEventListener('input', atualizaTotalModal);
  nomeInput.addEventListener('input', ()=>{
    nomeInput.value = nomeInput.value.toUpperCase().replace(/[^A-Z0-9]/g,'');
  });

  /* ───────── Inicialização ─────── */
  atualizaHeader();
});

 