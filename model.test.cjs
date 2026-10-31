'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const model = require('./model.js');
// Stored outputs from an independent Python Decimal model. All values are hypothetical.
// Columns: country, scenario, initial pages, return pages, contacts, RV90,
// monthly visitors at the annual target, monthly pages, full-cost BE CPC, margin CPC.
const referenceRows = [
  ['BR', 'conservative', .525, .09, .15, .009225, 45167118.33785004, 27777777.777777776, -.001568335, -.003136585],
  ['BR', 'base', 1.2, .48, .3, .0504, 8267195.767195767, 13888888.888888888, .03109824, .02202624],
  ['BR', 'strong', 2.025, 2.025, .54, .2025, 2057613.1687242799, 8333333.333333333, .1605595, .1220845],
  ['MX', 'conservative', .525, .09, .15, .0123, 33875338.75338753, 20833333.333333332, .00074222, -.00134878],
  ['MX', 'base', 1.2, .48, .3, .0672, 6200396.825396826, 10416666.666666666, .04446432, .03236832],
  ['MX', 'strong', 2.025, 2.025, .54, .2835, 1469723.6919459142, 5952380.952380952, .2285833, .1747183],
  ['US', 'conservative', .525, .09, .15, .0369, 11291779.58446251, 6944444.444444444, .01922666, .01295366],
  ['US', 'base', 1.2, .48, .3, .2016, 2066798.9417989417, 3472222.222222222, .15139296, .11510496],
  ['US', 'strong', 2.025, 2.025, .54, .81, 514403.29218106996, 2083333.3333333333, .670738, .516838],
  ['CA', 'conservative', .525, .09, .15, .03075, 13550135.501355013, 8333333.333333333, .01460555, .00937805],
  ['CA', 'base', 1.2, .48, .3, .168, 2480158.73015873, 4166666.6666666665, .1246608, .0944208],
  ['CA', 'strong', 2.025, 2.025, .54, .6885, 605180.3437424352, 2450980.3921568627, .5687023, .4378873]
];
const horizons = {
  BR: [.0432, .04752, .0504], MX: [.0576, .06336, .0672],
  US: [.1728, .19008, .2016], CA: [.144, .1584, .168]
};
const close = (actual, expected, label) => assert.ok(Math.abs(actual - Number(expected)) <= Math.max(1e-11, Math.abs(Number(expected)) * 1e-12), `${label}: ${actual} != ${expected}`);

// Compare all twelve presets with the independent Decimal reference model.
for (const [country, scenario, initial, returns, contacts, rv, visitors, pages, be, margin] of referenceRows) {
  const result = model.calculate(model.presets[country][scenario]);
  const label = country + '/' + scenario;
  close(result.initialPagesPerVisitor, initial, label);
  close(result.returnPagesPerVisitor, returns, label);
  close(result.contactsPerVisitor, contacts, label);
  close(result.totalRpv90, rv, label);
  close(result.scaleVisitors, visitors, label);
  close(result.scalePages, pages, label);
  close(result.scaleBreakEvenCpc, be, label);
  close(result.scaleMarginCpc, margin, label);
  const atMargin = model.calculate({ ...model.presets[country][scenario], paidCpc: Math.max(0, result.scaleMarginCpc) });
  if (result.scaleMarginCpc >= 0) close(atMargin.scaleMargin, .20, label + ' margin identity');
  else assert.equal(result.feasible.scaleTargetMargin, false, label);
}

const expectedBe = [.03109824, .04446432, .15139296, .1246608];
const expectedMargin = [.02202624, .03236832, .11510496, .0944208];
Object.keys(model.presets).forEach((country, i) => {
  const result = model.calculate(model.presets[country].base);
  close(result.scaleBreakEvenCpc, expectedBe[i], country);
  close(result.scaleMarginCpc, expectedMargin[i], country);
  [30, 60, 90].forEach((day, index) => close(result['rpv' + day], horizons[country][index], country + ' horizon'));
  const free = model.calculate({ ...model.presets[country].base, paidCpc: 0 });
  close(result.monthlyResult, free.monthlyResult - result.mediaCost, country + ' cost attribution');
});

const tiny = model.calculate({ ...model.presets.BR.base, monthlyVisitors: 10000, paidCpc: 0 });
assert.ok(tiny.breakEvenCpc < 0);
assert.equal(tiny.feasible.breakEven, false);
assert.ok(tiny.monthlyResult < 0);
const noDisplay = model.calculate({ rpm: 0 });
assert.equal(noDisplay.scaleVisitors, null);
assert.equal(noDisplay.scaleBreakEvenCpc, null);
assert.equal(noDisplay.feasible.scaleRevenue, false);
assert.ok(noDisplay.breakEvenCpc < 0);
const allZero = model.calculate(Object.fromEntries(Object.keys(model.defaults).map(key => [key, 0])));
assert.equal(allZero.monthlyRevenue, 0);
assert.equal(allZero.monthlyResult, 0);
assert.equal(allZero.margin, null);
assert.equal(allZero.scaleVisitors, 0);
assert.equal(allZero.feasible.breakEven, false);
const noLanding = model.calculate({ landingRate: 0 });
assert.equal(noLanding.paidClicks, null);
assert.equal(noLanding.monthlyResult, null);
assert.equal(noLanding.feasible.deliveredPaidAcquisition, false);
const affiliate = model.calculate({ affiliateRpv: .10 });
close(affiliate.rpv30 - model.calculate().rpv30, .10, 'affiliate immediate');
close(affiliate.totalRpv90 - affiliate.displayRpv90, .10, 'affiliate separate');
close(affiliate.breakEvenCpc - model.calculate().breakEvenCpc, .0828, 'affiliate CPC');
assert.ok(affiliate.scaleVisitors < model.calculate().scaleVisitors);
const boundary = model.calculate({ rpm: 0, variableCost: 0, fixedCosts: 0, paidCpc: 0 });
assert.equal(boundary.breakEvenCpc, 0);
assert.equal(boundary.feasible.breakEven, true);
assert.equal(boundary.feasible.positivePaidBreakEven, false);
for (const invalid of [NaN, Infinity, -1, '', null, true]) assert.throws(() => model.calculate({ rpm: invalid }));
assert.throws(() => model.calculate({ quizCompletion: 1.01 }));
for (const result of [allZero, noDisplay, noLanding, tiny, affiliate, boundary]) {
  const check = value => {
    if (typeof value === 'number') assert.ok(Number.isFinite(value), 'No NaN or Infinity output');
    else if (value && typeof value === 'object') Object.values(value).forEach(check);
  };
  check(result);
}
const browser = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'model.js'), 'utf8'), browser);
close(browser.window.GM_MODEL.calculate().totalRpv90, .0504, 'browser export');
assert.ok(Object.isFrozen(model.presets.BR.base));
console.log('PASS: 12 Decimal-reference presets, full-cost CPC/margin identities, cohort timing, affiliate separation, zero/negative/invalid boundaries, browser export.');
