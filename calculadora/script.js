// ============================================
// CALCULADORA DE PREÇOS - OVOS DE PÁSCOA
// ============================================

class CalculadoraOvos {
    constructor() {
        this.modo = 'simples';
        this.inicializar();
    }

    inicializar() {
        this.selecionarElementos();
        this.adicionarEventos();
        // Forçar modo inicial
        this.alternarModo('simples');
    }

    selecionarElementos() {
        // Botões de modo
        this.modoBtns = document.querySelectorAll('.mode-btn');
        
        // Formulário
        this.form = document.getElementById('calculadoraForm');
        this.btnCalcular = document.getElementById('btnCalcular');
        this.btnSimularOutro = document.getElementById('btnSimularOutro');
        this.btnBaixarPDF = document.getElementById('btnBaixarPDF');
        
        // Campos simples
        this.nomeProduto = document.getElementById('nomeProduto');
        this.pesoCasca = document.getElementById('pesoCasca');
        this.pesoRecheio = document.getElementById('pesoRecheio');
        this.custoCasca = document.getElementById('custoCasca');
        this.custoRecheio = document.getElementById('custoRecheio');
        this.custoEmbalagem = document.getElementById('custoEmbalagem');
        this.tempoProducao = document.getElementById('tempoProducao');
        this.valorHora = document.getElementById('valorHora');
        this.margemLucro = document.getElementById('margemLucro');
        
        // Campos avançados
        this.pesoDecoracao = document.getElementById('pesoDecoracao');
        this.custoDecoracao = document.getElementById('custoDecoracao');
        this.custoColher = document.getElementById('custoColher');
        this.custoFitaTag = document.getElementById('custoFitaTag');
        this.outrosCustos = document.getElementById('outrosCustos');
        this.custoGasEnergia = document.getElementById('custoGasEnergia');
        this.custoAguaLimpeza = document.getElementById('custoAguaLimpeza');
        this.custoFixoMensal = document.getElementById('custoFixoMensal');
        this.quantidadeMedia = document.getElementById('quantidadeMedia');
        this.taxaMaquininha = document.getElementById('taxaMaquininha');
        this.percentualPerdas = document.getElementById('percentualPerdas');
        this.taxaEntrega = document.getElementById('taxaEntrega');
        this.descontoPromocional = document.getElementById('descontoPromocional');
        
        // Seções de resultado
        this.blocoResultado = document.getElementById('bloco-resultado');
        this.avisos = document.getElementById('avisos');
        
        // Valores de resultado
        this.custoIngredientes = document.getElementById('custoIngredientes');
        this.custoEmbalagemTotal = document.getElementById('custoEmbalagemTotal');
        this.custoMaoObra = document.getElementById('custoMaoObra');
        this.custoFixoRateado = document.getElementById('custoFixoRateado');
        this.custoRealTotal = document.getElementById('custoRealTotal');
        this.precoMinimo = document.getElementById('precoMinimo');
        this.precoSugerido = document.getElementById('precoSugerido');
        this.lucroUnidade = document.getElementById('lucroUnidade');
        this.margemFinal = document.getElementById('margemFinal');
    }

    adicionarEventos() {
        // Toggle de modo
        this.modoBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.alternarModo(e.target.dataset.mode);
            });
        });
        
        // Botão calcular
        if (this.btnCalcular) {
            this.btnCalcular.addEventListener('click', (e) => {
                e.preventDefault();
                this.calcular();
            });
        }
        
        // Botão baixar PDF
        if (this.btnBaixarPDF) {
            this.btnBaixarPDF.addEventListener('click', (e) => {
                e.preventDefault();
                this.gerarPDF();
            });
        }
        
        // Botão simular outro
        if (this.btnSimularOutro) {
            this.btnSimularOutro.addEventListener('click', (e) => {
                e.preventDefault();
                this.blocoResultado.style.display = 'none';
                this.form.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // Enter no formulário
        this.form.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.calcular();
            }
        });

        // Evento de reset do formulário
        this.form.addEventListener('reset', () => {
            setTimeout(() => {
                this.blocoResultado.style.display = 'none';
                this.avisos.innerHTML = '';
                this.avisos.classList.remove('ativo');
                this.alternarModo('simples');
            }, 10);
        });

        // Atualização automática ao digitar
        this.form.addEventListener('input', () => {
            if (this.blocoResultado.style.display === 'block') {
                this.calcular();
            }
        });
    }

    alternarModo(novoModo) {
        this.modo = novoModo;
        
        // Atualizar botões
        this.modoBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === novoModo) {
                btn.classList.add('active');
            }
        });
        
        // Mostrar/ocultar campos avançados
        const camposAvancados = document.querySelectorAll('.avancado-only');
        camposAvancados.forEach(campo => {
            if (novoModo === 'avancado') {
                // Se for uma row do formulário, usa grid, senão block
                if (campo.classList.contains('form-row')) {
                    campo.style.display = 'grid';
                } else {
                    campo.style.display = 'block';
                }
            } else {
                campo.style.display = 'none';
            }
        });

        // Se já houver resultado, recalcula para o novo modo
        if (this.blocoResultado.style.display === 'block') {
            this.calcular();
        }
    }

    validar() {
        const erros = [];
        if (!this.pesoCasca.value || parseFloat(this.pesoCasca.value) <= 0) erros.push('Peso da casca é obrigatório');
        if (!this.pesoRecheio.value || parseFloat(this.pesoRecheio.value) <= 0) erros.push('Peso do recheio é obrigatório');
        if (!this.custoCasca.value || parseFloat(this.custoCasca.value) < 0) erros.push('Custo do chocolate é obrigatório');
        if (!this.custoRecheio.value || parseFloat(this.custoRecheio.value) < 0) erros.push('Custo do recheio é obrigatório');
        if (!this.tempoProducao.value || parseFloat(this.tempoProducao.value) <= 0) erros.push('Tempo de produção é obrigatório');
        if (!this.valorHora.value || parseFloat(this.valorHora.value) <= 0) erros.push('Valor da hora é obrigatório');
        
        if (erros.length > 0) {
            this.mostrarErro(erros);
            return false;
        }
        return true;
    }

    calcular() {
        if (!this.validar()) return;
        
        // Obter valores (garantindo 0 se vazio ou oculto)
        const pesoCasca = parseFloat(this.pesoCasca.value) || 0;
        const pesoRecheio = parseFloat(this.pesoRecheio.value) || 0;
        const pesoDecoracao = (this.modo === 'avancado') ? (parseFloat(this.pesoDecoracao.value) || 0) : 0;
        
        const custoCasca = parseFloat(this.custoCasca.value) || 0;
        const custoRecheio = parseFloat(this.custoRecheio.value) || 0;
        const custoDecoracao = (this.modo === 'avancado') ? (parseFloat(this.custoDecoracao.value) || 0) : 0;
        
        const custoEmbalagem = parseFloat(this.custoEmbalagem.value) || 0;
        const custoColher = (this.modo === 'avancado') ? (parseFloat(this.custoColher.value) || 0) : 0;
        const custoFitaTag = (this.modo === 'avancado') ? (parseFloat(this.custoFitaTag.value) || 0) : 0;
        const outrosCustos = (this.modo === 'avancado') ? (parseFloat(this.outrosCustos.value) || 0) : 0;
        
        const tempoProducao = parseFloat(this.tempoProducao.value) || 0;
        const valorHora = parseFloat(this.valorHora.value) || 0;
        
        const custoGasEnergia = (this.modo === 'avancado') ? (parseFloat(this.custoGasEnergia.value) || 0) : 0;
        const custoAguaLimpeza = (this.modo === 'avancado') ? (parseFloat(this.custoAguaLimpeza.value) || 0) : 0;
        const custoFixoMensal = (this.modo === 'avancado') ? (parseFloat(this.custoFixoMensal.value) || 0) : 0;
        const quantidadeMedia = (this.modo === 'avancado') ? (parseFloat(this.quantidadeMedia.value) || 1) : 1;
        
        const margemLucro = parseFloat(this.margemLucro.value) || 0;
        const taxaMaquininha = (this.modo === 'avancado') ? (parseFloat(this.taxaMaquininha.value) || 0) : 0;
        const percentualPerdas = (this.modo === 'avancado') ? (parseFloat(this.percentualPerdas.value) || 0) : 0;
        const taxaEntrega = (this.modo === 'avancado') ? (parseFloat(this.taxaEntrega.value) || 0) : 0;
        const descontoPromocional = (this.modo === 'avancado') ? (parseFloat(this.descontoPromocional.value) || 0) : 0;
        
        // Fórmulas
        const custoCascaTotal = (pesoCasca / 1000) * custoCasca;
        const custoRecheioTotal = (pesoRecheio / 1000) * custoRecheio;
        const custoDecoracao_Total = (pesoDecoracao / 1000) * custoDecoracao;
        const custoIngredientesTotal = custoCascaTotal + custoRecheioTotal + custoDecoracao_Total;
        
        const custoEmbalagemTotal_Calc = custoEmbalagem + custoColher + custoFitaTag + outrosCustos;
        const custoMaoObraTotal = (tempoProducao / 60) * valorHora;
        const custoFixoRateado_Calc = custoFixoMensal / (quantidadeMedia || 1);
        
        const subtotal = custoIngredientesTotal + custoEmbalagemTotal_Calc + custoGasEnergia + custoAguaLimpeza + custoMaoObraTotal + custoFixoRateado_Calc;
        const custoPerdasImprevistos = subtotal * (percentualPerdas / 100);
        const custoRealFinal = subtotal + custoPerdasImprevistos;
        
        const precoMinimoCalc = custoRealFinal / (1 - (taxaMaquininha / 100) || 1);
        const precoSugeridoCalc = (custoRealFinal + taxaEntrega) / (1 - ((margemLucro + taxaMaquininha) / 100) || 1);
        const precoComDesconto = precoSugeridoCalc * (1 - (descontoPromocional / 100));
        const precoFinal = this.arredondarComercial(precoComDesconto);
        
        const lucroUnidadeCalc = precoFinal - (precoFinal * (taxaMaquininha / 100)) - custoRealFinal;
        const margemPercentual = (lucroUnidadeCalc / precoFinal) * 100;
        
        // Atualizar Interface
        this.custoIngredientes.textContent = this.formatarMoeda(custoIngredientesTotal);
        this.custoEmbalagemTotal.textContent = this.formatarMoeda(custoEmbalagemTotal_Calc);
        this.custoMaoObra.textContent = this.formatarMoeda(custoMaoObraTotal);
        this.custoFixoRateado.textContent = this.formatarMoeda(custoFixoRateado_Calc);
        this.custoRealTotal.textContent = this.formatarMoeda(custoRealFinal);
        this.precoMinimo.textContent = this.formatarMoeda(precoMinimoCalc);
        this.precoSugerido.textContent = this.formatarMoeda(precoFinal);
        this.lucroUnidade.textContent = this.formatarMoeda(lucroUnidadeCalc);
        this.margemFinal.textContent = margemPercentual.toFixed(2) + '%';
        
        this.blocoResultado.style.display = 'block';
        this.verificarAvisos(custoRealFinal, precoFinal, margemPercentual, margemLucro);
    }

    verificarAvisos(custoReal, preco, margemReal, margemDesejada) {
        const avisos = [];
        if (preco < custoReal) avisos.push({ tipo: 'erro', mensagem: '⚠️ Preço abaixo do custo real!' });
        if (margemReal < (margemDesejada * 0.5)) avisos.push({ tipo: 'aviso', mensagem: '⚠️ Margem real muito abaixo da desejada.' });
        this.mostrarAvisos(avisos);
    }

    mostrarAvisos(avisos) {
        this.avisos.innerHTML = avisos.map(a => `<div class="aviso ${a.tipo}">${a.mensagem}</div>`).join('');
        this.avisos.classList.toggle('ativo', avisos.length > 0);
    }

    mostrarErro(erros) {
        alert('Por favor, preencha os campos obrigatórios:\n\n' + erros.join('\n'));
    }

    arredondarComercial(valor) {
        const inteiro = Math.floor(valor);
        const decimal = valor - inteiro;
        return (decimal < 0.90) ? inteiro + 0.90 : (inteiro + 1) + 0.90;
    }

    formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    }

    gerarPDF() {
        const nome = this.nomeProduto.value || 'Ovo de Páscoa';
        const data = new Date().toLocaleDateString('pt-BR');
        
        // Criar um container invisível para o PDF
        const element = document.createElement('div');
        element.style.padding = '40px';
        element.style.fontFamily = 'Arial, sans-serif';
        element.style.color = '#333';
        element.style.backgroundColor = '#fff';
        
        element.innerHTML = `
            <div style="text-align: center; border-bottom: 2px solid #6B3E26; padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="color: #6B3E26; margin: 0;">🍫 Relatório de Precificação</h1>
                <p style="color: #888; margin: 5px 0;">Gerado em ${data}</p>
            </div>
            
            <div style="background: #FDF5F0; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                <h2 style="margin-top: 0; color: #6B3E26;">📦 ${nome}</h2>
                <p><strong>Modo de Cálculo:</strong> ${this.modo.toUpperCase()}</p>
            </div>

            <h3 style="border-left: 4px solid #6B3E26; padding-left: 10px; color: #6B3E26;">📊 Resumo de Custos</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background: #f9f9f9;"><td style="padding: 10px; border: 1px solid #eee;">Ingredientes</td><td style="padding: 10px; border: 1px solid #eee; text-align: right;">${this.custoIngredientes.textContent}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #eee;">Embalagem</td><td style="padding: 10px; border: 1px solid #eee; text-align: right;">${this.custoEmbalagemTotal.textContent}</td></tr>
                <tr style="background: #f9f9f9;"><td style="padding: 10px; border: 1px solid #eee;">Mão de Obra</td><td style="padding: 10px; border: 1px solid #eee; text-align: right;">${this.custoMaoObra.textContent}</td></tr>
                ${this.modo === 'avancado' ? `<tr><td style="padding: 10px; border: 1px solid #eee;">Custos Fixos</td><td style="padding: 10px; border: 1px solid #eee; text-align: right;">${this.custoFixoRateado.textContent}</td></tr>` : ''}
                <tr style="background: #6B3E26; color: white;"><td style="padding: 10px; border: 1px solid #6B3E26;"><strong>CUSTO REAL TOTAL</strong></td><td style="padding: 10px; border: 1px solid #6B3E26; text-align: right;"><strong>${this.custoRealTotal.textContent}</strong></td></tr>
            </table>

            <h3 style="border-left: 4px solid #28a745; padding-left: 10px; color: #28a745;">💰 Sugestão de Venda</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="background: #f0fff0; padding: 20px; border-radius: 10px; text-align: center; border: 1px solid #28a745;">
                    <span style="font-size: 0.9rem; color: #666;">PREÇO SUGERIDO</span><br>
                    <strong style="font-size: 1.8rem; color: #28a745;">${this.precoSugerido.textContent}</strong>
                </div>
                <div style="background: #fff; padding: 20px; border-radius: 10px; text-align: center; border: 1px solid #eee;">
                    <span style="font-size: 0.9rem; color: #666;">LUCRO LÍQUIDO</span><br>
                    <strong style="font-size: 1.8rem; color: #333;">${this.lucroUnidade.textContent}</strong>
                </div>
            </div>
            
            <div style="margin-top: 40px; text-align: center; font-size: 0.8rem; color: #aaa; border-top: 1px solid #eee; padding-top: 20px;">
                Calculadora de Ovos de Páscoa - Organização e Lucro
            </div>
        `;

        const opt = {
            margin: 10,
            filename: `Relatorio-${nome.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };

        if (typeof html2pdf !== 'undefined') {
            html2pdf().set(opt).from(element).save();
        } else {
            alert('Erro: Biblioteca PDF não encontrada.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CalculadoraOvos();
});
