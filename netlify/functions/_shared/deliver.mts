import {getStore} from '@netlify/blobs';
import {signSync} from './sync.mjs';
import {validateIntakeReceipt} from './intake-receipt.mjs';
import {resolveIntakeEndpoint} from './intake-endpoint.mjs';
export async function deliver(record:any){if(Netlify.env.get('CONTEXT')!=='production')throw Error('Preview intake delivery disabled pending isolation');const key=Netlify.env.get('VAULTARA_INTAKE_SYNC_KEY');if(!key)throw Error('Intake connection is not configured');const body=JSON.stringify(record);const timestamp=String(Date.now());const r=await fetch(resolveIntakeEndpoint(Netlify.env.get('CONTEXT'),Netlify.env.get('VAULTARA_TEST_INTAKE_URL')),{method:'POST',headers:{'Content-Type':'application/json','x-vaultara-time':timestamp,'x-vaultara-signature':signSync(body,timestamp,key)},body,signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error('Platform delivery not confirmed');
let receipt:any;
try{receipt=await r.json();}catch{throw Error('Platform delivery receipt missing');}
if(!validateIntakeReceipt(receipt,record.id)){
  throw Error('Platform delivery receipt does not match submission');
}}
export async function retryDeliveries(){if(Netlify.env.get('CONTEXT')!=='production')return 0;const store=getStore({name:'vaultara-intake-outbox',consistency:'strong'});let sent=0,examined=0;for await(const page of store.list({prefix:'pending/',paginate:true})){for(const b of page.blobs){if(sent>=3||examined>=100)return sent;examined++;try{const record=await store.get(b.key,{type:'json'}) as any;if(!record?.submission?.id)continue;await deliver(record.submission);await store.setJSON('receipts/'+record.submission.id,{deliveredAt:new Date().toISOString()});await store.delete(b.key);sent++;}catch{console.error('Vaultara queued intake delivery failed; item retained for retry');continue;}}}return sent;}
