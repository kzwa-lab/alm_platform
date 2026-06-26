import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  TabBarComponent,
  FeatureCardComponent,
  StatusBadgeComponent,
  GhanaRegulatoryDetailComponent,
} from '../../shared/index';
import Chart from 'chart.js/auto';

interface ScenarioParam {
  scenario: string;
  assetGrowth: string;
  liabilityGrowth: string;
  pricingChanges: string;
  hedgeRatio: string;
  recoveryActions: string;
}

interface KeyMetricRow {
  metric: string;
  base: string;
  recovery: string;
  aggressive: string;
  defensive: string;
}

interface TriggerRow {
  trigger: string;
  threshold: string;
  projected: string;
  status: string;
}

interface NimAttributionRow {
  product: string;
  assets: number;
  income: number;
  expense: number;
  nim: number;
}

interface VolumeRateRow {
  product: string;
  volumeEffect: string;
  rateEffect: string;
  mixEffect: string;
  totalChange: string;
}

interface NimCurrencyRow {
  currency: string;
  earningAssets: number;
  nii: number;
  nim: string;
}

interface HedgeScenarioRow {
  scenario: string;
  dgap: number;
  deve: number;
  dnii: number;
  hedgeCost: number;
}

interface CostBenefitRow {
  metric: string;
  value: string;
}

@Component({
  selector: 'app-optimization',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TabBarComponent,
    FeatureCardComponent,
    StatusBadgeComponent,
    GhanaRegulatoryDetailComponent,
  ],
  template: `
    <div class="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
      <header class="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4">
        <div class="max-w-7xl mx-auto flex items-center gap-4">
          <h1 class="text-2xl font-bold text-neutral-800 dark:text-neutral-100 font-mono">
            <a routerLink="/" class="hover:text-primary-500 transition-colors">BankOS</a>
          </h1>
          <span class="text-neutral-400">|</span>
          <span class="text-neutral-700 dark:text-neutral-300">Balance Sheet Optimization</span>
        </div>
      </header>

      <main class="flex-1 p-6 overflow-y-auto">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">Balance Sheet Optimization</h2>
          <p class="text-neutral-500 dark:text-neutral-400 mb-6 text-sm">
            NIM attribution, scenario simulation, hedging strategies &mdash; Ghana ALCO decision support
          </p>

          <tab-bar [tabs]="tabLabels" [activeIndex]="activeTab" (tabChange)="onTabChange($event)" />

          <!-- ================================================================ -->
          <!-- TAB 1: Balance Sheet Simulator                                  -->
          <!-- ================================================================ -->
          @if (activeTab === 0) {
            <div>
              <feature-card
                title="Balance Sheet Simulator"
                description="Run multi-scenario balance sheet simulations with recovery planning actions. Assess impact on capital, liquidity, and profitability under Ghana-specific stress."
                [userStories]="simulatorUserStories"
              >
                <ghana-regulatory-detail
                  detail="BoG Recovery Planning Directive: Recovery plan to BoG by Dec 31 annually. Recovery options must have quantified impact. Triggers monitored: CET1 < 7%, LCR < 100%, NSFR < 100%, Leverage < 3%. Management actions: dividend cut, asset sales, capital issuance. Ghana-specific scenarios: sovereign default, currency crisis, commodity price shock."
                />
              </feature-card>

              <!-- Table 1: Scenario Parameters -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Scenario Parameters</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700">
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3">Parameter</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Base</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Aggressive</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Defensive</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Recovery</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of scenarioParams; track row.scenario) {
                        <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">{{ row.scenario }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.assetGrowth }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.liabilityGrowth }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.pricingChanges }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.hedgeRatio }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Table 2: Key Metrics Comparison -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Key Metrics Comparison (Year 3)</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700">
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3">Metric</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Base</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Recovery</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Aggressive</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Defensive</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of keyMetrics; track row.metric) {
                        <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">{{ row.metric }}</td>
                          <td class="p-3 text-right font-mono" [ngClass]="getMetricClass(row.base, row.metric)">{{ row.base }}</td>
                          <td class="p-3 text-right font-mono" [ngClass]="getMetricClass(row.recovery, row.metric)">{{ row.recovery }}</td>
                          <td class="p-3 text-right font-mono" [ngClass]="getMetricClass(row.aggressive, row.metric)">{{ row.aggressive }}</td>
                          <td class="p-3 text-right font-mono" [ngClass]="getMetricClass(row.defensive, row.metric)">{{ row.defensive }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Table 3: Recovery Trigger Monitoring -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Recovery Trigger Monitoring</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700">
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3">Trigger</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Threshold</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Projected</th>
                        <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of triggerData; track row.trigger) {
                        <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                          <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.trigger }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.threshold }}</td>
                          <td class="p-3 text-right font-mono" [ngClass]="row.projected.includes('<') ? 'text-alert-600 dark:text-alert-400' : 'text-success-600 dark:text-success-400'">{{ row.projected }}</td>
                          <td class="p-3 text-center">
                            <status-badge [status]="row.status === 'Compliant' ? 'compliant' : row.status === 'Warning' ? 'warning' : 'breach'" [label]="row.status" />
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart 1: Key Metrics Radar -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Key Metrics Radar &mdash; Scenario Comparison</h3>
                <div class="relative" style="height: 320px;">
                  <canvas #radarChart></canvas>
                </div>
              </div>

              <!-- Chart 2: Balance Sheet Evolution -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Balance Sheet Evolution (Stacked Area)</h3>
                <div class="relative" style="height: 300px;">
                  <canvas #bsEvolutionChart></canvas>
                </div>
              </div>
            </div>
          }

          <!-- ================================================================ -->
          <!-- TAB 2: NIM Attribution & Decomposition                          -->
          <!-- ================================================================ -->
          @if (activeTab === 1) {
            <div>
              <feature-card
                title="NIM Attribution &amp; Decomposition"
                description="Analyse Net Interest Margin drivers by product, currency, and business unit. Decompose changes into volume, rate, and mix effects."
                [userStories]="nimUserStories"
              />

              <!-- Table 1: NIM Attribution -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">NIM Attribution by Product</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700">
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3">Product Group</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Earning Assets (GHS M)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Interest Income (GHS M)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Interest Expense (GHS M)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">NIM (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of nimAttributionData; track row.product) {
                        <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                          <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.product }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.assets | number:'1.0-0' }}</td>
                          <td class="p-3 text-right font-mono text-success-600 dark:text-success-400">{{ row.income | number:'1.0-0' }}</td>
                          <td class="p-3 text-right font-mono text-alert-600 dark:text-alert-400">{{ row.expense | number:'1.0-0' }}</td>
                          <td class="p-3 text-right font-mono font-semibold" [ngClass]="row.nim >= 2.0 ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400'">{{ row.nim }}%</td>
                        </tr>
                      }
                    </tbody>
                    <tfoot>
                      <tr class="bg-neutral-50 dark:bg-neutral-700/50 font-semibold">
                        <td class="p-3 text-neutral-800 dark:text-neutral-100">Total</td>
                        <td class="p-3 text-right font-mono text-neutral-800 dark:text-neutral-100">12,500</td>
                        <td class="p-3 text-right font-mono text-success-600 dark:text-success-400">402</td>
                        <td class="p-3 text-right font-mono text-alert-600 dark:text-alert-400">254</td>
                        <td class="p-3 text-right font-mono text-warning-600 dark:text-warning-400">2.05%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <!-- Table 2: Volume vs Rate Effect -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Volume vs Rate Effect Decomposition</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700">
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3">Product</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Volume Effect (bps)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Rate Effect (bps)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Mix Effect (bps)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Total NIM Change (bps)</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of volumeRateData; track row.product) {
                        <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                          <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.product }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.volumeEffect }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.rateEffect }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.mixEffect }}</td>
                          <td class="p-3 text-right font-mono font-semibold" [ngClass]="parseBps(row.totalChange) >= 0 ? 'text-success-600 dark:text-success-400' : 'text-alert-600 dark:text-alert-400'">{{ row.totalChange }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Table 3: NIM by Currency -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">NIM by Currency</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700">
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3">Currency</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Earning Assets (GHS M)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">NII (GHS M)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">NIM (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of nimCurrencyData; track row.currency) {
                        <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">{{ row.currency }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.earningAssets | number:'1.0-0' }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.nii | number:'1.0-0' }}</td>
                          <td class="p-3 text-right font-mono font-semibold" [ngClass]="parseFloat(row.nim) >= 2.0 ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400'">{{ row.nim }}%</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart 1: NIM Waterfall -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">NIM Waterfall &mdash; Volume, Rate &amp; Mix Decomposition</h3>
                <div class="relative" style="height: 300px;">
                  <canvas #nimWaterfallChart></canvas>
                </div>
              </div>

              <!-- Chart 2: ROE Decomposition -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">ROE Decomposition (NIM x Leverage x Efficiency)</h3>
                <div class="relative" style="height: 300px;">
                  <canvas #roeDecompChart></canvas>
                </div>
              </div>
            </div>
          }

          <!-- ================================================================ -->
          <!-- TAB 3: What-If Hedging Simulator                                -->
          <!-- ================================================================ -->
          @if (activeTab === 2) {
            <div>
              <feature-card
                title="What-If Hedging Simulator"
                description="Model the impact of different hedge ratios on DGAP, EVE, NII, and cost. Identify the optimal hedging strategy for Ghana-specific ALM."
                [userStories]="hedgingUserStories"
              />

              <!-- Table 1: Hedge Scenario Comparison -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Hedge Scenario Comparison</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700">
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3">Scenario</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">DGAP (yrs)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">&Delta;EVE (%)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">&Delta;NII (%)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Hedge Cost (GHS M)</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of hedgeScenarios; track row.scenario) {
                        <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">{{ row.scenario }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.dgap | number:'1.2-2' }}</td>
                          <td class="p-3 text-right font-mono" [ngClass]="row.deve >= 0 ? 'text-success-600 dark:text-success-400' : 'text-alert-600 dark:text-alert-400'">{{ row.deve | number:'1.1-1' }}%</td>
                          <td class="p-3 text-right font-mono" [ngClass]="row.dnii >= 0 ? 'text-success-600 dark:text-success-400' : 'text-alert-600 dark:text-alert-400'">{{ row.dnii | number:'1.1-1' }}%</td>
                          <td class="p-3 text-right font-mono text-alert-600 dark:text-alert-400">{{ row.hedgeCost | number:'1.0-0' }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Table 2: Cost-Benefit Analysis -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Cost-Benefit Analysis (80% Hedge Ratio)</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700">
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3">Metric</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of costBenefitData; track row.metric) {
                        <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                          <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.metric }}</td>
                          <td class="p-3 text-right font-mono font-semibold text-primary-600 dark:text-primary-400">{{ row.value }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart 1: DGAP Impact -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">DGAP Impact at Different Hedge Ratios</h3>
                <div class="relative" style="height: 300px;">
                  <canvas #dgapChart></canvas>
                </div>
              </div>

              <!-- Chart 2: NII Sensitivity -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">NII Sensitivity by Hedge Ratio</h3>
                <div class="relative" style="height: 300px;">
                  <canvas #niiSensitivityChart></canvas>
                </div>
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `,
})
export class OptimizationComponent implements AfterViewInit {
  // ── View Children ──
  @ViewChild('radarChart') radarChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bsEvolutionChart') bsEvolutionChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('nimWaterfallChart') nimWaterfallChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('roeDecompChart') roeDecompChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('dgapChart') dgapChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('niiSensitivityChart') niiSensitivityChartRef!: ElementRef<HTMLCanvasElement>;

  // ── Tab State ──
  tabLabels = ['Balance Sheet Simulator', 'NIM Attribution & Decomposition', 'What-If Hedging Simulator'];
  activeTab = 0;
  private chartInstances: Chart[] = [];

  // ── User Stories ──
  simulatorUserStories = [
    'As a Strategic Planning Manager, I want to model balance sheet growth scenarios so that I can plan capital and funding requirements.',
    'As a Treasurer, I want to simulate recovery actions to ensure we can restore regulatory ratios under stress.',
    'As an ALCO Member, I want to compare Aggressive vs Defensive strategies to recommend an optimal path.',
    'As a CRO, I want to monitor recovery triggers and ensure compliance with BoG Recovery Planning Directive.',
  ];

  nimUserStories = [
    'As a CFO, I want to decompose NIM changes into volume, rate, and mix effects so that I can explain P&L variance to the Board.',
    'As a BU Head, I want to see NIM attribution by product and currency to identify margin improvement opportunities.',
    'As an ALCO Member, I want to understand ROE drivers across NIM, leverage, and efficiency.',
  ];

  hedgingUserStories = [
    'As a Treasurer, I want to compare hedge strategies so that I can minimise earnings volatility at acceptable cost.',
    'As a Risk Manager, I want to see DGAP and EVE sensitivity at different hedge ratios to set hedge policy.',
    'As an ALCO Member, I want a cost-benefit analysis of hedging to inform the annual hedging mandate.',
  ];

  // ── Tab 1 Data ──
  scenarioParams: ScenarioParam[] = [
    { scenario: 'Asset Growth', assetGrowth: '3.5%', liabilityGrowth: '3.0%', pricingChanges: '+25bps', hedgeRatio: '50%', recoveryActions: '' },
    { scenario: 'Liability Growth', assetGrowth: '4.5%', liabilityGrowth: '5.0%', pricingChanges: '+50bps', hedgeRatio: '60%', recoveryActions: '' },
    { scenario: 'Pricing Changes', assetGrowth: '2.0%', liabilityGrowth: '1.5%', pricingChanges: '-10bps', hedgeRatio: '70%', recoveryActions: '' },
    { scenario: 'Hedge Ratio', assetGrowth: '1.0%', liabilityGrowth: '0.5%', pricingChanges: '+100bps', hedgeRatio: '80%', recoveryActions: '' },
  ];

  keyMetrics: KeyMetricRow[] = [
    { metric: 'LCR (%)', base: '142', recovery: '118', aggressive: '128', defensive: '155' },
    { metric: 'NSFR (%)', base: '115', recovery: '105', aggressive: '110', defensive: '122' },
    { metric: 'CET1 (%)', base: '13.5', recovery: '11.2', aggressive: '12.8', defensive: '14.1' },
    { metric: 'Leverage (%)', base: '5.2', recovery: '4.1', aggressive: '4.8', defensive: '5.6' },
    { metric: 'EVE (% Tier 1)', base: '8.5', recovery: '12.2', aggressive: '10.1', defensive: '7.2' },
    { metric: 'NII (GHS M)', base: '402', recovery: '355', aggressive: '425', defensive: '380' },
    { metric: 'ROE (%)', base: '14.8', recovery: '11.5', aggressive: '16.2', defensive: '13.0' },
  ];

  triggerData: TriggerRow[] = [
    { trigger: 'CET1 Ratio', threshold: '≥ 7.0%', projected: '11.2%', status: 'Compliant' },
    { trigger: 'LCR', threshold: '≥ 100%', projected: '118%', status: 'Compliant' },
    { trigger: 'NSFR', threshold: '≥ 100%', projected: '105%', status: 'Compliant' },
    { trigger: 'Leverage Ratio', threshold: '≥ 3.0%', projected: '4.1%', status: 'Compliant' },
    { trigger: 'NIM', threshold: '≥ 1.8%', projected: '2.05%', status: 'Compliant' },
    { trigger: 'Tier 1 Capital', threshold: '≥ GHS 800M', projected: '745M', status: 'Warning' },
  ];

  // ── Tab 2 Data ──
  nimAttributionData: NimAttributionRow[] = [
    { product: 'Retail Deposits', assets: 2100, income: 85, expense: 0, nim: 4.05 },
    { product: 'SME Loans', assets: 3400, income: 148, expense: 92, nim: 1.65 },
    { product: 'Corporate Loans', assets: 4200, income: 124, expense: 98, nim: 1.33 },
    { product: 'Government Bonds', assets: 2800, income: 45, expense: 64, nim: 1.61 },
  ];

  volumeRateData: VolumeRateRow[] = [
    { product: 'Retail Deposits', volumeEffect: '+12', rateEffect: '-3', mixEffect: '+5', totalChange: '+14' },
    { product: 'SME Loans', volumeEffect: '+8', rateEffect: '-6', mixEffect: '-2', totalChange: '0' },
    { product: 'Corporate Loans', volumeEffect: '+15', rateEffect: '-10', mixEffect: '-4', totalChange: '+1' },
    { product: 'Government Bonds', volumeEffect: '+5', rateEffect: '+2', mixEffect: '-1', totalChange: '+6' },
  ];

  nimCurrencyData: NimCurrencyRow[] = [
    { currency: 'GHS', earningAssets: 7200, nii: 215, nim: '2.99' },
    { currency: 'USD', earningAssets: 3800, nii: 135, nim: '3.55' },
    { currency: 'EUR', earningAssets: 1500, nii: 52, nim: '3.47' },
  ];

  // ── Tab 3 Data ──
  hedgeScenarios: HedgeScenarioRow[] = [
    { scenario: 'Current', dgap: 2.35, deve: -12.5, dnii: -8.2, hedgeCost: 0 },
    { scenario: 'Nothing (0%)', dgap: 2.35, deve: -12.5, dnii: -8.2, hedgeCost: 0 },
    { scenario: '60% Hedge', dgap: 1.85, deve: -8.9, dnii: -5.4, hedgeCost: 3.2 },
    { scenario: '80% Hedge', dgap: 1.45, deve: -6.2, dnii: -3.8, hedgeCost: 4.8 },
    { scenario: '100% Hedge', dgap: 0.95, deve: -3.5, dnii: -2.1, hedgeCost: 6.5 },
  ];

  costBenefitData: CostBenefitRow[] = [
    { metric: 'Hedge Cost (Annual)', value: 'GHS 4.8M' },
    { metric: 'Risk Reduction (&Delta;EVE)', value: '6.3% (from -12.5% to -6.2%)' },
    { metric: 'Risk Reduction (&Delta;NII)', value: '4.4% (from -8.2% to -3.8%)' },
    { metric: 'Net Benefit (EVE)', value: 'GHS 2.1M' },
    { metric: 'Break-Even Hedge Cost', value: 'GHS 7.2M' },
    { metric: 'Cost-Benefit Ratio', value: '1 : 1.44' },
  ];

  // ── Lifecycle ──
  ngAfterViewInit(): void {
    setTimeout(() => this.createCharts(), 50);
  }

  onTabChange(index: number): void {
    this.activeTab = index;
    this.destroyCharts();
    setTimeout(() => this.createCharts(), 80);
  }

  // ── Helpers ──
  private destroyCharts(): void {
    this.chartInstances.forEach((c) => c.destroy());
    this.chartInstances = [];
  }

  parseFloat(val: string): number {
    return Number(val);
  }

  parseBps(val: string): number {
    return Number(val.replace(/[+\-]/g, ''));
  }

  getMetricClass(val: string, metric: string): string {
    const num = parseFloat(val);
    if (metric === 'LCR (%)' || metric === 'NSFR (%)' || metric === 'CET1 (%)') {
      return num >= 100 ? 'text-success-600 dark:text-success-400' : num >= 90 ? 'text-warning-600 dark:text-warning-400' : 'text-alert-600 dark:text-alert-400';
    }
    if (metric === 'Leverage (%)') {
      return num >= 3.0 ? 'text-success-600 dark:text-success-400' : num >= 2.5 ? 'text-warning-600 dark:text-warning-400' : 'text-alert-600 dark:text-alert-400';
    }
    if (metric === 'EVE (% Tier 1)') {
      return num <= 15 ? 'text-success-600 dark:text-success-400' : 'text-alert-600 dark:text-alert-400';
    }
    if (metric === 'ROE (%)') {
      return num >= 12 ? 'text-success-600 dark:text-success-400' : num >= 8 ? 'text-warning-600 dark:text-warning-400' : 'text-alert-600 dark:text-alert-400';
    }
    return 'text-neutral-700 dark:text-neutral-200';
  }

  private getCtx(ref: ElementRef<HTMLCanvasElement>): CanvasRenderingContext2D | null {
    return ref?.nativeElement?.getContext('2d') ?? null;
  }

  // ── Chart Creators ──
  private createCharts(): void {
    if (this.activeTab === 0) {
      this.createRadarChart();
      this.createBsEvolutionChart();
    } else if (this.activeTab === 1) {
      this.createNimWaterfallChart();
      this.createRoeDecompChart();
    } else if (this.activeTab === 2) {
      this.createDgapChart();
      this.createNiiSensitivityChart();
    }
  }

  // ── Tab 1 Charts ──
  private createRadarChart(): void {
    const ctx = this.getCtx(this.radarChartRef);
    if (!ctx) return;

    const labels = ['LCR', 'NSFR', 'CET1', 'Leverage', 'EVE', 'NII', 'ROE'];
    const baseData = [142, 115, 13.5, 5.2, 8.5, 402, 14.8];
    const recoveryData = [118, 105, 11.2, 4.1, 12.2, 355, 11.5];
    const aggressiveData = [128, 110, 12.8, 4.8, 10.1, 425, 16.2];
    const defensiveData = [155, 122, 14.1, 5.6, 7.2, 380, 13.0];

    // Normalise for radar display
    const maxVals = labels.map((_, i) => Math.max(baseData[i], recoveryData[i], aggressiveData[i], defensiveData[i]));
    const normalize = (arr: number[]) => arr.map((v, i) => +(v / maxVals[i] * 100).toFixed(1));

    const chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [
          { label: 'Base', data: normalize(baseData), borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.15)', pointBackgroundColor: 'rgb(59, 130, 246)' },
          { label: 'Recovery', data: normalize(recoveryData), borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.1)', pointBackgroundColor: 'rgb(239, 68, 68)' },
          { label: 'Aggressive', data: normalize(aggressiveData), borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.1)', pointBackgroundColor: 'rgb(34, 197, 94)' },
          { label: 'Defensive', data: normalize(defensiveData), borderColor: 'rgb(249, 115, 22)', backgroundColor: 'rgba(249, 115, 22, 0.1)', pointBackgroundColor: 'rgb(249, 115, 22)' },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { display: false },
            grid: { color: 'rgba(0,0,0,0.08)' },
            pointLabels: { font: { size: 11 } },
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  private createBsEvolutionChart(): void {
    const ctx = this.getCtx(this.bsEvolutionChartRef);
    if (!ctx) return;

    const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
    const loans = [7600, 8100, 8600, 9100, 9600];
    const bonds = [2800, 3000, 3200, 3400, 3500];
    const otherAssets = [1600, 1700, 1800, 1900, 2000];
    const deposits = [9400, 10000, 10600, 11200, 11800];
    const borrowings = [1600, 1700, 1800, 1900, 2000];
    const equity = [1000, 1100, 1200, 1300, 1400];

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          { label: 'Loans', data: loans, borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.6)', fill: '+1' },
          { label: 'Bonds', data: bonds, borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.5)', fill: '+1' },
          { label: 'Other Assets', data: otherAssets, borderColor: 'rgb(249, 115, 22)', backgroundColor: 'rgba(249, 115, 22, 0.4)', fill: '+1' },
          { label: 'Deposits', data: deposits, borderColor: 'rgb(168, 85, 247)', backgroundColor: 'rgba(168, 85, 247, 0.5)', fill: false, borderDash: [5, 3] },
          { label: 'Borrowings', data: borrowings, borderColor: 'rgb(236, 72, 153)', backgroundColor: 'rgba(236, 72, 153, 0.3)', fill: false, borderDash: [3, 3] },
          { label: 'Equity', data: equity, borderColor: 'rgb(34, 211, 238)', backgroundColor: 'rgba(34, 211, 238, 0.2)', fill: false, borderDash: [2, 4] },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          y: { stacked: true, title: { display: true, text: 'GHS M' }, beginAtZero: true },
          x: { grid: { display: false } },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  // ── Tab 2 Charts ──
  private createNimWaterfallChart(): void {
    const ctx = this.getCtx(this.nimWaterfallChartRef);
    if (!ctx) return;

    const labels = ['Starting NIM', 'Volume Effect', 'Rate Effect', 'Mix Effect', 'Ending NIM'];
    const data: (number | undefined)[] = [2.42, 0.35, -0.18, -0.04, undefined];
    // Manual waterfall using bar chart with hidden baseline
    const baseValues = [0, 2.42, 2.77, 2.59, 0];
    const barValues = [2.42, 0.35, -0.18, -0.04, 2.55];
    const colors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(249, 115, 22, 0.8)',
      'rgba(59, 130, 246, 0.8)',
    ];
    const baseColor = 'rgba(0,0,0,0)';

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Base',
            data: baseValues,
            backgroundColor: baseColor,
            borderColor: baseColor,
          },
          {
            label: 'NIM Change',
            data: barValues,
            backgroundColor: colors,
            borderColor: colors.map((c) => c.replace('0.8', '1')),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed.y;
                if (val == null) return '';
                return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
              },
            },
          },
        },
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: {
            stacked: true,
            title: { display: true, text: 'NIM (%)' },
            beginAtZero: true,
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  private createRoeDecompChart(): void {
    const ctx = this.getCtx(this.roeDecompChartRef);
    if (!ctx) return;

    const labels = ['Current', 'Optimised', 'Peer Avg', 'Target'];
    const nim = [2.05, 2.55, 2.80, 3.00];
    const leverage = [5.2, 5.8, 5.5, 6.0];
    const efficiency = [0.72, 0.78, 0.80, 0.85];
    const roe = nim.map((n, i) => +(n * leverage[i] * efficiency[i]).toFixed(1));

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'NIM (%)', data: nim, backgroundColor: 'rgba(59, 130, 246, 0.8)', borderRadius: 2 },
          { label: 'Leverage (x)', data: leverage, backgroundColor: 'rgba(34, 197, 94, 0.8)', borderRadius: 2 },
          { label: 'Efficiency (x)', data: efficiency, backgroundColor: 'rgba(249, 115, 22, 0.8)', borderRadius: 2 },
          { label: 'ROE (%)', data: roe, backgroundColor: 'rgba(168, 85, 247, 0.9)', borderRadius: 2 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Value' } },
          x: { grid: { display: false } },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  // ── Tab 3 Charts ──
  private createDgapChart(): void {
    const ctx = this.getCtx(this.dgapChartRef);
    if (!ctx) return;

    const labels = ['Current (50%)', 'Nothing (0%)', '60% Hedge', '80% Hedge', '100% Hedge'];
    const dgapData = [2.35, 2.35, 1.85, 1.45, 0.95];
    const eveData = [-12.5, -12.5, -8.9, -6.2, -3.5];
    const niiData = [-8.2, -8.2, -5.4, -3.8, -2.1];

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'DGAP (yrs)', data: dgapData, borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: false, tension: 0.3, pointRadius: 5, pointBackgroundColor: 'rgb(59, 130, 246)' },
          { label: 'ΔEVE (%)', data: eveData, borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.1)', fill: false, tension: 0.3, pointRadius: 5, pointBackgroundColor: 'rgb(239, 68, 68)', borderDash: [5, 3] },
          { label: 'ΔNII (%)', data: niiData, borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.1)', fill: false, tension: 0.3, pointRadius: 5, pointBackgroundColor: 'rgb(34, 197, 94)', borderDash: [3, 3] },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Value' } },
          x: { grid: { display: false }, ticks: { maxRotation: 30 } },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  private createNiiSensitivityChart(): void {
    const ctx = this.getCtx(this.niiSensitivityChartRef);
    if (!ctx) return;

    const labels = ['Current (50%)', 'Nothing (0%)', '60% Hedge', '80% Hedge', '100% Hedge'];
    const parallelUp = [-8.2, -8.2, -5.4, -3.8, -2.1];
    const parallelDown = [4.5, 4.5, 3.1, 2.0, 1.1];
    const steepener = [-6.1, -6.1, -4.2, -2.8, -1.5];

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Parallel +200bps', data: parallelUp, backgroundColor: 'rgba(239, 68, 68, 0.8)', borderRadius: 2 },
          { label: 'Parallel -200bps', data: parallelDown, backgroundColor: 'rgba(34, 197, 94, 0.8)', borderRadius: 2 },
          { label: 'Steepener', data: steepener, backgroundColor: 'rgba(249, 115, 22, 0.8)', borderRadius: 2 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          y: { title: { display: true, text: 'NII Change (%)' }, beginAtZero: true },
          x: { grid: { display: false }, ticks: { maxRotation: 30 } },
        },
      },
    });
    this.chartInstances.push(chart);
  }
}
