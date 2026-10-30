import test from 'node:test';
import assert from 'node:assert/strict';
import {markRetryFailure} from '../netlify/functions/_shared/retry-metadata.mjs';

function storage(){
 const values=new Map();
 return {
  values,
  async get(key){return values.get(key)??null;},
  async setJSON(key,value){values.set(key,structuredClone(value));}
 };
}
test('failure diagnostics are separate from the pending submission',async()=>{
 const store=storage();
 const pending={submission:{id:'synthetic-12345678',data:{email:'test@example.invalid'}}};
 store.values.set('pending/synthetic-12345678',structuredClone(pending));
 await markRetryFailure(store,'pending/synthetic-12345678','2026-10-30T12:00:00Z');
 await markRetryFailure(store,'pending/synthetic-12345678','2026-10-30T13:00:00Z');
 assert.deepEqual(store.values.get('pending/synthetic-12345678'),pending);
 assert.deepEqual(store.values.get('retry-status/synthetic-12345678'),{attempts:2,lastAttemptAt:'2026-10-30T13:00:00Z'});
});
test('invalid pending keys do not create diagnostic entries',async()=>{
 const store=storage();
 assert.equal(await markRetryFailure(store,'receipts/other'),false);
 assert.equal(store.values.size,0);
});
