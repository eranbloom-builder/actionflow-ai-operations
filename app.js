import {FIELDS,MISSING,STATUSES,emptyState,formatRows,parseEmail,importEmail,reminders,changeStatus} from './core.js';
import {sources,candidates} from './fixtures.js';
const $ = id=>document.getElementById(id);
let state=emptyState(),review=[],approved=false,emailId='demo-email-1',sequence=1;
const escape = value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function guard(fn){try{fn();$('alert').textContent='';}catch(e){$('alert').textContent=e.message;}}
function invalidate(){approved=false;$('import').disabled=true;$('approvalState').textContent='Review required';}
function reviewRender(){
 $('reviewEmpty').hidden=review.length>0;$('approve').disabled=!review.length;
 $('reviewRows').innerHTML=review.map((row,i)=>`<article class="review-card"><div class="review-top"><small>Candidate ${i+1} · evidence ${escape(row.sourceId||'PM supplied')}</small><button class="secondary" data-remove="${i}">Remove</button></div><div class="fields">${FIELDS.map(([label,key])=>`<label>${escape(label)}<input class="${row[key]===MISSING?'missing':''}" data-index="${i}" data-key="${key}" value="${escape(row[key])}"></label>`).join('')}</div></article>`).join('');
}
function registerRender(){
 $('register').innerHTML=state.items.map(row=>`<tr><td>${escape(row.action)}</td><td>${escape(row.owner)}</td><td>${escape(row.startDate)}</td><td>${escape(row.endDate)}</td><td>${escape(row.ownerEmail)}</td><td><select aria-label="Status for ${escape(row.action)}" data-id="${escape(row.id)}">${STATUSES.map(status=>`<option ${status===row.status?'selected':''}>${status}</option>`).join('')}</select></td></tr>`).join('');
 $('download').disabled=!state.items.length;
 $('events').innerHTML=state.events.length?state.events.map(e=>`<div class="event"><strong>Note to PM:</strong> ${escape(e.owner)} updated “${escape(e.action)}” from ${escape(e.from)} to <strong>${escape(e.to)}</strong>.<br><small>${escape(e.timestamp)}</small></div>`).join(''):'No status changes yet.';
}
function reminderRender(){
 const result=reminders(state.items,$('today').value);
 $('reminders').innerHTML=result.groups.length?result.groups.map(group=>`<article class="card"><small>Private Teams message preview · ${escape(group.email)}</small><h3>Hello ${escape(group.owner)}</h3>${[['overdue','Overdue'],['today','To do today'],['upcoming','Upcoming · next 7 days']].map(([key,label])=>`<strong>${label}</strong><ul>${group[key].length?group[key].map(row=>`<li>${escape(row.action)} · due ${escape(row.endDate)} · ${escape(row.status)}</li>`).join(''):'<li>None</li>'}</ul>`).join('')}<p>Please update your status in the <a href="#email">action register</a>.</p></article>`).join(''):'<p class="empty">No eligible open actions in this reminder window.</p>';
 $('exceptions').innerHTML=result.exceptions.length?`<div class="warning"><strong>PM exception queue · ${result.exceptions.length} record(s)</strong><ul>${result.exceptions.map(e=>`<li>${escape(e.action)} — ${escape(e.reason)}</li>`).join('')}</ul><p>These records stay in the register. Resolve the missing details before routing reminders.</p></div>`:'';
}
$('sources').innerHTML=sources.map(s=>`<article class="card"><small>${escape(s.type)} · ${escape(s.captured)} · ${escape(s.id)}</small><p>${escape(s.text)}</p></article>`).join('');
$('load').onclick=()=>guard(()=>{review=structuredClone(candidates);invalidate();reviewRender();$('review').scrollIntoView({behavior:'smooth'});});
$('reviewRows').oninput=e=>{if(e.target.dataset.key){review[Number(e.target.dataset.index)][e.target.dataset.key]=e.target.value;invalidate();}};
$('reviewRows').onclick=e=>{if(e.target.dataset.remove!==undefined){review.splice(Number(e.target.dataset.remove),1);invalidate();reviewRender();}};
$('approve').onclick=()=>guard(()=>{$('emailBody').value=formatRows(review);approved=true;emailId=`demo-email-${sequence++}`;$('import').disabled=false;$('approveEmail').disabled=false;$('approvalState').textContent='PM approved · email ready';});
$('emailBody').oninput=()=>{invalidate();$('approveEmail').disabled=!$('emailBody').value.trim();};
$('subject').oninput=invalidate;
$('approveEmail').onclick=()=>guard(()=>{parseEmail($('emailBody').value);if(!/\bactions?\b/i.test($('subject').value))throw new Error('Subject must contain action or action items.');approved=true;emailId=`demo-email-${sequence++}`;$('import').disabled=false;$('approvalState').textContent='Edited email approved';});
$('import').onclick=()=>guard(()=>{const result=importEmail(state,{id:emailId,subject:$('subject').value,body:$('emailBody').value,approved});$('importStatus').textContent=result.duplicate?'Duplicate email ignored. No extra rows created.':`${result.added} actions created with status Not started.`;registerRender();reminderRender();});
$('register').onchange=e=>guard(()=>{if(e.target.dataset.id){changeStatus(state,e.target.dataset.id,e.target.value);registerRender();reminderRender();}});
$('run').onclick=()=>guard(reminderRender);
$('download').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='actionflow-demo-register.json';link.click();URL.revokeObjectURL(url);};
$('reset').onclick=()=>{state=emptyState();review=[];approved=false;sequence=1;emailId='demo-email-1';$('emailBody').value='';$('subject').value='Action items — PM reviewed';$('today').value='2026-10-05';$('import').disabled=true;$('approveEmail').disabled=true;$('approvalState').textContent='';$('importStatus').textContent='';$('reminders').innerHTML='';$('exceptions').innerHTML='';$('alert').textContent='';reviewRender();registerRender();};
reviewRender();registerRender();
