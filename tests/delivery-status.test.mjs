import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {hasConfirmedDelivery,pendingRecordMatchesKey} from '../netlify/functions/_shared/delivery-status.mjs';
const source=readFileSync(new URL('../netlify/functions/_shared/deliver.mts',import.meta.url),'utf8');
test('only valid receipt metadata confirms prior delivery',()=>{
 assert.equal(hasConfirmedDelivery({deliveredAt:'2026-10-30T12:00:00Z'}),true);
 for(const invalid of [null,{},[],{deliveredAt:null},{deliveredAt:'invalid'},{deliveredAt:123}]){
  assert.equal(hasConfirmedDelivery(invalid),false);
 }
});
test('retry checks existing receipt before delivering again',()=>{
 const check=source.indexOf("const confirmed=await store.get('receipts/'+record.submission.id");
 const skip=source.indexOf('if(hasConfirmedDelivery(confirmed))');
 const delivery=source.indexOf('await deliver(record.submission)');
 assert.ok(check>=0&&skip>check&&delivery>skip);
 assert.match(source,/if\(hasConfirmedDelivery\(confirmed\)\)\{await store\.delete\(b\.key\);continue;\}/);
});

test('pending key must match the submitted ID',()=>{
 const record={submission:{id:'valid-12345678'}};
 assert.equal(pendingRecordMatchesKey('pending/valid-12345678',record),true);
 for(const key of ['pending/other-12345678','receipts/valid-12345678','pending/../bad']){
  assert.equal(pendingRecordMatchesKey(key,record),false);
 }
 assert.equal(pendingRecordMatchesKey('pending/valid-12345678',{submission:{id:'../bad'}}),false);
 assert.match(source,/pendingRecordMatchesKey\(b\.key,record\)/);
});
