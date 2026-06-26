import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  TabBarComponent,
  FeatureCardComponent,
  StatusBadgeComponent,
  GhanaRegulatoryDetailComponent,
} from '../../shared/index';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-irrbb',
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
      <header
        class="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4"
      >
        <div class="max-w-7xl mx-auto flex items-center gap-4">
          <h1 class="text-2xl font-bold text-neutral-800 dark:text-neutral-100 font-mono">
            <a routerLink="/" class="hover:text-primary-500 transition-colors">BankOS</a>
          </h1>
          <span class="text-neutral-400">|</span>
          <span class="text-neutral-700 dark:text-neutral-300">IRRBB</span>
        </div>
      </header>

      <main class="flex-1 p-6 overflow-y-auto">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
            Interest Rate Risk in the Banking Book (IRRBB)
          </h2>
          <p class="text-neutral-500 dark:text-neutral-400 mb-6 text-sm">
            Bank of Ghana Standardised 19-Bucket Framework &mdash; EVE, NII, Repricing Gap, Hedging &amp; Duration Analysis
          </p>

          <!-- TABS -->
          <tab-bar [tabs]="tabLabels" [activeIndex]="activeTab" (tabChange)="onTabChange($event)" />

          <!-- ======================== TAB 1: EVE SENSITIVITY ======================== -->
          @if (activeTab === 0) {
            <div>
              <feature-card
                title="EVE Sensitivity Calculator"
                description="Calculate Economic Value of Equity (EVE) sensitivity under six SOT scenarios using the Bank of Ghana standardised 19-bucket framework."
                [userStories]="[
                  'As a risk analyst, I want to run EVE shocks under 6 scenarios so that I can assess capital impact.',
                  'As a CRO, I want to see SOT threshold breaches so that I can take corrective action.',
                  'As a regulator, I want to verify EVE changes are within 15% of Tier 1 capital.',
                ]"
              >
                <ghana-regulatory-detail
                  detail="BoG IRRBB Guideline 2026: Standardised Framework with 19 buckets. Six shock scenarios: parallel up, parallel down, steepener, flattener, short rate up, short rate down. SOT (Supervisory Outlier Test): delta-EVE > 15% of Tier 1 capital triggers alert. Ghana Reference Rate (GRR) used for GHS cash flows."
                />
              </feature-card>

              <!-- Table 1: EVE by Scenario -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  EVE Sensitivity by Scenario
                </h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr
                        class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700"
                      >
                        <th
                          class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Scenario
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          EVE Change (&euro;M)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Capital Impact (%)
                        </th>
                        <th
                          class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of eveData; track row.scenario) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.scenario }}</td>
                          <td
                            class="p-3 text-right font-mono"
                            [ngClass]="
                              row.eveChange >= 0
                                ? 'text-success-600 dark:text-success-400'
                                : 'text-alert-600 dark:text-alert-400'
                            "
                          >
                            {{ row.eveChange | number: '1.0-0' }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.capitalImpact }}%
                          </td>
                          <td class="p-3 text-center">
                            <status-badge
                              [status]="row.status === 'Compliant' ? 'compliant' : row.status === 'Warning' ? 'warning' : 'breach'"
                              [label]="row.status"
                            />
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Table 2: EVE Heatmap -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  EVE Heatmap (% of Tier 1 Capital)
                </h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr
                        class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700"
                      >
                        <th
                          class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Currency
                        </th>
                        @for (sc of heatmapScenarios; track sc) {
                          <th
                            class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                          >
                            {{ sc }}
                          </th>
                        }
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of eveHeatmapData; track row.currency) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                            {{ row.currency }}
                          </td>
                          @for (val of row.values; track val) {
                            <td
                              class="p-3 text-right font-mono"
                              [ngClass]="getHeatmapClass(val)"
                            >
                              {{ val > 0 ? '+' : '' }}{{ val }}%
                            </td>
                          }
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Table 3: SOT Breach History -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  SOT Breach History
                </h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr
                        class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700"
                      >
                        <th
                          class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Date
                        </th>
                        <th
                          class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Scenario
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          EVE Change (&euro;M)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          % Tier 1
                        </th>
                        <th
                          class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of sotBreachData; track row.date) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.date }}</td>
                          <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.scenario }}</td>
                          <td
                            class="p-3 text-right font-mono"
                            [ngClass]="
                              row.eveChange >= 0
                                ? 'text-success-600 dark:text-success-400'
                                : 'text-alert-600 dark:text-alert-400'
                            "
                          >
                            {{ row.eveChange | number: '1.0-0' }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.pctTier1 }}%
                          </td>
                          <td class="p-3 text-center">
                            <status-badge
                              [status]="row.status === 'Breach' ? 'red' : 'amber'"
                              [label]="row.status"
                            />
                          </td>
                        </tr>
                      } @empty {
                        <tr>
                          <td
                            colspan="5"
                            class="p-6 text-center text-neutral-400 dark:text-neutral-500 italic"
                          >
                            No SOT breaches recorded. All scenarios within 15% Tier 1 threshold.
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart 1: EVE Impact bar chart -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  EVE Impact by Scenario &mdash; SOT Threshold
                </h3>
                <div class="relative" style="height: 300px;">
                  <canvas #eveImpactChart></canvas>
                </div>
              </div>

              <!-- Chart 2: EVE by Currency stacked bar -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  EVE by Currency (Stacked)
                </h3>
                <div class="relative" style="height: 300px;">
                  <canvas #eveCurrencyChart></canvas>
                </div>
              </div>
            </div>
          }

          <!-- ======================== TAB 2: NII FORECASTING ======================== -->
          @if (activeTab === 1) {
            <div>
              <ghana-regulatory-detail
                detail="BoG IRRBB 2026: NII forecast required under all six SOT scenarios for quarterly reporting. Deposit beta 0.2-0.8 for core deposits. NMD core ratio capped at 70%."
              />

              <!-- Table 1: NII by Product -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  NII by Product (Next Quarter)
                </h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr
                        class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700"
                      >
                        <th
                          class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Product
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Base (&euro;M)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Upside (&euro;M)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Downside (&euro;M)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of niiProductData; track row.product) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                            {{ row.product }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.base | number: '1.0-0' }}
                          </td>
                          <td class="p-3 text-right font-mono text-success-600 dark:text-success-400">
                            {{ row.upside | number: '1.0-0' }}
                          </td>
                          <td class="p-3 text-right font-mono text-alert-600 dark:text-alert-400">
                            {{ row.downside | number: '1.0-0' }}
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Table 2: Scenario Comparison -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  NII Scenario Comparison (12-Month Forecast)
                </h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr
                        class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700"
                      >
                        <th
                          class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Month
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Base (&euro;M)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Upside (&euro;M)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Downside (&euro;M)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Custom (&euro;M)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of niiScenarioData; track row.month) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                            {{ row.month }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.base | number: '1.0-0' }}
                          </td>
                          <td class="p-3 text-right font-mono text-success-600 dark:text-success-400">
                            {{ row.upside | number: '1.0-0' }}
                          </td>
                          <td class="p-3 text-right font-mono text-alert-600 dark:text-alert-400">
                            {{ row.downside | number: '1.0-0' }}
                          </td>
                          <td class="p-3 text-right font-mono text-primary-600 dark:text-primary-400">
                            {{ row.custom | number: '1.0-0' }}
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart 1: NII Forecast line chart -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  NII Forecast (12 Months)
                </h3>
                <div class="relative" style="height: 300px;">
                  <canvas #niiForecastChart></canvas>
                </div>
              </div>

              <!-- Chart 2: NII by Product stacked bar -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  NII by Product (Stacked)
                </h3>
                <div class="relative" style="height: 300px;">
                  <canvas #niiProductChart></canvas>
                </div>
              </div>
            </div>
          }

          <!-- ======================== TAB 3: REPRICING GAP ======================== -->
          @if (activeTab === 2) {
            <div>
              <ghana-regulatory-detail
                detail="BoG IRRBB 2026: 19 standardised time buckets: O/N, 1M, 2M, 3M, 4-6M, 7-9M, 10-12M, 1Y, 1.5Y, 2Y, 2.5Y, 3Y, 3.5Y, 4Y, 4.5Y, 5Y, 6-7Y, 8-10Y, >10Y. Standardisation categorisation: amenable/less amenable/not amenable."
              />

              <!-- Table 1: Gap Ladder -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Repricing Gap Ladder
                </h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr
                        class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700"
                      >
                        <th
                          class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Time Bucket
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Gap (&euro;M)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Rate Sensitivity (%)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of gapData; track row.bucket) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                            {{ row.bucket }}
                          </td>
                          <td
                            class="p-3 text-right font-mono"
                            [ngClass]="
                              row.gap >= 0
                                ? 'text-success-600 dark:text-success-400'
                                : 'text-alert-600 dark:text-alert-400'
                            "
                          >
                            {{ row.gap | number: '1.0-0' }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.sensitivity }}%
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Table 2: Standardisation Categorisation -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Standardisation Categorisation
                </h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr
                        class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700"
                      >
                        <th
                          class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Category
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Amount (&euro;M)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Percentage
                        </th>
                        <th
                          class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of standardisationData; track row.category) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                            {{ row.category }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.amount | number: '1.0-0' }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.percentage }}%
                          </td>
                          <td class="p-3 text-center">
                            <status-badge [status]="row.statusCode" [label]="row.status" />
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart 1: Cumulative Gap line chart -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Cumulative Repricing Gap
                </h3>
                <div class="relative" style="height: 300px;">
                  <canvas #cumulativeGapChart></canvas>
                </div>
              </div>

              <!-- Chart 2: Gap Distribution bar chart -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Gap Distribution by Bucket
                </h3>
                <div class="relative" style="height: 300px;">
                  <canvas #gapDistributionChart></canvas>
                </div>
              </div>
            </div>
          }

          <!-- ======================== TAB 4: DERIVATIVE HEDGING ======================== -->
          @if (activeTab === 3) {
            <div>
              <!-- Table 1: Instrument Breakdown -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Derivative Instrument Breakdown
                </h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr
                        class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700"
                      >
                        <th
                          class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Instrument
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Notional (&euro;bn)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Rate / Strike
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Tenor
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          MTM (&euro;M)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of derivativeData; track row.instrument) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                            {{ row.instrument }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.notional | number: '1.1-1' }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.rate }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.tenor }}
                          </td>
                          <td
                            class="p-3 text-right font-mono"
                            [ngClass]="
                              row.mtm >= 0
                                ? 'text-success-600 dark:text-success-400'
                                : 'text-alert-600 dark:text-alert-400'
                            "
                          >
                            {{ row.mtm >= 0 ? '+' : '' }}{{ row.mtm | number: '1.0-0' }}
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Table 2: Counterparty Exposure -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Counterparty Exposure Summary
                </h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr
                        class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700"
                      >
                        <th
                          class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Counterparty
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Gross Exposure (&euro;M)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Net Exposure (&euro;M)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Credit Rating
                        </th>
                        <th
                          class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Collateralised
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of counterpartyData; track row.name) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                            {{ row.name }}
                          </td>
                          <td class="p-3 text-right font-mono">{{ row.gross | number: '1.0-0' }}</td>
                          <td class="p-3 text-right font-mono">{{ row.net | number: '1.0-0' }}</td>
                          <td class="p-3 text-right font-mono">{{ row.rating }}</td>
                          <td class="p-3 text-center">
                            <status-badge
                              [status]="row.collateralised ? 'compliant' : 'warning'"
                              [label]="row.collateralised ? 'Yes' : 'No'"
                            />
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart 1: Maturity Profile bar chart -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Derivative Maturity Profile
                </h3>
                <div class="relative" style="height: 300px;">
                  <canvas #derivativeMaturityChart></canvas>
                </div>
              </div>

              <!-- Chart 2: Hedge Effectiveness line chart -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Hedge Effectiveness Over Time
                </h3>
                <div class="relative" style="height: 300px;">
                  <canvas #hedgeEffectivenessChart></canvas>
                </div>
              </div>
            </div>
          }

          <!-- ======================== TAB 5: DURATION GAP ======================== -->
          @if (activeTab === 4) {
            <div>
              <!-- Table 1: Duration Analysis -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Duration Analysis
                </h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr
                        class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700"
                      >
                        <th
                          class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Metric
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Assets
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Liabilities
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Gap
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of durationAnalysisData; track row.metric) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                            {{ row.metric }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.assets }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.liabilities }}
                          </td>
                          <td
                            class="p-3 text-right font-mono"
                            [ngClass]="
                              row.gap >= 0
                                ? 'text-success-600 dark:text-success-400'
                                : 'text-alert-600 dark:text-alert-400'
                            "
                          >
                            {{ row.gap >= 0 ? '+' : '' }}{{ row.gap }}
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Table 2: Scenario Impact -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Scenario Impact on Duration Gap
                </h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr
                        class="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700"
                      >
                        <th
                          class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Scenario
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Asset Value Change (%)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Liability Value Change (%)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Equity Impact (%)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of scenarioImpactData; track row.scenario) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                            {{ row.scenario }}
                          </td>
                          <td
                            class="p-3 text-right font-mono"
                            [ngClass]="
                              row.assetChange >= 0
                                ? 'text-success-600 dark:text-success-400'
                                : 'text-alert-600 dark:text-alert-400'
                            "
                          >
                            {{ row.assetChange > 0 ? '+' : '' }}{{ row.assetChange }}%
                          </td>
                          <td
                            class="p-3 text-right font-mono"
                            [ngClass]="
                              row.liabilityChange >= 0
                                ? 'text-success-600 dark:text-success-400'
                                : 'text-alert-600 dark:text-alert-400'
                            "
                          >
                            {{ row.liabilityChange > 0 ? '+' : '' }}{{ row.liabilityChange }}%
                          </td>
                          <td
                            class="p-3 text-right font-mono font-semibold"
                            [ngClass]="
                              row.equityImpact >= 0
                                ? 'text-success-600 dark:text-success-400'
                                : 'text-alert-600 dark:text-alert-400'
                            "
                          >
                            {{ row.equityImpact > 0 ? '+' : '' }}{{ row.equityImpact }}%
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart 1: Duration Gap Trend -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Duration Gap Trend
                </h3>
                <div class="relative" style="height: 300px;">
                  <canvas #durationGapTrendChart></canvas>
                </div>
              </div>

              <!-- Chart 2: Price Sensitivity Curve -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Price Sensitivity Curve
                </h3>
                <div class="relative" style="height: 300px;">
                  <canvas #priceSensitivityChart></canvas>
                </div>
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [],
})
export class IRRBBComponent implements AfterViewInit {
  // ── Tab state ──
  tabLabels = [
    'EVE Sensitivity',
    'NII Forecasting',
    'Repricing Gap',
    'Derivative Hedging',
    'Duration Gap (DGAP)',
  ];
  activeTab = 0;

  // ── Chart canvas refs ──
  @ViewChild('eveImpactChart', { static: true }) eveImpactCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('eveCurrencyChart', { static: true }) eveCurrencyCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('niiForecastChart', { static: true }) niiForecastCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('niiProductChart', { static: true }) niiProductCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cumulativeGapChart', { static: true }) cumulativeGapCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('gapDistributionChart', { static: true }) gapDistributionCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('derivativeMaturityChart', { static: true }) derivativeMaturityCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('hedgeEffectivenessChart', { static: true }) hedgeEffectivenessCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('durationGapTrendChart', { static: true }) durationGapTrendCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priceSensitivityChart', { static: true }) priceSensitivityCanvas!: ElementRef<HTMLCanvasElement>;

  private chartInstances: Chart[] = [];

  // ── TAB 1: EVE Sensitivity Data ──
  heatmapScenarios = [
    'Par Up',
    'Par Down',
    'Steepener',
    'Flattener',
    'Short Up',
    'Short Down',
  ];

  eveData = [
    { scenario: 'Parallel Up (+100bps)', eveChange: -185, capitalImpact: -3.2, status: 'Warning' },
    { scenario: 'Parallel Down (-100bps)', eveChange: 42, capitalImpact: 0.7, status: 'Compliant' },
    { scenario: 'Steepener (+50/–50)', eveChange: -95, capitalImpact: -1.6, status: 'Compliant' },
    { scenario: 'Flattener (–50/+50)', eveChange: 38, capitalImpact: 0.6, status: 'Compliant' },
    { scenario: 'Short Rate Up', eveChange: -210, capitalImpact: -3.6, status: 'Warning' },
    { scenario: 'Short Rate Down', eveChange: 28, capitalImpact: 0.5, status: 'Compliant' },
  ];

  eveHeatmapData = [
    { currency: 'GHS', values: [-3.8, 0.9, -2.1, 0.7, -4.2, 0.6] },
    { currency: 'USD', values: [-2.5, 0.5, -1.1, 0.4, -2.8, 0.3] },
    { currency: 'EUR', values: [-1.2, 0.2, -0.5, 0.2, -1.4, 0.1] },
  ];

  sotBreachData: any[] = [];

  // ── TAB 2: NII Data ──
  niiProductData = [
    { product: 'Fixed Mortgages', base: 120, upside: 135, downside: 95 },
    { product: 'Variable Loans', base: 85, upside: 95, downside: 68 },
    { product: 'Retail Current', base: 32, upside: 34, downside: 28 },
    { product: 'Savings', base: 18, upside: 19, downside: 16 },
    { product: 'Wholesale', base: 65, upside: 72, downside: 52 },
  ];

  niiScenarioData = [
    { month: 'Jan', base: 320, upside: 355, downside: 259, custom: 310 },
    { month: 'Feb', base: 318, upside: 358, downside: 255, custom: 305 },
    { month: 'Mar', base: 325, upside: 362, downside: 262, custom: 312 },
    { month: 'Apr', base: 330, upside: 370, downside: 265, custom: 315 },
    { month: 'May', base: 328, upside: 368, downside: 260, custom: 308 },
    { month: 'Jun', base: 335, upside: 375, downside: 268, custom: 318 },
    { month: 'Jul', base: 340, upside: 380, downside: 272, custom: 322 },
    { month: 'Aug', base: 338, upside: 378, downside: 270, custom: 316 },
    { month: 'Sep', base: 342, upside: 382, downside: 274, custom: 320 },
    { month: 'Oct', base: 348, upside: 388, downside: 278, custom: 325 },
    { month: 'Nov', base: 345, upside: 385, downside: 276, custom: 318 },
    { month: 'Dec', base: 350, upside: 390, downside: 280, custom: 328 },
  ];

  // ── TAB 3: Repricing Gap Data ──
  gapData = [
    { bucket: '0-1M', gap: 150, sensitivity: 0.5 },
    { bucket: '1-3M', gap: 420, sensitivity: 1.2 },
    { bucket: '3-6M', gap: 380, sensitivity: 2.1 },
    { bucket: '6-12M', gap: 290, sensitivity: 3.4 },
    { bucket: '1-2Y', gap: 180, sensitivity: 4.8 },
    { bucket: '2-3Y', gap: -45, sensitivity: 5.2 },
    { bucket: '3-5Y', gap: -120, sensitivity: 6.1 },
    { bucket: '5+Y', gap: -320, sensitivity: 7.3 },
  ];

  standardisationData = [
    { category: 'Amenable', amount: 850, percentage: 48.6, status: 'Within Cap', statusCode: 'compliant' },
    { category: 'Less Amenable', amount: 520, percentage: 29.7, status: 'Watch', statusCode: 'warning' },
    { category: 'Not Amenable', amount: 380, percentage: 21.7, status: 'Within Cap', statusCode: 'compliant' },
  ];

  // ── TAB 4: Derivative Hedging Data ──
  derivativeData = [
    { instrument: 'IRS Pay (Fixed)', notional: 2.0, rate: '3.25%', tenor: '5Y', mtm: -30 },
    { instrument: 'IRS Rec (Float)', notional: 0.5, rate: '2.80%', tenor: '3Y', mtm: 8 },
    { instrument: 'Cap (3.5%)', notional: 0.4, rate: '3.50%', tenor: '7Y', mtm: 5 },
    { instrument: 'Floor (2.0%)', notional: 0.3, rate: '2.00%', tenor: '5Y', mtm: -2 },
  ];

  counterpartyData = [
    { name: 'Standard Chartered GH', gross: 850, net: 720, rating: 'AA-', collateralised: true },
    { name: 'Ecobank Ghana', gross: 420, net: 380, rating: 'A+', collateralised: true },
    { name: 'Ghana Commercial Bank', gross: 350, net: 310, rating: 'A', collateralised: true },
    { name: 'Societe Generale GH', gross: 280, net: 220, rating: 'A-', collateralised: false },
  ];

  // ── TAB 5: Duration Gap Data ──
  durationAnalysisData = [
    { metric: 'Macaulay Duration', assets: '4.52 yrs', liabilities: '2.18 yrs', gap: 2.34 },
    { metric: 'Modified Duration', assets: '4.38', liabilities: '2.11', gap: 2.27 },
    { metric: 'Convexity', assets: '28.5', liabilities: '12.4', gap: 16.1 },
    { metric: 'DV01 (&euro;M)', assets: '1.85', liabilities: '0.92', gap: 0.93 },
  ];

  scenarioImpactData = [
    { scenario: 'Parallel +100bps', assetChange: -4.38, liabilityChange: -2.11, equityImpact: -2.27 },
    { scenario: 'Parallel -100bps', assetChange: 4.38, liabilityChange: 2.11, equityImpact: 2.27 },
    { scenario: 'Parallel +200bps', assetChange: -8.76, liabilityChange: -4.22, equityImpact: -4.54 },
    { scenario: 'Parallel -200bps', assetChange: 8.76, liabilityChange: 4.22, equityImpact: 4.54 },
    { scenario: 'Parallel +300bps', assetChange: -13.14, liabilityChange: -6.33, equityImpact: -6.81 },
    { scenario: 'Parallel -300bps', assetChange: 13.14, liabilityChange: 6.33, equityImpact: 6.81 },
    { scenario: 'Steepener', assetChange: -2.85, liabilityChange: -1.05, equityImpact: -1.80 },
    { scenario: 'Flattener', assetChange: 1.95, liabilityChange: 0.75, equityImpact: 1.20 },
  ];

  // ── Lifecycle ──
  ngAfterViewInit(): void {
    this.destroyCharts();
    // Only init charts for the default tab (tab 0 = EVE Sensitivity)
    // Other tabs' canvases don't exist in the DOM yet (hidden by @if)
    this.createEveImpactChart();
    this.createEveCurrencyChart();
  }

  onTabChange(index: number): void {
    this.destroyCharts();
    this.activeTab = index;
    // Small delay to ensure DOM renders before chart initialisation
    setTimeout(() => {
      switch (index) {
        case 0:
          this.createEveImpactChart();
          this.createEveCurrencyChart();
          break;
        case 1:
          this.createNiiForecastChart();
          this.createNiiProductChart();
          break;
        case 2:
          this.createCumulativeGapChart();
          this.createGapDistributionChart();
          break;
        case 3:
          this.createDerivativeMaturityChart();
          this.createHedgeEffectivenessChart();
          break;
        case 4:
          this.createDurationGapTrendChart();
          this.createPriceSensitivityChart();
          break;
      }
    }, 50);
  }

  getHeatmapClass(val: number): string {
    if (val < -3) return 'text-alert-600 dark:text-alert-400 font-bold bg-alert-50 dark:bg-alert-900/20 rounded';
    if (val < -1) return 'text-warning-600 dark:text-warning-400 bg-warning-50 dark:bg-warning-900/20 rounded';
    if (val > 1) return 'text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/20 rounded';
    return 'text-neutral-600 dark:text-neutral-400';
  }

  // ── Chart helpers ──

  private destroyCharts(): void {
    this.chartInstances.forEach((c) => c.destroy());
    this.chartInstances = [];
  }

  private createAllCharts(): void {
    this.createEveImpactChart();
    this.createEveCurrencyChart();
    this.createNiiForecastChart();
    this.createNiiProductChart();
    this.createCumulativeGapChart();
    this.createGapDistributionChart();
    this.createDerivativeMaturityChart();
    this.createHedgeEffectivenessChart();
    this.createDurationGapTrendChart();
    this.createPriceSensitivityChart();
  }

  private getCtx(canvasRef: ElementRef<HTMLCanvasElement>): CanvasRenderingContext2D | null {
    return canvasRef?.nativeElement?.getContext('2d');
  }

  private isElementVisible(el: ElementRef<HTMLCanvasElement>): boolean {
    return !!el?.nativeElement?.parentElement?.offsetParent;
  }

  // ── TAB 1 Charts ──

  private createEveImpactChart(): void {
    const ctx = this.getCtx(this.eveImpactCanvas);
    if (!ctx || !this.isElementVisible(this.eveImpactCanvas)) return;

    const scenarios = this.eveData.map((d) => d.scenario);
    const values = this.eveData.map((d) => d.eveChange);
    const colors = values.map((v) =>
      v >= 0
        ? 'rgba(34, 197, 94, 0.85)'
        : 'rgba(239, 68, 68, 0.85)'
    );
    const borderColors = values.map((v) =>
      v >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
    );

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: scenarios,
        datasets: [
          {
            label: 'EVE Change (€M)',
            data: values,
            backgroundColor: colors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: false,
            title: { display: true, text: 'EVE Change (€M)' },
          },
          x: {
            ticks: { maxRotation: 45 },
          },
        },
      },
      plugins: [
        {
          id: 'sotThreshold',
          beforeDraw: (chart: Chart) => {
            const ctx2 = chart.ctx;
            const chartArea = chart.chartArea;
            const yScale = chart.scales['y'];

            if (chartArea && yScale) {
              // Draw SOT threshold line at -15% of tier 1 (approx -870M)
              const sotValue = -870;
              const yPos = yScale.getPixelForValue(sotValue);

              if (yPos >= chartArea.top && yPos <= chartArea.bottom) {
                ctx2.save();
                ctx2.beginPath();
                ctx2.setLineDash([6, 4]);
                ctx2.strokeStyle = '#ef4444';
                ctx2.lineWidth = 2;
                ctx2.moveTo(chartArea.left, yPos);
                ctx2.lineTo(chartArea.right, yPos);
                ctx2.stroke();
                ctx2.fillStyle = '#ef4444';
                ctx2.font = '11px sans-serif';
                ctx2.fillText('SOT Threshold (15% Tier 1)', chartArea.left + 4, yPos - 4);
                ctx2.restore();
              }
            }
          },
        },
      ],
    });
    this.chartInstances.push(chart);
  }

  private createEveCurrencyChart(): void {
    const ctx = this.getCtx(this.eveCurrencyCanvas);
    if (!ctx || !this.isElementVisible(this.eveCurrencyCanvas)) return;

    const currencies = this.eveHeatmapData.map((d) => d.currency);
    const scenarios = this.heatmapScenarios;

    const colors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(249, 115, 22, 0.8)',
    ];

    const datasets = this.eveHeatmapData.map((row, i) => ({
      label: row.currency,
      data: row.values,
      backgroundColor: colors[i],
      borderColor: colors[i].replace('0.8', '1'),
      borderWidth: 1,
    }));

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: scenarios,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            title: { display: true, text: '% of Tier 1 Capital' },
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  // ── TAB 2 Charts ──

  private createNiiForecastChart(): void {
    const ctx = this.getCtx(this.niiForecastCanvas);
    if (!ctx || !this.isElementVisible(this.niiForecastCanvas)) return;

    const months = this.niiScenarioData.map((d) => d.month);
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Base',
            data: this.niiScenarioData.map((d) => d.base),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 3,
          },
          {
            label: 'Upside',
            data: this.niiScenarioData.map((d) => d.upside),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 3,
          },
          {
            label: 'Downside',
            data: this.niiScenarioData.map((d) => d.downside),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
        scales: {
          y: {
            title: { display: true, text: 'NII (€M)' },
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  private createNiiProductChart(): void {
    const ctx = this.getCtx(this.niiProductCanvas);
    if (!ctx || !this.isElementVisible(this.niiProductCanvas)) return;

    const products = this.niiProductData.map((d) => d.product);
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: products,
        datasets: [
          {
            label: 'Base',
            data: this.niiProductData.map((d) => d.base),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
          },
          {
            label: 'Upside',
            data: this.niiProductData.map((d) => d.upside),
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
          },
          {
            label: 'Downside',
            data: this.niiProductData.map((d) => d.downside),
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            title: { display: true, text: 'NII (€M)' },
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  // ── TAB 3 Charts ──

  private createCumulativeGapChart(): void {
    const ctx = this.getCtx(this.cumulativeGapCanvas);
    if (!ctx || !this.isElementVisible(this.cumulativeGapCanvas)) return;

    const buckets = this.gapData.map((d) => d.bucket);
    const gaps = this.gapData.map((d) => d.gap);
    // Cumulative
    let cum = 0;
    const cumulative = gaps.map((g) => {
      cum += g;
      return cum;
    });

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: buckets,
        datasets: [
          {
            label: 'Cumulative Gap (€M)',
            data: cumulative,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: cumulative.map((v) =>
              v >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
            ),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
        scales: {
          y: {
            title: { display: true, text: 'Cumulative Gap (€M)' },
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  private createGapDistributionChart(): void {
    const ctx = this.getCtx(this.gapDistributionCanvas);
    if (!ctx || !this.isElementVisible(this.gapDistributionCanvas)) return;

    const buckets = this.gapData.map((d) => d.bucket);
    const gaps = this.gapData.map((d) => d.gap);
    const colors = gaps.map((g) =>
      g >= 0
        ? 'rgba(34, 197, 94, 0.8)'
        : 'rgba(239, 68, 68, 0.8)'
    );

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: buckets,
        datasets: [
          {
            label: 'Gap (€M)',
            data: gaps,
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
        },
        scales: {
          y: {
            title: { display: true, text: 'Gap (€M)' },
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  // ── TAB 4 Charts ──

  private createDerivativeMaturityChart(): void {
    const ctx = this.getCtx(this.derivativeMaturityCanvas);
    if (!ctx || !this.isElementVisible(this.derivativeMaturityCanvas)) return;

    const labels = ['< 1Y', '1-2Y', '2-3Y', '3-5Y', '5-7Y', '7-10Y', '> 10Y'];
    const payNotional = [0.15, 0.35, 0.5, 0.7, 0.3, 0.0, 0.0];
    const recNotional = [0.05, 0.1, 0.2, 0.15, 0.0, 0.0, 0.0];
    const optionsNotional = [0.0, 0.05, 0.08, 0.12, 0.25, 0.2, 0.0];

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Pay Fixed (IRS)',
            data: payNotional,
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 1,
          },
          {
            label: 'Receive Float (IRS)',
            data: recNotional,
            backgroundColor: 'rgba(34, 197, 94, 0.7)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
          },
          {
            label: 'Options (Caps/Floors)',
            data: optionsNotional,
            backgroundColor: 'rgba(249, 115, 22, 0.7)',
            borderColor: 'rgb(249, 115, 22)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            title: { display: true, text: 'Notional (€bn)' },
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  private createHedgeEffectivenessChart(): void {
    const ctx = this.getCtx(this.hedgeEffectivenessCanvas);
    if (!ctx || !this.isElementVisible(this.hedgeEffectivenessCanvas)) return;

    const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'];
    const effectiveness = [82.5, 85.0, 87.2, 88.5, 90.1, 91.3];
    const lowerBound = [80, 80, 80, 80, 80, 80];
    const upperBound = [125, 125, 125, 125, 125, 125];

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: quarters,
        datasets: [
          {
            label: 'Hedge Effectiveness (%)',
            data: effectiveness,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: 'rgb(34, 197, 94)',
          },
          {
            label: 'Lower Bound (80%)',
            data: lowerBound,
            borderColor: 'rgb(239, 68, 68)',
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
          },
          {
            label: 'Upper Bound (125%)',
            data: upperBound,
            borderColor: 'rgb(239, 68, 68)',
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
        scales: {
          y: {
            min: 70,
            max: 130,
            title: { display: true, text: 'Effectiveness (%)' },
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  // ── TAB 5 Charts ──

  private createDurationGapTrendChart(): void {
    const ctx = this.getCtx(this.durationGapTrendCanvas);
    if (!ctx || !this.isElementVisible(this.durationGapTrendCanvas)) return;

    const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'];
    const assetDuration = [4.8, 4.7, 4.65, 4.6, 4.55, 4.52, 4.48, 4.45];
    const liabilityDuration = [2.5, 2.45, 2.38, 2.3, 2.25, 2.18, 2.12, 2.05];
    const dgap = assetDuration.map((a, i) => a - liabilityDuration[i]);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: quarters,
        datasets: [
          {
            label: 'Asset Duration (yrs)',
            data: assetDuration,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 3,
          },
          {
            label: 'Liability Duration (yrs)',
            data: liabilityDuration,
            borderColor: 'rgb(249, 115, 22)',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 3,
          },
          {
            label: 'Duration Gap (yrs)',
            data: dgap,
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: dgap.map((v) =>
              v >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
            ),
            borderDash: [4, 3],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
        scales: {
          y: {
            title: { display: true, text: 'Duration (yrs)' },
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  private createPriceSensitivityChart(): void {
    const ctx = this.getCtx(this.priceSensitivityCanvas);
    if (!ctx || !this.isElementVisible(this.priceSensitivityCanvas)) return;

    const bpShifts = [-300, -200, -100, -50, 0, 50, 100, 200, 300];
    const assetPriceChange = bpShifts.map((bp) => {
      // Approx price change using modified duration 4.38 + convexity 28.5
      return -4.38 * (bp / 100) + 0.5 * 28.5 * Math.pow(bp / 100, 2);
    });
    const liabilityPriceChange = bpShifts.map((bp) => {
      return -2.11 * (bp / 100) + 0.5 * 12.4 * Math.pow(bp / 100, 2);
    });
    const equityImpact = bpShifts.map((bp) => {
      return -(4.38 - 2.11) * (bp / 100) + 0.5 * (28.5 - 12.4) * Math.pow(bp / 100, 2);
    });

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: bpShifts.map((bp) => `${bp > 0 ? '+' : ''}${bp}bps`),
        datasets: [
          {
            label: 'Asset Price Change (%)',
            data: assetPriceChange,
            borderColor: 'rgb(59, 130, 246)',
            fill: false,
            tension: 0.3,
            pointRadius: 3,
          },
          {
            label: 'Liability Price Change (%)',
            data: liabilityPriceChange,
            borderColor: 'rgb(249, 115, 22)',
            fill: false,
            tension: 0.3,
            pointRadius: 3,
          },
          {
            label: 'Equity Impact (%)',
            data: equityImpact,
            borderColor: 'rgb(139, 92, 246)',
            borderDash: [4, 3],
            fill: false,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: equityImpact.map((v) =>
              v >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
            ),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
        scales: {
          y: {
            title: { display: true, text: 'Price Change (%)' },
          },
          x: {
            ticks: { maxRotation: 45 },
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }
}
