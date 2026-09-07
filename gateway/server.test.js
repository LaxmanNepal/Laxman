import test from 'node:test';
import assert from 'node:assert/strict';
import { needsApproval, authorize } from './security.js';

test('critical permissions require approval', () => {
  assert.equal(needsApproval('github.merge'), true);
  assert.equal(needsApproval('github.read'), false);
});

test('declared permission is allowed', () => {
  const agent = {id:'phone', permissions:['automation.trigger']};
  assert.deepEqual(authorize(agent, 'automation.trigger'), {allowed:true});
});

test('undeclared permission is denied', () => {
  const agent = {id:'phone', permissions:['automation.trigger']};
  assert.equal(authorize(agent, 'github.write_main').allowed, false);
});
