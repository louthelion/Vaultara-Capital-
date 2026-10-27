import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateIntakeReceipt} from '../netlify/functions/_shared/intake-receipt.mjs';
const source=readFileSync(new URL('../netlify/functions/_shared/deliver.mts',import.meta.url),'utf8');
const id='test-12345678';
test('accepts only a matching persisted inquiry and task acknowledgment',()=>{
 assert.equal(validateIntakeReceipt({saved:true,inquiryId:id,taskId:'intake-'+id},id),true);
 for(const invalid of [null,{},[],{saved:false,inquiryId:id,taskId:'intake-'+id},
 {saved:true,inquiryId:'other-12345678',taskId:'intake-'+id},
 {saved:true,inquiryId:id,taskId:'intake-other-12345678'},
 {saved:'true',inquiryId:id,taskId:'intake-'+id}]){
  assert.equal(validateIntakeReceipt(invalid,id),false);
 }
 assert.equal(validateIntakeReceipt({saved:true,inquiryId:id,taskId:'intake-'+id},'bad/id'),false);
});
test('delivery rejects a missing or invalid receipt',()=>{
 assert.match(source,/await r\.json\(\)/);
 assert.match(source,/validateIntakeReceipt\(receipt,record\.id\)/);
 assert.match(source,/Platform delivery receipt does not match submission/);
});
test('retry removes pending only after deliver returns',()=>{
 const deliverPosition=source.indexOf('await deliver(record.submission)');
 const receiptPosition=source.indexOf("await store.setJSON('receipts/'");
 const deletePosition=source.indexOf('await store.delete(b.key)');
 assert.ok(deliverPosition>=0&&receiptPosition>deliverPosition&&deletePosition>receiptPosition);
});

test('retry continues after an individual delivery failure',()=>{
 assert.match(source,/catch\{console\.error\('Vaultara queued intake delivery failed; item retained for retry'\);continue;\}/);
 assert.match(source,/paginate:true/);
 assert.match(source,/examined>=100/);
 assert.match(source,/if\(sent>=3\|\|examined>=100\)return sent/);
});
