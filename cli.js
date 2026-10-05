/** Local automation runner: node cli.js reviewed-email.json 2026-10-05 > result.json */
import {readFileSync} from 'node:fs';
import {emptyState,importEmail,reminders} from './core.js';
const [input,today]=process.argv.slice(2);
if(!input||!today){console.error('Usage: node cli.js <reviewed-email.json> <YYYY-MM-DD>');process.exit(1);}
try{
 const email=JSON.parse(readFileSync(input,'utf8'));
 const state=emptyState();const imported=importEmail(state,email);
 console.log(JSON.stringify({imported,register:state.items,reminderPreview:reminders(state.items,today)},null,2));
}catch(error){console.error(error.message);process.exit(1);}
