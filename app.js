(() => {
  'use strict';
  const D = window.GM_CONTENT, M = window.GM_MODEL;
  if (!D || !M) { document.getElementById('main').innerHTML = '<p>Não foi possível carregar os dados. Recarregue a página.</p>'; return; }
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const countryNames = {BR:'Brasil',MX:'México',US:'EUA',CA:'Canadá'};
  const chapterNames = ['Comece aqui','Mapa do grupo','De onde vem a receita','Siga o visitante','Faça as contas','Plano de 90 dias','O que sabemos','Fontes e termos'];
  const hashes = ['visao','grupo','receita','caminhos','numeros','montar','evidencias','fontes'];
  let chapter = 0, entityKind = 'todos', selectedEntity = D.entities[0].id, routeCountry = 'BR', routeId = 'BR187', routeStep = 0, phase = 0;
  const sourceMap = new Map(D.sources.map(s => [s.id,s]));
  const fmt = (v,d=2) => v === null || !Number.isFinite(v) ? 'Não definido' : v.toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d});
  const brl = (v,d=2) => v === null || !Number.isFinite(v) ? 'Não definido' : `R$ ${fmt(v,d)}`;
  const compact = v => v === null || !Number.isFinite(v) ? 'Inviável' : new Intl.NumberFormat('pt-BR',{notation:'compact',maximumFractionDigits:2}).format(v);
  const external = (url,label,cls='source-link') => /^https?:\/\//.test(url || '') ? `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} <span aria-hidden="true">↗</span></a>` : '';
  const status = s => `<span class="status ${{comprovado:'proven',declarado:'declared',estimativa:'hypothesis',hipotese:'hypothesis',desconhecido:'unknown'}[s] || 'unknown'}">${esc({comprovado:'Observado',declarado:'Declaração pública',estimativa:'Estimativa',hipotese:'Hipótese',desconhecido:'Não verificado'}[s] || s)}</span>`;
  const sources = ids => `<div class="source-links">${(ids || []).map(id => sourceMap.get(id)).filter(Boolean).map(s => external(s.url,s.title)).join('')}</div>`;
  function showChapter(index,updateHash=true,focus=false) {
    chapter = Math.max(0,Math.min(7,index));
    document.querySelectorAll('[data-panel]').forEach(el => el.hidden = Number(el.dataset.panel) !== chapter);
    document.querySelectorAll('[data-slide]').forEach(el => { const active = Number(el.dataset.slide) === chapter; el.classList.toggle('active',active); if(active) el.setAttribute('aria-current','step'); else el.removeAttribute('aria-current'); });
    $('chapter-label').textContent = `${String(chapter+1).padStart(2,'0')} / 08 · ${chapterNames[chapter]}`;
    $('progress-text').textContent = `Capítulo ${chapter+1} de 8`;
    $('progress-fill').style.width = `${(chapter+1)/8*100}%`;
    $('previous').disabled = chapter === 0; $('next').disabled = chapter === 7;
    if(updateHash) history.replaceState(null,'',`#${hashes[chapter]}`);
    window.scrollTo({top:0,behavior:'instant'});
    if(focus) $('main').focus({preventScroll:true});
  }
  document.querySelectorAll('[data-slide],[data-go]').forEach(el => el.addEventListener('click',() => showChapter(Number(el.dataset.slide ?? el.dataset.go),true,true)));
  $('previous').onclick = () => showChapter(chapter-1,true,true);
  $('next').onclick = () => showChapter(chapter+1,true,true);
  window.addEventListener('hashchange',() => showChapter(Math.max(0,hashes.indexOf(location.hash.slice(1))),false));
  document.addEventListener('keydown',e => { if(/INPUT|SELECT|TEXTAREA|SUMMARY/.test(e.target.tagName) || e.ctrlKey || e.metaKey || e.altKey) return; if(e.key==='ArrowRight'){e.preventDefault();showChapter(chapter+1,true,true);} if(e.key==='ArrowLeft'){e.preventDefault();showChapter(chapter-1,true,true);} });
  $('print').onclick = () => window.print();
  $('fullscreen').onclick = async () => { try { if(document.fullscreenElement) await document.exitFullscreen(); else if(document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen(); } catch { $('fullscreen').textContent = 'Use F11 para ampliar'; } };
  document.addEventListener('fullscreenchange',() => $('fullscreen').textContent = document.fullscreenElement ? 'Sair da apresentação' : 'Apresentar');

  function renderEntities() {
    const kinds = ['todos',...new Set(D.entities.map(e => e.kind))];
    $('entity-filters').innerHTML = kinds.map(k => `<button data-kind="${esc(k)}" class="${k===entityKind?'active':''}" aria-pressed="${k===entityKind}">${esc(k==='todos'?'Todos':k[0].toUpperCase()+k.slice(1))}</button>`).join('');
    const list = D.entities.filter(e => entityKind==='todos' || e.kind===entityKind);
    if(!list.some(e=>e.id===selectedEntity)) selectedEntity=list[0]?.id;
    $('entity-grid').innerHTML = list.map(e => `<button class="entity-card ${e.id===selectedEntity?'active':''}" data-entity="${esc(e.id)}" aria-pressed="${e.id===selectedEntity}"><span class="kicker">${esc(e.kind)}</span><strong>${esc(e.name)}</strong><span class="small muted">${esc(e.relation)}</span></button>`).join('');
    const e = D.entities.find(e => e.id===selectedEntity);
    $('entity-detail').innerHTML = e ? `${status(e.status)}<h2>${esc(e.name)}</h2><p>${esc(e.summary)}</p>${e.markets?.length ? `<p class="small"><strong>Mercados citados:</strong> ${e.markets.map(x=>esc(countryNames[x] || x)).join(', ')}</p>`:''}<p class="small muted">${esc(D.statusDefinitions[e.status])}</p><details class="disclosure"><summary>Ver fontes desta relação</summary>${sources(e.sourceIds)}</details>` : '';
    $('entity-filters').querySelectorAll('button').forEach(b=>b.onclick=()=>{entityKind=b.dataset.kind;renderEntities();});
    $('entity-grid').querySelectorAll('button').forEach(b=>b.onclick=()=>{selectedEntity=b.dataset.entity;renderEntities();});
  }
  const money = {
    ads:{label:'Publicidade no site',title:'A atenção vira espaço publicitário.',text:'O conteúdo de recomendação e os artigos carregam integrações de anúncios. O visitante pode gerar receita publicitária mesmo sem solicitar um cartão.',steps:['Visita ao conteúdo','Publicidade exibida','Receita validada pela rede'],note:'Observado: código publicitário e requisições de anúncios. Não observado: impressões pagas, preços de leilão ou extratos de receita.',sources:['brasil-policy','gm']},
    affiliate:{label:'Encaminhamentos financeiros',title:'O contrato define quando uma indicação vale dinheiro.',text:'O Brasil Cartões declara remuneração de parceiros por propostas ou aprovações. Encontramos destinos oficiais, mas não contratos ou pagamentos da GM para cada produto.',steps:['Clique para o parceiro','Evento exigido no contrato','Validação e pagamento'],note:'Um clique, um e-mail captado, uma proposta e uma aprovação são eventos diferentes. Não presumimos comissão para todo link.',sources:['brasil-policy']},
    email:{label:'Retenção da audiência',title:'O contato pode trazer novas visitas.',text:'A política do Brasil Cartões descreve conteúdo por e-mail e comunicações entre marcas do grupo. Um retorno ao site pode gerar novas páginas e encaminhamentos elegíveis.',steps:['Contato com autorização','Mensagem relevante','Retorno ao conteúdo'],note:'Não observamos a sequência real de e-mails nem sua conversão. No modelo, os retornos são premissas e não duplicam as páginas da visita inicial.',sources:['brasil-policy']}
  };
  function renderMoney(key='ads') {
    const x=money[key];
    document.querySelectorAll('[data-money]').forEach(b=>{b.classList.toggle('active',b.dataset.money===key);b.setAttribute('aria-pressed',String(b.dataset.money===key));});
    $('money-detail').innerHTML=`<div><p class="kicker">${esc(x.label)}</p><h2>${esc(x.title)}</h2><p>${esc(x.text)}</p></div><div class="money-flow">${x.steps.map((s,i)=>`<div class="flow-node"><span>0${i+1}</span><strong>${esc(s)}</strong></div>${i<2?'<span class="flow-arrow" aria-hidden="true">→</span>':''}`).join('')}</div><p class="small muted">${esc(x.note)}</p>${sources(x.sources)}`;
  }
  document.querySelectorAll('[data-money]').forEach(b=>b.onclick=()=>renderMoney(b.dataset.money));
  const programsHtml=()=> (D.publicPrograms||[]).map(p=>`<article class="provider-row"><h3>${esc(p.name||p.product||p.title)}</h3><p><strong>${esc(p.rate||'')}</strong></p><p>${esc(p.summary||p.description||p.note||'')}</p>${sources(p.sourceIds)}</article>`).join('');
  $('provider-list').innerHTML=D.providers.map(p=>`<article class="provider-row"><h3>${esc(p.name)}</h3><p><strong>${esc(p.role)}.</strong> ${esc(p.relationship)}</p>${status(p.status)}${sources(p.sourceIds)}</article>`).join('') + `<h3>Programas públicos, sem vínculo contratual GM comprovado</h3>` + programsHtml();

  function renderRoute() {
    $('route-countries').innerHTML=Object.entries(countryNames).map(([c,n])=>`<button data-country="${c}" class="${c===routeCountry?'active':''}" aria-pressed="${c===routeCountry}">${n}</button>`).join('');
    const list=D.routes.filter(r=>r.country===routeCountry);
    if(!list.some(r=>r.id===routeId))routeId=list[0].id;
    $('route-select').innerHTML=list.map(r=>`<option value="${esc(r.id)}" ${r.id===routeId?'selected':''}>${esc(r.channel)} · ${esc(r.label)}</option>`).join('');
    const r=D.routes.find(r=>r.id===routeId); routeStep=Math.min(routeStep,r.steps.length-1);
    $('route-summary').innerHTML=`<div><span class="kicker">${esc(countryNames[r.country])} / ${esc(r.channel)}</span><h2>${esc(r.product)}</h2></div><p class="small"><strong>Página anunciante:</strong> ${esc(r.pageName||'Anunciante GM no Google')}<br><strong>Campanha:</strong> <code>${esc(r.campaign)}</code></p>`;
    $('journey').innerHTML=r.steps.map((s,i)=>`<button class="journey-step ${i===routeStep?'active':''}" data-step="${i}" aria-pressed="${i===routeStep}"><span class="step-number">${i+1}</span><strong>${esc(s.name)}</strong></button>${i<r.steps.length-1?'<span class="journey-arrow" aria-hidden="true">→</span>':''}`).join('');
    const s=r.steps[routeStep];
    $('route-detail').innerHTML=`<p class="kicker">ETAPA ${routeStep+1} DE ${r.steps.length}</p><h3>${esc(s.name)}</h3><p>${esc(s.note)}</p>${external(s.url,'Abrir esta página','button primary')}<p class="small url-label">${esc(new URL(s.url).hostname+new URL(s.url).pathname)}</p><div class="section-note"><strong>Limite da evidência:</strong> ${esc(r.limitation)}</div><details class="disclosure"><summary>Fontes e páginas do percurso</summary>${sources(r.sourceIds)}</details>`;
    $('route-countries').querySelectorAll('button').forEach(b=>b.onclick=()=>{routeCountry=b.dataset.country;routeStep=0;renderRoute();});
    $('journey').querySelectorAll('button').forEach(b=>b.onclick=()=>{routeStep=Number(b.dataset.step);renderRoute();});
  }
  $('route-select').onchange=e=>{routeId=e.target.value;routeStep=0;renderRoute();};

  const advanced=[['landingRate','Chegada por clique (%)',100,1,100,.1],['quizCompletion','Conclusão do quiz (%)',100,0,100,.1],['contentReach','Chegada ao conteúdo entre concluintes (%)',100,0,100,.1],['initialPages','Páginas iniciais por leitor',1,0,30,.1],['emailCapture','Captura entre concluintes (%)',100,0,100,.1],['returnPages','Páginas por retorno',1,0,30,.1],['fixedCosts','Fixos mensais atuais (R$)',1,0,1000000,100],['variableCost','Custo variável por visitante (R$)',1,0,100,.001],['taxRate','Provisão sobre receita (%)',100,0,100,.1]];
  $('advanced-controls').innerHTML=advanced.map(([k,label,,min,max,step])=>`<label class="control"><span>${label}</span><input id="adv-${k}" type="number" min="${min}" max="${max}" step="${step}"></label>`).join('');
  function resetCalc() {
    const p=M.presets[$('calc-country').value][$('calc-scenario').value];
    $('calc-rpm').value=p.rpm;$('calc-returns').value=p.returnVisits;$('calc-affiliate').value=0;
    advanced.forEach(([k,,factor])=>$(`adv-${k}`).value=(p[k] ?? M.defaults[k])*factor);
    renderCalc();
  }
  function calcParams() {
    const p={...M.presets[$('calc-country').value][$('calc-scenario').value]};
    const number=(id,fallback)=>{const el=$(id);if(el.value==='')return fallback;const n=Number(el.value);return Number.isFinite(n)?Math.min(Number(el.max)||1e12,Math.max(Number(el.min)||0,n)):fallback;};
    p.rpm=number('calc-rpm',30);p.returnVisits=number('calc-returns',.8);p.paidCpc=number('calc-cpc',.1);p.monthlyVisitors=number('calc-visitors',100000);p.affiliateRpv=number('calc-affiliate',0);
    advanced.forEach(([k,,factor])=>p[k]=number(`adv-${k}`,(p[k] ?? M.defaults[k])*factor)/factor);
    return p;
  }
  function resultCard(label,value,note='',cls='') {return `<div class="result-card ${cls}"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`;}
  const ceilingLabel = x => x===null?'Não definido':x<0?'Sem CPC viável':brl(x,4);
  function renderCalc() {
    let p,r;try{p=calcParams();r=M.calculate(p);}catch(e){$('calc-results').innerHTML='<p>Revise os valores informados.</p>';return;}
    $('rpm-value').textContent=brl(p.rpm,0);$('returns-value').textContent=fmt(p.returnVisits,1);
    $('calc-results').innerHTML=resultCard('Receita por visitante em 90 dias',brl(r.totalRpv90,4),`${fmt(r.pages90,2)} páginas por visitante`)+resultCard('CPC máximo para equilíbrio',ceilingLabel(r.breakEvenCpc),r.breakEvenCpc<0?`Teto calculado: ${brl(r.breakEvenCpc,4)}`:'Inclui os fixos no volume escolhido')+resultCard('Resultado mensal maduro',brl(r.monthlyResult,0),`Receita ${brl(r.monthlyRevenue,0)} · mídia ${brl(r.mediaCost,0)}`,r.monthlyResult>=0?'positive':'negative')+resultCard('CPC para margem de 20%',ceilingLabel(r.marginCpc),r.marginCpc<0?'Nem aquisição gratuita atinge 20%':'Após custos e provisão do modelo');
    const parts=[['Publicidade inicial',r.displayInitialRpv,'initial'],['Publicidade nos retornos',r.displayReturnRpv,'return'],['Comissões realizadas',p.affiliateRpv,'affiliate']];const max=Math.max(...parts.map(x=>x[1]),.00001);
    $('revenue-chart').innerHTML=`<h3>De onde vem a receita por visitante</h3>${parts.map(([label,value,cls])=>`<div class="bar-label"><span>${label}</span><strong>${brl(value,4)}</strong></div><div class="bar-track"><div class="bar-fill ${cls}" style="width:${value/max*100}%"></div></div>`).join('')}<div class="comparison-strip"><span>30 dias <strong>${brl(r.rpv30,4)}</strong></span><span>60 dias <strong>${brl(r.rpv60,4)}</strong></span><span>90 dias <strong>${brl(r.rpv90,4)}</strong></span></div>`;
    $('calc-explanation').textContent=`${fmt(r.contactsPerVisitor*100,1)} contatos por 100 visitantes. Retornos distribuídos em 50% / 30% / 20% nos três períodos. ${p.affiliateRpv>0?'Nesta simplificação, a comissão adicional é considerada realizada já no primeiro período. ':''}O resultado mensal pressupõe coortes maduras; não é o caixa do primeiro mês.`;
    $('scale-results').innerHTML=resultCard('Novos visitantes por mês',compact(r.scaleVisitors),`${compact(r.scalePages)} páginas por mês`)+resultCard('CPC de equilíbrio na escala',ceilingLabel(r.scaleBreakEvenCpc),'Com R$ 15 mil/mês de fixos')+resultCard('CPC para margem de 20%',ceilingLabel(r.scaleMarginCpc),'Teto econômico, não cotação de mídia')+resultCard('Mídia/mês nesse teto de 20%',r.scaleMarginMediaCost===null||r.scaleMarginMediaCost<0?'Sem valor viável':brl(r.scaleMarginMediaCost,0),`${compact(r.scaleContacts)} novos contatos por mês`);
    $('scale-note').innerHTML=`<strong>No CPC escolhido de ${brl(p.paidCpc,2)}:</strong> ${r.scaleMediaCost===null?'não é possível calcular a escala.':`mídia de ${brl(r.scaleMediaCost,0)}/mês e resultado de ${brl(r.scaleMonthlyResult,0)}/mês, nas mesmas premissas.`} Aumentar o volume sem manter a economia por visitante pode ampliar o prejuízo. R$ 5 milhões é receita anual; o trabalho dos sócios não está remunerado.`;
  }
  $('calc-country').onchange=resetCalc;$('calc-scenario').onchange=resetCalc;$('calc-reset').onclick=()=>{$('calc-cpc').value=.10;$('calc-visitors').value=100000;resetCalc();};
  document.querySelectorAll('.calculator-controls input').forEach(el=>el.addEventListener('input',renderCalc));

  const completedSteps=new Set();
  function renderPlaybook(){
    $('playbook-list').innerHTML=D.playbook.map((p,i)=>`<button class="playbook-item ${i===phase?'active':''}" data-phase="${i}" aria-pressed="${i===phase}"><span class="step-number">${esc(p.phase)}</span><strong>${esc(p.title)}</strong></button>`).join('');
    const p=D.playbook[phase];$('playbook-detail').innerHTML=`<p class="kicker">FASE ${esc(p.phase)}</p><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p><div class="checklist">${p.steps.map((s,i)=>`<label><input type="checkbox" data-check="${phase}-${i}" ${completedSteps.has(`${phase}-${i}`)?'checked':''}><span>${esc(s)}</span></label>`).join('')}</div><div class="section-note"><strong>Critério para avançar:</strong> ${esc(p.gate)}</div><p class="small muted">Checklist de planejamento desta sessão. Não registra execução nem contratação.</p>`;
    $('playbook-list').querySelectorAll('button').forEach(b=>b.onclick=()=>{phase=Number(b.dataset.phase);renderPlaybook();});
    $('playbook-detail').querySelectorAll('input').forEach(b=>b.onchange=()=>b.checked?completedSteps.add(b.dataset.check):completedSteps.delete(b.dataset.check));
  }
  const evidenceRows=rows=>rows.map(x=>`<article class="evidence-row"><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p>${x.sourceIds?.length?`<details><summary>Fontes</summary>${sources(x.sourceIds)}</details>`:''}</article>`).join('');
  $('known-list').innerHTML=evidenceRows(D.knowns);$('gap-list').innerHTML=evidenceRows(D.gaps);
  $('required-rpm').textContent=brl(5000000/(8000000*12)*1000,2);
  function renderSources(){const q=$('source-search').value.toLocaleLowerCase('pt-BR');const rows=D.sources.filter(s=>(s.title+' '+s.note+' '+s.type).toLocaleLowerCase('pt-BR').includes(q));$('source-list').innerHTML=rows.map(s=>`<article class="source-card"><span class="source-type">${esc(s.type)}</span><h3>${external(s.url,s.title)}</h3><p>${esc(s.note)}</p></article>`).join('')||'<p class="empty-state">Nenhuma fonte corresponde à busca.</p>';}
  $('source-search').oninput=renderSources;
  $('glossary-view').innerHTML=D.glossary.map(x=>`<article class="glossary-term"><h3>${esc(x.term)}</h3><p>${esc(x.definition)}</p></article>`).join('');
  document.querySelectorAll('[data-source-tab]').forEach(b=>b.onclick=()=>{const source=b.dataset.sourceTab==='sources';$('sources-view').hidden=!source;$('glossary-view').hidden=source;document.querySelectorAll('[data-source-tab]').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));});});
  $('build-programs').innerHTML=programsHtml();
  $('build-notes').innerHTML=(D.buildNotes||[]).map(n=>`<article class="provider-row"><h3>${esc(n.title)}</h3><p>${esc(n.description)}</p>${sources(n.sourceIds)}</article>`).join('');
  renderEntities();renderMoney();renderRoute();resetCalc();renderPlaybook();renderSources();showChapter(Math.max(0,hashes.indexOf(location.hash.slice(1))),false);
})();
