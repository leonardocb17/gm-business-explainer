const assert = require('node:assert/strict');
const plan = require('./launch-plan.js');
const near = (actual, expected) => assert.ok(Math.abs(actual-expected)<1e-8, `${actual} != ${expected}`);
// Independent stored reference: 7,500 clicks, 6,750 arrivals, 270 validated leads.
const reference = {visitors:6750,leads:270,revenue:2457,media:1500,fixed:750,variable:67.5,tax:196.56,result:-57.06,breakEvenCpc:.194928,marginCpc:.151248};
const base = plan.calculatePilot({});
Object.entries(reference).forEach(([key,value])=>near(base[key],value));
assert.deepEqual(plan.calculateBudget(), {fixedTotal:2250,mediaTotal:4500,scheduledTotal:8250,total:10000,byPhase:[{setup:1500,fixed:750,media:0,total:2250},{setup:0,fixed:750,media:1500,total:2250},{setup:0,fixed:750,media:3000,total:3750}],reserve:1750});
near(plan.calculatePilot({cpc:base.breakEvenCpc}).result,0);
const margin = plan.calculatePilot({cpc:base.marginCpc});
near(margin.result / margin.revenue,.20);
const noLead = plan.calculatePilot({acceptedLeadRate:0});
near(noLead.result,-2317.5);
assert.ok(noLead.breakEvenCpc<0);
assert.equal(plan.calculatePilot({budget:0,fixed:0}).breakEvenCpc,null);
for(const input of [{cpc:0},{cpc:-1},{tax:2},{acceptedLeadRate:NaN},{budget:Infinity}]) assert.throws(()=>plan.calculatePilot(input),RangeError);
console.log('PASS: pilot reference, cash cap, full-cost break-even/margin, no-lead and invalid boundaries.');
