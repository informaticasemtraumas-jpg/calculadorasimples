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
        this.carregarValoresExemplo();
    }

    selecionarElementos() {
        // Botões de modo
        this.modoBtns = document.querySelectorAll('.mode-btn');
        
        // Formulário
        this.form = document.getElementById('calculadoraForm');
        this.btnCalcular = document.getElementById('btnCalcular');
        this.btnSimularOutro = document.getElementById('btnSimularOutro');
        
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
            btn.addEventListener('click', (e) => this.alternarModo(e.target.dataset.mode));
        });
        
        // Botão calcular
        this.btnCalcular.addEventListener('click', (e) => {
            e.preventDefault();
            this.calcular();
        });
        
        // Botão baixar PDF
        const btnBaixarPDF = document.getElementById('btnBaixarPDF');
        if (btnBaixarPDF) {
            btnBaixarPDF.addEventListener('click', () => this.gerarPDF());
        }
        
        // Botão simular outro
        this.btnSimularOutro.addEventListener('click', () => {
            this.blocoResultado.style.display = 'none';
            this.form.scrollIntoView({ behavior: 'smooth' });
        });
        
        // Enter no formulário
        this.form.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.calcular();
            }
        });
        
        // Atualização automática (opcional - comentado por padrão)
        // this.form.addEventListener('input', () => this.calcular());
    }

    carregarValoresExemplo() {
        // Valores já estão no HTML
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
                campo.classList.add('visible');
                if (campo.classList.contains('form-row')) {
                    campo.style.display = 'grid';
                } else if (campo.classList.contains('form-group')) {
                    campo.style.display = 'block';
                } else if (campo.classList.contains('resultado-item')) {
                    campo.style.display = 'block';
                }
            } else {
                campo.classList.remove('visible');
                campo.style.display = 'none';
            }
        });
    }

    validar() {
        const erros = [];
        
        // Validações obrigatórias
        if (!this.pesoCasca.value || parseFloat(this.pesoCasca.value) <= 0) {
            erros.push('Peso da casca é obrigatório e deve ser maior que 0');
        }
        if (!this.pesoRecheio.value || parseFloat(this.pesoRecheio.value) <= 0) {
            erros.push('Peso do recheio é obrigatório e deve ser maior que 0');
        }
        if (!this.custoCasca.value || parseFloat(this.custoCasca.value) < 0) {
            erros.push('Custo do chocolate é obrigatório e não pode ser negativo');
        }
        if (!this.custoRecheio.value || parseFloat(this.custoRecheio.value) < 0) {
            erros.push('Custo do recheio é obrigatório e não pode ser negativo');
        }
        if (!this.custoEmbalagem.value || parseFloat(this.custoEmbalagem.value) < 0) {
            erros.push('Custo da embalagem é obrigatório e não pode ser negativo');
        }
        if (!this.tempoProducao.value || parseFloat(this.tempoProducao.value) <= 0) {
            erros.push('Tempo de produção é obrigatório e deve ser maior que 0');
        }
        if (!this.valorHora.value || parseFloat(this.valorHora.value) <= 0) {
            erros.push('Valor da hora é obrigatório e deve ser maior que 0');
        }
        if (!this.margemLucro.value || parseFloat(this.margemLucro.value) < 0) {
            erros.push('Margem de lucro é obrigatória e não pode ser negativa');
        }
        
        if (erros.length > 0) {
            this.mostrarErro(erros);
            return false;
        }
        
        return true;
    }

    calcular() {
        if (!this.validar()) {
            return;
        }
        
        // Obter valores
        const pesoCasca = parseFloat(this.pesoCasca.value);
        const pesoRecheio = parseFloat(this.pesoRecheio.value);
        const pesoDecoracao = parseFloat(this.pesoDecoracao.value) || 0;
        
        const custoCasca = parseFloat(this.custoCasca.value);
        const custoRecheio = parseFloat(this.custoRecheio.value);
        const custoDecoracao = parseFloat(this.custoDecoracao.value) || 0;
        
        const custoEmbalagem = parseFloat(this.custoEmbalagem.value);
        const custoColher = parseFloat(this.custoColher.value) || 0;
        const custoFitaTag = parseFloat(this.custoFitaTag.value) || 0;
        const outrosCustos = parseFloat(this.outrosCustos.value) || 0;
        
        const tempoProducao = parseFloat(this.tempoProducao.value);
        const valorHora = parseFloat(this.valorHora.value);
        
        const custoGasEnergia = parseFloat(this.custoGasEnergia.value) || 0;
        const custoAguaLimpeza = parseFloat(this.custoAguaLimpeza.value) || 0;
        const custoFixoMensal = parseFloat(this.custoFixoMensal.value) || 0;
        const quantidadeMedia = parseFloat(this.quantidadeMedia.value) || 1;
        
        const margemLucro = parseFloat(this.margemLucro.value);
        const taxaMaquininha = parseFloat(this.taxaMaquininha.value) || 0;
        const percentualPerdas = parseFloat(this.percentualPerdas.value) || 0;
        const taxaEntrega = parseFloat(this.taxaEntrega.value) || 0;
        const descontoPromocional = parseFloat(this.descontoPromocional.value) || 0;
        
        // ============================================
        // FÓRMULAS DE CÁLCULO
        // ============================================
        
        // 1. Custo da casca
        const custoCascaTotal = (pesoCasca / 1000) * custoCasca;
        
        // 2. Custo do recheio
        const custoRecheioTotal = (pesoRecheio / 1000) * custoRecheio;
        
        // 3. Custo da decoração
        const custoDecoracao_Total = (pesoDecoracao / 1000) * custoDecoracao;
        
        // Custo total de ingredientes
        const custoIngredientesTotal = custoCascaTotal + custoRecheioTotal + custoDecoracao_Total;
        
        // 4. Custo de embalagem (soma de todos os itens)
        const custoEmbalagemTotal_Calc = custoEmbalagem + custoColher + custoFitaTag + outrosCustos;
        
        // 5. Mão de obra por unidade
        const custoMaoObraTotal = (tempoProducao / 60) * valorHora;
        
        // 6. Custos fixos rateados
        const custoFixoRateado_Calc = custoFixoMensal / quantidadeMedia;
        
        // 7. Subtotal (ingredientes + embalagem + variáveis + mão de obra + custos fixos)
        const subtotal = custoIngredientesTotal + custoEmbalagemTotal_Calc + custoGasEnergia + custoAguaLimpeza + custoMaoObraTotal + custoFixoRateado_Calc;
        
        // 8. Perdas/imprevistos
        const custoPerdasImprevistos = subtotal * (percentualPerdas / 100);
        
        // 9. Custo real final
        const custoRealFinal = subtotal + custoPerdasImprevistos;
        
        // 10. Preço mínimo (custo real + taxa de maquininha)
        const precoMinimoCalc = custoRealFinal / (1 - (taxaMaquininha / 100));
        
        // 11. Preço sugerido com margem de lucro
        // Fórmula: Preço = (Custo Real + Taxa) / (1 - Margem% - Taxa%)
        const precoSugeridoCalc = (custoRealFinal + taxaEntrega) / (1 - ((margemLucro + taxaMaquininha) / 100));
        
        // Aplicar desconto promocional se houver
        const precoComDesconto = precoSugeridoCalc * (1 - (descontoPromocional / 100));
        
        // Arredondar para valor comercial
        const precoFinal = this.arredondarComercial(precoComDesconto);
        
        // 12. Lucro por unidade (considerando taxa)
        const lucroUnidadeCalc = precoFinal - (precoFinal * (taxaMaquininha / 100)) - custoRealFinal;
        
        // 13. Margem percentual
        const margemPercentual = (lucroUnidadeCalc / precoFinal) * 100;
        
        // ============================================
        // ATUALIZAR INTERFACE
        // ============================================
        
        this.custoIngredientes.textContent = this.formatarMoeda(custoIngredientesTotal);
        this.custoEmbalagemTotal.textContent = this.formatarMoeda(custoEmbalagemTotal_Calc);
        this.custoMaoObra.textContent = this.formatarMoeda(custoMaoObraTotal);
        this.custoFixoRateado.textContent = this.formatarMoeda(custoFixoRateado_Calc);
        this.custoRealTotal.textContent = this.formatarMoeda(custoRealFinal);
        this.precoMinimo.textContent = this.formatarMoeda(precoMinimoCalc);
        this.precoSugerido.textContent = this.formatarMoeda(precoFinal);
        this.lucroUnidade.textContent = this.formatarMoeda(lucroUnidadeCalc);
        this.margemFinal.textContent = margemPercentual.toFixed(2) + '%';
        
        // Mostrar resultado
        this.blocoResultado.style.display = 'block';
        this.blocoResultado.scrollIntoView({ behavior: 'smooth' });
        
        // Validações e avisos
        this.verificarAvisos(custoRealFinal, precoFinal, margemPercentual, margemLucro);
    }

    verificarAvisos(custoReal, preco, margemReal, margemDesejada) {
        const avisos = [];
        
        // Aviso 1: Preço abaixo do custo
        if (preco < custoReal) {
            avisos.push({
                tipo: 'erro',
                mensagem: '⚠️ ATENÇÃO: O preço sugerido está abaixo do custo real! Revise seus valores.'
            });
        }
        
        // Aviso 2: Margem inviável
        if (margemReal < (margemDesejada * 0.5)) {
            avisos.push({
                tipo: 'aviso',
                mensagem: `⚠️ A margem real (${margemReal.toFixed(2)}%) é menor que a desejada (${margemDesejada.toFixed(2)}%). Considere aumentar o preço.`
            });
        }
        
        // Aviso 3: Margem muito baixa
        if (margemReal < 10) {
            avisos.push({
                tipo: 'aviso',
                mensagem: '⚠️ Margem de lucro muito baixa. Considere aumentar o preço para maior sustentabilidade.'
            });
        }
        
        this.mostrarAvisos(avisos);
    }

    mostrarAvisos(avisos) {
        if (avisos.length === 0) {
            this.avisos.classList.remove('ativo');
            this.avisos.innerHTML = '';
            return;
        }
        
        let html = '';
        avisos.forEach(aviso => {
            html += `<div class="aviso ${aviso.tipo}">${aviso.mensagem}</div>`;
        });
        
        this.avisos.innerHTML = html;
        this.avisos.classList.add('ativo');
    }

    mostrarErro(erros) {
        const mensagem = erros.join('\n');
        alert('Erro na validação:\n\n' + mensagem);
    }

    arredondarComercial(valor) {
        // Arredondar para valores comerciais: 9.90, 14.90, 19.90, 24.90, 29.90, 34.90, 39.90, 44.90, 49.90, etc
        const inteiro = Math.floor(valor);
        const decimal = valor - inteiro;
        
        // Se o decimal é menor que 0.90, arredondar para .90 do mesmo inteiro
        // Se o decimal é >= 0.90, arredondar para .90 do próximo inteiro
        if (decimal < 0.90) {
            return inteiro + 0.90;
        } else {
            return (inteiro + 1) + 0.90;
        }
    }

    formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }
}

// ============================================
// INICIALIZAR QUANDO DOM ESTIVER PRONTO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    new CalculadoraOvos();
});

    gerarPDF() {
        // Obter dados do formulário
        const nomeProduto = this.nomeProduto.value || 'Ovo de Páscoa';
        const pesoCasca = this.pesoCasca.value;
        const pesoRecheio = this.pesoRecheio.value;
        const custoCasca = this.custoCasca.value;
        const custoRecheio = this.custoRecheio.value;
        const custoEmbalagem = this.custoEmbalagem.value;
        const tempoProducao = this.tempoProducao.value;
        const valorHora = this.valorHora.value;
        const margemLucro = this.margemLucro.value;
        
        // Criar conteúdo do PDF
        const pdfContent = `
            <div style="background: white; padding: 30px; font-family: 'Inter', sans-serif;">
                <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #E8B4B8;">
                    <h1 style="color: #6B3E26; font-size: 1.8rem; margin: 0 0 10px 0; font-family: 'Poppins', sans-serif;">🍫 Relatório de Preço - Ovo de Páscoa</h1>
                    <p style="color: #666; font-size: 0.95rem; margin: 5px 0;">Calculadora de Preços para Confeiteiras</p>
                </div>
                
                <div style="background: #F4E6D9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 8px 0;"><strong style="color: #6B3E26;">Produto:</strong> ${nomeProduto}</p>
                    <p style="margin: 8px 0;"><strong style="color: #6B3E26;">Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                
                <h3 style="color: #6B3E26; margin-top: 20px; margin-bottom: 10px; font-family: 'Poppins', sans-serif;">📊 Dados do Cálculo</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.9rem;">
                    <tr style="background: #F4E6D9;">
                        <td style="padding: 8px; border: 1px solid #E5D5C8;"><strong>Peso da Casca</strong></td>
                        <td style="padding: 8px; border: 1px solid #E5D5C8;">${pesoCasca}g</td>
                        <td style="padding: 8px; border: 1px solid #E5D5C8;"><strong>Custo/kg</strong></td>
                        <td style="padding: 8px; border: 1px solid #E5D5C8;">R$ ${parseFloat(custoCasca).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #E5D5C8;"><strong>Peso do Recheio</strong></td>
                        <td style="padding: 8px; border: 1px solid #E5D5C8;">${pesoRecheio}g</td>
                        <td style="padding: 8px; border: 1px solid #E5D5C8;"><strong>Custo/kg</strong></td>
                        <td style="padding: 8px; border: 1px solid #E5D5C8;">R$ ${parseFloat(custoRecheio).toFixed(2)}</td>
                    </tr>
                    <tr style="background: #F4E6D9;">
                        <td style="padding: 8px; border: 1px solid #E5D5C8;"><strong>Tempo de Produção</strong></td>
                        <td style="padding: 8px; border: 1px solid #E5D5C8;">${tempoProducao} min</td>
                        <td style="padding: 8px; border: 1px solid #E5D5C8;"><strong>Valor/hora</strong></td>
                        <td style="padding: 8px; border: 1px solid #E5D5C8;">R$ ${parseFloat(valorHora).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #E5D5C8;"><strong>Custo Embalagem</strong></td>
                        <td style="padding: 8px; border: 1px solid #E5D5C8;">R$ ${parseFloat(custoEmbalagem).toFixed(2)}</td>
                        <td style="padding: 8px; border: 1px solid #E5D5C8;"><strong>Margem Desejada</strong></td>
                        <td style="padding: 8px; border: 1px solid #E5D5C8;">${margemLucro}%</td>
                    </tr>
                </table>
                
                <h3 style="color: #6B3E26; margin-top: 20px; margin-bottom: 10px; font-family: 'Poppins', sans-serif;">✨ Resultados Finais</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                    <tr style="background: #FFF8F2; border-bottom: 2px solid #E8B4B8;">
                        <td style="padding: 12px; border: 1px solid #E5D5C8;"><strong>Custo Real Total</strong></td>
                        <td style="padding: 12px; border: 1px solid #E5D5C8; text-align: right; color: #C97B63; font-weight: bold;">${this.custoRealTotal.textContent}</td>
                    </tr>
                    <tr style="background: #FFF8F2;">
                        <td style="padding: 12px; border: 1px solid #E5D5C8;"><strong>Preço Mínimo</strong></td>
                        <td style="padding: 12px; border: 1px solid #E5D5C8; text-align: right;">${this.precoMinimo.textContent}</td>
                    </tr>
                    <tr style="background: #FFF8F2;">
                        <td style="padding: 12px; border: 1px solid #E5D5C8;"><strong>Preço Sugerido</strong></td>
                        <td style="padding: 12px; border: 1px solid #E5D5C8; text-align: right; color: #6AA84F; font-weight: bold; font-size: 1.1rem;">${this.precoSugerido.textContent}</td>
                    </tr>
                    <tr style="background: #FFF8F2;">
                        <td style="padding: 12px; border: 1px solid #E5D5C8;"><strong>Lucro por Unidade</strong></td>
                        <td style="padding: 12px; border: 1px solid #E5D5C8; text-align: right; color: #6AA84F;">${this.lucroUnidade.textContent}</td>
                    </tr>
                    <tr style="background: #FFF8F2;">
                        <td style="padding: 12px; border: 1px solid #E5D5C8;"><strong>Margem Final</strong></td>
                        <td style="padding: 12px; border: 1px solid #E5D5C8; text-align: right; color: #6AA84F;">${this.margemFinal.textContent}</td>
                    </tr>
                </table>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #E5D5C8; text-align: center; font-size: 0.85rem; color: #666;">
                    <p style="margin: 5px 0;">Relatório gerado pela Calculadora de Preços de Ovos de Páscoa</p>
                    <p style="margin: 5px 0;">Ferramenta desenvolvida para confeiteiras e pequenos empreendedores</p>
                </div>
            </div>
        `;
        
        // Criar elemento temporário
        const element = document.createElement('div');
        element.innerHTML = pdfContent;
        
        // Configurações do PDF
        const opt = {
            margin: 10,
            filename: `Relatorio-${nomeProduto.replace(/\s+/g, '-')}-${new Date().getTime()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: false },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };
        
        // Gerar PDF
        html2pdf().set(opt).from(element).save();
    }
