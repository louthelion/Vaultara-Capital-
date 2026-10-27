import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../netlify/functions/_shared/deliver.mts',import.meta.url),'utf8');
test('website intake delivery must validate structured acknowledgment',()=>{
 assert.match(source,/await r\.json\(\)/);
 assert.match(source,/receipt\?\.saved!==true/);
 assert.match(source,/receipt\?\.inquiryId!==String\(record\.id\)/);
 assert.match(source,/receipt\?\.taskId!=='intake-'\+String\(record\.id\)/);
 assert.match(source,/throw Error\('Platform delivery receipt does not match submission'\)/);
});
test('retry removes pending only after deliver returns',()=>{
 const deliverPosition=source.indexOf('await deliver(record.submission)');
 const receiptPosition=source.indexOf("await store.setJSON('receipts/'");
 const deletePosition=source.indexOf('await store.delete(b.key)');
 assert.ok(deliverPosition>=0&&receiptPosition>deliverPosition&&deletePosition>receiptPosition);
});
