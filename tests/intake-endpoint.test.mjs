import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveIntakeEndpoint} from '../netlify/functions/_shared/intake-endpoint.mjs';

const production='https://vaultara-capital-dashboard.netlify.app/api/intake-sync';
const isolated='https://vaultara-integration-test.netlify.app/api/intake-sync';

test('production always uses fixed dashboard destination',()=>{
 assert.equal(resolveIntakeEndpoint('production'),production);
 assert.equal(resolveIntakeEndpoint('production',isolated),production);
});
test('isolated endpoint resolver validates a separate HTTPS Netlify site',()=>{
 assert.equal(resolveIntakeEndpoint('deploy-preview',isolated,'vaultara-integration-test.netlify.app'),isolated);
 for(const invalid of [
  undefined,'http://vaultara-integration-test.netlify.app/api/intake-sync',
  production,'https://vaultara-integration-test.netlify.app/other',
  'https://vaultara-integration-test.netlify.app/api/intake-sync?token=secret',
  'https://vaultara-integration-test.netlify.app.evil.com/api/intake-sync',
  'https://user:pass@vaultara-integration-test.netlify.app/api/intake-sync'
 ])assert.throws(()=>resolveIntakeEndpoint('deploy-preview',invalid,'vaultara-integration-test.netlify.app'));
});

test('test destination must exactly match explicitly approved host',()=>{
 assert.throws(()=>resolveIntakeEndpoint('deploy-preview',isolated));
 assert.throws(()=>resolveIntakeEndpoint('deploy-preview',isolated,'another-test.netlify.app'));
});
