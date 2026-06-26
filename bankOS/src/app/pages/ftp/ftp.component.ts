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
  selector: 'app-ftp',
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
          <span class="text-neutral-700 dark:text-neutral-300">FTP &amp; Pricing</span>
        </div>
      </header>

      <main class="flex-1 p-6 overflow-y-auto">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
            FTP &amp; Pricing Module
          </h2>
          <p class="text-neutral-500 dark:text-neutral-400 mb-6 text-sm">
            Funds Transfer Pricing (FTP) module implementing Ghana Reference Rate (GRR) based curve construction, Non-Maturing Deposit (NMD) behavioral modeling, deal-level profitability analysis &amp; Liquidity Transfer Pricing (LTP) attribution.
          </p>

          <!-- TABS -->
          <tab-bar [tabs]="tabLabels" [activeIndex]="activeTab" (tabChange)="onTabChange($event)" />

          <!-- ======================== TAB 1: FTP CURVE CONSTRUCTION & MANAGEMENT ======================== -->
          @if (activeTab === 0) {
            <div>
              <feature-card
                title="FTP Curve Construction &amp; Management"
                description="Construct and manage the Ghana Reference Rate (GRR) based FTP curve for GHS and multi-currency products."
                [userStories]="[
                  'As a Treasurer, I want to see the full FTP curve structure so that I can set internal funding rates correctly.',
                  'As a BU Head, I want multi-currency FTP rates so that I can price foreign-currency products consistently.',
                  'As an ALCO Member, I want to monitor GRR changes and their impact on FTP so that I can assess margin implications.',
                ]"
              >
                <ghana-regulatory-detail
                  detail="BoG Monetary Policy Framework: Ghana Reference Rate (GRR) is primary reference for GHS-denominated products. GoG T-Bill curve (91-day, 182-day, 1-year, 2-year). BoG policy rate (currently 26.00%). Interbank rate for wholesale funding. FTP curve = GRR + tenor_premium + bank_credit_spread + liquidity_premium. No negative FTP rates in Ghana context. GRR change notification automatic."
                />
              </feature-card>

              <!-- Table 1: GHS FTP Curve -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  GHS FTP Curve
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
                          Tenor
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          FTP Rate (%)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          GRR + Spread (bps)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          NMD Beta
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of ftpCurveData; track row.tenor) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                            {{ row.tenor }}
                          </td>
                          <td class="p-3 text-right font-mono text-primary-600 dark:text-primary-400">
                            {{ row.rate }}%
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.spread }}bps
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.beta }}
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Table 2: Multi-Currency FTP -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Multi-Currency FTP Rates
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
                          Tenor
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          GHS (%)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          USD (%)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          EUR (%)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          GBP (%)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          X-Ccy Basis (bps)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of multiCcyData; track row.tenor) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                            {{ row.tenor }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.ghs }}%
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.usd }}%
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.eur }}%
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.gbp }}%
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.xccyBasis }}
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Table 3: FTP Rate Components -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  FTP Rate Components
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
                          Tenor
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          ITP Rate (%)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          LTP Rate (%)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Credit Spread (%)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Total FTP (%)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of ftpComponentsData; track row.tenor) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                            {{ row.tenor }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.itp }}%
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.ltp }}%
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.creditSpread }}%
                          </td>
                          <td class="p-3 text-right font-mono text-primary-600 dark:text-primary-400 font-semibold">
                            {{ row.total }}%
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart 1: GHS FTP Curve -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  GHS FTP Curve — Today vs Last Week vs Last Month
                </h3>
                <div class="relative" style="height: 300px;">
                  <canvas #ghsFtpCurveChart></canvas>
                </div>
              </div>

              <!-- Chart 2: Multi-Currency Curve Comparison -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Multi-Currency Curve Comparison
                </h3>
                <div class="relative" style="height: 300px;">
                  <canvas #multiCcyCurveChart></canvas>
                </div>
              </div>
            </div>
          }

          <!-- ======================== TAB 2: DEAL-LEVEL FTP PRICING ENGINE ======================== -->
          @if (activeTab === 1) {
            <div>
              <feature-card
                title="Deal-Level FTP Pricing Engine"
                description="Calculate deal-level profitability by decomposing customer rates into FTP, credit, operational and regulatory cost components."
                [userStories]="[
                  'As a Product Manager, I want to see the margin decomposition for each deal so that I can optimise pricing.',
                  'As a BU Head, I want portfolio-level ROE and RAROC so that I can identify outlier deals.',
                  'As a Treasurer, I want to verify that FTP charges are correctly applied to each deal.',
                ]"
              />

              <!-- Table 1: Pricing Decomposition -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Deal Pricing Decomposition
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
                          Component
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Value (%)
                        </th>
                        <th
                          class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of pricingDecompData; track row.component) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                            {{ row.component }}
                          </td>
                          <td
                            class="p-3 text-right font-mono"
                            [ngClass]="row.type === 'income' ? 'text-success-600 dark:text-success-400' : row.type === 'cost' ? 'text-alert-600 dark:text-alert-400' : 'text-primary-600 dark:text-primary-400 font-semibold'"
                          >
                            {{ row.value > 0 ? '+' : '' }}{{ row.value }}%
                          </td>
                          <td class="p-3 text-center">
                            <status-badge
                              [status]="row.type === 'income' ? 'compliant' : row.type === 'cost' ? 'warning' : 'normal'"
                              [label]="row.type === 'income' ? 'Income' : row.type === 'cost' ? 'Cost' : 'Net'"
                            />
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Table 2: Portfolio Profitability -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Portfolio Profitability Summary
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
                          Notional (GHS M)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Avg Margin (%)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          ROE (%)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          RAROC (%)
                        </th>
                        <th
                          class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Exception
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of portfolioProfitData; track row.product) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                            {{ row.product }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.notional | number: '1.0-0' }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.avgMargin }}%
                          </td>
                          <td
                            class="p-3 text-right font-mono"
                            [ngClass]="row.roe >= 15 ? 'text-success-600 dark:text-success-400' : 'text-alert-600 dark:text-alert-400'"
                          >
                            {{ row.roe }}%
                          </td>
                          <td
                            class="p-3 text-right font-mono"
                            [ngClass]="row.raroc >= 12 ? 'text-success-600 dark:text-success-400' : 'text-alert-600 dark:text-alert-400'"
                          >
                            {{ row.raroc }}%
                          </td>
                          <td class="p-3 text-center">
                            <status-badge
                              [status]="row.exceptionFlag ? 'red' : 'compliant'"
                              [label]="row.exceptionFlag ? 'Flagged' : 'OK'"
                            />
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart 1: Margin Waterfall -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Margin Waterfall — Customer Rate to Net Margin
                </h3>
                <div class="relative" style="height: 300px;">
                  <canvas #marginWaterfallChart></canvas>
                </div>
              </div>

              <!-- Chart 2: ROE vs RAROC Comparison -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  ROE vs RAROC by Product
                </h3>
                <div class="relative" style="height: 300px;">
                  <canvas #roeRarocChart></canvas>
                </div>
              </div>
            </div>
          }

          <!-- ======================== TAB 3: NMD BEHAVIORAL MODEL ======================== -->
          @if (activeTab === 2) {
            <div>
              <ghana-regulatory-detail
                detail="BoG IRRBB Guideline: NMD core ratio capped at 70% for retail, 50% for SME, 30% for corporate. Average maturity cap: 4 years retail, 2 years SME. Core ratio estimated from 5-year historical balance regression. Backtesting: MAPE < 10%. Replicating portfolio yield vs actual deposit cost = endowment effect."
              />

              <!-- Table 1: Core Allocation by Tenor -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  NMD Core Allocation by Tenor
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
                          Tenor
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Weight (%)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          FTP Rate (%)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Contribution (bps)
                        </th>
                        <th
                          class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          BoG Limit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of nmdAllocationData; track row.tenor) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                            {{ row.tenor }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.weight }}%
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.ftpRate }}%
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.contribution }}
                          </td>
                          <td class="p-3 text-center">
                            <status-badge
                              [status]="row.withinLimit ? 'compliant' : 'red'"
                              [label]="row.withinLimit ? 'Within Cap' : 'Over Limit'"
                            />
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Table 2: Backtesting Results -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  NMD Core Balance Backtesting (12 Months)
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
                          Predicted (GHS M)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Actual (GHS M)
                        </th>
                        <th
                          class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Error (%)
                        </th>
                        <th
                          class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of backtestData; track row.month) {
                        <tr
                          class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        >
                          <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">
                            {{ row.month }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.predicted | number: '1.0-0' }}
                          </td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">
                            {{ row.actual | number: '1.0-0' }}
                          </td>
                          <td
                            class="p-3 text-right font-mono"
                            [ngClass]="row.errorPct <= 5 ? 'text-success-600 dark:text-success-400' : row.errorPct <= 10 ? 'text-warning-600 dark:text-warning-400' : 'text-alert-600 dark:text-alert-400'"
                          >
                            {{ row.errorPct }}%
                          </td>
                          <td class="p-3 text-center">
                            <status-badge
                              [status]="row.errorPct <= 5 ? 'compliant' : row.errorPct <= 10 ? 'warning' : 'red'"
                              [label]="row.errorPct <= 5 ? 'Pass' : row.errorPct <= 10 ? 'Watch' : 'Fail'"
                            />
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart 1: Replicating Portfolio stacked bar -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Replicating Portfolio Allocation
                </h3>
                <div class="relative" style="height: 300px;">
                  <canvas #replicatingPortfolioChart></canvas>
                </div>
              </div>

              <!-- Chart 2: Core Ratio Trend with BoG Cap -->
              <div
                class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6"
              >
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Core Ratio Trend — BoG Cap Overlay
                </h3>
                <div class="relative" style="height: 300px;">
                  <canvas #coreRatioTrendChart></canvas>
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
export class FTPComponent implements AfterViewInit {
  // ── Tab state ──
  tabLabels = [
    'FTP Curve Construction & Management',
    'Deal-Level FTP Pricing Engine',
    'NMD Behavioral Model',
  ];
  activeTab = 0;

  // ── Chart canvas refs ──
  @ViewChild('ghsFtpCurveChart', { static: true }) ghsFtpCurveCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('multiCcyCurveChart', { static: true }) multiCcyCurveCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('marginWaterfallChart', { static: true }) marginWaterfallCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('roeRarocChart', { static: true }) roeRarocCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('replicatingPortfolioChart', { static: true }) replicatingPortfolioCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('coreRatioTrendChart', { static: true }) coreRatioTrendCanvas!: ElementRef<HTMLCanvasElement>;

  private chartInstances: Chart[] = [];

  // ── TAB 1 Data: FTP Curve Construction & Management ──

  ftpCurveData = [
    { tenor: 'Overnight', rate: 21.5, spread: 15, beta: 0.1 },
    { tenor: '1 Week', rate: 22.1, spread: 18, beta: 0.12 },
    { tenor: '1 Month', rate: 23.4, spread: 22, beta: 0.15 },
    { tenor: '3 Months', rate: 24.8, spread: 28, beta: 0.18 },
    { tenor: '6 Months', rate: 25.6, spread: 32, beta: 0.22 },
    { tenor: '1 Year', rate: 26.2, spread: 35, beta: 0.25 },
    { tenor: '2 Years', rate: 26.8, spread: 38, beta: 0.32 },
    { tenor: '3 Years', rate: 27.1, spread: 40, beta: 0.38 },
    { tenor: '5 Years', rate: 27.5, spread: 42, beta: 0.45 },
  ];

  multiCcyData = [
    { tenor: 'O/N', ghs: 21.5, usd: 5.25, eur: 3.85, gbp: 4.55, xccyBasis: 0 },
    { tenor: '1M', ghs: 23.4, usd: 5.50, eur: 4.10, gbp: 4.80, xccyBasis: -5 },
    { tenor: '3M', ghs: 24.8, usd: 5.75, eur: 4.35, gbp: 5.05, xccyBasis: -8 },
    { tenor: '6M', ghs: 25.6, usd: 6.00, eur: 4.55, gbp: 5.30, xccyBasis: -12 },
    { tenor: '1Y', ghs: 26.2, usd: 6.30, eur: 4.80, gbp: 5.55, xccyBasis: -15 },
    { tenor: '2Y', ghs: 26.8, usd: 6.60, eur: 5.05, gbp: 5.80, xccyBasis: -18 },
    { tenor: '3Y', ghs: 27.1, usd: 6.85, eur: 5.25, gbp: 6.00, xccyBasis: -20 },
    { tenor: '5Y', ghs: 27.5, usd: 7.10, eur: 5.50, gbp: 6.25, xccyBasis: -22 },
  ];

  ftpComponentsData = [
    { tenor: 'O/N', itp: 21.0, ltp: 0.2, creditSpread: 0.3, total: 21.5 },
    { tenor: '1W', itp: 21.4, ltp: 0.3, creditSpread: 0.4, total: 22.1 },
    { tenor: '1M', itp: 22.5, ltp: 0.4, creditSpread: 0.5, total: 23.4 },
    { tenor: '3M', itp: 23.6, ltp: 0.5, creditSpread: 0.7, total: 24.8 },
    { tenor: '6M', itp: 24.2, ltp: 0.6, creditSpread: 0.8, total: 25.6 },
    { tenor: '1Y', itp: 24.6, ltp: 0.7, creditSpread: 0.9, total: 26.2 },
    { tenor: '2Y', itp: 25.0, ltp: 0.8, creditSpread: 1.0, total: 26.8 },
    { tenor: '3Y', itp: 25.1, ltp: 0.9, creditSpread: 1.1, total: 27.1 },
    { tenor: '5Y', itp: 25.3, ltp: 1.0, creditSpread: 1.2, total: 27.5 },
  ];

  // ── TAB 2 Data: Deal-Level FTP Pricing Engine ──

  pricingDecompData = [
    { component: 'Customer Rate', value: 30.0, type: 'income' },
    { component: 'FTP Charge', value: -29.0, type: 'cost' },
    { component: 'Credit Margin', value: -1.5, type: 'cost' },
    { component: 'Operating Cost', value: -0.5, type: 'cost' },
    { component: 'Regulatory Cost', value: -0.3, type: 'cost' },
    { component: 'Net Margin', value: -1.3, type: 'net' },
  ];

  portfolioProfitData = [
    { product: 'Retail Deposits', notional: 850, avgMargin: 2.8, roe: 22.5, raroc: 18.2, exceptionFlag: false },
    { product: 'SME Loans', notional: 420, avgMargin: 4.2, roe: 18.3, raroc: 14.7, exceptionFlag: false },
    { product: 'Corporate Loans', notional: 680, avgMargin: 3.5, roe: 15.8, raroc: 12.1, exceptionFlag: false },
    { product: 'Mortgages', notional: 310, avgMargin: 2.1, roe: 9.2, raroc: 7.5, exceptionFlag: true },
    { product: 'T-Bills', notional: 550, avgMargin: 1.8, roe: 12.4, raroc: 10.8, exceptionFlag: false },
  ];

  // ── TAB 3 Data: NMD Behavioral Model ──

  nmdAllocationData = [
    { tenor: 'O/N', weight: 5, ftpRate: 21.5, contribution: 108, withinLimit: true },
    { tenor: '3M', weight: 10, ftpRate: 24.8, contribution: 248, withinLimit: true },
    { tenor: '6M', weight: 15, ftpRate: 25.6, contribution: 384, withinLimit: true },
    { tenor: '1Y', weight: 20, ftpRate: 26.2, contribution: 524, withinLimit: true },
    { tenor: '2Y', weight: 15, ftpRate: 26.8, contribution: 402, withinLimit: true },
    { tenor: '3Y', weight: 15, ftpRate: 27.1, contribution: 407, withinLimit: true },
    { tenor: '5Y', weight: 15, ftpRate: 27.5, contribution: 413, withinLimit: true },
    { tenor: '>5Y', weight: 5, ftpRate: 27.8, contribution: 139, withinLimit: true },
  ];

  backtestData = [
    { month: 'Jan', predicted: 1250, actual: 1228, errorPct: 1.8 },
    { month: 'Feb', predicted: 1245, actual: 1210, errorPct: 2.9 },
    { month: 'Mar', predicted: 1260, actual: 1285, errorPct: 2.0 },
    { month: 'Apr', predicted: 1255, actual: 1240, errorPct: 1.2 },
    { month: 'May', predicted: 1270, actual: 1295, errorPct: 2.0 },
    { month: 'Jun', predicted: 1265, actual: 1235, errorPct: 2.4 },
    { month: 'Jul', predicted: 1280, actual: 1310, errorPct: 2.3 },
    { month: 'Aug', predicted: 1275, actual: 1258, errorPct: 1.4 },
    { month: 'Sep', predicted: 1290, actual: 1322, errorPct: 2.5 },
    { month: 'Oct', predicted: 1285, actual: 1265, errorPct: 1.6 },
    { month: 'Nov', predicted: 1300, actual: 1335, errorPct: 2.7 },
    { month: 'Dec', predicted: 1295, actual: 1272, errorPct: 1.8 },
  ];

  // ── Lifecycle ──

  ngAfterViewInit(): void {
    this.createAllCharts();
  }

  onTabChange(index: number): void {
    this.activeTab = index;
    setTimeout(() => {
      this.destroyCharts();
      this.createAllCharts();
    }, 50);
  }

  // ── Chart helpers ──

  private destroyCharts(): void {
    this.chartInstances.forEach((c) => c.destroy());
    this.chartInstances = [];
  }

  private createAllCharts(): void {
    this.createGhsFtpCurveChart();
    this.createMultiCcyCurveChart();
    this.createMarginWaterfallChart();
    this.createRoeRarocChart();
    this.createReplicatingPortfolioChart();
    this.createCoreRatioTrendChart();
  }

  private getCtx(canvasRef: ElementRef<HTMLCanvasElement>): CanvasRenderingContext2D | null {
    return canvasRef?.nativeElement?.getContext('2d');
  }

  private isElementVisible(el: ElementRef<HTMLCanvasElement>): boolean {
    return !!el?.nativeElement?.parentElement?.offsetParent;
  }

  // ── TAB 1 Charts ──

  private createGhsFtpCurveChart(): void {
    const ctx = this.getCtx(this.ghsFtpCurveCanvas);
    if (!ctx || !this.isElementVisible(this.ghsFtpCurveCanvas)) return;

    const tenors = this.ftpCurveData.map((d) => d.tenor);
    const today = this.ftpCurveData.map((d) => d.rate);
    // Last week: slightly lower rates
    const lastWeek = this.ftpCurveData.map((d) => +(d.rate - (Math.random() * 0.4 + 0.1)).toFixed(1));
    // Last month: higher rates (upward trend in Ghana)
    const lastMonth = this.ftpCurveData.map((d) => +(d.rate - (Math.random() * 0.8 + 0.3)).toFixed(1));

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: tenors,
        datasets: [
          {
            label: 'Today',
            data: today,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: 'rgb(59, 130, 246)',
          },
          {
            label: 'Last Week',
            data: lastWeek,
            borderColor: 'rgb(249, 115, 22)',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: 'rgb(249, 115, 22)',
            borderDash: [5, 5],
          },
          {
            label: 'Last Month',
            data: lastMonth,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: 'rgb(34, 197, 94)',
            borderDash: [2, 4],
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
            title: { display: true, text: 'FTP Rate (%)' },
            min: 18,
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  private createMultiCcyCurveChart(): void {
    const ctx = this.getCtx(this.multiCcyCurveCanvas);
    if (!ctx || !this.isElementVisible(this.multiCcyCurveCanvas)) return;

    const tenors = this.multiCcyData.map((d) => d.tenor);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: tenors,
        datasets: [
          {
            label: 'GHS',
            data: this.multiCcyData.map((d) => d.ghs),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 4,
          },
          {
            label: 'USD',
            data: this.multiCcyData.map((d) => d.usd),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 4,
          },
          {
            label: 'EUR',
            data: this.multiCcyData.map((d) => d.eur),
            borderColor: 'rgb(249, 115, 22)',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 4,
          },
          {
            label: 'GBP',
            data: this.multiCcyData.map((d) => d.gbp),
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 4,
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
            title: { display: true, text: 'FTP Rate (%)' },
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  // ── TAB 2 Charts ──

  private createMarginWaterfallChart(): void {
    const ctx = this.getCtx(this.marginWaterfallCanvas);
    if (!ctx || !this.isElementVisible(this.marginWaterfallCanvas)) return;

    const labels = this.pricingDecompData.map((d) => d.component);
    const values = this.pricingDecompData.map((d) => d.value);

    const colors = values.map((v) =>
      v >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
    );

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Margin Component (%)',
            data: values,
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
            title: { display: true, text: 'Value (%)' },
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  private createRoeRarocChart(): void {
    const ctx = this.getCtx(this.roeRarocCanvas);
    if (!ctx || !this.isElementVisible(this.roeRarocCanvas)) return;

    const products = this.portfolioProfitData.map((d) => d.product);
    const roeData = this.portfolioProfitData.map((d) => d.roe);
    const rarocData = this.portfolioProfitData.map((d) => d.raroc);

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: products,
        datasets: [
          {
            label: 'ROE (%)',
            data: roeData,
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
          },
          {
            label: 'RAROC (%)',
            data: rarocData,
            backgroundColor: 'rgba(249, 115, 22, 0.8)',
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
          y: {
            title: { display: true, text: 'Percentage (%)' },
            min: 0,
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  // ── TAB 3 Charts ──

  private createReplicatingPortfolioChart(): void {
    const ctx = this.getCtx(this.replicatingPortfolioCanvas);
    if (!ctx || !this.isElementVisible(this.replicatingPortfolioCanvas)) return;

    const labels = this.nmdAllocationData.map((d) => d.tenor);
    const weights = this.nmdAllocationData.map((d) => d.weight);
    const contributions = this.nmdAllocationData.map((d) => d.contribution);

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Weight (%)',
            data: weights,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
            order: 2,
          },
          {
            label: 'Contribution (bps)',
            data: contributions,
            backgroundColor: 'rgba(249, 115, 22, 0.7)',
            borderColor: 'rgb(249, 115, 22)',
            borderWidth: 1,
            order: 1,
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
            title: { display: true, text: 'Value' },
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }

  private createCoreRatioTrendChart(): void {
    const ctx = this.getCtx(this.coreRatioTrendCanvas);
    if (!ctx || !this.isElementVisible(this.coreRatioTrendCanvas)) return;

    const months = this.backtestData.map((d) => d.month);
    // Simulated core ratios (actual/predicted balances as ratio of a reference balance ~1800)
    const coreRatio = this.backtestData.map((d) =>
      +((d.actual / 1800) * 100).toFixed(1)
    );
    const coreRatioPredicted = this.backtestData.map((d) =>
      +((d.predicted / 1800) * 100).toFixed(1)
    );
    const bogCap = Array(12).fill(70);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Actual Core Ratio (%)',
            data: coreRatio,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: 'rgb(59, 130, 246)',
          },
          {
            label: 'Predicted Core Ratio (%)',
            data: coreRatioPredicted,
            borderColor: 'rgb(249, 115, 22)',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: 'rgb(249, 115, 22)',
            borderDash: [5, 5],
          },
          {
            label: 'BoG Cap (70%)',
            data: bogCap,
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            fill: false,
            borderDash: [8, 4],
            pointRadius: 0,
            borderWidth: 2,
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
            title: { display: true, text: 'Core Ratio (%)' },
            min: 50,
            max: 80,
          },
        },
      },
    });
    this.chartInstances.push(chart);
  }
}
