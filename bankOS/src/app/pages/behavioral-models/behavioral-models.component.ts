import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { TabBarComponent, FeatureCardComponent, StatusBadgeComponent, GhanaRegulatoryDetailComponent } from '../../shared/index';

@Component({
  selector: 'app-behavioral-models',
  standalone: true,
  imports: [CommonModule, RouterModule, TabBarComponent, FeatureCardComponent, StatusBadgeComponent, GhanaRegulatoryDetailComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
      <header class="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-2xl font-bold text-neutral-800 dark:text-neutral-100 font-mono">
            <a routerLink="/" class="hover:text-primary-500 transition-colors">BankOS</a>
          </h1>
        </div>
      </header>

      <main class="flex-1 p-6">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Behavioral Models</h2>

          <tab-bar [tabs]="tabLabels" [activeIndex]="activeTab" (tabChange)="onTabChange($event)"></tab-bar>

          <!-- TAB 1: NMD Core Deposit Modeler -->
          @if (activeTab === 0) {
            <feature-card
              [title]="'NMD Core Deposit Modeler'"
              [description]="'Model non-maturity deposit (NMD) core allocation using replicating portfolio approach with BoG regulatory constraints.'"
              [userStories]="nmdCoreStories"
            ></feature-card>

            <ghana-regulatory-detail [detail]="nmdRegulatoryDetail"></ghana-regulatory-detail>

            <!-- Table 1: Core Allocation by Tenor -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Core Allocation by Tenor</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Tenor</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Weight (%)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">FTP Rate (%)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Contribution (bps)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">BoG Limit (yrs)</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of coreAllocation; track row.tenor) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ row.tenor }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.weight }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.ftpRate }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.contribution }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.bogLimit }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.statusColor" [label]="row.statusLabel"></status-badge>
                        </td>
                      </tr>
                    }
                  </tbody>
                  <tfoot>
                    <tr class="bg-neutral-100 dark:bg-neutral-700 font-semibold">
                      <td class="p-3 text-neutral-800 dark:text-neutral-100">Total / W.Avg</td>
                      <td class="p-3 text-right font-mono text-neutral-800 dark:text-neutral-100">100%</td>
                      <td class="p-3 text-right font-mono text-neutral-800 dark:text-neutral-100">—</td>
                      <td class="p-3 text-right font-mono text-neutral-800 dark:text-neutral-100">{{ totalContribution | number:'1.0-1' }}</td>
                      <td class="p-3 text-right font-mono text-neutral-800 dark:text-neutral-100">4.0</td>
                      <td class="p-3 text-center">
                        <status-badge status="green" label="Compliant"></status-badge>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Table 2: Backtesting Results -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Backtesting Results (12 Months)</h3>
              <div class="overflow-x-auto max-h-80 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Month</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Predicted Core (&#8373;M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Actual Core (&#8373;M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Error (%)</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">MAPE Limit</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of backtestingResults; track row.month) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ row.month }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.predicted | number:'1.0-0' }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.actual | number:'1.0-0' }}</td>
                        <td class="p-3 text-right font-mono"
                          [ngClass]="Math.abs(row.error) < 10 ? 'text-success-600' : 'text-alert-600'">
                          {{ row.error > 0 ? '+' : '' }}{{ row.error | number:'1.1-1' }}
                        </td>
                        <td class="p-3 text-center">
                          <status-badge
                            [status]="Math.abs(row.error) < 10 ? 'green' : 'red'"
                            [label]="Math.abs(row.error) < 10 ? 'Pass' : 'Fail'">
                          </status-badge>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Replicating Portfolio</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="bmChart1"></canvas>
                </div>
              </div>
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Core Ratio Trend with BoG Cap</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="bmChart2"></canvas>
                </div>
              </div>
            </div>
          }

          <!-- TAB 2: CPR Modeler -->
          @if (activeTab === 1) {
            <feature-card
              [title]="'CPR Modeler – Constant Prepayment Rate'"
              [description]="'Model and forecast prepayment behavior across mortgage, personal, and auto loan portfolios using historical CPR trends.'"
              [userStories]="['Model Developer: Calibrate CPR models using historical prepayment data segmented by product and vintage.', 'Treasury: Incorporate CPR forecasts into FTP and ALM cash flow projections.', 'Risk Manager: Validate CPR assumptions against market conditions and portfolio performance.']"
            ></feature-card>

            <!-- Table 1: CPR by Product -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">CPR by Product</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Product</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">CPR (%)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">12M Range (%)</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of cprByProduct; track row.product) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ row.product }}</td>
                        <td class="p-3 text-right font-mono font-semibold text-neutral-700 dark:text-neutral-200">{{ row.cpr }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.range }}</td>
                        <td class="p-3 text-neutral-700 dark:text-neutral-200">
                          <status-badge
                            [status]="row.trend === 'Rising' ? 'red' : row.trend === 'Stable' ? 'green' : 'amber'"
                            [label]="row.trend">
                          </status-badge>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Prepayment History -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Prepayment History (Monthly CPR)</h3>
              <div class="overflow-x-auto max-h-80 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Month</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Mortgage (%)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Personal (%)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Auto (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of prepaymentHistory; track row.month) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ row.month }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.mortgage }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.personal }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.auto }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">CPR Trend</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="bmChart3"></canvas>
                </div>
              </div>
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Backtesting Scatter</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="bmChart4"></canvas>
                </div>
              </div>
            </div>
          }

          <!-- TAB 3: TDRR Modeler -->
          @if (activeTab === 2) {
            <feature-card
              [title]="'TDRR Modeler – Term Deposit Redemption Rate'"
              [description]="'Model term deposit redemption behavior by product and tenor to forecast cash flow and liquidity impact.'"
              [userStories]="['Model Developer: Calibrate TDRR curves from historical redemption patterns segmented by tenor.', 'Treasury: Use TDRR forecasts for liquidity gap analysis and FTP tenor pricing.', 'Risk Manager: Validate TDRR assumptions against seasonal patterns and product cycles.']"
            ></feature-card>

            <!-- Table 1: TDRR by Product/Tenor -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">TDRR by Product / Tenor</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Product</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">3M (%)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">6M (%)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">12M (%)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">24M (%)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">36M (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of tdrrByProduct; track row.product) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ row.product }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.t3m }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.t6m }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.t12m }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.t24m }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.t36m }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Redemption History -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Redemption History (Monthly Redemption Rate)</h3>
              <div class="overflow-x-auto max-h-80 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Month</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Fixed Deposit (%)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Notice Deposit (%)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Time Deposit (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of redemptionHistory; track row.month) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ row.month }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.fixedDeposit }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.noticeDeposit }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.timeDeposit }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">TDRR Trend</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="bmChart5"></canvas>
                </div>
              </div>
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Seasonal Pattern</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="bmChart6"></canvas>
                </div>
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .sticky-header { position: sticky; top: 0; z-index: 10; }
  `]
})
export class BehavioralModelsComponent implements AfterViewInit, OnDestroy {
  Math = Math;

  tabLabels = ['NMD Core Deposit Modeler', 'CPR Modeler', 'TDRR Modeler'];
  activeTab = 0;

  private chartInstances: Chart[] = [];

  // ── User Stories ──────────────────────────────────────────────────

  nmdCoreStories = [
    'Model Developer: Calibrate NMD core allocation using 5-year historical balance regression and replicating portfolio approach.',
    'Model Validator: Validate core ratio estimates and backtesting MAPE under BoG IRRBB guidelines.',
    'Treasurer: Set FTP rates based on replicating portfolio yield and endowment effect analysis.',
    'Compliance Officer: Ensure core ratio remains within BoG caps (70% retail, 50% SME, 30% corporate).',
  ];

  // ── Regulatory Detail ──────────────────────────────────────────────

  nmdRegulatoryDetail = 'BoG IRRBB Guideline: NMD core ratio capped at 70% retail, 50% SME, 30% corporate. Average maturity cap: 4 years retail, 2 years SME. Core ratio estimated from 5-year historical balance regression. Backtesting MAPE < 10%. Replicating portfolio yield - actual deposit cost = endowment effect.';

  // ── Data: Tab 1 (NMD Core Deposit Modeler) ────────────────────────

  coreAllocation = [
    { tenor: 'O/N', weight: '5.0%', ftpRate: '24.50%', contribution: 122.5, bogLimit: '—', statusColor: 'green' as const, statusLabel: 'Compliant' },
    { tenor: '1 Week', weight: '3.0%', ftpRate: '24.00%', contribution: 72.0, bogLimit: '—', statusColor: 'green' as const, statusLabel: 'Compliant' },
    { tenor: '1 Month', weight: '8.0%', ftpRate: '23.50%', contribution: 188.0, bogLimit: '—', statusColor: 'green' as const, statusLabel: 'Compliant' },
    { tenor: '3 Months', weight: '12.0%', ftpRate: '22.80%', contribution: 273.6, bogLimit: '—', statusColor: 'green' as const, statusLabel: 'Compliant' },
    { tenor: '6 Months', weight: '15.0%', ftpRate: '22.00%', contribution: 330.0, bogLimit: '—', statusColor: 'green' as const, statusLabel: 'Compliant' },
    { tenor: '1 Year', weight: '20.0%', ftpRate: '21.50%', contribution: 430.0, bogLimit: '4 yrs', statusColor: 'green' as const, statusLabel: 'Compliant' },
    { tenor: '3 Years', weight: '22.0%', ftpRate: '20.50%', contribution: 451.0, bogLimit: '4 yrs', statusColor: 'green' as const, statusLabel: 'Compliant' },
    { tenor: '5+ Years', weight: '15.0%', ftpRate: '19.50%', contribution: 292.5, bogLimit: '4 yrs', statusColor: 'amber' as const, statusLabel: 'Near Limit' },
  ];

  get totalContribution(): number {
    return this.coreAllocation.reduce((s, r) => s + r.contribution, 0);
  }

  backtestingResults = [
    { month: 'Apr 2025', predicted: 2850, actual: 2810, error: -1.4 },
    { month: 'May 2025', predicted: 2880, actual: 2850, error: -1.0 },
    { month: 'Jun 2025', predicted: 2910, actual: 2940, error: 1.0 },
    { month: 'Jul 2025', predicted: 2920, actual: 2880, error: -1.4 },
    { month: 'Aug 2025', predicted: 2950, actual: 2980, error: 1.0 },
    { month: 'Sep 2025', predicted: 2960, actual: 2900, error: -2.0 },
    { month: 'Oct 2025', predicted: 2980, actual: 3010, error: 1.0 },
    { month: 'Nov 2025', predicted: 2990, actual: 2950, error: -1.3 },
    { month: 'Dec 2025', predicted: 3010, actual: 3050, error: 1.3 },
    { month: 'Jan 2026', predicted: 3030, actual: 2990, error: -1.3 },
    { month: 'Feb 2026', predicted: 3050, actual: 3020, error: -1.0 },
    { month: 'Mar 2026', predicted: 3080, actual: 3100, error: 0.6 },
  ];

  // ── Data: Tab 2 (CPR Modeler) ─────────────────────────────────────

  cprByProduct = [
    { product: 'Residential Mortgage', cpr: '8.5%', range: '6.2% – 11.8%', trend: 'Rising' },
    { product: 'Personal Loan', cpr: '15.2%', range: '12.0% – 18.5%', trend: 'Stable' },
    { product: 'Auto Loan', cpr: '12.8%', range: '9.5% – 16.0%', trend: 'Declining' },
  ];

  prepaymentHistory = [
    { month: 'Apr 2025', mortgage: 7.2, personal: 14.8, auto: 14.5 },
    { month: 'May 2025', mortgage: 7.5, personal: 15.2, auto: 14.0 },
    { month: 'Jun 2025', mortgage: 7.8, personal: 14.9, auto: 13.6 },
    { month: 'Jul 2025', mortgage: 8.0, personal: 15.5, auto: 13.2 },
    { month: 'Aug 2025', mortgage: 8.2, personal: 15.0, auto: 12.9 },
    { month: 'Sep 2025', mortgage: 8.4, personal: 15.3, auto: 12.5 },
    { month: 'Oct 2025', mortgage: 8.6, personal: 14.7, auto: 12.8 },
    { month: 'Nov 2025', mortgage: 8.5, personal: 15.1, auto: 12.7 },
    { month: 'Dec 2025', mortgage: 8.9, personal: 14.6, auto: 12.4 },
    { month: 'Jan 2026', mortgage: 9.1, personal: 15.4, auto: 12.0 },
    { month: 'Feb 2026', mortgage: 8.8, personal: 14.8, auto: 12.3 },
    { month: 'Mar 2026', mortgage: 8.5, personal: 15.2, auto: 12.8 },
  ];

  // ── Data: Tab 3 (TDRR Modeler) ────────────────────────────────────

  tdrrByProduct = [
    { product: 'Fixed Deposit - Retail', t3m: '35%', t6m: '55%', t12m: '72%', t24m: '85%', t36m: '92%' },
    { product: 'Fixed Deposit - Corporate', t3m: '40%', t6m: '60%', t12m: '78%', t24m: '88%', t36m: '95%' },
    { product: 'Notice Deposit - 7 Day', t3m: '50%', t6m: '70%', t12m: '82%', t24m: '90%', t36m: '96%' },
    { product: 'Notice Deposit - 30 Day', t3m: '45%', t6m: '65%', t12m: '78%', t24m: '88%', t36m: '94%' },
    { product: 'Time Deposit - 3M', t3m: '65%', t6m: '80%', t12m: '90%', t24m: '95%', t36m: '98%' },
    { product: 'Time Deposit - 6M', t3m: '30%', t6m: '60%', t12m: '82%', t24m: '90%', t36m: '95%' },
  ];

  redemptionHistory = [
    { month: 'Apr 2025', fixedDeposit: 38, noticeDeposit: 48, timeDeposit: 58 },
    { month: 'May 2025', fixedDeposit: 42, noticeDeposit: 52, timeDeposit: 62 },
    { month: 'Jun 2025', fixedDeposit: 45, noticeDeposit: 50, timeDeposit: 60 },
    { month: 'Jul 2025', fixedDeposit: 40, noticeDeposit: 46, timeDeposit: 56 },
    { month: 'Aug 2025', fixedDeposit: 44, noticeDeposit: 52, timeDeposit: 62 },
    { month: 'Sep 2025', fixedDeposit: 48, noticeDeposit: 55, timeDeposit: 65 },
    { month: 'Oct 2025', fixedDeposit: 46, noticeDeposit: 53, timeDeposit: 63 },
    { month: 'Nov 2025', fixedDeposit: 50, noticeDeposit: 56, timeDeposit: 66 },
    { month: 'Dec 2025', fixedDeposit: 55, noticeDeposit: 60, timeDeposit: 72 },
    { month: 'Jan 2026', fixedDeposit: 52, noticeDeposit: 58, timeDeposit: 68 },
    { month: 'Feb 2026', fixedDeposit: 48, noticeDeposit: 54, timeDeposit: 64 },
    { month: 'Mar 2026', fixedDeposit: 45, noticeDeposit: 50, timeDeposit: 60 },
  ];

  // ── Tab Management ─────────────────────────────────────────────────

  onTabChange(index: number) {
    this.activeTab = index;
    this.destroyCharts();
    setTimeout(() => this.initCharts(), 100);
  }

  // ── Lifecycle ──────────────────────────────────────────────────────

  ngAfterViewInit() {
    setTimeout(() => this.initCharts(), 100);
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  // ── Chart Initialization ───────────────────────────────────────────

  private destroyCharts() {
    for (const chart of this.chartInstances) {
      chart.destroy();
    }
    this.chartInstances = [];
  }

  private initCharts() {
    switch (this.activeTab) {
      case 0: this.initTab1Charts(); break;
      case 1: this.initTab2Charts(); break;
      case 2: this.initTab3Charts(); break;
    }
  }

  private addChart(chart: Chart) {
    this.chartInstances.push(chart);
  }

  // ── Tab 1 Charts ──────────────────────────────────────────────────

  private initTab1Charts() {
    // Stacked bar: Replicating Portfolio
    const ctx1 = document.getElementById('bmChart1') as HTMLCanvasElement | null;
    if (ctx1) {
      const chart = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: this.coreAllocation.map(r => r.tenor),
          datasets: [
            {
              label: 'Weight (%)',
              data: this.coreAllocation.map(r => parseFloat(r.weight)),
              backgroundColor: [
                'rgba(59, 130, 246, 0.7)', 'rgba(59, 130, 246, 0.7)',
                'rgba(34, 197, 94, 0.7)', 'rgba(34, 197, 94, 0.7)',
                'rgba(245, 158, 11, 0.7)', 'rgba(245, 158, 11, 0.7)',
                'rgba(239, 68, 68, 0.7)', 'rgba(239, 68, 68, 0.7)',
              ],
              borderRadius: 4,
              yAxisID: 'y',
            },
            {
              label: 'FTP Rate (%)',
              data: this.coreAllocation.map(r => parseFloat(r.ftpRate)),
              type: 'line',
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              fill: false,
              tension: 0.3,
              pointRadius: 5,
              pointBackgroundColor: '#8b5cf6',
              yAxisID: 'y1',
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Replicating Portfolio — Weight & FTP Rate by Tenor'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              position: 'left',
              title: { display: true, text: 'Weight (%)' },
              max: 30,
            },
            y1: {
              beginAtZero: true,
              position: 'right',
              title: { display: true, text: 'FTP Rate (%)' },
              max: 30,
              grid: { display: false },
            }
          }
        }
      });
      this.addChart(chart);
    }

    // Line chart: Core Ratio Trend with BoG Cap
    const ctx2 = document.getElementById('bmChart2') as HTMLCanvasElement | null;
    if (ctx2) {
      const chart = new Chart(ctx2, {
        type: 'line',
        data: {
          labels: this.backtestingResults.map(r => r.month.substring(0, 7)),
          datasets: [
            {
              label: 'Actual Core Ratio (%)',
              data: this.backtestingResults.map(r => +(r.actual / 3200 * 100).toFixed(1)),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'BoG Cap (70%)',
              data: this.backtestingResults.map(() => 70),
              borderColor: '#ef4444',
              borderDash: [8, 4],
              pointRadius: 0,
              borderWidth: 2,
              fill: false,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Core Ratio Trend with BoG Cap'
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 60,
              max: 75,
              title: { display: true, text: 'Core Ratio (%)' }
            }
          }
        }
      });
      this.addChart(chart);
    }
  }

  // ── Tab 2 Charts ──────────────────────────────────────────────────

  private initTab2Charts() {
    // Line chart: CPR Trend
    const ctx3 = document.getElementById('bmChart3') as HTMLCanvasElement | null;
    if (ctx3) {
      const chart = new Chart(ctx3, {
        type: 'line',
        data: {
          labels: this.prepaymentHistory.map(r => r.month.substring(0, 7)),
          datasets: [
            {
              label: 'Mortgage CPR (%)',
              data: this.prepaymentHistory.map(r => r.mortgage),
              borderColor: '#3b82f6',
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'Personal Loan CPR (%)',
              data: this.prepaymentHistory.map(r => r.personal),
              borderColor: '#f59e0b',
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'Auto Loan CPR (%)',
              data: this.prepaymentHistory.map(r => r.auto),
              borderColor: '#22c55e',
              tension: 0.3,
              pointRadius: 4,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'CPR Trend (12 Months)'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'CPR (%)' }
            }
          }
        }
      });
      this.addChart(chart);
    }

    // Scatter chart: Backtesting (predicted vs actual)
    const ctx4 = document.getElementById('bmChart4') as HTMLCanvasElement | null;
    if (ctx4) {
      const chart = new Chart(ctx4, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Predicted vs Actual Core (&#8373;M)',
              data: this.backtestingResults.map(r => ({ x: r.predicted, y: r.actual })),
              backgroundColor: '#3b82f6',
              pointRadius: 6,
            },
            {
              label: 'Perfect Fit (y=x)',
              data: [
                { x: 2800, y: 2800 },
                { x: 3150, y: 3150 },
              ],
              type: 'line',
              borderColor: '#ef4444',
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Backtesting: Predicted vs Actual Core (&#8373;M)'
            }
          },
          scales: {
            x: {
              title: { display: true, text: 'Predicted (&#8373;M)' },
              min: 2800,
              max: 3150,
            },
            y: {
              title: { display: true, text: 'Actual (&#8373;M)' },
              min: 2800,
              max: 3150,
            }
          }
        }
      });
      this.addChart(chart);
    }
  }

  // ── Tab 3 Charts ──────────────────────────────────────────────────

  private initTab3Charts() {
    // Line chart: TDRR Trend
    const ctx5 = document.getElementById('bmChart5') as HTMLCanvasElement | null;
    if (ctx5) {
      const chart = new Chart(ctx5, {
        type: 'line',
        data: {
          labels: this.redemptionHistory.map(r => r.month.substring(0, 7)),
          datasets: [
            {
              label: 'Fixed Deposit (%)',
              data: this.redemptionHistory.map(r => r.fixedDeposit),
              borderColor: '#3b82f6',
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'Notice Deposit (%)',
              data: this.redemptionHistory.map(r => r.noticeDeposit),
              borderColor: '#f59e0b',
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'Time Deposit (%)',
              data: this.redemptionHistory.map(r => r.timeDeposit),
              borderColor: '#22c55e',
              tension: 0.3,
              pointRadius: 4,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'TDRR Trend (12 Months)'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Redemption Rate (%)' }
            }
          }
        }
      });
      this.addChart(chart);
    }

    // Bar chart: Seasonal Pattern
    const ctx6 = document.getElementById('bmChart6') as HTMLCanvasElement | null;
    if (ctx6) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const chart = new Chart(ctx6, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Fixed Deposit',
              data: [52, 48, 45, 38, 42, 45, 40, 44, 48, 46, 50, 55],
              backgroundColor: 'rgba(59, 130, 246, 0.7)',
              borderRadius: 4,
            },
            {
              label: 'Notice Deposit',
              data: [58, 54, 50, 48, 52, 50, 46, 52, 55, 53, 56, 60],
              backgroundColor: 'rgba(245, 158, 11, 0.7)',
              borderRadius: 4,
            },
            {
              label: 'Time Deposit',
              data: [68, 64, 60, 58, 62, 60, 56, 62, 65, 63, 66, 72],
              backgroundColor: 'rgba(34, 197, 94, 0.7)',
              borderRadius: 4,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Seasonal Redemption Pattern by Product'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Redemption Rate (%)' }
            }
          }
        }
      });
      this.addChart(chart);
    }
  }
}
