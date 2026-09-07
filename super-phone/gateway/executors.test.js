const test = require('node:test');
const assert = require('node:assert/strict');
const { execute } = require('./executors');

test('phone adapter fails closed for non-https URL', async () => {
  await assert.rejects(() => execute({agent:'phone', action:'open_url', args:{url:'http://example.com'}}), /only_https_urls_allowed/);
});

test('github adapter does not require a token to load', async () => {
  const old = process.env.GITHUB_TOKEN;
  delete process.env.GITHUB_TOKEN;
  const result = await execute({agent:'github', action:'inspect_repo', args:{repository:'LaxmanNepal/Laxman'}});
  assert.equal(result.executed, false);
  if (old) process.env.GITHUB_TOKEN = old;
});

test('unknown executor action is blocked', async () => {
  await assert.rejects(() => execute({agent:'github', action:'delete_repo', args:{}}), /executor_action_not_allowlisted/);
});
