import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('nonproduction website submissions return before shared outbox access',()=>{
 const code=read('netlify/functions/submission-created.mts');
 const guard=code.indexOf("if(Netlify.env.get('CONTEXT')!=='production')return;");
 const queue=code.indexOf("getStore({name:'vaultara-intake-outbox'");
 assert.ok(guard>=0&&queue>guard);
});
test('nonproduction delivery cannot contact production dashboard',()=>{
 const code=read('netlify/functions/_shared/deliver.mts');
 const guard=code.indexOf("if(Netlify.env.get('CONTEXT')!=='production')throw Error(");
 const network=code.indexOf('await fetch(resolveIntakeEndpoint(');
 assert.ok(guard>=0&&network>guard);
});
test('nonproduction retry returns before shared queue access',()=>{
 const code=read('netlify/functions/_shared/deliver.mts');
 const guard=code.indexOf("if(Netlify.env.get('CONTEXT')!=='production')return 0;");
 const queue=code.indexOf("getStore({name:'vaultara-intake-outbox'");
 assert.ok(guard>=0&&queue>guard);
});
