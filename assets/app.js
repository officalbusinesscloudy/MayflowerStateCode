const $=id=>document.getElementById(id);
const state={data:null,sections:[],chapterById:new Map(),titleById:new Map()};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-|-$/g,'');
const params=()=>new URLSearchParams(location.search);
const href=(key,value)=>'?'+key+'='+encodeURIComponent(value);
const sectionUrl=(number,sub='')=>href('section',number)+(sub?'#section-'+slug(number)+'-'+sub:'');
function sectionParts(section){const chapter=state.chapterById.get(section.chapter_id),title=state.titleById.get(chapter?.title_id),match=String(section.number).match(/^(\d+)[-.](\d+[a-z]?)$/i);return {title:String(section.title_number||title?.number||match?.[1]||''),number:String(section.section_number||match?.[2]||section.number)}}
function citation(section,sub=''){const p=sectionParts(section);return (p.title?p.title+' M.S.C. § ':'§ ')+p.number+(sub?'('+sub+')':'')}
function findSection(title,num){return state.sections.find(s=>{const p=sectionParts(s);return (!title||p.title.toLowerCase()===title.toLowerCase())&&(p.number.toLowerCase()===num.toLowerCase()||String(s.number).toLowerCase()===num.toLowerCase())})}
const chapterUrl=id=>href('chapter',id);
const titleUrl=id=>href('title',id);
function extractParagraphs(s){let path=[],parts=String(s||'').split(/\n\s*\n/);return parts.map((raw,i)=>{const markers=[...raw.matchAll(/^\s*\(([a-z]|[ivxlcdm]+|\d+)\)/g)];const m=markers[0]?.[1];if(m){const marker=String(m).toLowerCase(); if(/^[a-z]$/.test(marker)&&!/^[ivx]$/.test(marker)){path=[marker]}else if(/^[a-z]$/.test(marker)&&(!path.length||path.length>1)){path=[marker]}else if(path.length){path=[path[0],marker]}else{path=[marker]}}return {raw,path:m?[...path]:[],id:'paragraph-'+i}})}
function normalizeLegalReference(value){return String(value||'').toLowerCase().replace(/\\b(mayflower state code|m\\.?s\\.?c\\.?|msc)\\b/g,'msc').replace(/\\s+/g,' ').replace(/\\s*§\\s*/g,' § ').replace(/\\s*\\(\\s*/g,'(').replace(/\\s*\\)\\s*/g,')').trim().replace(/[.;,]+$/,'')}
function citationAliases(section){
 const p=sectionParts(section),aliases=[section.number,citation(section),p.title+' MSC § '+p.number,p.title+' M.S.C. § '+p.number];
 const legacy=section.legacy||{};
 for(const value of [...(legacy.old_ids||[]),...(legacy.old_citations||[]),...(legacy.citations||[]),legacy.old_citation,legacy.citation,section.old_citation])if(value)aliases.push(String(value));
 return aliases;
}
function resolveLegalReference(text){
 const key=normalizeLegalReference(text);
 const matched=state.sections.filter(section=>citationAliases(section).some(alias=>normalizeLegalReference(alias)===key));
 return matched.length===1?matched[0]:null;
}
function markup(raw){
 // Match legacy title/subtitle references before ordinary title-section and bare section references.
 const re=/\\b\\d+\\s*M\\.?S\\.?C\\.?\\s+\\d+\\s*§\\s*\\d+[a-z]?(?:\\([a-z0-9ivxlcdm]+\\))*|\\b\\d+\\s*M\\.?S\\.?C\\.?\\s*§\\s*\\d+[a-z]?(?:\\([a-z0-9ivxlcdm]+\\))*|(?:§\\s*|Section\\s+)\\d+[a-z]?(?:[-.]\\d+[a-z]?)*(?:\\([a-z0-9ivxlcdm]+\\))?/gi;
 let out='',last=0;
 for(const m of String(raw||'').matchAll(re)){
  out+=esc(raw.slice(last,m.index));
  const original=m[0],subMatch=original.match(/\\(([a-z0-9ivxlcdm]+)\\)$/i);
  const base=subMatch?original.slice(0,-subMatch[0].length):original;
  const p=base.match(/(?:^|\\s)(\\d+)\\s*M\\.?S\\.?C\\.?\\s*§\\s*(\\d+[a-z]?)$/i);
  const short=base.match(/(?:§\\s*|Section\\s+)(\\d+[a-z]?(?:[-.]\\d+[a-z]?)?)$/i);
  let target=resolveLegalReference(base);
  if(!target&&p)target=findSection(p[1],p[2]);
  if(!target&&short)target=state.sections.filter(s=>sectionParts(s).number.toLowerCase()===short[1].toLowerCase()).length===1?state.sections.find(s=>sectionParts(s).number.toLowerCase()===short[1].toLowerCase()):null;
  const sub=subMatch?.[1]||'';
  out+=target?'<a href="'+esc(sectionUrl(target.number,sub))+'" title="Current citation">'+esc(citation(target,sub))+'</a>':esc(original);
  last=m.index+original.length;
 }
 return out+esc(raw.slice(last));
}
function sectionParas(section,seen=new Map()){return extractParagraphs(section.text).map((p,i)=>{const stem='section-'+slug(section.number)+(p.path.length?'-'+p.path.join('-'):'-p'+(i+1));const used=seen.get(stem)||0;seen.set(stem,used+1);const id=used?stem+'-'+(used+1):stem;return '<p id="'+esc(id)+'">'+markup(p.raw)+'</p>'}).join('')}
function alphaLabel(n){let result='';for(let x=n+1;x>0;x=Math.floor((x-1)/26))result=String.fromCharCode(97+(x-1)%26)+result;return result}
function provisionParagraphs(text,mode){return String(text||'').split(/\n\s*\n/).map(raw=>{let content=raw.trim();if(mode==='numbered')content=content.replace(/^\(([a-z])\)\s*/i,(_,v)=>'('+String(v.toLowerCase().charCodeAt(0)-96)+') ');if(mode==='lettered')content=content.replace(/^\(([a-z])\)\s*/i,(_,v)=>'('+v.toUpperCase()+') ');return '<p>'+markup(content)+'</p>'}).join('')}
function renderUnits(section,units,level,partIndex=0){
 const nested=units.length>1;
 return units.map((text,i)=>{
   const label=nested?(level==='numeric'?'('+String(i+1)+')':'('+alphaLabel(i)+')'):'';
   const id='section-'+slug(section.number)+(level==='numeric'?'-'+alphaLabel(partIndex)+'-'+(i+1):'-'+alphaLabel(i));
   const paragraphs=provisionParagraphs(text,nested?(level==='numeric'?'lettered':'numbered'):'');
   return nested?'<div class="statute-clause '+(level==='numeric'?'nested-clause':'')+'" id="'+esc(id)+'"><span class="statute-marker">'+label+'</span><div class="statute-clause-text">'+paragraphs+'</div></div>':paragraphs
 }).join('')
}
function renderStatute(section){
 if(!section.parts?.length)return section.units?.length?renderUnits(section,section.units,'alpha'):sectionParas(section);
 const many=section.parts.length>1;
 return section.parts.map((part,i)=>{
   const units=part.units||[part.text||''];
   const head='<h3 class="part-heading">'+esc(part.heading)+'</h3>';
   const body=renderUnits(section,units,many?'numeric':'alpha',i);
   return many?'<section class="statute-clause part-clause" id="section-'+slug(section.number)+'-'+alphaLabel(i)+'"><span class="statute-marker">('+alphaLabel(i)+')</span><div class="statute-clause-text">'+head+body+'</div></section>':head+body;
 }).join('')
}
function breadcrumbs(items){return '<div class="breadcrumbs"><a href="./">Code Contents</a>'+items.map(x=>' / '+(x.url?'<a href="'+esc(x.url)+'">'+esc(x.label)+'</a>':esc(x.label))).join('')+'</div>'}
function catalog(){const d=state.data;return '<h2>Code Contents</h2><p class="draft-notice">Consolidation draft — provisions are not enacted by publication on this website.</p>'+(!d.titles.length?'<div class="empty-note"><strong>No statutes published yet.</strong><p>Titles and sections will appear here when added to the Code.</p></div>':'<div class="catalog">'+d.titles.map(t=>{const ch=d.chapters.filter(c=>c.title_id===t.id),sc=ch.flatMap(c=>state.sections.filter(s=>s.chapter_id===c.id));return '<a href="'+esc(titleUrl(t.id))+'"><span class="code-label">Title '+esc(t.number)+'</span><strong>'+esc(t.heading)+'</strong>'+(ch.length?'<small>'+ch.length+' chapter(s) · '+sc.length+' section(s)</small>':'')+'</a>'}).join('')+'</div>')}
function titleView(t){const ch=state.data.chapters.filter(c=>c.title_id===t.id);return breadcrumbs([{label:'Title '+t.number}])+'<div class="code-label">Title '+esc(t.number)+'</div><h2>'+esc(t.heading)+'</h2>'+(ch.length?'<div class="catalog">'+ch.map(c=>'<a href="'+esc(chapterUrl(c.id))+'"><span class="code-label">Chapter '+esc(c.number)+'</span><strong>'+esc(c.heading)+'</strong><small>'+state.sections.filter(s=>s.chapter_id===c.id).length+' section(s)</small></a>').join('')+'</div>':'<p class="empty-note">No chapters are published under this title.</p>')}
function chapterView(c){const t=state.titleById.get(c.title_id),sections=state.sections.filter(s=>s.chapter_id===c.id);return breadcrumbs([{label:'Title '+(t?.number||''),url:titleUrl(c.title_id)},{label:'Chapter '+c.number}])+'<div class="code-label">Chapter '+esc(c.number)+'</div><h2>'+esc(c.heading)+'</h2>'+(sections.length?'<ul class="section-list">'+sections.map(s=>'<li><a href="'+esc(sectionUrl(s.number))+'"><span>'+esc(s.heading)+'</span><span class="num">'+esc(citation(s))+'</span></a></li>').join('')+'</ul>':'<p class="empty-note">No sections are published in this chapter.</p>')}
async function copy(str){try{await navigator.clipboard.writeText(str);$('status').textContent='Copied to clipboard.'}catch{$('status').textContent='Copy manually: '+str}}
function displayPenalty(section){
 // Imported penalty fields are not verified against currently enacted text.
 // Prevent obsolete classification, confinement, and fines from appearing authoritative.
 return '';
}
function sectionView(s){const c=state.chapterById.get(s.chapter_id),t=state.titleById.get(c?.title_id),idx=state.sections.indexOf(s);let html=breadcrumbs([{label:'Title '+(t?.number||''),url:t?titleUrl(t.id):null},{label:'Chapter '+(c?.number||''),url:c?chapterUrl(c.id):null},{label:citation(s)}])+'<div class="code-label">Mayflower State Code</div><div class="code-citation">'+esc(citation(s))+'</div><h2 class="section-title">'+esc(s.heading)+'</h2><p class="title-context">Title '+esc(t?.number||'')+' — '+esc(t?.heading||'')+'</p><div class="actions"><button id="copy-citation">Copy citation</button><button id="copy-link">Copy link</button><a href="javascript:window.print()" id="print-link">Print section</a></div><article class="statute">'+renderStatute(s)+'</article>';html+=displayPenalty(s) html+='<div class="nav-arrows">'+(idx>0?'<a href="'+esc(sectionUrl(state.sections[idx-1].number))+'">← Previous section</a>':'<span></span>')+(idx<state.sections.length-1?'<a href="'+esc(sectionUrl(state.sections[idx+1].number))+'">Next section →</a>':'<span></span>')+'</div>';return html}
function navigate(){if(!state.data)return;const p=params();let html='',s=state.sections.find(s=>String(s.number).toLowerCase()===String(p.get('section')||'').toLowerCase()||(s.legacy?.old_ids||[]).some(x=>String(x).toLowerCase()===String(p.get('section')||'').toLowerCase())),c=state.chapterById.get(p.get('chapter')),t=state.titleById.get(p.get('title'));$('status').textContent='';if(p.has('q')){html=searchResults(p.get('q'))}else if(s){html=sectionView(s)}else if(c){html=chapterView(c)}else if(t){html=titleView(t)}else{html=catalog();if(p.has('section')||p.has('chapter')||p.has('title'))$('status').textContent='Requested provision not found.'}$('content').innerHTML=html;document.querySelectorAll('[data-toc]').forEach(el=>el.classList.toggle('active',el.getAttribute('href')===location.search));if(s){$('copy-citation').addEventListener('click',()=>copy(citation(s)));$('copy-link').addEventListener('click',()=>copy(location.href));$('print-link').addEventListener('click',e=>{e.preventDefault();window.print()})}if(location.hash){requestAnimationFrame(()=>document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({block:'center'}))}}
function searchResults(q){q=String(q||'').trim().slice(0,200);$('search').value=q;if(!q)return '<div class="empty-note">Enter a citation or search phrase.</div>';const exact=q.match(/^(?:(\d+[a-z]?)\s*m\.?s\.?c\.?\s*§?\s*)?(?:§\s*|section\s+)?(\d+[a-z]?(?:[-.]\d+[a-z]?)?)(?:\(([a-z0-9ivxlcdm]+)\))?$/i);if(exact){const match=findSection(exact[1]||'',exact[2]);if(match){const sub=exact[3]||'';return '<div class="code-label">Citation match</div><h2>Search results</h2><a class="result" href="'+esc(sectionUrl(match.number,sub))+'"><strong>'+esc(citation(match,sub))+'. '+esc(match.heading)+'</strong><span class="result-meta">Open matching provision</span></a>'}}const lower=q.toLowerCase(),matches=state.sections.filter(s=>(citation(s)+' '+s.number+' '+s.heading+' '+s.text+' '+(s.keywords||[]).join(' ')).toLowerCase().includes(lower));return '<div class="code-label">Full-text search</div><h2>Search results</h2><p class="result-meta">'+matches.length+' matching section(s)</p>'+(matches.length?matches.map(s=>{const text=s.text||'',i=text.toLowerCase().indexOf(lower),excerpt=i<0?'':text.slice(Math.max(0,i-65),i+q.length+120).replace(/\s+/g,' ');return '<a class="result" href="'+esc(sectionUrl(s.number))+'"><strong>§ '+esc(s.number)+'. '+esc(s.heading)+'</strong><p>'+esc(excerpt||s.heading)+'</p></a>'}).join(''):'<p class="empty-note">No sections match this search.</p>')}
function toc(){const f=$('filter').value.toLowerCase().trim(),d=state.data;$('toc').innerHTML=d.titles.map(t=>{const ch=d.chapters.filter(c=>c.title_id===t.id);const inner=ch.map(c=>{const sections=state.sections.filter(s=>s.chapter_id===c.id);if(f&&!([t.heading,t.number,c.heading,c.number,...sections.flatMap(s=>[s.number,s.heading])].join(' ').toLowerCase().includes(f)))return '';return '<li><a data-toc href="'+esc(chapterUrl(c.id))+'">Chapter '+esc(c.number)+'. '+esc(c.heading)+'</a></li>'}).join('');if(f&&!inner&&!String(t.heading+' '+t.number).toLowerCase().includes(f))return '';return '<div><a class="toc-title" data-toc href="'+esc(titleUrl(t.id))+'"><small>TITLE '+esc(t.number)+'</small>'+esc(t.heading)+'</a><ul class="toc-chapters">'+inner+'</ul></div>'}).join('')||'<p class="result-meta">No matching titles.</p>'}
function isStandaloneShortTitle(s){
 const heading=String(s.heading||'').trim();
 const body=String(s.text||'').trim();
 return /^(?:subchapter\\s+[ivxlcdm]+\\s*[—–:-]\\s*)?short title\\.?$/i.test(heading)
  || (/^short title$/i.test(heading)&&/^(?:this (?:chapter|act|title)|the (?:chapter|act))\\b/i.test(body));
}
function validate(d){if(!d||!Array.isArray(d.titles)||!Array.isArray(d.chapters)||!Array.isArray(d.sections))throw Error('Invalid Code dataset');const ids=new Set(),chap=new Set(),nums=new Set();for(const t of d.titles){if(!t.id||ids.has(t.id))throw Error('Invalid or duplicated title identifier');ids.add(t.id)}for(const c of d.chapters){if(!c.id||chap.has(c.id)||!ids.has(c.title_id))throw Error('Invalid chapter reference');chap.add(c.id)}for(const s of d.sections){if(!s.number||nums.has(String(s.number).toLowerCase())||!chap.has(s.chapter_id)||typeof s.text!=='string')throw Error('Invalid section reference or text');nums.add(String(s.number).toLowerCase())}return d}
async function init(){try{const r=await fetch(new URL('../data/code.json',import.meta.url),{cache:'no-cache'});if(!r.ok)throw Error('HTTP '+r.status);const d=validate(await r.json());d.sections=d.sections.filter(s=>!isStandaloneShortTitle(s));state.data=d;state.sections=d.sections.filter(s=>!isStandaloneShortTitle(s));state.chapterById=new Map(d.chapters.map(c=>[c.id,c]));state.titleById=new Map(d.titles.map(t=>[t.id,t]));toc();navigate()}catch(e){$('content').innerHTML='<div class="empty-note">The Code dataset could not be loaded. Check data/code.json and reload the page.</div>';$('status').textContent=String(e.message)}}$('search-form').addEventListener('submit',e=>{e.preventDefault();go(href('q',$('search').value.trim()))});$('filter').addEventListener('input',toc);$('contents-toggle').addEventListener('click',()=>{let open=$('contents').classList.toggle('open');$('contents-toggle').setAttribute('aria-expanded',String(open))});document.addEventListener('click',e=>{const a=e.target.closest('a[href^="?"]');if(!a)return;e.preventDefault();go(a.getAttribute('href'));if(innerWidth<851){$('contents').classList.remove('open');$('contents-toggle').setAttribute('aria-expanded','false')}});window.addEventListener('popstate',navigate);window.addEventListener('hashchange',()=>{if(location.hash)document.getElementById(location.hash.slice(1))?.scrollIntoView()});function go(url){history.pushState({},'',url);navigate();if(!url.includes('#'))window.scrollTo({top:0,behavior:'instant'})}init();