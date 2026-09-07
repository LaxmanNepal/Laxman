const https = require('node:https');
const { URL } = require('node:url');

const allowlist = {
  phone: new Set(['tasker_task', 'open_url']),
  github: new Set(['inspect_repo', 'inspect_workflows', 'create_pr']),
  website: new Set(['health_check']),
  notify: new Set(['notify'])
};

function requestJson(url, options = {}, body) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const req = https.request(target, { ...options, hostname: target.hostname, path: `${target.pathname}${target.search}`, port: target.port || 443 }, res => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed; try { parsed = data ? JSON.parse(data) : {}; } catch { parsed = { raw: data }; }
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(parsed);
        else reject(new Error(`http_${res.statusCode}`));
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function execute(spec) {
  const { agent, action, args = {} } = spec;
  if (!allowlist[agent] || !allowlist[agent].has(action)) throw new Error('executor_action_not_allowlisted');

  if (agent === 'phone') {
    if (action === 'open_url') {
      const value = String(args.url || '');
      if (!/^https:\/\//i.test(value)) throw new Error('only_https_urls_allowed');
      return { executed: false, adapter: 'tasker', action, url: value, message: 'Queue this action for Tasker execution.' };
    }
    return { executed: false, adapter: 'tasker', action, task: String(args.task || args.value || ''), message: 'Queue this action for Tasker execution.' };
  }

  if (agent === 'website' && action === 'health_check') {
    const target = String(args.url || '');
    if (!/^https:\/\//i.test(target)) throw new Error('only_https_urls_allowed');
    const u = new URL(target);
    return await new Promise((resolve, reject) => {
      const req = https.get(u, { timeout: 10000 }, res => {
        res.resume();
        resolve({ executed: true, status: res.statusCode, url: target });
      });
      req.on('timeout', () => req.destroy(new Error('timeout')));
      req.on('error', reject);
    });
  }

  if (agent === 'github') {
    const token = process.env.GITHUB_TOKEN;
    const api = process.env.GITHUB_API_URL || 'https://api.github.com';
    const repo = String(args.repository || process.env.GITHUB_REPOSITORY || '');
    if (!repo || !/^[^/]+\/[^/]+$/.test(repo)) throw new Error('invalid_repository');
    if (!token) return { executed: false, adapter: 'github', action, message: 'Set GITHUB_TOKEN in the gateway environment to enable GitHub API execution.' };
    const headers = { 'User-Agent': 'Laxman-Super-Phone', Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' };
    if (action === 'inspect_repo') return requestJson(`${api}/repos/${repo}`, { method: 'GET', headers });
    if (action === 'inspect_workflows') return requestJson(`${api}/repos/${repo}/actions/runs?per_page=10`, { method: 'GET', headers });
    if (action === 'create_pr') {
      const body = { title: String(args.title || ''), head: String(args.head || ''), base: String(args.base || 'main'), body: String(args.body || '') };
      if (!body.title || !body.head) throw new Error('title_and_head_required');
      return requestJson(`${api}/repos/${repo}/pulls`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' } }, body);
    }
  }

  if (agent === 'notify') return { executed: false, adapter: 'notification', message: String(args.message || '') };
  throw new Error('executor_not_implemented');
}

module.exports = { execute };
