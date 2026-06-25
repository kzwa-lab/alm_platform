/* ============================================================
   ALM Platform — Interactive Calculators
   ============================================================ */

/* ── LCR Calculator ──────────────────────────────────────── */
function calculateLCR(inputs) {
  const {
    level1Assets = 0,      // unrestricted
    level2aAssets = 0,     // 15% haircut
    level2bAssets = 0,     // 25-50% haircut (use 50%)
    retailStableOutflow = 0,
    retailNonstableOutflow = 0,
    operationalDeposits = 0,
    wholesaleUnsecured = 0,
    wholesaleSecured = 0,
    retailInflows = 0,
    wholesaleInflows = 0
  } = inputs;

  // Adjusted HQLA
  let hqla = level1Assets + level2aAssets * 0.85 + level2bAssets * 0.50;

  // Cap Level 2 at 40% of total HQLA
  const level2Total = level2aAssets * 0.85 + level2bAssets * 0.50;
  const level2Cap = level1Assets * (0.40 / 0.60);
  if (level2Total > level2Cap && level1Assets > 0) {
    hqla = level1Assets + level2Cap;
  }

  // Cash outflows (run-off rates)
  const totalOutflows =
    retailStableOutflow * 0.05 +
    retailNonstableOutflow * 0.10 +
    operationalDeposits * 0.25 +
    wholesaleUnsecured * 1.00 +
    wholesaleSecured * 0.25;

  // Cash inflows (capped at 75% of outflows)
  const totalInflows = retailInflows + wholesaleInflows;
  const inflowCap = totalOutflows * 0.75;
  const effectiveInflows = Math.min(totalInflows, inflowCap);

  const netCashOutflows = totalOutflows - effectiveInflows;
  const lcr = netCashOutflows > 0 ? (hqla / netCashOutflows) * 100 : 999;

  let status = lcr >= 120 ? 'green' : lcr >= 100 ? 'amber' : 'red';

  return { hqla, totalOutflows, totalInflows, effectiveInflows, netCashOutflows, lcr, status };
}

/* ── NSFR Calculator ─────────────────────────────────────── */
function calculateNSFR(inputs) {
  const {
    cet1Capital = 0, preferredShares = 0,
    stableRetailDeposits = 0, lessStableRetailDeposits = 0,
    wholesaleFunding = 0, operationalDeposits = 0, otherLiabilities = 0,
    cashReserves = 0, unencumberedLevel1 = 0, unencumberedLevel2 = 0,
    residentialLoans = 0, corporateLoans = 0, loansToFinancials = 0, fixedAssets = 0
  } = inputs;

  const asf =
    cet1Capital * 1.00 +
    preferredShares * 1.00 +
    stableRetailDeposits * 0.95 +
    lessStableRetailDeposits * 0.90 +
    wholesaleFunding * 0.50 +
    operationalDeposits * 0.50 +
    otherLiabilities * 0.00;

  const rsf =
    cashReserves * 0.00 +
    unencumberedLevel1 * 0.05 +
    unencumberedLevel2 * 0.15 +
    residentialLoans * 0.65 +
    corporateLoans * 0.85 +
    loansToFinancials * 1.00 +
    fixedAssets * 1.00;

  const nsfr = rsf > 0 ? (asf / rsf) * 100 : 999;
  const status = nsfr >= 120 ? 'green' : nsfr >= 100 ? 'amber' : 'red';

  return { asf, rsf, nsfr, status, shortfall: Math.max(0, rsf - asf) };
}

/* ── EVE Sensitivity Calculator ──────────────────────────── */
function calculateEVESensitivity(inputs) {
  const {
    assetsPV = 0, liabilitiesPV = 0,
    assetDuration = 0, liabilityDuration = 0,
    shockBps = 0
  } = inputs;

  const dAssets = -assetsPV * assetDuration * (shockBps / 10000);
  const dLiabilities = -liabilitiesPV * liabilityDuration * (shockBps / 10000);
  const dEVE = dAssets - dLiabilities;
  const eveBefore = assetsPV - liabilitiesPV;
  const eveAfter = eveBefore + dEVE;
  const impactPct = eveBefore !== 0 ? (dEVE / eveBefore) * 100 : 0;

  return { dAssets, dLiabilities, dEVE, eveBefore, eveAfter, impactPct };
}

/* ── ECL Calculator ──────────────────────────────────────── */
function calculateECL(inputs) {
  const {
    pd = 0, lgd = 0, ead = 0,
    stage = 1,
    macroAdjustment = 1.0,
    monthsRemaining = 12
  } = inputs;

  const adjustedPD = Math.min(pd * macroAdjustment, 1.0);
  const horizon = stage === 1 ? 12 : monthsRemaining;
  const discountFactor = 1 / Math.pow(1 + 0.03 / 12, horizon);

  // Simplified monthly sum
  let ecl = 0;
  for (let m = 0; m < horizon; m++) {
    const df = 1 / Math.pow(1 + 0.03 / 12, m + 1);
    ecl += adjustedPD * lgd * ead * df;
  }
  // Annualize roughly
  if (stage === 1) {
    ecl = adjustedPD * lgd * ead * discountFactor;
  }

  const eclRatio = ead > 0 ? (ecl / ead) * 100 : 0;

  return { ecl, eclRatio, stage, horizon };
}

/* ── FTP Curve Interpolator ──────────────────────────────── */
function interpolateFTP(tenorMonths, curvePoints) {
  // curvePoints: [{ tenorMonths, rate }]
  const sorted = [...curvePoints].sort((a, b) => a.tenorMonths - b.tenorMonths);
  if (tenorMonths <= sorted[0].tenorMonths) return sorted[0].rate;
  if (tenorMonths >= sorted[sorted.length - 1].tenorMonths) return sorted[sorted.length - 1].rate;

  for (let i = 0; i < sorted.length - 1; i++) {
    if (tenorMonths >= sorted[i].tenorMonths && tenorMonths <= sorted[i + 1].tenenorMonths) {
      const t = (tenorMonths - sorted[i].tenorMonths) / (sorted[i + 1].tenorMonths - sorted[i].tenorMonths);
      return sorted[i].rate + t * (sorted[i + 1].rate - sorted[i].rate);
    }
  }
  return sorted[sorted.length - 1].rate;
}

/* ── Output Floor Calculator ─────────────────────────────── */
function calculateOutputFloor(saRWA, irbRWA, floorPct = 0.725) {
  const floorRWA = saRWA * floorPct;
  const finalRWA = Math.max(irbRWA, floorRWA);
  const capitalAddon = Math.max(0, floorRWA - irbRWA);
  const capitalImpact = capitalAddon * 0.08;
  const binding = irbRWA < floorRWA;

  return { saRWA, irbRWA, floorRWA, finalRWA, capitalAddon, capitalImpact, binding };
}

/* ── RWA Calculator (Standardized Approach) ──────────────── */
function calculateRWASA(exposures) {
  // exposures: [{ amount, riskWeight }]
  let totalRWA = 0;
  const breakdown = [];
  exposures.forEach(e => {
    const rwa = e.amount * e.riskWeight;
    totalRWA += rwa;
    breakdown.push({ ...e, rwa });
  });
  return { totalRWA, breakdown };
}

/* ── NIM Calculator ──────────────────────────────────────── */
function calculateNIM(earningAssets, intBearingLiabilities, assetYield, liabilityCost) {
  const nii = earningAssets * (assetYield / 100) - intBearingLiabilities * (liabilityCost / 100);
  const nim = earningAssets > 0 ? (nii / earningAssets) * 100 : 0;
  return { nii, nim };
}

/* ── SICR Analysis ───────────────────────────────────────── */
function analyzeSICR(originationPD, currentPD, relativeThreshold = 1.5, absoluteThreshold = 0.005) {
  const relativeTrigger = (currentPD / originationPD) >= relativeThreshold;
  const absoluteTrigger = (currentPD - originationPD) >= absoluteThreshold;
  const sicrOccurred = relativeTrigger || absoluteTrigger;
  const stage = sicrOccurred ? 2 : 1;

  return {
    originationPD, currentPD,
    pdChangeRelative: (currentPD / originationPD - 1) * 100,
    pdChangeAbsoluteBps: (currentPD - originationPD) * 10000,
    relativeTriggered: relativeTrigger,
    absoluteTriggered: absoluteTrigger,
    sicrOccurred,
    stage,
    eclHorizon: stage === 1 ? '12-month' : 'Lifetime'
  };
}

/* ── Deal Pricer ─────────────────────────────────────────── */
function priceDeal(inputs) {
  const {
    amount = 0, tenorMonths = 12,
    ftpRate = 0, creditCost = 0, liquidityCost = 0,
    capitalCost = 0, targetMargin = 0,
    customerSegment = 'corporate', riskRating = 'A'
  } = inputs;

  const allInCost = ftpRate + creditCost + liquidityCost + capitalCost;
  const suggestedRate = allInCost + targetMargin;
  const annualRevenue = amount * (suggestedRate / 100);
  const annualCost = amount * (allInCost / 100);
  const annualMargin = annualRevenue - annualCost;

  let recommendation = 'accept';
  if (targetMargin < 0.5) recommendation = 'reject';
  else if (targetMargin < 1.0) recommendation = 'review';

  return { allInCost, suggestedRate, annualRevenue, annualCost, annualMargin, recommendation };
}

/* ── Stress Testing ──────────────────────────────────────── */
function applyLiquidityStress(baseLCR, scenario) {
  const factors = {
    mild: { hqlaReduction: 0.05, outflowMult: 1.5, inflowReduction: 0.8 },
    moderate: { hqlaReduction: 0.10, outflowMult: 2.5, inflowReduction: 0.5 },
    severe: { hqlaReduction: 0.20, outflowMult: 4.0, inflowReduction: 0.2 }
  };
  const f = factors[scenario] || factors.moderate;
  return { ...f, scenario };
}

/* ── Table Sorting ───────────────────────────────────────── */
function initSortableTable(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const headers = table.querySelectorAll('thead th[data-sort]');

  headers.forEach(th => {
    th.addEventListener('click', () => {
      const col = parseInt(th.dataset.sort);
      const type = th.dataset.sortType || 'string';
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const dir = th.dataset.dir === 'asc' ? 'desc' : 'asc';

      headers.forEach(h => { h.dataset.dir = ''; h.querySelector('.sort-icon').textContent = '⇅'; });
      th.dataset.dir = dir;
      th.querySelector('.sort-icon').textContent = dir === 'asc' ? '↑' : '↓';

      rows.sort((a, b) => {
        let av = a.cells[col].textContent.trim().replace(/[^0-9.\-]/g, '');
        let bv = b.cells[col].textContent.trim().replace(/[^0-9.\-]/g, '');
        if (type === 'number') {
          av = parseFloat(av) || 0;
          bv = parseFloat(bv) || 0;
        }
        if (av < bv) return dir === 'asc' ? -1 : 1;
        if (av > bv) return dir === 'asc' ? 1 : -1;
        return 0;
      });

      rows.forEach(row => tbody.appendChild(row));
    });
  });
}

/* ── Tab Switching ───────────────────────────────────────── */
function initTabs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const buttons = container.querySelectorAll('.tab-btn');
  const panels = container.querySelectorAll('.tab-panel');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      buttons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      container.querySelector(`.tab-panel[data-panel="${target}"]`).classList.add('active');
    });
  });
}
