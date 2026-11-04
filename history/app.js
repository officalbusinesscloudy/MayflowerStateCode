import { foundations } from './data/foundations.js';
import { nationhood } from './data/nationhood.js';
import { twentieth } from './data/twentieth.js';
import { reference } from './data/reference.js';
import { appendix } from './data/appendix.js';
const articles=[...foundations,...nationhood,...twentieth,...reference,...appendix];
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const href=id=>'?article='+encodeURIComponent(id);
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const groups=[['Origins and colonial rule','origins'],['Revolution and nationhood','foundation'],['Modern history','modern'],['Counties, places, and people','reference']];
const timeline=[
['Before 1620','Indigenous settlements and regional trade networks develop along the coast and river valleys.','origins'],
['1620','Traditional date of the first documented European landing on the Mayflower coast.','colonial'],
['1625','Permanent Wallonian settlements emerge on the coast.','colonial'],
['1648','The settlement at Lander receives municipal recognition in colonial records.','colonial'],
['1700–1770','Pax Britannian trade, land claims, and political influence expand.','pax-landeria'],
['December 1771','Pax Britannia consolidates the province of Pax Landeria.','pax-landeria'],
['1774','Intercolonial protest committees coordinate opposition to royal taxation.','revolution'],
['January 1776','Revolutionary forces capture Lander and its royal administrative facilities.','revolution'],
['4 July 1776','The Union of Columbia declares independence; Mayflower joins the new confederation.','revolution'],
['3 September 1783','The War of Independence ends in a rebel victory.','revolution'],
['1780s','Mayflower replaces provisional administration with permanent constitutional institutions.','early-republic'],
['1820s','The four-county system of local government is consolidated.','early-republic'],
['1830s','Diamond Creek mineral discoveries encourage investment and inland transportation.','industrial'],
['1840s–1850s','Railways, workshops, mills, and port facilities expand.','industrial'],
['1861–1865','The Columbian Civil War tests the confederation; Mayflower supports the Union.','civil-war'],
['1870s–1890s','Rapid industrial growth, labor organization, and municipal reform transform the state.','gilded'],
['July 1903','The Home Guard Act establishes the foundations of the modern Mayflower National Guard.','guard'],
['1910s','Electrification, automobiles, modern public health and wartime production reshape daily life.','guard'],
['1912','Major river floods damage transport and industrial facilities along the Lander corridor.','disasters'],
['1918–1919','The influenza pandemic puts hospitals and public-health authorities under extraordinary strain.','disasters'],
['1929','The global financial contraction begins affecting Mayflower banks and industry.','depression'],
['1930s','Unemployment and public works become defining political issues.','depression'],
['1939–1945','Global war brings mass industrial mobilization and expanded military service.','depression'],
['1945–1960','Veterans return; housing, schooling, highways, and suburban growth accelerate.','postwar'],
['1954','A severe coastal storm damages towns, harbors, and utilities in the New Haven region.','disasters'],
['1960s','Civil rights campaigns, urban change, and government reform gain prominence.','postwar'],
['1970s','Industrial restructuring and fiscal strains intensify.','transition'],
['1978','A large warehouse fire in the Lander industrial corridor renews safety debates.','disasters'],
['1980s','Finance and services grow as older industrial districts face disinvestment.','transition'],
['1990–1991','A slowing economy, public-service pressures, and debates over state authority frame the present.','present']
];
function groupName(g){return groups.find(x=>x[1]===g)?.[0]||'Other'}
function renderNav(selected){$('history-nav').innerHTML=groups.map(([label,key])=>'<div class="history-group"><h2>'+esc(label)+'</h2>'+articles.filter(a=>a.group===key).map(a=>'<a href="'+href(a.id)+'" class="'+(a.id===selected?'active':'')+'">'+esc(a.title)+'</a>').join('')+'</div>').join('');$('timeline-nav-link').classList.toggle('active',new URLSearchParams(location.search).get('view')==='timeline')}
function renderHome(){
 document.title='History of Mayflower | State of Mayflower';
 return '<p class="archive-eyebrow">Historical archive · Through 1991</p>'+
 '<h2 class="archive-title">The State of Mayflower</h2>'+
 '<p class="archive-lead">Mayflower is a constituent state of the Union of Columbia, situated on the northeastern coast of the Columbian continent. One of the fourteen founding states, it has a history shaped by maritime settlement, the struggle for independence, industrial development, and the growth of Lander as a center of government and commerce.</p>'+
 '<p class="archive-opening">The historical record begins with the region’s indigenous communities and continues through the Wallonian settlements, the Pax Britannian colonial period, the founding of the Union in 1776, and the political and economic changes that followed. These articles trace Mayflower’s development to 1991, including the distinct histories of New Haven, Clark, Lee, and Elizabeth Counties.</p>'+
 '<div class="history-actions"><a href="?view=timeline">View historical timeline</a></div>'+
 groups.map(([label,key])=>'<section class="archive-home-group"><h3 class="archive-section-title">'+esc(label)+'</h3><div class="archive-grid">'+articles.filter(a=>a.group===key).map(card).join('')+'</div></section>').join('');
}
function card(a){return '<a class="archive-card" href="'+href(a.id)+'"><small>'+esc(a.period)+' · '+esc(groupName(a.group))+'</small><strong>'+esc(a.title)+'</strong><p>'+esc(a.summary)+'</p></a>'}
function renderArticle(a){document.title=a.title+' | History of Mayflower';const i=articles.indexOf(a),previous=articles[i-1],next=articles[i+1];return '<div class="archive-breadcrumb"><a href="./">Historical Archive</a> / '+esc(groupName(a.group))+'</div><p class="archive-eyebrow">'+esc(a.period)+' · '+esc(groupName(a.group))+'</p><h2 class="archive-title">'+esc(a.title)+'</h2><p class="archive-lead">'+esc(a.summary)+'</p><div class="article-meta">Mayflower historical record · 1991 edition</div><div class="history-actions"><a href="./">Archive contents</a><a href="?view=timeline">Timeline</a><button id="history-print" type="button">Print article</button><button id="history-copy" type="button">Copy link</button></div><nav class="article-outline" aria-label="In this article"><strong>Contents of this article</strong><div class="outline-links">'+a.sections.map((s,j)=>'<a href="#'+slug(a.id+'-'+j)+'">'+esc(s.heading)+'</a>').join('')+'</div></nav><article class="archive-prose">'+a.sections.map((s,j)=>'<section><h2 id="'+slug(a.id+'-'+j)+'">'+esc(s.heading)+'</h2>'+s.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+'</section>').join('')+'</article><nav class="article-nav" aria-label="Adjacent articles"><span>'+(previous?'<a href="'+href(previous.id)+'">← '+esc(previous.title)+'</a>':'')+'</span><span>'+(next?'<a href="'+href(next.id)+'">'+esc(next.title)+' →</a>':'')+'</span></nav>'}
function renderTimeline(){document.title='Historical Timeline | State of Mayflower';return '<p class="archive-eyebrow">Chronology · Through 1991</p><h2 class="archive-title">Historical Timeline</h2><p class="archive-lead">A chronological guide to major periods in the development of Mayflower. Dates prior to the modern period include traditional or approximate historical datings where noted in the associated chapters.</p><ol class="timeline-list">'+timeline.map(([date,event,id])=>'<li><span class="timeline-year">'+esc(date)+'</span><p>'+esc(event)+'</p><a href="'+href(id)+'">Read related history</a></li>').join('')+'</ol>'}
function renderSearch(query){document.title='Search History | State of Mayflower';const q=query.trim().toLocaleLowerCase();const matches=articles.filter(a=>[a.title,a.period,a.summary,groupName(a.group),...a.sections.flatMap(s=>[s.heading,...s.paragraphs])].join(' ').toLocaleLowerCase().includes(q));return '<p class="archive-eyebrow">Archive search</p><h2 class="archive-title">Search results</h2><p class="archive-lead">'+matches.length+' article'+(matches.length===1?'':'s')+' matched “'+esc(query)+'”.</p>'+(matches.length?'<div class="history-search-results">'+matches.map(card).join('')+'</div>':'<div class="no-results">No articles matched your search. Try another date, place, or historical topic.</div>')}
function route(){const p=new URLSearchParams(location.search),id=p.get('article'),q=p.get('q'),a=articles.find(x=>x.id===id);renderNav(a?.id||'');$('history-content').innerHTML=q?renderSearch(q):a?renderArticle(a):p.get('view')==='timeline'?renderTimeline():renderHome();const btn=$('history-print');if(btn)btn.addEventListener('click',()=>window.print());const copy=$('history-copy');if(copy)copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);$('history-status').textContent='Article link copied.'}catch{$('history-status').textContent='Copy the address from your browser.'}});if(id&&!a){$('history-status').textContent='That article was not found. Showing archive contents.'}}
const input=$('history-search');const p=new URLSearchParams(location.search);if(p.has('q'))input.value=p.get('q');let debounce;input.addEventListener('input',()=>{clearTimeout(debounce);debounce=setTimeout(()=>{const q=input.value.trim();const u=new URL(location.href);u.search=q?'?q='+encodeURIComponent(q):'';history.replaceState({},'',u);route()},240)});window.addEventListener('popstate',()=>{input.value=new URLSearchParams(location.search).get('q')||'';route()});route();