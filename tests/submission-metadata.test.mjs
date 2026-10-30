import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeSubmissionMetadata} from '../netlify/functions/_shared/submission-metadata.mjs';
const source='vaultara-inquiry';
const data={email:'test@example.invalid'};
const now='2026-10-30T12:00:00.000Z';
test('preserves valid provider IDs and timestamps',()=>{
 assert.deepEqual(normalizeSubmissionMetadata({id:'provider-12345678',created_at:now},source,data),
  {id:'provider-12345678',created:now});
});
test('invalid IDs are replaced with a deterministic safe ID',()=>{
 for(const id of [null,12,'../bad','short','a'.repeat(101)]){
  const a=normalizeSubmissionMetadata({id,created_at:now},source,data);
  const b=normalizeSubmissionMetadata({id,created_at:now},source,data);
  assert.match(a.id,/^[a-zA-Z0-9-]{8,100}$/);
  assert.equal(a.id,b.id);
 }
});
test('invalid timestamps fall back to a valid timestamp',()=>{
 for(const created_at of [null,45,'not-a-date']){
  assert.equal(normalizeSubmissionMetadata({id:'provider-12345678',created_at},source,data,now).created,now);
 }
});
