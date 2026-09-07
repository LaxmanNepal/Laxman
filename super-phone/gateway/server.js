const http = require('node:http');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { execute } = require('./executors');

const ROOT = path.resolve(__dirname, '..');
const agents = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/agents.json'))).agents;
const policy = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/permissions.json')));
const commands = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/commands.json'))).commands;
const audit = [];
const approvals = new Map();
const token = process.env.LSP_GATEWAY_TOKEN || '';
const port = Number(process.env.LSP_PORT || 8787);
const host = process.env.LSP_HOST || '127.0.0.1';

function safeEqual(a, b) { const x=Buffer.from(a||''); const y=Buffer.from(b||''); return x.length===y.length && crypto.timingSafeEqual(x,y); }
function log(event) { audit.push({id:crypto.randomUUID(),ts:new Date().toISOString(),...event}); if(audit.length>500) audit.shift(); }
function auth(req) { if(!token) return process.env.NODE_ENV==='test'; const h=req.headers.authorization||''; return safeEqual(h.startsWith('Bearer ')?h.slice(7):'',token); }
function body(req) { return new Promise((resolve,reject)=>{let data='',size=0; req.on('data',c=>{size+=c.length;if(size>policy.max_body_bytes){reject(new Error('body_too_large'));req.destroy();}else data+=c;});req.on('end',()=>{try{resolve(data?JSON.parse(data):{});}catch{reject(new Error('invalid_json'));}});req.on('error',reject);}); }
function agentFor(id){return agents.find(a=>a.id===id);}
function requiresApproval(risk){return risk==='L2'||risk==='L3';}
function forbidden(action){return policy.always_block.includes(action);}
function json(res,status,payload){res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(payload));}

async function run(spec, source) {
  const result = await execute(spec);
  log({type:'command_executed',agent:spec.agent,action:spec.action,risk:spec.risk,source,result:{executed:result.executed===true,adapter:result.adapter||null}});
  return result;
}

async function handle(req,res){
  if(!auth(req)) return json(res,401,{error:'unauthorized'});
  const url=new URL(req.url,`http://${host}:${port}`);
  if(req.method==='GET'&&url.pathname==='/health') return json(res,200,{ok:true,service:'laxman-super-phone',version:'10.1',time:new Date().toISOString()});
  if(req.method==='GET'&&url.pathname==='/agents') return json(res,200,{agents});
  if(req.method==='GET'&&url.pathname==='/audit') return json(res,200,{events:audit});
  if(req.method==='GET'&&url.pathname==='/approvals') return json(res,200,{approvals:[...approvals.values()].filter(x=>x.expiresAt>Date.now())});
  if(req.method==='POST'&&url.pathname==='/command'){
    const c=await body(req); const command=String(c.command||'').trim().toLowerCase();
    const spec=commands[command]||{agent:c.agent,action:c.action,risk:c.risk||'L3',args:c.args||{}};
    const agent=agentFor(spec.agent); if(!agent||!spec.action) return json(res,400,{error:'unknown_agent_or_action'});
    if(forbidden(spec.action)) return json(res,403,{error:'blocked_action'});
    const risk=spec.risk||agent.risk||'L3'; spec.risk=risk;
    if(requiresApproval(risk)){const id=crypto.randomUUID();const item={id,agent:agent.id,action:spec.action,args:spec.args||c.args||{},risk,createdAt:Date.now(),expiresAt:Date.now()+policy.approval_ttl_seconds*1000,source:c.source||'api'};approvals.set(id,item);log({type:'approval_requested',...item});return json(res,202,{status:'approval_required',approval_id:id,expires_at:new Date(item.expiresAt).toISOString()});}
    try { const result=await run(spec,c.source||'api'); return json(res,200,{status:'executed',agent:agent.id,action:spec.action,risk,result}); }
    catch(e){log({type:'execution_failed',agent:agent.id,action:spec.action,risk,error:e.message});return json(res,502,{error:'execution_failed',detail:e.message});}
  }
  const m=url.pathname.match(/^\/approval\/([^/]+)$/);
  if(req.method==='POST'&&m){const item=approvals.get(m[1]);if(!item||item.expiresAt<Date.now())return json(res,404,{error:'approval_not_found_or_expired'});const c=await body(req);const decision=c.decision;if(!['approve','deny'].includes(decision))return json(res,400,{error:'decision_must_be_approve_or_deny'});approvals.delete(item.id);if(decision==='deny'){log({type:'approval_denied',...item});return json(res,200,{status:'denied',approval_id:item.id});}try{const result=await run(item,'approval');return json(res,200,{status:'executed',approval_id:item.id,result});}catch(e){log({type:'execution_failed',...item,error:e.message});return json(res,502,{error:'execution_failed',detail:e.message});}}
  return json(res,404,{error:'not_found'});
}

const server=http.createServer((req,res)=>handle(req,res).catch(e=>{log({type:'error',error:e.message});json(res,400,{error:e.message});}));
if(require.main===module)server.listen(port,host,()=>console.log(`Laxman Super Phone gateway listening on http://${host}:${port}`));
module.exports={server,handle,approvals,audit};
