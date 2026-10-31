(function(root) {
  'use strict';
  const plan = {
    updatedAt:'2026-10-31',
    recommendation:{
      country:'Brasil',
      offer:'SuperSim · lead validado',
      channel:'Google Search · termos genéricos',
      reason:'Começar em português, com um público, uma oferta e uma fonte. A referência pública de CPL ajuda a definir um teto econômico. A escolha reduz complexidade operacional; não demonstra que o Brasil ou o Google tenham o melhor retorno.',
      restriction:'Só comprar mídia após aceitação do editor, domínio, página e origem de tráfego pelo parceiro, verificação financeira do Google e confirmação do produto elegível. A Actionpay publica 150 visitantes únicos/dia no mês anterior para sites e blogs; outras fontes também exigem aprovação. A proposta direta B2B da SuperSim é uma alternativa de admissão com tarifa própria, antes de contratar pela rede; assuntos de campanhas Actionpay devem ser tratados com a própria rede.'
    },
    budget:{setup:1500,monthlyFixed:750,months:3,media:[0,1500,3000],reserve:1750,currency:'BRL',note:'Teto gerencial de caixa, não preço de mercado nem compromisso de gasto. Dois sócios sem salário ou retirada, usando equipamento e acessos individuais já existentes. Não contar com recebimentos para financiar estes 90 dias. R$ 750/mês substituem, neste piloto enxuto, os outros cenários de custo fixo da apresentação. A reserva cobre variações, custos variáveis e provisões; formação de empresa ou serviços externos que ultrapassem o teto exigem reorçamento antes da mídia.'},
    phases:[
      {
        period:'Dias 1–30',title:'Conseguir admissão e provar a medição',
        objective:'Preparar um piloto enxuto. Mídia liberada nesta fase: R$ 0. As datas não substituem as aprovações.',
        ownerA:[
          'Dias 1–7: escolher a entidade contratante, documentar o público e enviar a proposta de editor/origem pelo canal de admissão adequado. Confirmar evento, tarifa, validação, estornos, atribuição e pagamento.',
          'Dias 8–15: obter aprovação escrita do domínio, página e Google Search genérico; coordenar a verificação de terceiro com o anunciante autorizado por meio da rede, quando aplicável.',
          'Dias 16–30: preparar uma campanha pequena, com um grupo temático de termos genéricos, negativas e três versões de anúncio; revisar custos do leilão sem assumir CPC viável. Não lançar enquanto as condições estiverem pendentes.'
        ],
        ownerB:[
          'Dias 1–10: publicar um WordPress simples, identificação do editor, contato, políticas e divulgação da relação comercial; criar uma página útil sobre o produto e quatro conteúdos de apoio revisados.',
          'Dias 11–20: instalar GA4/GTM uma única vez e medir chegada, leitura e clique para o parceiro; conciliar o identificador de campanha com o relatório da rede. Usar teste autorizado, nunca pedido fictício de crédito.',
          'Dias 21–30: testar celular, desempenho, links e condições. Preparar inscrição opcional em conteúdo, confirmação e descadastro; se o fornecedor de e-mail não estiver pronto, lançar o piloto sem essa captura.'
        ],
        ai:[
          'Gerar briefs, rascunhos dos cinco conteúdos e três anúncios a partir das fontes oficiais; o sócio B revisa cada condição e o sócio A aprova a comunicação comercial.',
          'Ajudar na implementação, nos casos de teste e na organização dos termos. Código calcula valores; uma pessoa aprova publicação e gasto.'
        ],
        deliverables:['Uma oferta e origem aceitas por escrito','Um site enxuto com cinco conteúdos revisados','Medição reconciliável até o evento do parceiro','Campanha pronta, com limite e verificações concluídas'],
        release:'Liberar o primeiro lote de R$ 300 somente com aceitação comercial, verificação do canal e medição funcionando. A referência de R$ 9,10 só entra no orçamento depois de confirmada nos termos aceitos.',
        stop:'Sem admissão até o dia 30: manter a mídia em zero, reavaliar o canal de entrada e limitar a preparação. Não assumir isenção da exigência de tráfego nem comprar visitas artificiais para satisfazê-la.'
      },
      {
        period:'Dias 31–60',title:'Comprar aprendizado em lotes pequenos',
        objective:'Até R$ 1.500 de mídia, com teto gerencial de R$ 50/dia. Uma oferta e um canal. Começar pela página de conteúdo com encaminhamento; o quiz completo pode esperar.',
        ownerA:[
          'Primeiro lote: R$ 300. Conferir termos de busca, custo por chegada e eventos atribuídos diariamente. Pausar ao consumir o lote para revisar antes de liberar mais dinheiro.',
          'Se medição e atribuição estiverem corretas, liberar até dois lotes adicionais de R$ 600, respeitando o teto mensal. Distinguir registros pendentes, leads validados, estornos e saldo pago.',
          'Revisar o CPC frente ao teto recalculado com a tarifa contratada e conversão observada. Não ampliar porque houve cadastro ou porque o anúncio teve bom CTR.'
        ],
        ownerB:[
          'Corrigir primeiro as perdas de carregamento e compreensão. Testar uma mudança por vez, mantendo a mesma oferta e registrando a versão da página.',
          'Produzir dois conteúdos de apoio por semana com IA e revisão. Manter registro da data de checagem das condições do produto.',
          'Se houver autorização e envio aprovado, testar boas-vindas e até dois e-mails úteis por semana; medir cliques humanos e retorno ao site. E-mail e publicidade do site ficam fora da receita usada para liberar mídia nesta etapa.'
        ],
        ai:[
          'Agrupar termos de busca e sugerir negativas, sem aplicar automaticamente; preparar variantes com mudança controlada.',
          'Resumir os relatórios de aquisição e rejeição. Dados pessoais e documentos de crédito ficam fora do assistente e do analytics.'
        ],
        deliverables:['Lotes de aquisição identificados por data e versão','Relatório de gasto, chegadas, cliques e eventos atribuídos','Primeira estimativa de custo por lead validado','Registro separado de pendências, recusas e recebimentos'],
        release:'O limite de R$ 1.500 é o preço máximo deste teste, não uma meta de gasto. O último lote depende de indicadores coerentes e de nenhuma falha de aprovação, atribuição ou caixa.',
        stop:'Ao atingir R$ 300 sem nenhum cadastro atribuído, pausar e investigar. Após sete dias úteis com rastreamento confirmado e nenhuma atribuição, encerrar essa variante. Se o problema for atraso de integração ou validação, marcar inconclusivo e aguardar, sem tratar pendente como recusado.'
      },
      {
        period:'Dias 61–90',title:'Decidir com coortes maduras e recebimento',
        objective:'Até R$ 3.000 adicionais de mídia, condicionados ao resultado. Teto gerencial de R$ 100/dia; não acelerar para consumir saldo se as aprovações chegarem tarde.',
        ownerA:[
          'Conciliar dois lotes distintos, com pelo menos 50 leads validados em cada e custos alocados. Estes mínimos são regras gerenciais do teste, não garantia estatística.',
          'Exigir pelo menos um recebimento e margem de 20% após mídia, custos variáveis, provisões e fixos alocados antes de chamar o movimento de escala.',
          'Se todos os critérios forem atendidos, aumentar o teto de gasto em no máximo 20% por semana, dentro dos R$ 100/dia e R$ 3.000 da fase. Se o canal não couber no teto econômico, pausar e revisar a oferta ou a aquisição.'
        ],
        ownerB:[
          'Consolidar o histórico de 30/60/90 dias por grupo de aquisição; só reconhecer comissões elegíveis e evitar pagamento duplicado do mesmo cadastro.',
          'Revisar conteúdo, permissão, descadastro, rejeições e reclamações. Corrigir falhas antes de mais tráfego.',
          'No dia 90, documentar uma decisão: escalar um único fluxo, repetir um teste limitado, ou encerrar. México/EUA/Canadá e cartões por aprovação ficam para uma segunda rodada com aprovação e economia próprias.'
        ],
        ai:[
          'Gerar uma leitura dos lotes conciliados e listar hipóteses de melhoria; as recomendações precisam apontar os dados que as sustentam.',
          'Automatizar checagem de links e importação de relatórios apenas depois de o processo manual funcionar. Manter revisão dos sócios.'
        ],
        deliverables:['Dois lotes conciliados sem duplicação','Uma confirmação de dinheiro recebido, se houver','Margem recalculada com custos e invalidações','Decisão escrita e limite do próximo teste'],
        release:'Escalar somente com os critérios comerciais, técnicos e financeiros atendidos. Sem primeiro recebimento ou validação suficiente, continuar em observação; o calendário não obriga a liberar o saldo.',
        stop:'Se o orçamento total chegar ao teto, parar novos gastos. Se os lotes maduros forem deficitários, pausar mídia e corrigir antes de novo teste. Se houver saldo pendente no dia 90, o resultado é inconclusivo: aguardar a janela de validação e pagamento com mídia pausada.'
      }
    ],
    tools:[
      {name:'WordPress + hospedagem/domínio',use:'Publicar o site, conteúdo e formulário opcional. Tema padrão, poucos plugins, backup e contas individuais.',cap:'R$ 120/mês',condition:'Provisão dentro dos R$ 750; conferir preço total, renovação e domínio antes da contratação.',url:'https://wordpress.org/about/features/'},
      {name:'Assistente de IA já licenciado',use:'Briefs, rascunhos, traduções, variantes, ajuda com código e leitura de relatórios. Cada sócio usa acesso individual autorizado.',cap:'R$ 200/mês',condition:'Teto de novas despesas, não cotação de dois planos. Aproveitar acessos existentes e reduzir escopo se o total não couber.',url:''},
      {name:'GA4 + Google Tag Manager',use:'Chegadas reais, leitura, clique de saída e retorno por campanha. Relatório da rede confirma o evento remunerado.',cap:'Sem verba adicional prevista',condition:'Uma instalação, eventos testados e nenhum e-mail/CPF nos parâmetros de analytics.',url:'https://developers.google.com/analytics/devguides/collection/ga4/tag-options'},
      {name:'Google Ads · Search',use:'Um teste de intenção, com termos genéricos e criativos revisados.',cap:'Dentro dos R$ 4.500 de mídia',condition:'Verificação financeira brasileira, origem aprovada e condições do empréstimo compatíveis. Sem compra de marca ou retargeting na oferta consultada.',url:'https://support.google.com/adspolicy/answer/15332527?co=GENIE.CountryCode%3DBR&hl=pt-BR'},
      {name:'Amazon SES + gestão de lista',use:'Opção técnica para confirmação, envio e descadastro de conteúdo, com lista, agenda e supressão integradas.',cap:'R$ 100/mês',condition:'Provisão, não cotação ou aceite. Exige aprovação de produção, domínio autenticado, consentimento e testes de descadastro/rejeição. Se faltar integração, começar sem e-mail.',url:'https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html'},
      {name:'Controle já usado + scripts simples',use:'Planilha operacional existente e exportações de mídia/rede para reconciliar gasto, validação, estorno e recebimento. Python para cálculos repetitivos.',cap:'Sem novo CRM previsto',condition:'Não construir automação complexa antes de validar o processo manual.',url:''},
      {name:'Administração e operação',use:'Reservar R$ 200/mês para administração e R$ 130/mês para manutenção e pequenos imprevistos.',cap:'R$ 330/mês',condition:'Somados a tecnologia, IA e e-mail, fecham os R$ 750/mês. São limites escolhidos, não preços ou suficiência comprovada.',url:''}
    ],
    cadence:[
      'Premissa de capacidade: 15 horas por semana por sócio, sem remuneração. Se não houver essa disponibilidade, reduzir entregas e estender o calendário, preservando os limites de gasto.',
      'Segunda, 30 minutos juntos: revisar os números conciliados, escolher uma hipótese e definir o limite do lote. Sócio A responde por parceiros, mídia e caixa; B por conteúdo, tecnologia e e-mail.',
      'Diariamente, A confere gasto/atribuição e B verifica links, formulários e alertas. Desvio de rastreamento, oferta suspensa ou falha de consentimento interrompe a aquisição relacionada.',
      'Sexta, 45 minutos juntos: comparar previsto com realizado, marcar pendente/validado/pago, revisar condições e decidir se o próximo lote será liberado. Registrar a decisão.'
    ],
    gates:[
      {title:'Antes do primeiro real de mídia',action:'LIBERAR SÓ COM EVIDÊNCIA',note:'Editor, origem/domínio e produto aceitos; tarifa e evento confirmados; verificação financeira do canal; rastreamento reconciliável. Nenhuma dessas aprovações foi obtida por esta apresentação.'},
      {title:'Falha de rastreamento, oferta ou permissão',action:'PAUSAR IMEDIATAMENTE',note:'Investigar e corrigir antes de retomar. Testar um clique autorizado e conciliar os relatórios; não gerar pedidos fictícios para testar uma comissão.'},
      {title:'Lote inicial de R$ 300 sem atribuição',action:'PAUSAR E DIAGNOSTICAR',note:'Zero cadastro atribuído pede revisão. Após sete dias úteis com rastreamento confirmado e nenhuma atribuição, encerrar a variante. Pendências de integração/validação não são recusas; manter gasto pausado enquanto se esclarecem.'},
      {title:'CPC e margem após validação',action:'COMPARAR CUSTO COMPLETO',note:'Usar tarifa efetiva, leads validados e custos alocados. Se a margem do lote maduro for negativa, pausar. Se for positiva abaixo de 20%, otimizar em teste limitado; não escalar. Não usar receita publicitária ou de e-mail ainda não realizada para aprovar o aumento.'},
      {title:'Sinal mínimo para ampliar',action:'DOIS LOTES + RECEBIMENTO + 20%',note:'Pelo menos dois lotes distintos de 50 leads validados cada, um pagamento recebido e margem mínima de 20% em ambos após todos os custos alocados. Mínimo gerencial, não significância estatística. Aumento máximo de 20% por semana dentro do orçamento da fase.'},
      {title:'Dia 90 com resultados pendentes',action:'INCONCLUSIVO É UM RESULTADO',note:'Processamento máximo de 45 dias não é promessa de caixa em 45 dias; o anunciante ainda precisa pagar. Não contar pendências como receita recebida. Pausar novos gastos e aguardar a janela aplicável antes da decisão final.'},
      {title:'Teto de caixa',action:'NÃO ULTRAPASSAR R$ 10 MIL',note:'Implantação, operação, mídia e reserva somam o limite. Não reciclar receitas esperadas nem consumir reserva para aumentar campanha. Gastar menos quando os critérios não forem cumpridos.'}
    ],
    sources:[
      {title:'SuperSim CPL na Actionpay',url:'https://actionpay.com.br/pt/wmOffers/view/14572/supersim-emprestimo-pessoal-cpl',note:'Referência pública ativa: R$ 9,10 na primeira faixa; SEM genérico permitido, marca e retargeting negados. Exige validação e admissão; não é contrato nosso ou da GM.'},
      {title:'Regras da Actionpay',url:'https://actionpay.com.br/pt/content/rules',note:'Histórico exigido para sites/blogs; fontes aprovadas; pagamento condicionado à validação e ao anunciante. Assuntos de campanha são tratados com a rede.'},
      {title:'Parcerias estratégicas SuperSim',url:'https://www.supersim.com.br/parcerias-estrategicas/',note:'Admissão B2B alternativa para publishers e mídia paga, com tarifa não publicada. Não atribuir o valor da rede ao contrato direto.'},
      {title:'Google: verificação financeira no Brasil',url:'https://support.google.com/adspolicy/answer/15332527?co=GENIE.CountryCode%3DBR&hl=pt-BR',note:'Afiliação não dispensa a verificação. Terceiros aprovados dependem do processo e da confirmação do anunciante autorizado.'},
      {title:'Google: política de empréstimos pessoais',url:'https://support.google.com/adspolicy/answer/15188216?hl=en',note:'A política também alcança geradores de leads: quitação em 61 dias ou mais e informações de prazo/custo exigidas na página. Verificar a oferta concreta antes do anúncio.'},
      {title:'WordPress: recursos de publicação',url:'https://wordpress.org/about/features/',note:'Publicação, revisões, papéis de usuário e extensões; hospedagem e manutenção são custos separados.'},
      {title:'GA4 e Google Tag Manager',url:'https://developers.google.com/analytics/devguides/collection/ga4/tag-options',note:'Documentação primária da integração e instalação.'},
      {title:'SES: aprovação para produção',url:'https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html',note:'Aceite não automático; requer remetente verificado, permissão e tratamento de rejeições/reclamações.'},
      {title:'SES: preferências e descadastro',url:'https://docs.aws.amazon.com/ses/latest/dg/sending-email-subscription-management.html',note:'Gestão de descadastro exige configuração e integração corretas; não é garantida por qualquer plugin SMTP.'},
      {title:'Gmail: requisitos de remetentes',url:'https://support.google.com/mail/answer/81126?hl=en',note:'Autenticação, controles de spam e regras adicionais para envio em volume. Começar com SPF, DKIM, DMARC, consentimento e descadastro testados.'}
    ],
    pilot:{budget:1500,fixed:750,landingRate:.9,acceptedLeadRate:.04,payout:9.1,variable:.01,tax:.08,cpc:.20,note:'Exemplo do mês de teste, não previsão: 90% de chegada e 4% dos visitantes virando lead validado são hipóteses. R$ 9,10 é referência pública condicionada ao contrato; acima de 400 ações, manter esse valor é apenas sensibilidade, pois as regras das faixas precisam ser esclarecidas. Receita de anúncios e e-mail = zero neste teste. A provisão de 8% não é alíquota verificada. Os custos variáveis e provisões precisam caber na reserva ou no caixa do projeto; não criar verba extra.'}
  };
  plan.calculateBudget = function() {
    const b=plan.budget;
    const byPhase=b.media.map((media,i)=>({setup:i===0?b.setup:0,fixed:b.monthlyFixed,media,total:(i===0?b.setup:0)+b.monthlyFixed+media}));
    const fixedTotal=b.monthlyFixed*b.months,mediaTotal=b.media.reduce((a,x)=>a+x,0),scheduledTotal=b.setup+fixedTotal+mediaTotal;
    return {fixedTotal,mediaTotal,scheduledTotal,total:scheduledTotal+b.reserve,byPhase,reserve:b.reserve};
  };
  plan.calculatePilot = function(input) {
    const p={...plan.pilot,...input};
    for(const k of ['budget','fixed','landingRate','acceptedLeadRate','payout','variable','tax','cpc']) if(!Number.isFinite(p[k])||p[k]<0)throw new RangeError('Invalid pilot input: '+k);
    if(p.landingRate>1||p.acceptedLeadRate>1||p.tax>1||p.cpc===0)throw new RangeError('Invalid pilot rate');
    const visitors=p.budget/p.cpc*p.landingRate,leads=visitors*p.acceptedLeadRate,revenue=leads*p.payout,variable=visitors*p.variable,tax=revenue*p.tax;
    const denominator=p.budget+p.fixed;
    const breakEvenCpc=denominator>0?p.budget*p.landingRate*(p.acceptedLeadRate*p.payout*(1-p.tax)-p.variable)/denominator:null;
    const marginCpc=denominator>0?p.budget*p.landingRate*(p.acceptedLeadRate*p.payout*(1-p.tax-.20)-p.variable)/denominator:null;
    return {visitors,leads,revenue,media:p.budget,fixed:p.fixed,variable,tax,result:revenue-p.budget-p.fixed-variable-tax,breakEvenCpc,marginCpc,paidCpc:p.cpc};
  };
  root.GM_PLAN90=plan;
  if(typeof module==='object'&&module.exports)module.exports=plan;
})(typeof window!=='undefined'?window:globalThis);
