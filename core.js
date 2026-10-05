/** Pure business rules shared by the browser demo and tests. No external services. */
export const MISSING = 'missing information';
export const FIELDS = [['Action','action'],['Owner','owner'],['Start date','startDate'],['End date','endDate'],["Owner's email address",'ownerEmail']];
export const STATUSES = ['Not started','In progress','Blocked','Completed','Cancelled'];
export function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value+'T00:00:00Z').toISOString().slice(0,10) === value;
}
export function validate(row) {
  for (const [,key] of FIELDS) {
    if (typeof row[key] !== 'string' || !row[key].trim()) throw new Error(`${key}: use a value or "${MISSING}".`);
    if (/[|\r\n]/.test(row[key])) throw new Error(`${key}: pipes and line breaks would break the email format.`);
  }
  if (row.action === MISSING) throw new Error('Action description is required. Remove an unsupported candidate.');
  for (const key of ['startDate','endDate']) if (row[key] !== MISSING && !validDate(row[key])) throw new Error(`${key}: use YYYY-MM-DD or "${MISSING}".`);
  if (row.ownerEmail !== MISSING && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.ownerEmail)) throw new Error('Owner email must be valid or missing information.');
  if (row.startDate !== MISSING && row.endDate !== MISSING && row.endDate < row.startDate) throw new Error('End date precedes start date. Review the dates.');
  return row;
}
export function formatRows(rows) {
  if (!rows.length) throw new Error('At least one reviewed action is required.');
  return rows.map(row => { validate(row); return FIELDS.map(([label,key]) => `${label}: ${row[key].trim()}`).join(' | '); }).join('\n');
}
export function parseEmail(body) {
  const lines = body.split(/\r?\n/).filter(line => line.trim());
  if (!lines.length) throw new Error('No action lines found.');
  return lines.map((line,index) => {
    const parts = line.split('|');
    if (parts.length !== FIELDS.length) throw new Error(`Line ${index+1}: expected exactly five fields.`);
    const row = {};
    FIELDS.forEach(([label,key],i) => {
      const part = parts[i].trim(), prefix = label+':';
      if (!part.startsWith(prefix)) throw new Error(`Line ${index+1}: expected ${label} in field ${i+1}.`);
      row[key] = part.slice(prefix.length).trim();
    });
    return validate(row);
  });
}
export function importEmail(state, {id,subject,body,approved}) {
  if (!approved) throw new Error('PM approval is required before importing.');
  if (!id || !/\bactions?\b/i.test(subject)) throw new Error('Email needs an ID and an action/action items subject.');
  if (state.processedEmails.includes(id)) return {added:0,duplicate:true};
  const parsed = parseEmail(body); // Validate the entire batch before mutating.
  const unique = [...new Map(parsed.map(row => [JSON.stringify(row),row])).values()];
  unique.forEach((row,i) => state.items.push({...row,id:`${id}:${i+1}`,status:'Not started'}));
  state.processedEmails.push(id);
  return {added:unique.length,duplicate:false};
}
export function bucket(row,today) {
  if (!validDate(today)) throw new Error('Choose a valid reminder date.');
  if (['Completed','Cancelled'].includes(row.status)) return 'closed';
  if (row.endDate === MISSING || !validDate(row.endDate)) return 'missing due date';
  if (row.endDate < today) return 'overdue';
  if (row.endDate === today) return 'today';
  const horizon = new Date(today+'T00:00:00Z'); horizon.setUTCDate(horizon.getUTCDate()+7);
  return row.endDate <= horizon.toISOString().slice(0,10) ? 'upcoming' : 'later';
}
export function reminders(items,today) {
  const groups = new Map(), exceptions = [];
  for (const row of items) {
    const category = bucket(row,today);
    if (category === 'closed') continue;
    if (row.ownerEmail === MISSING || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.ownerEmail) || category === 'missing due date') {
      exceptions.push({id:row.id,action:row.action,reason:row.ownerEmail === MISSING ? 'Missing owner email' : category === 'missing due date' ? 'Missing due date' : 'Invalid owner email'}); continue;
    }
    if (category === 'later') continue;
    const key = row.ownerEmail.toLowerCase();
    if (!groups.has(key)) groups.set(key,{email:key,owner:row.owner,overdue:[],today:[],upcoming:[]});
    groups.get(key)[category].push(row);
  }
  return {groups:[...groups.values()],exceptions};
}
export function changeStatus(state,id,status,timestamp=new Date().toISOString()) {
  if (!STATUSES.includes(status)) throw new Error('Unsupported status.');
  const row = state.items.find(x=>x.id===id);
  if (!row) throw new Error('Action not found.');
  if (row.status === status) return null;
  const event = {id,action:row.action,owner:row.owner,from:row.status,to:status,timestamp};
  row.status = status; state.events.push(event); return event;
}
export function emptyState() { return {items:[],processedEmails:[],events:[]}; }
