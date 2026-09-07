const test = require('node:test');
const assert = require('node:assert/strict');
process.env.NODE_ENV='test';
const {handle}=require('./server');
function mock(method,url,body){let status;let payload='';return new Promise(async resolve=>{const req={method,url,headers:{},on:(ev,fn)=>{if(ev==='end')fn();}};const res={writeHead:(s)=>status=s,end:(p)=>{payload=p;resolve({status,body:JSON.parse(p)})}};req.on=()=>{};await handle(req,res);});}
test('health endpoint',async()=>{const r=await mock('GET','/health');assert.equal(r.status,200);assert.equal(r.body.ok,true);});
test('agents endpoint',async()=>{const r=await mock('GET','/agents');assert.equal(r.status,200);assert.ok(r.body.agents.length>=10);});
