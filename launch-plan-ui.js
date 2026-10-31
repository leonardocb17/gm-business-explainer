(() => {
  'use strict';
  function mountPlan90() {
    const mount = document.getElementById('plan90');
    const D = window.GM_PLAN90;
    if (!mount || !D || typeof D.calculateBudget !== 'function' || typeof D.calculatePilot !== 'function') return;
    if (mount.dataset.plan90Ready) return;
    mount.dataset.plan90Ready = 'true';
    mount.classList.add('plan90');
    const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    const number = (value, places = 2) => Number.isFinite(value) ? value.toLocaleString('pt-BR', {minimumFractionDigits:places, maximumFractionDigits:places}) : 'Não definido';
    const money = value => Number.isFinite(value) ? new Intl.NumberFormat('pt-BR', {style:'currency', currency:D.budget.currency || 'BRL'}).format(value) : 'Não definido';
    const list = items => `<ul>${(items || []).map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
    const link = (url, title) => /^https?:\/\//i.test(url || '') ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)} <span aria-hidden="true">↗</span></a>` : esc(title);
    const budget = D.calculateBudget();
    const recommendation = D.recommendation || {};
    const budgetRows = (budget.byPhase || []).map((phase, index) => `<tr><th scope="row">${esc(D.phases[index]?.period || `Período ${index + 1}`)}</th><td>${money(phase.setup)}</td><td>${money(phase.fixed)}</td><td>${money(phase.media)}</td><td>${money(phase.total)}</td></tr>`).join('');
    mount.innerHTML = `
      <header class="p90-heading"><p class="kicker">Dois sócios · 90 dias · retirada zero</p><h2>Um piloto para provar a operação</h2><p>Uma marca, uma oferta e um canal. A verba avança conforme os resultados e as aprovações.</p></header>
      <div class="p90-recommendation">${[['Mercado inicial',recommendation.country],['Oferta inicial',recommendation.offer],['Aquisição inicial',recommendation.channel]].map(([title,value]) => `<article class="p90-card"><p class="kicker">${esc(title)}</p><h3>${esc(value)}</h3></article>`).join('')}</div>
      <p class="p90-reason">${esc(recommendation.reason)}</p>
      <aside class="p90-callout"><strong>Condição para começar</strong><p>${esc(recommendation.restriction)}</p></aside>
      <section class="p90-section" aria-labelledby="p90-phases-title"><h2 id="p90-phases-title">Quem faz o quê</h2><div class="p90-tabs" role="tablist" aria-label="Etapas do piloto">${D.phases.map((phase,index) => `<button id="p90-tab-${index}" type="button" role="tab" aria-controls="p90-panel-${index}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-p90-phase="${index}"><span>${esc(phase.period)}</span><strong>${esc(phase.title)}</strong></button>`).join('')}</div>
      ${D.phases.map((phase,index) => `<section id="p90-panel-${index}" class="p90-phase ${index === 0 ? 'is-active' : ''}" role="tabpanel" aria-labelledby="p90-tab-${index}" tabindex="0"><p class="p90-print-period">${esc(phase.period)}</p><h3>${esc(phase.title)}</h3><p>${esc(phase.objective)}</p><div class="p90-owners"><article><h4>Sócio A · crescimento e receita</h4>${list(phase.ownerA)}</article><article><h4>Sócio B · conteúdo e operação</h4>${list(phase.ownerB)}</article></div><div class="p90-ai"><h4>O que a IA executa</h4>${list(phase.ai)}</div><div class="p90-deliverables"><h4>O que precisa estar pronto</h4>${list(phase.deliverables)}</div><div class="p90-decision"><p><strong>Liberar a próxima etapa:</strong> ${esc(phase.release)}</p><p><strong>Parar ou corrigir:</strong> ${esc(phase.stop)}</p></div></section>`).join('')}</section>
      <section class="p90-section" aria-labelledby="p90-budget-title"><h2 id="p90-budget-title">Quanto colocar em risco</h2><p class="p90-caption">Tetos de caixa para planejamento, sem remuneração dos sócios. Os valores não são cotações de fornecedores.</p><div class="p90-table-wrap" tabindex="0" role="region" aria-label="Orçamento por período"><table><caption>Liberação de caixa por etapa</caption><thead><tr><th scope="col">Período</th><th scope="col">Implantação</th><th scope="col">Fixos</th><th scope="col">Mídia</th><th scope="col">Total</th></tr></thead><tbody>${budgetRows}<tr class="p90-total"><th scope="row">Programado</th><td>${money(D.budget.setup)}</td><td>${money(budget.fixedTotal)}</td><td>${money(budget.mediaTotal)}</td><td>${money(budget.scheduledTotal)}</td></tr><tr><th scope="row">Reserva</th><td colspan="3">Usar somente após decisão dos sócios</td><td>${money(budget.reserve)}</td></tr><tr class="p90-total"><th scope="row" colspan="4">Limite de caixa dos 90 dias</th><td>${money(budget.total)}</td></tr></tbody></table></div><p class="p90-caption">${esc(D.budget.note)}</p></section>
      <section class="p90-section" aria-labelledby="p90-tools-title"><h2 id="p90-tools-title">Ferramentas suficientes para começar</h2><div class="p90-table-wrap" tabindex="0" role="region" aria-label="Ferramentas e condições"><table class="p90-tools"><thead><tr><th scope="col">Ferramenta</th><th scope="col">Para quê</th><th scope="col">Limite</th><th scope="col">Condição</th></tr></thead><tbody>${(D.tools || []).map(tool => `<tr><th scope="row">${link(tool.url,tool.name)}</th><td>${esc(tool.use)}</td><td>${esc(tool.cap)}</td><td>${esc(tool.condition)}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="p90-section" aria-labelledby="p90-pilot-title"><h2 id="p90-pilot-title">O primeiro teste precisa fechar a conta</h2><p class="p90-caption">Hipótese de 4% de leads aceitos entre visitantes entregues, sem medição da GM. Comissão de referência sujeita a contrato e aceite. Não contamos receita de anúncios nem de e-mail.</p><div class="p90-pilot-control"><label for="p90-cpc">CPC pago no teste, em R$<input id="p90-cpc" type="number" inputmode="decimal" min="0.001" max="100" step="0.01" value="${esc(D.pilot.cpc)}" aria-describedby="p90-cpc-help"></label><p id="p90-cpc-help">Altere o custo por clique para ver o efeito com ${money(D.pilot.budget)} de mídia e ${money(D.pilot.fixed)} de fixos. A taxa de aceitação continua sendo uma hipótese.</p></div><p id="p90-input-error" class="p90-error" role="status"></p><div id="p90-pilot-result" aria-live="polite" aria-atomic="true"></div><p class="p90-caption">${esc(D.pilot.note)}</p></section>
      <section class="p90-section" aria-labelledby="p90-cadence-title"><h2 id="p90-cadence-title">Ritmo semanal dos sócios</h2><ol class="p90-cadence">${(D.cadence || []).map(item => `<li>${esc(item)}</li>`).join('')}</ol></section>
      <section class="p90-section" aria-labelledby="p90-gates-title"><h2 id="p90-gates-title">Quando a verba fica parada</h2><div class="p90-gates">${(D.gates || []).map(gate => `<details><summary>${esc(gate.title)}</summary><div><p><strong>Ação:</strong> ${esc(gate.action)}</p><p>${esc(gate.note)}</p></div></details>`).join('')}</div></section>
      <section class="p90-section p90-sources" aria-labelledby="p90-sources-title"><h2 id="p90-sources-title">Fontes para conferir antes de contratar</h2><ul>${(D.sources || []).map(source => `<li>${link(source.url,source.title)}${source.note ? `<p>${esc(source.note)}</p>` : ''}</li>`).join('')}</ul></section>`;

    const tabs = Array.from(mount.querySelectorAll('[data-p90-phase]'));
    function selectPhase(index, focus) {
      tabs.forEach((tab, tabIndex) => {
        const selected = tabIndex === index;
        tab.setAttribute('aria-selected',String(selected));
        tab.tabIndex = selected ? 0 : -1;
        mount.querySelector(`#p90-panel-${tabIndex}`).classList.toggle('is-active',selected);
      });
      if (focus) tabs[index].focus();
    }
    tabs.forEach((tab,index) => {
      tab.addEventListener('click',() => selectPhase(index,false));
      tab.addEventListener('keydown',event => {
        if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
        event.preventDefault();
        event.stopPropagation();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        selectPhase(next,true);
      });
    });
    const ceiling = value => Number.isFinite(value) && value > 0 ? money(value) : 'Não há CPC positivo viável';
    function updatePilot() {
      const rawValue = mount.querySelector('#p90-cpc').value;
      const cpc = Number(rawValue);
      const valid = rawValue.trim() !== '' && Number.isFinite(cpc) && cpc > 0 && cpc <= 100;
      mount.querySelector('#p90-cpc').setAttribute('aria-invalid',String(!valid));
      mount.querySelector('#p90-input-error').textContent = valid ? '' : 'Informe um CPC maior que zero e de até R$ 100.';
      if (!valid) { mount.querySelector('#p90-pilot-result').innerHTML = ''; return; }
      const result = D.calculatePilot({...D.pilot,cpc});
      const rows = [['Visitantes entregues',number(result.visitors,0)],['Leads aceitos, hipótese',number(result.leads,1)],['Receita de comissão',money(result.revenue)],['Mídia',money(result.media)],['Custos fixos',money(result.fixed)],['Custos variáveis',money(result.variable)],['Provisão tributária, hipótese',money(result.tax)]];
      mount.querySelector('#p90-pilot-result').innerHTML = `<div class="p90-pilot-grid"><div class="p90-table-wrap"><table><caption>Simulação do período 2</caption><tbody>${rows.map(([label,value]) => `<tr><th scope="row">${esc(label)}</th><td>${esc(value)}</td></tr>`).join('')}<tr class="p90-total"><th scope="row">Resultado do teste</th><td class="${result.result < 0 ? 'p90-negative' : 'p90-positive'}">${money(result.result)}</td></tr></tbody></table></div><div class="p90-ceilings"><article><p class="kicker">Equilíbrio com os fixos</p><strong>${ceiling(result.breakEvenCpc)}</strong><p>CPC máximo para resultado zero neste cenário.</p></article><article><p class="kicker">Margem de 20%</p><strong>${ceiling(result.marginCpc)}</strong><p>Teto de CPC para a margem proposta, com os mesmos custos e premissas.</p></article><p>O valor simulado não comprova leads, comissões ou rentabilidade futura.</p></div></div>`;
    }
    mount.querySelector('#p90-cpc').addEventListener('input',updatePilot);
    updatePilot();
  }
  window.mountGMPlan90 = mountPlan90;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',mountPlan90,{once:true});
  else mountPlan90();
})();
