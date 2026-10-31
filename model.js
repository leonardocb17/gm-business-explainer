/* Illustrative BRL economics. These inputs are scenarios, not measured GM data. */
(function (root) {
  'use strict';

  const funnels = {
    conservative: { landingRate: .85, quizCompletion: .50, contentReach: .70, initialPages: 1.5, emailCapture: .30, returnVisits: .30, returnPages: 2 },
    base: { landingRate: .90, quizCompletion: .75, contentReach: .80, initialPages: 2, emailCapture: .40, returnVisits: .80, returnPages: 2 },
    strong: { landingRate: .95, quizCompletion: .90, contentReach: .90, initialPages: 2.5, emailCapture: .60, returnVisits: 1.50, returnPages: 2.5 }
  };
  const rpms = { BR: [15, 30, 50], MX: [20, 40, 70], US: [60, 120, 200], CA: [50, 100, 170] };
  const presets = {};
  for (const country of Object.keys(rpms)) {
    presets[country] = {};
    Object.keys(funnels).forEach((scenario, index) => {
      presets[country][scenario] = Object.freeze({ ...funnels[scenario], rpm: rpms[country][index] });
    });
    Object.freeze(presets[country]);
  }
  Object.freeze(presets);

  const defaults = Object.freeze({ ...presets.BR.base, monthlyVisitors: 100000, paidCpc: .10,
    fixedCosts: 1500, variableCost: .01, taxRate: .08, targetMargin: .20,
    affiliateRpv: 0, annualTarget: 5000000, scaleFixedCosts: 15000 });
  const rates = new Set(['landingRate', 'quizCompletion', 'contentReach', 'emailCapture', 'taxRate', 'targetMargin']);

  function inputs(params) {
    if (!params || typeof params !== 'object' || Array.isArray(params)) throw new TypeError('Parameters must be an object.');
    const p = {};
    for (const key of Object.keys(defaults)) {
      const raw = params[key] === undefined ? defaults[key] : params[key];
      if (raw === null || typeof raw === 'boolean' || (typeof raw !== 'number' && typeof raw !== 'string') || (typeof raw === 'string' && !raw.trim())) {
        throw new TypeError(key + ' must be a finite number.');
      }
      const value = Number(raw);
      const maximum = rates.has(key) ? 1 : 1e12;
      if (!Number.isFinite(value) || value < 0 || value > maximum) throw new RangeError(key + ' is outside its allowed range.');
      p[key] = value;
    }
    return p;
  }

  function calculate(params = {}) {
    const p = inputs(params);
    const initialPagesPerVisitor = p.quizCompletion * p.contentReach * p.initialPages;
    const contactsPerVisitor = p.quizCompletion * p.emailCapture;
    const returnPagesPerVisitor = contactsPerVisitor * p.returnVisits * p.returnPages;
    const pages90 = initialPagesPerVisitor + returnPagesPerVisitor;
    const displayInitialRpv = initialPagesPerVisitor * p.rpm / 1000;
    const displayReturnRpv = returnPagesPerVisitor * p.rpm / 1000;
    const displayRpv90 = displayInitialRpv + displayReturnRpv;
    const totalRpv90 = displayRpv90 + p.affiliateRpv;
    // Additional affiliate revenue is assumed immediate, realized, and non-reversed.
    const rpv30 = displayInitialRpv + .5 * displayReturnRpv + p.affiliateRpv;
    const rpv60 = displayInitialRpv + .8 * displayReturnRpv + p.affiliateRpv;
    const paidClicks = p.monthlyVisitors === 0 ? 0 : p.landingRate > 0 ? p.monthlyVisitors / p.landingRate : null;
    const mediaCost = paidClicks === null ? null : paidClicks * p.paidCpc;
    const monthlyRevenue = p.monthlyVisitors * totalRpv90;
    const variableCostTotal = p.monthlyVisitors * p.variableCost;
    const taxProvision = monthlyRevenue * p.taxRate;
    const monthlyResult = mediaCost === null ? null : monthlyRevenue - mediaCost - variableCostTotal - taxProvision - p.fixedCosts;
    const margin = monthlyRevenue > 0 && monthlyResult !== null ? monthlyResult / monthlyRevenue : null;
    const ceiling = (visitors, fixed, marginRate) => visitors > 0 && p.landingRate > 0
      ? p.landingRate * ((1 - p.taxRate - marginRate) * totalRpv90 - p.variableCost - fixed / visitors) : null;
    // Signed ceilings must remain negative when even free acquisition cannot work.
    const breakEvenCpc = ceiling(p.monthlyVisitors, p.fixedCosts, 0);
    const marginCpc = ceiling(p.monthlyVisitors, p.fixedCosts, p.targetMargin);
    const scaleVisitors = p.annualTarget === 0 ? 0 : totalRpv90 > 0 ? p.annualTarget / (12 * totalRpv90) : null;
    const scalePages = scaleVisitors === null ? null : scaleVisitors * pages90;
    const scaleContacts = scaleVisitors === null ? null : scaleVisitors * contactsPerVisitor;
    const scaleBreakEvenCpc = ceiling(scaleVisitors, p.scaleFixedCosts, 0);
    const scaleMarginCpc = ceiling(scaleVisitors, p.scaleFixedCosts, p.targetMargin);
    const scalePaidClicks = scaleVisitors === 0 ? 0 : scaleVisitors !== null && p.landingRate > 0 ? scaleVisitors / p.landingRate : null;
    const scaleMediaCost = scalePaidClicks === null ? null : scalePaidClicks * p.paidCpc;
    const scaleMonthlyRevenue = scaleVisitors === null ? null : scaleVisitors * totalRpv90;
    const scaleVariableCost = scaleVisitors === null ? null : scaleVisitors * p.variableCost;
    const scaleTaxProvision = scaleMonthlyRevenue === null ? null : scaleMonthlyRevenue * p.taxRate;
    const scaleMonthlyResult = scaleMediaCost === null || scaleMonthlyRevenue === null ? null
      : scaleMonthlyRevenue - scaleMediaCost - scaleVariableCost - scaleTaxProvision - p.scaleFixedCosts;
    const nonnegative = value => value !== null && value >= 0;
    const positive = value => value !== null && value > 0;
    const atPrice = value => nonnegative(value) && p.paidCpc <= value;
    return {
      params: p, initialPagesPerVisitor, returnPagesPerVisitor, pages90, contactsPerVisitor,
      displayInitialRpv, displayReturnRpv, displayRpv90, totalRpv90,
      rpv30, rpv60, rpv90: totalRpv90,
      revenues30: p.monthlyVisitors * rpv30, revenues60: p.monthlyVisitors * rpv60, revenues90: monthlyRevenue,
      affiliateTiming: 'immediate', revenueTiming: 'economic attribution, not cash settlement',
      paidClicks, mediaCost, monthlyRevenue, variableCostTotal, taxProvision, monthlyResult, margin,
      breakEvenCpc, marginCpc, scaleVisitors, scalePages, scaleContacts,
      scaleBreakEvenCpc, scaleMarginCpc, scalePaidClicks, scaleMediaCost, scaleMonthlyRevenue,
      scaleFixedCosts: p.scaleFixedCosts, scaleVariableCost, scaleTaxProvision, scaleMonthlyResult,
      scaleMargin: scaleMonthlyRevenue > 0 && scaleMonthlyResult !== null ? scaleMonthlyResult / scaleMonthlyRevenue : null,
      scaleBreakEvenMediaCost: scalePaidClicks === null || scaleBreakEvenCpc === null ? null : scalePaidClicks * scaleBreakEvenCpc,
      scaleMarginMediaCost: scalePaidClicks === null || scaleMarginCpc === null ? null : scalePaidClicks * scaleMarginCpc,
      retentionShare: totalRpv90 > 0 ? displayReturnRpv / totalRpv90 : 0,
      displayRetentionShare: displayRpv90 > 0 ? displayReturnRpv / displayRpv90 : 0,
      feasible: {
        deliveredPaidAcquisition: p.landingRate > 0,
        breakEven: nonnegative(breakEvenCpc), targetMargin: nonnegative(marginCpc),
        positivePaidBreakEven: positive(breakEvenCpc), positivePaidTargetMargin: positive(marginCpc),
        selectedCpcBreakEven: atPrice(breakEvenCpc), selectedCpcTargetMargin: atPrice(marginCpc),
        scaleRevenue: scaleVisitors !== null,
        scaleBreakEven: nonnegative(scaleBreakEvenCpc), scaleTargetMargin: nonnegative(scaleMarginCpc),
        scalePositivePaidBreakEven: positive(scaleBreakEvenCpc), scalePositivePaidTargetMargin: positive(scaleMarginCpc),
        scaleSelectedCpcBreakEven: atPrice(scaleBreakEvenCpc), scaleSelectedCpcTargetMargin: atPrice(scaleMarginCpc)
      }
    };
  }

  const model = Object.freeze({ presets, defaults, calculate });
  if (root) root.GM_MODEL = model;
  if (typeof module === 'object' && module.exports) module.exports = model;
})(typeof window !== 'undefined' ? window : null);
