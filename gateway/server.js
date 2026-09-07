import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { authorize, constantTimeEqual } from './security.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(fs.readFileSync(path.join(root, 'agents.json'), 'utf8'));
const HOST = process.env.LAXMAN_GATEWAY_HOST || '127.0.0.1';
const PORT = Number(process.env.LAXMAN_GATEWAY_PORT || 8787);
const TOKEN = process.env.LAXMAN_GATEWAY_TOKEN || '';
const TTL = Number(process.env.LAXMAN_APPROVAL_TTL_SECONDS || 600) * 1000;
const MAX = Number(process.env.LAXMAN_MAX_BODY_BYTES || 16384);
const approvals = new Map();
const audit = [];

if (!TOKEN) console.warn('WARNING: LAXMAN_GATEWAY_TOKEN is not set. Authenticated routes will reject requests.');

function log(event) {
  audit.push({ ts: new Date().toISOString(), ...event });
  if (audit.length > 500) audit.shift();
}

function json(res, status, body) {
  res.writeHead(status, {'content-type':'application/json; charset=utf-8','cache-control':'no-store'});
  res.end(JSON.stringify(body));
}

function auth(req) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  return TOKEN && constantTimeEqual(token, TOKEN);
}

async function body(req) {
  let data = '';
  for await (const chunk of req) {
    data += chunk;
    if (Buffer.byteLength(data) > MAX) throw new Error('body_too_large');
  }
  return data ? JSON.parse(data) : {};
}

function route(text) {
  const t = String(text).toLowerCase().trim();
  if (/(github|workflow|repository|repo|pull request|pr)/.test(t)) return {agent:'github', permission:'github.read', action:'github.status'};
  if (/(open|launch|start).*(app|application)/.test(t) || /work mode|creator mode|focus mode/.test(t)) return {agent:'phone', permission:'automation.trigger', action:'automation.trigger'};
  if (/research|search|find information|compare/.test(t)) return {agent:'research', permission:'web.research', action:'web.research'};
  if (/status|health|ping/.test(t)) return {agent:'commander', permission:'status.read', action:'status.read'};
  if (/merge|delete|send message|security|transaction/.test(t)) return {agent:'security', permission: /(merge)/.test(t)?'github.merge':/(delete)/.test(t)?'phone.delete_file':/(message)/.test(t)?'phone.send_message':/(transaction)/.test(t)?'finance.transaction':'account.change_security', action:'sensitive.action'};
  return {agent:'commander', permission:'agent.route', action:'agent.route'};
}

function findAgent(id) { return registry.agents.find(a => a.id === id); }

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/health') return json(res, 200, {ok:true, service:'laxman-super-phone-gateway', version:1});
    if (!auth(req)) return json(res, 401, {ok:false,error:'unauthorized'});

    if (req.method === 'GET' && req.url === '/agents') return json(res, 200, {ok:true, agents:registry.agents});
    if (req.method === 'GET' && req.url === '/audit') return json(res, 200, {ok:true, entries:audit});

    if (req.method === 'POST' && req.url === '/command') {
      const input = await body(req);
      if (!input.text) return json(res, 400, {ok:false,error:'text_required'});
      const plan = route(input.text);
      const agent = findAgent(plan.agent);
      const decision = authorize(agent, plan.permission);
      const id = crypto.randomUUID();
      if (decision.approvalRequired) {
        approvals.set(id, {id, plan, createdAt:Date.now(), expiresAt:Date.now()+TTL, approved:false});
        log({type:'approval_requested', id, plan});
        return json(res, 202, {ok:true,status:'approval_required',approvalId:id,plan});
      }
      log({type:'command', text:input.text, plan, decision});
      return json(res, 200, {ok:true,status:'accepted',plan,message:'V1 routed the command. Connect the selected executor to perform the action.'});
    }

    const match = req.url.match(/^\/approval\/([^/]+)$/);
    if (req.method === 'POST' && match) {
      const item = approvals.get(match[1]);
      if (!item || Date.now() > item.expiresAt) return json(res, 404, {ok:false,error:'approval_not_found_or_expired'});
      const input = await body(req);
      if (input.approve !== true) return json(res, 400, {ok:false,error:'approve_true_required'});
      item.approved = true;
      item.approvedAt = Date.now();
      log({type:'approval_granted', id:item.id, plan:item.plan});
      return json(res, 200, {ok:true,status:'approved',approvalId:item.id,plan:item.plan,message:'Approved. V1 still requires a dedicated executor for the sensitive action.'});
    }

    return json(res, 404, {ok:false,error:'not_found'});
  } catch (e) {
    log({type:'error', error:e.message});
    return json(res, 400, {ok:false,error:e.message || 'bad_request'});
  }
});

server.listen(PORT, HOST, () => console.log(`Laxman gateway listening on http://${HOST}:${PORT}`));
