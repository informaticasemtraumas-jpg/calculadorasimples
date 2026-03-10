// script.js - Versão Sincronizada com index.html
console.log("Calculadora de Páscoa: Iniciada!");

document.addEventListener('DOMContentLoaded', function() {
    // Seleção de elementos principais
    const btnCalcular = document.getElementById('btnCalcular');
    const btnBaixarPDF = document.getElementById('btnBaixarPDF');
    const btnSimularOutro = document.getElementById('btnSimularOutro');
    const blocoResultado = document.getElementById('bloco-resultado');
    const modoBtns = document.querySelectorAll('.mode-btn');

    // 1. Alternar entre Modo Simples e Avançado
    modoBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            modoBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const modo = this.getAttribute('data-mode');
            const camposAvancados = document.querySelectorAll('.avancado-only');
            
            camposAvancados.forEach(campo => {
                // Se for uma linha (form-row), usamos flex/grid, senão block
                if (modo === 'avancado') {
                    campo.style.display = campo.classList.contains('form-row') ? 'flex' : 'block';
                } else {
                    campo.style.display = 'none';
                }
            });
        });
    });

    // 2. Função de Formatação de Moeda
    const formatarMoeda = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // 3. Lógica de Cálculo
    function realizarCalculo() {
        try {
            // Coleta de dados do HTML
            const pesoCasca = parseFloat(document.getElementById('pesoCasca').value) || 0;
            const pesoRecheio = parseFloat(document.getElementById('pesoRecheio').value) || 0;
            const custoCasca = parseFloat(document.getElementById('custoCasca').value) || 0;
            const custoRecheio = parseFloat(document.getElementById('custoRecheio').value) || 0;
            const custoEmbalagem = parseFloat(document.getElementById('custoEmbalagem').value) || 0;
            const tempoProducao = parseFloat(document.getElementById('tempoProducao').value) || 0;
            const valorHora = parseFloat(document.getElementById('valorHora').value) || 0;
            const margemLucro = parseFloat(document.getElementById('margemLucro').value) || 0;

            // Dados Avançados
            const pesoDecoracao = parseFloat(document.getElementById('pesoDecoracao')?.value || 0);
            const custoDecoracao = parseFloat(document.getElementById('custoDecoracao')?.value || 0);
            const custoColher = parseFloat(document.getElementById('custoColher')?.value || 0);
            const custoFitaTag = parseFloat(document.getElementById('custoFitaTag')?.value || 0);
            const outrosCustos = parseFloat(document.getElementById('outrosCustos')?.value || 0);
            const custoGasEnergia = parseFloat(document.getElementById('custoGasEnergia')?.value || 0);
            const custoAguaLimpeza = parseFloat(document.getElementById('custoAguaLimpeza')?.value || 0);
            const custoFixoMensal = parseFloat(document.getElementById('custoFixoMensal')?.value || 0);
            const quantidadeMedia = parseFloat(document.getElementById('quantidadeMedia')?.value || 1);
            const taxaMaquininha = parseFloat(document.getElementById('taxaMaquininha')?.value || 0);
            const percentualPerdas = parseFloat(document.getElementById('percentualPerdas')?.value || 0);
            const taxaEntrega = parseFloat(document.getElementById('taxaEntrega')?.value || 0);
            const descontoPromocional = parseFloat(document.getElementById('descontoPromocional')?.value || 0);

            // Cálculos
            const custoIngredientes = ((pesoCasca / 1000) * custoCasca) + 
                                    ((pesoRecheio / 1000) * custoRecheio) + 
                                    ((pesoDecoracao / 1000) * custoDecoracao);
            
            const custoEmbalagemTotal = custoEmbalagem + custoColher + custoFitaTag + outrosCustos;
            const custoMaoObra = (tempoProducao / 60) * valorHora;
            const custoFixoRateado = custoFixoMensal / (quantidadeMedia || 1);
            
            const subtotal = custoIngredientes + custoEmbalagemTotal + custoMaoObra + custoFixoRateado + custoGasEnergia + custoAguaLimpeza;
            const custoRealTotal = subtotal * (1 + (percentualPerdas / 100));
            
            // Preço Sugerido com Margem e Taxas
            const precoSugerido = (custoRealTotal + taxaEntrega) / (1 - ((margemLucro + taxaMaquininha) / 100));
            const precoFinal = precoSugerido * (1 - (descontoPromocional / 100));
            const lucro = precoFinal - (precoFinal * (taxaMaquininha / 100)) - custoRealTotal;

            // Exibir Resultados
            document.getElementById('custoIngredientes').textContent = formatarMoeda(custoIngredientes);
            document.getElementById('custoEmbalagemTotal').textContent = formatarMoeda(custoEmbalagemTotal);
            document.getElementById('custoMaoObra').textContent = formatarMoeda(custoMaoObra);
            document.getElementById('custoRealTotal').textContent = formatarMoeda(custoRealTotal);
            document.getElementById('precoSugerido').textContent = formatarMoeda(precoFinal);
            document.getElementById('lucroUnidade').textContent = formatarMoeda(lucro);
            
            if (document.getElementById('custoFixoRateado')) {
                document.getElementById('custoFixoRateado').textContent = formatarMoeda(custoFixoRateado);
            }

            // Mostrar bloco de resultado
            blocoResultado.style.display = 'block';
            blocoResultado.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error("Erro no cálculo:", error);
            alert("Erro ao calcular. Verifique se os campos estão preenchidos corretamente.");
        }
    }

    // 4. Eventos dos Botões
    if (btnCalcular) btnCalcular.addEventListener('click', realizarCalculo);

    if (btnSimularOutro) {
        btnSimularOutro.addEventListener('click', function() {
            blocoResultado.style.display = 'none';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (btnBaixarPDF) {
        btnBaixarPDF.addEventListener('click', function() {
            const element = document.getElementById('bloco-resultado');
            const nomeProd = document.getElementById('nomeProduto').value || 'Ovo de Pascoa';
            
            const opt = {
                margin: 10,
                filename: `Orcamento_${nomeProd}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            
            if (typeof html2pdf !== 'undefined') {
                html2pdf().set(opt).from(element).save();
            } else {
                alert("Biblioteca de PDF ainda carregando. Tente em instantes.");
            }
        });
    }
});
