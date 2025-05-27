let chartSummarySales, chartVendas, chartCategorias;

async function carregarDados() {
try {
const resposta = await fetch('https://localhost:7216/api/sales/summary');
if (!resposta.ok) throw new Error(`HTTP error! status: ${resposta.status}`);

const dados = await resposta.json();

const totalGeral = dados.reduce((acc, cur) => acc + Number(cur.total), 0);
document.getElementById('totalVendas').textContent = `$ ${totalGeral.toFixed(2)}`;

const mesAtual = new Date().getMonth() + 1;
const vendasMes = dados
  .filter(d => d.month === mesAtual)
  .reduce((acc, cur) => acc + Number(cur.total), 0);
document.getElementById('vendasMes').textContent = `$ ${vendasMes.toFixed(2)}`;


const ticketMedio = totalGeral / 30;
document.getElementById('ticketMedio').textContent = `$ ${ticketMedio.toFixed(2)}`;

//dados para os gráficos
const meses = dados.map(d => d.monthName);
const totais = dados.map(d => Number(d.total));

//atualiza / cria gráfico Summary Sales (barrinha)
if (chartSummarySales) {
  chartSummarySales.data.labels = meses;
  chartSummarySales.data.datasets[0].data = totais;
  chartSummarySales.update();
} else {
  const ctx = document.getElementById('graficoSummarySales').getContext('2d');
  chartSummarySales = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: meses,
      datasets: [{
        label: 'Vendas Mensais ($)',
        data: totais,
        backgroundColor: ['#E91E63', '#6fea79', '#FF9800', '#2196F3'],
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, ticks: { color: '#fff', font: { weight: '600' } } },
        x: { ticks: { color: '#fff', font: { weight: '600' } } }
      },
      plugins: {
        legend: { display: true, labels: { color: '#fff' } },
        tooltip: { enabled: true }
      }
    }
  });
}

//atualiza / cria gráfico de vendas gerais (linha)
if (chartVendas) {
  chartVendas.data.labels = meses;
  chartVendas.data.datasets[0].data = totais;
  chartVendas.update();
} else {
  const ctx = document.getElementById('graficoVendas').getContext('2d');
  chartVendas = new Chart(ctx, {
    type: 'line',
    data: {
      labels: meses,
      datasets: [{
        label: 'Vendas Gerais',
        data: totais,
        fill: true,
        backgroundColor: 'rgba(41, 231, 248, 0.3)',
        borderColor: '#304fff',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, ticks: { color: '#fff', font: { weight: '600' } } },
        x: { ticks: { color: '#fff', font: { weight: '600' } } }
      },
      plugins: {
        legend: { display: true, labels: { color: '#fff' } },
        tooltip: { enabled: true }
      }
    }
  });
}

} catch (error) {
console.error('Erro ao carregar dados:', error);
alert('Não foi possível carregar os dados do dashboard.');
}
}


//grafico pizza
function criarGraficoCategorias() {
const categorias = ['Eletrônicos', 'Roupas', 'Alimentos', 'Casa'];
const vendasCategorias = [4000, 3000, 2500, 1500];

const ctx = document.getElementById('graficoCategorias').getContext('2d');
chartCategorias = new Chart(ctx, {
type: 'doughnut',
data: {
  labels: categorias,
  datasets: [{
    label: 'Vendas por Categoria',
    data: vendasCategorias,
    backgroundColor: ['#E91E63', '#6fea79', '#FF9800', '#2196F3'],
    hoverOffset: 30
  }]
},
options: {
  responsive: true,
  plugins: {
    legend: { position: 'right', labels: { color: '#304ffe', font: { weight: '600' } } },
    tooltip: { enabled: true }
  }
}
});
}

document.getElementById("formGasto").addEventListener("submit", async (e) => {
e.preventDefault();
const novoGasto = {
description: document.getElementById("descricao").value,
total: parseFloat(document.getElementById("valor").value),
date: document.getElementById("data").value,
};

try {
const resposta = await fetch("https://localhost:7216/api/sales", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(novoGasto)
});

if (!resposta.ok) throw new Error("Erro ao adicionar gasto.");

await carregarDados();
e.target.reset();

} catch (error) {
alert(error.message);
}
});

window.onload = () => {
carregarDados();
criarGraficoCategorias();
};

//PDF 
document.getElementById("export-table-pdf").addEventListener("click", async () => {
  const response = await fetch("https://localhost:7216/api/sales");
  const data = await response.json();

  const formatador = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD'
  });

  const rows = data.map((item) => [
    item.description || "–",
    formatador.format(parseFloat(item.total) || 0),
    new Date(item.date).toLocaleDateString('pt-BR')
  ]);

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Relatório de Transações", 14, 15);
  doc.autoTable({
    startY: 20,
    head: [["Descrição", "Valor", "Data"]],
    body: rows,
    theme: "striped"
  });

  doc.save("relatorio-vendas.pdf");
});

