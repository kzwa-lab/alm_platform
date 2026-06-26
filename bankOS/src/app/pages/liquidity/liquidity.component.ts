import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import {
  TabBarComponent,
  FeatureCardComponent,
  StatusBadgeComponent,
  GhanaRegulatoryDetailComponent
} from '../../shared/index';

interface LcrRow {
  bucket: string;
  hqla: number;
  inflows: number;
  outflows: number;
  netFlow: number;
}

interface HqlaItem {
  level: string;
  amount: number;
  haircut: string;
  valueAfterHaircut: number;
  capApplied: string;
}

interface OutflowCategory {
  category: string;
  rate: string;
  amount: number;
  outflow: number;
}

interface EwiItem {
  name: string;
  current: string;
  threshold: string;
  status: string;
}

interface CfpPhase {
  phase: string;
  trigger: string;
  actions: string;
  escalation: string;
}

interface AsfComponent {
  component: string;
  factor: string;
  amount: number;
  asfAmount: number;
}

interface RsfComponent {
  component: string;
  factor: string;
  amount: number;
  rsfAmount: number;
}

interface ForwardProjection {
  month: string;
  base: number;
  stress: number;
  custom: number;
}

interface ScenarioParam {
  scenario: string;
  retailRunoff: string;
  wholesaleRunoff: string;
  hqlaHaircut: string;
  inflowReduction: string;
}

interface ScenarioResult {
  metric: string;
  base: string;
  mild: string;
  moderate: string;
  severe: string;
}

interface GapBucket {
  bucket: string;
  inflows: number;
  outflows: number;
  gap: number;
  cumulative: number;
}

interface BurnDownRow {
  day: number;
  depositOutflow: number;
  remainingAssets: number;
  remainingDeposits: number;
  liquidityRatio: number;
  breach: boolean;
}

interface SavedScenario {
  name: string;
  severity: string;
  survivalDays: number;
  lcrImpact: string;
  date: string;
}

interface LcrTrend {
  day: string;
  value: number;
}

@Component({
  selector: 'app-liquidity',
  standalone: true,
  imports: [CommonModule, RouterModule, TabBarComponent, FeatureCardComponent, StatusBadgeComponent, GhanaRegulatoryDetailComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
      <header class="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4">
        <div class="max-w-7xl mx-auto flex items-center gap-4">
          <h1 class="text-2xl font-bold text-neutral-800 dark:text-neutral-100 font-mono">
            <a routerLink="/" class="hover:text-primary-500 transition-colors">BankOS</a>
          </h1>
          <span class="text-neutral-400">|</span>
          <span class="text-neutral-700 dark:text-neutral-300">Liquidity Risk</span>
        </div>
      </header>

      <main class="flex-1 p-6 overflow-y-auto">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Liquidity Risk Module</h2>

          <tab-bar [tabs]="tabs" [activeIndex]="activeTab" (tabChange)="onTabChange($event)"></tab-bar>

          <!-- ================================================================ -->
          <!-- TAB 1: LCR Calculator                                           -->
          <!-- ================================================================ -->
          @if (activeTab === 0) {
            <feature-card
              title="LCR Calculator"
              description="Calculate the Liquidity Coverage Ratio under Basel III / BoG LMTD 2026 framework with real-time waterfall analysis."
              [userStories]="lcrUserStories"
            ></feature-card>

            <ghana-regulatory-detail detail="Bank of Ghana LMTD 2026: LCR minimum 100%, internal target 120%. Narrow/Broad liquid asset ratios: Narrow Liquid Assets / Volatile Liabilities >= 80% (banks), >= 90% (SDIs). Broad Liquid Assets / Total Deposits >= 80% (banks), >= 70% (SDIs). E-money float accounts classified as volatile liabilities per LRMD."></ghana-regulatory-detail>

            <!-- Table 1: LCR Time Buckets -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">LCR Time Bucket Cash Flows</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Time Bucket</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">HQLA (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Inflows (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Outflows (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Net Cash Flow (€M)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let row of lcrData" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.bucket }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.hqla | number:'1.0-0' }}</td>
                      <td class="p-3 text-right font-mono text-success-600">{{ row.inflows | number:'1.0-0' }}</td>
                      <td class="p-3 text-right font-mono text-alert-600">{{ row.outflows | number:'1.0-0' }}</td>
                      <td class="p-3 text-right font-mono font-semibold" [ngClass]="row.netFlow >= 0 ? 'text-success-600' : 'text-alert-600'">{{ row.netFlow | number:'1.0-0' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: HQLA Composition -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">HQLA Composition</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Level</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Amount (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Haircut</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Value After Haircut (€M)</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">L2 Cap Applied</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of hqlaComposition" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.level }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.amount | number:'1.0-0' }}</td>
                      <td class="p-3 text-right font-mono text-neutral-500 dark:text-neutral-400">{{ item.haircut }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.valueAfterHaircut | number:'1.0-0' }}</td>
                      <td class="p-3 text-center">
                        <status-badge [status]="item.capApplied"></status-badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 3: Cash Outflow Categories -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Cash Outflow by Category</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Category</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Run-off Rate</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Balance (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Outflow (€M)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of outflowCategories" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.category }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.rate }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.amount | number:'1.0-0' }}</td>
                      <td class="p-3 text-right font-mono font-semibold text-alert-600">{{ item.outflow | number:'1.0-0' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Chart 1: LCR Waterfall -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">LCR Waterfall Chart</h3>
              <div class="relative h-72">
                <canvas #lcrWaterfallCanvas></canvas>
              </div>
            </div>

            <!-- Chart 2: LCR 30-day Trend -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">LCR 30-Day Trend</h3>
              <div class="relative h-72">
                <canvas #lcrTrendCanvas></canvas>
              </div>
            </div>

            <!-- Users & Roles -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Users & Roles</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Role</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">User</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">Treasurer</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">Kwame Asante</td>
                      <td class="p-3 text-neutral-600 dark:text-neutral-300">View, Run LCR, Approve</td>
                    </tr>
                    <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">Liquidity Risk Manager</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">Akua Mensah</td>
                      <td class="p-3 text-neutral-600 dark:text-neutral-300">View, Edit, Run Scenarios</td>
                    </tr>
                    <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">Compliance Officer</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">Yaw Owusu</td>
                      <td class="p-3 text-neutral-600 dark:text-neutral-300">View, Audit Trail, Report</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- ================================================================ -->
          <!-- TAB 2: NSFR Monitor                                             -->
          <!-- ================================================================ -->
          @if (activeTab === 1) {
            <feature-card
              title="NSFR Monitor"
              description="Monitor the Net Stable Funding Ratio under Basel III / CRR with forward-looking ASF and RSF analysis."
              [userStories]="nsfrUserStories"
            ></feature-card>

            <ghana-regulatory-detail detail="BoG LRMD 2026: NSFR minimum 100%, internal target 110%. ASF factors per CRR Article 413. Off-balance-sheet CCF per CRR3."></ghana-regulatory-detail>

            <!-- Table 1: ASF Components -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Available Stable Funding (ASF) Components</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Component</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">ASF Factor</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Amount (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">ASF Amount (€M)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of asfComponents" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.component }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.factor }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.amount | number:'1.0-0' }}</td>
                      <td class="p-3 text-right font-mono font-semibold text-success-600">{{ item.asfAmount | number:'1.0-0' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: RSF Components -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Required Stable Funding (RSF) Components</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Component</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">RSF Factor</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Amount (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">RSF Amount (€M)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of rsfComponents" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.component }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.factor }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.amount | number:'1.0-0' }}</td>
                      <td class="p-3 text-right font-mono font-semibold text-alert-600">{{ item.rsfAmount | number:'1.0-0' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 3: Forward Projection -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">NSFR Forward Projection (6 Months)</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Month</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Base (%)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Stress (%)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Custom (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of forwardProjections" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.month }}</td>
                      <td class="p-3 text-right font-mono font-semibold text-neutral-700 dark:text-neutral-200">{{ item.base | number:'1.1-1' }}%</td>
                      <td class="p-3 text-right font-mono" [ngClass]="item.stress >= 100 ? 'text-warning-600' : 'text-alert-600'">{{ item.stress | number:'1.1-1' }}%</td>
                      <td class="p-3 text-right font-mono" [ngClass]="item.custom >= 100 ? 'text-neutral-700' : 'text-alert-600'">{{ item.custom | number:'1.1-1' }}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Chart 1: ASF vs RSF -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">ASF vs RSF Comparison</h3>
              <div class="relative h-72">
                <canvas #nsfrBarCanvas></canvas>
              </div>
            </div>

            <!-- Chart 2: Forward Projection -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">NSFR Forward Projection Trend</h3>
              <div class="relative h-72">
                <canvas #nsfrForwardCanvas></canvas>
              </div>
            </div>
          }

          <!-- ================================================================ -->
          <!-- TAB 3: Liquidity Stress Testing                                 -->
          <!-- ================================================================ -->
          @if (activeTab === 2) {
            <feature-card
              title="Liquidity Stress Testing"
              description="Run multi-scenario liquidity stress tests with idiosyncratic and market-wide shocks per BoG LRMD 2026."
              [userStories]="stressUserStories"
            ></feature-card>

            <ghana-regulatory-detail detail="BoG LRMD 2026: Three standard scenarios (Mild, Moderate, Severe). Idiosyncratic stress includes rating downgrade, large depositor withdrawal. Market-wide stress includes systemic freeze, sovereign crisis. Survival horizon must be calculated."></ghana-regulatory-detail>

            <!-- Table 1: Scenario Parameters -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Scenario Parameters</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Scenario</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Retail Run-off</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Wholesale Run-off</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">HQLA Haircut</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Inflow Reduction</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of scenarioParams" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">{{ item.scenario }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.retailRunoff }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.wholesaleRunoff }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.hqlaHaircut }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.inflowReduction }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Results Comparison -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Results Comparison: Base vs Stressed</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Metric</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Base</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Mild</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Moderate</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Severe</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of scenarioResults" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">{{ item.metric }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.base }}</td>
                      <td class="p-3 text-right font-mono" [ngClass]="item.mild.includes('%') && parseFloat(item.mild) >= 100 ? 'text-success-600' : 'text-alert-600'">{{ item.mild }}</td>
                      <td class="p-3 text-right font-mono" [ngClass]="item.moderate.includes('%') && parseFloat(item.moderate) >= 100 ? 'text-warning-600' : 'text-alert-600'">{{ item.moderate }}</td>
                      <td class="p-3 text-right font-mono" [ngClass]="item.severe.includes('%') && parseFloat(item.severe) >= 100 ? 'text-warning-600' : 'text-alert-600'">{{ item.severe }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Chart 1: LCR Impact -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">LCR Impact Across Scenarios</h3>
              <div class="relative h-72">
                <canvas #lcrImpactCanvas></canvas>
              </div>
            </div>

            <!-- Chart 2: Liquidity Gap -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Liquidity Gap per Time Bucket (Severe Scenario)</h3>
              <div class="relative h-72">
                <canvas #liquidityGapCanvas></canvas>
              </div>
            </div>
          }

          <!-- ================================================================ -->
          <!-- TAB 4: CFP Trigger Dashboard                                    -->
          <!-- ================================================================ -->
          @if (activeTab === 3) {
            <feature-card
              title="CFP Trigger Dashboard"
              description="Contingency Funding Plan (CFP) dashboard with Early Warning Indicators, phase escalation, and action matrix."
              [userStories]="cfpUserStories"
            ></feature-card>

            <ghana-regulatory-detail detail="BoG LRMD 2026: CFP Phase activation based on red EWI count. 6 EWIs monitored. Annual CFP test required. Escalation: Treasurer -> CRO -> CEO -> Board."></ghana-regulatory-detail>

            <!-- Table 1: EWIs -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Early Warning Indicators</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">EWI</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Current</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Threshold</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let row of ewiData" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.name }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.current }}</td>
                      <td class="p-3 text-right font-mono text-neutral-500 dark:text-neutral-400">{{ row.threshold }}</td>
                      <td class="p-3 text-center">
                        <status-badge [status]="row.status"></status-badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: CFP Action Matrix -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">CFP Action Matrix</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Phase</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Trigger</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Actions</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Escalation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of cfpPhases" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 font-semibold text-neutral-700 dark:text-neutral-200">{{ item.phase }}</td>
                      <td class="p-3 text-neutral-600 dark:text-neutral-300">{{ item.trigger }}</td>
                      <td class="p-3 text-neutral-600 dark:text-neutral-300">{{ item.actions }}</td>
                      <td class="p-3 text-neutral-600 dark:text-neutral-300">{{ item.escalation }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Chart 1: EWI Radar -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">EWI Radar Chart</h3>
              <div class="relative h-72">
                <canvas #ewiRadarCanvas></canvas>
              </div>
            </div>

            <!-- Chart 2: CFP Phase Timeline -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">CFP Phase Timeline</h3>
              <div class="relative h-72">
                <canvas #cfpTimelineCanvas></canvas>
              </div>
            </div>
          }

          <!-- ================================================================ -->
          <!-- TAB 5: Liquidity Gap Report                                     -->
          <!-- ================================================================ -->
          @if (activeTab === 4) {
            <feature-card
              title="Liquidity Gap Report"
              description="Maturity mismatch analysis with behavioral and contractual views across prescribed time bands."
              [userStories]="gapUserStories"
            ></feature-card>

            <ghana-regulatory-detail detail="BoG LMTD 2026: 13 prescribed time bands for maturity mismatch analysis. Dual view: Behavioral (business as usual) and Contractual (legal maturity)."></ghana-regulatory-detail>

            <!-- Table 1: Behavioral Gap -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Behavioral Maturity Gap</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Bucket</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Inflows (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Outflows (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Gap (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Cumulative (€M)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of behavioralGap" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.bucket }}</td>
                      <td class="p-3 text-right font-mono text-success-600">{{ item.inflows | number:'1.0-0' }}</td>
                      <td class="p-3 text-right font-mono text-alert-600">{{ item.outflows | number:'1.0-0' }}</td>
                      <td class="p-3 text-right font-mono font-semibold" [ngClass]="item.gap >= 0 ? 'text-success-600' : 'text-alert-600'">{{ item.gap | number:'1.0-0' }}</td>
                      <td class="p-3 text-right font-mono font-bold" [ngClass]="item.cumulative >= 0 ? 'text-success-600' : 'text-alert-600'">{{ item.cumulative | number:'1.0-0' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Behavioral vs Contractual -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Behavioral vs Contractual Gap Comparison</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Bucket</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Behavioral Gap (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Contractual Gap (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Difference (€M)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of behavioralVsContractual" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.bucket }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.behavioralGap | number:'1.0-0' }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.contractualGap | number:'1.0-0' }}</td>
                      <td class="p-3 text-right font-mono font-semibold" [ngClass]="item.difference >= 0 ? 'text-success-600' : 'text-alert-600'">{{ item.difference | number:'1.0-0' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Chart 1: Gap Ladder -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Gap Ladder with Cumulative Overlay</h3>
              <div class="relative h-72">
                <canvas #gapLadderCanvas></canvas>
              </div>
            </div>

            <!-- Chart 2: Cumulative Surplus -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Cumulative Surplus / Deficit</h3>
              <div class="relative h-72">
                <canvas #cumulativeSurplusCanvas></canvas>
              </div>
            </div>
          }

          <!-- ================================================================ -->
          <!-- TAB 6: Bank-Run Stress Calculator                               -->
          <!-- ================================================================ -->
          @if (activeTab === 5) {
            <feature-card
              title="Bank-Run Stress Calculator"
              description="Simulate deposit run scenarios with daily burn-down analysis, liquidity ratio tracking, and breach flagging."
              [userStories]="bankRunUserStories"
            ></feature-card>

            <!-- Table 1: Daily Burn-down -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">30-Day Deposit Run Burn-Down</h3>
              <div class="overflow-x-auto max-h-96 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="sticky top-0 bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Day</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Deposit Outflow (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Remaining Assets (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Remaining Deposits (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Liquidity Ratio (%)</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Breach</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of burnDownTable; let i = index" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700" [ngClass]="{'bg-alert-50 dark:bg-alert-900/10': item.breach}">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">Day {{ item.day }}</td>
                      <td class="p-3 text-right font-mono text-alert-600">{{ item.depositOutflow | number:'1.1-1' }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.remainingAssets | number:'1.1-1' }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.remainingDeposits | number:'1.1-1' }}</td>
                      <td class="p-3 text-right font-mono font-semibold" [ngClass]="item.liquidityRatio >= 100 ? 'text-success-600' : 'text-alert-600'">{{ item.liquidityRatio | number:'1.1-1' }}%</td>
                      <td class="p-3 text-center">
                        <status-badge [status]="item.breach ? 'red' : 'green'" [label]="item.breach ? 'BREACH' : 'OK'"></status-badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Saved Scenarios -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Saved Scenarios</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Scenario</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Severity</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Survival Horizon (Days)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">LCR Impact</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of savedScenarios" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.name }}</td>
                      <td class="p-3 text-center">
                        <status-badge [status]="item.severity"></status-badge>
                      </td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.survivalDays }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.lcrImpact }}</td>
                      <td class="p-3 text-right font-mono text-neutral-500 dark:text-neutral-400">{{ item.date }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Chart 1: Remaining Assets vs Deposits -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Remaining Assets vs Deposits</h3>
              <div class="relative h-72">
                <canvas #burnAssetsCanvas></canvas>
              </div>
            </div>

            <!-- Chart 2: Liquidity Ratio Trend -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Liquidity Ratio Trend</h3>
              <div class="relative h-72">
                <canvas #burnRatioCanvas></canvas>
              </div>
            </div>
          }

        </div>
      </main>
    </div>
  `
})
export class LiquidityComponent implements AfterViewInit {
  // ==========================================================================
  // ViewChild references for charts
  // ==========================================================================
  @ViewChild('lcrWaterfallCanvas', { static: false }) lcrWaterfallCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lcrTrendCanvas', { static: false }) lcrTrendCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('nsfrBarCanvas', { static: false }) nsfrBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('nsfrForwardCanvas', { static: false }) nsfrForwardCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lcrImpactCanvas', { static: false }) lcrImpactCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('liquidityGapCanvas', { static: false }) liquidityGapCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ewiRadarCanvas', { static: false }) ewiRadarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cfpTimelineCanvas', { static: false }) cfpTimelineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('gapLadderCanvas', { static: false }) gapLadderCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cumulativeSurplusCanvas', { static: false }) cumulativeSurplusCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('burnAssetsCanvas', { static: false }) burnAssetsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('burnRatioCanvas', { static: false }) burnRatioCanvas!: ElementRef<HTMLCanvasElement>;

  // ==========================================================================
  // Tab state
  // ==========================================================================
  tabs = ['LCR Calculator', 'NSFR Monitor', 'Liquidity Stress Testing', 'CFP Trigger Dashboard', 'Liquidity Gap Report', 'Bank-Run Stress Calculator'];
  activeTab = 0;

  // ==========================================================================
  // User stories by tab
  // ==========================================================================
  lcrUserStories = [
    'As a Treasurer, I want to run the LCR calculation with current data so that I can verify BoG compliance before the daily report.',
    'As a Liquidity Risk Manager, I want to see HQLA composition with haircut application so that I can identify collateral shortages.',
    'As a Compliance Officer, I want to compare LCR against the 100% minimum and 120% target thresholds so that I can flag breaches.',
  ];

  nsfrUserStories = [
    'As a Treasurer, I want to monitor the NSFR ratio forward-looking so that I can ensure stable funding over a 1-year horizon.',
    'As a Risk Manager, I want to compare ASF and RSF components so that I can identify funding structure weaknesses.',
    'As a Board Member, I want to see the forward projection under different scenarios so that I can approve funding strategy.',
  ];

  stressUserStories = [
    'As a Risk Manager, I want to run mild/moderate/severe stress scenarios so that I can quantify liquidity impact.',
    'As a CRO, I want to see the survival horizon in each scenario so that I can trigger the CFP if needed.',
    'As a Regulator, I want to verify the bank has adequate liquidity buffers under stress conditions.',
  ];

  cfpUserStories = [
    'As a Treasurer, I want to see real-time EWI status so that I can detect early signs of liquidity stress.',
    'As a CRO, I want to know which CFP phase is active so that I can follow the escalation procedures.',
    'As the Board, I want to review CFP test results to ensure the contingency plan is effective.',
  ];

  gapUserStories = [
    'As a Risk Manager, I want to view the maturity gap ladder so that I can identify positive/negative gaps.',
    'As a Treasurer, I want to compare behavioral vs contractual maturity so that I can optimize ALM strategy.',
    'As a Regulator, I want to verify the bank maintains adequate liquidity in each time band per BoG LMTD.',
  ];

  bankRunUserStories = [
    'As a Treasurer, I want to simulate a deposit run scenario so that I can assess the bank\'s resilience.',
    'As a CRO, I want to know the survival horizon under different outflow assumptions so that I can prepare contingency plans.',
    'As a Board Member, I want to see the liquidity ratio trend so that I can make informed decisions during a crisis.',
  ];

  // ==========================================================================
  // LCR Data (Tab 1)
  // ==========================================================================
  lcrData: LcrRow[] = [
    { bucket: 'Day 1', hqla: 2100, inflows: 150, outflows: 200, netFlow: -50 },
    { bucket: 'D2-7', hqla: 1800, inflows: 1200, outflows: 800, netFlow: 400 },
    { bucket: 'D8-14', hqla: 1500, inflows: 900, outflows: 600, netFlow: 300 },
    { bucket: 'D15-21', hqla: 1200, inflows: 600, outflows: 400, netFlow: 200 },
    { bucket: 'D22-30', hqla: 900, inflows: 400, outflows: 250, netFlow: 150 },
    { bucket: 'D31-60', hqla: 600, inflows: 200, outflows: 150, netFlow: 50 },
    { bucket: 'D61-90', hqla: 300, inflows: 100, outflows: 100, netFlow: 0 },
  ];

  hqlaComposition: HqlaItem[] = [
    { level: 'Level 1 (Unrestricted)', amount: 2100, haircut: '100%', valueAfterHaircut: 2100, capApplied: 'within cap' },
    { level: 'Level 2A', amount: 680, haircut: '85% (15% haircut)', valueAfterHaircut: 578, capApplied: 'within cap' },
    { level: 'Level 2B', amount: 200, haircut: '50% (50% haircut)', valueAfterHaircut: 100, capApplied: 'within cap' },
    { level: 'Level 2 Cap Applied', amount: 878, haircut: '—', valueAfterHaircut: 778, capApplied: 'within cap' },
  ];

  outflowCategories: OutflowCategory[] = [
    { category: 'Retail Stable', rate: '5%', amount: 4000, outflow: 200 },
    { category: 'Retail Non-Stable', rate: '10%', amount: 2500, outflow: 250 },
    { category: 'Operational Deposits', rate: '25%', amount: 1800, outflow: 450 },
    { category: 'Wholesale Unsecured', rate: '100%', amount: 1200, outflow: 1200 },
    { category: 'Wholesale Secured', rate: '25%', amount: 800, outflow: 200 },
  ];

  lcrTrendData: LcrTrend[] = [
    { day: 'D-30', value: 135 },
    { day: 'D-25', value: 132 },
    { day: 'D-20', value: 128 },
    { day: 'D-15', value: 125 },
    { day: 'D-10', value: 122 },
    { day: 'D-5', value: 124 },
    { day: 'Today', value: 126 },
  ];

  // Users & Roles for LCR tab
  lcrUsers = [
    { role: 'Treasurer', user: 'Kwame Asante', permissions: 'View, Run LCR, Approve' },
    { role: 'Liquidity Risk Manager', user: 'Akua Mensah', permissions: 'View, Edit, Run Scenarios' },
    { role: 'Compliance Officer', user: 'Yaw Owusu', permissions: 'View, Audit Trail, Report' },
  ];

  // ==========================================================================
  // NSFR Data (Tab 2)
  // ==========================================================================
  asfComponents: AsfComponent[] = [
    { component: 'CET1 Capital', factor: '100%', amount: 3200, asfAmount: 3200 },
    { component: 'Preferred Stock', factor: '100%', amount: 500, asfAmount: 500 },
    { component: 'Stable Retail Deposits (<6m)', factor: '95%', amount: 4000, asfAmount: 3800 },
    { component: 'Less Stable Retail Deposits', factor: '90%', amount: 2500, asfAmount: 2250 },
    { component: 'Wholesale Funding (<6m)', factor: '50%', amount: 1800, asfAmount: 900 },
    { component: 'Operational Deposits', factor: '50%', amount: 1200, asfAmount: 600 },
    { component: 'Other Liabilities', factor: '0%', amount: 800, asfAmount: 0 },
  ];

  rsfComponents: RsfComponent[] = [
    { component: 'Cash & Cash Equivalents', factor: '0%', amount: 500, rsfAmount: 0 },
    { component: 'Level 1 Unencumbered', factor: '5%', amount: 1600, rsfAmount: 80 },
    { component: 'Level 2 Unencumbered', factor: '15%', amount: 680, rsfAmount: 102 },
    { component: 'Residential Mortgages', factor: '65%', amount: 2200, rsfAmount: 1430 },
    { component: 'Corporate Loans', factor: '85%', amount: 3500, rsfAmount: 2975 },
    { component: 'Financial Institution Loans', factor: '100%', amount: 1200, rsfAmount: 1200 },
    { component: 'Fixed Assets', factor: '100%', amount: 600, rsfAmount: 600 },
  ];

  forwardProjections: ForwardProjection[] = [
    { month: 'Month 1', base: 118.5, stress: 105.2, custom: 112.0 },
    { month: 'Month 2', base: 116.2, stress: 101.8, custom: 109.5 },
    { month: 'Month 3', base: 114.8, stress: 98.5, custom: 107.2 },
    { month: 'Month 4', base: 113.0, stress: 95.2, custom: 104.8 },
    { month: 'Month 5', base: 111.5, stress: 92.0, custom: 102.5 },
    { month: 'Month 6', base: 110.2, stress: 89.5, custom: 100.2 },
  ];

  // ==========================================================================
  // Stress Testing Data (Tab 3)
  // ==========================================================================
  scenarioParams: ScenarioParam[] = [
    { scenario: 'Mild', retailRunoff: '3%', wholesaleRunoff: '5%', hqlaHaircut: '2%', inflowReduction: '5%' },
    { scenario: 'Moderate', retailRunoff: '8%', wholesaleRunoff: '15%', hqlaHaircut: '10%', inflowReduction: '20%' },
    { scenario: 'Severe', retailRunoff: '20%', wholesaleRunoff: '40%', hqlaHaircut: '25%', inflowReduction: '50%' },
  ];

  scenarioResults: ScenarioResult[] = [
    { metric: 'LCR (%)', base: '126%', mild: '118%', moderate: '95%', severe: '72%' },
    { metric: 'NSFR (%)', base: '115%', mild: '112%', moderate: '105%', severe: '88%' },
    { metric: 'Survival Horizon', base: '>30 days', mild: '28 days', moderate: '18 days', severe: '9 days' },
    { metric: 'HQLA (€M)', base: '2,100', mild: '2,058', moderate: '1,890', severe: '1,575' },
    { metric: 'Net Outflows (€M)', base: '1,667', mild: '1,895', moderate: '2,450', severe: '3,280' },
  ];

  // ==========================================================================
  // CFP Data (Tab 4)
  // ==========================================================================
  ewiData: EwiItem[] = [
    { name: 'LCR 30-day trend', current: '-1.5pp', threshold: '-5pp', status: 'normal' },
    { name: 'Wholesale funding conc.', current: '28%', threshold: '35%', status: 'normal' },
    { name: 'Daily deposit outflows', current: '€5M', threshold: '€50M', status: 'normal' },
    { name: 'Credit rating (Fitch)', current: 'A', threshold: 'BBB', status: 'normal' },
    { name: 'Collateral available', current: '€1.2bn', threshold: '€500M', status: 'normal' },
    { name: '5Y CDS spread', current: '85bps', threshold: '200bps', status: 'normal' },
  ];

  cfpPhases: CfpPhase[] = [
    { phase: 'Phase 1 (Green)', trigger: '0 red EWIs. All EWIs within thresholds.', actions: 'Normal monitoring. Standard reporting. No additional actions required.', escalation: 'None. Routine operations.' },
    { phase: 'Phase 2 (Amber)', trigger: '1-2 red EWIs. Breach of internal target but above regulatory minimum.', actions: 'Increase monitoring frequency. Treasurer briefs CRO. Review funding contingency plans. Reduce discretionary outflows.', escalation: 'Treasurer -> CRO within 24 hours.' },
    { phase: 'Phase 3 (Orange)', trigger: '3-4 red EWIs. LCR below 100% regulatory minimum.', actions: 'Activate CFP. Liquidity task force convened. HQLA mobilization. Limit new lending. Access central bank facilities.', escalation: 'CRO -> CEO within 4 hours.' },
    { phase: 'Phase 4 (Red)', trigger: '5-6 red EWIs. Severe liquidity crisis imminent.', actions: 'Full CFP activation. Emergency funding from central bank. Asset fire sales. Board-level crisis committee. Regulatory notification.', escalation: 'CEO -> Board. Notify Bank of Ghana.' },
  ];

  // ==========================================================================
  // Gap Report Data (Tab 5)
  // ==========================================================================
  behavioralGap: GapBucket[] = [
    { bucket: 'Demand', inflows: 500, outflows: 1800, gap: -1300, cumulative: -1300 },
    { bucket: '1-7 Days', inflows: 1200, outflows: 800, gap: 400, cumulative: -900 },
    { bucket: '8-14 Days', inflows: 900, outflows: 600, gap: 300, cumulative: -600 },
    { bucket: '15-30 Days', inflows: 1000, outflows: 650, gap: 350, cumulative: -250 },
    { bucket: '31-60 Days', inflows: 800, outflows: 500, gap: 300, cumulative: 50 },
    { bucket: '61-90 Days', inflows: 600, outflows: 400, gap: 200, cumulative: 250 },
    { bucket: '91-180 Days', inflows: 1500, outflows: 1000, gap: 500, cumulative: 750 },
    { bucket: '>12 Months', inflows: 4000, outflows: 3500, gap: 500, cumulative: 1250 },
  ];

  behavioralVsContractual = [
    { bucket: 'Demand', behavioralGap: -1300, contractualGap: -1800, difference: 500 },
    { bucket: '1-7 Days', behavioralGap: 400, contractualGap: 200, difference: 200 },
    { bucket: '8-14 Days', behavioralGap: 300, contractualGap: 150, difference: 150 },
    { bucket: '15-30 Days', behavioralGap: 350, contractualGap: 180, difference: 170 },
    { bucket: '31-60 Days', behavioralGap: 300, contractualGap: 200, difference: 100 },
    { bucket: '61-90 Days', behavioralGap: 200, contractualGap: 120, difference: 80 },
    { bucket: '91-180 Days', behavioralGap: 500, contractualGap: 350, difference: 150 },
    { bucket: '>12 Months', behavioralGap: 500, contractualGap: 400, difference: 100 },
  ];

  // ==========================================================================
  // Bank-Run Data (Tab 6)
  // ==========================================================================
  burnDownTable: BurnDownRow[] = [];
  savedScenarios: SavedScenario[] = [
    { name: 'Mild Run (3% daily)', severity: 'green', survivalDays: 30, lcrImpact: '-12%', date: '2026-03-15' },
    { name: 'Moderate Run (8% daily)', severity: 'amber', survivalDays: 18, lcrImpact: '-31%', date: '2026-03-15' },
    { name: 'Severe Run (20% daily)', severity: 'red', survivalDays: 7, lcrImpact: '-54%', date: '2026-03-10' },
    { name: 'Ghana Sovereign Crisis', severity: 'amber', survivalDays: 14, lcrImpact: '-38%', date: '2026-02-28' },
    { name: 'Rating Downgrade (2 notches)', severity: 'red', survivalDays: 9, lcrImpact: '-42%', date: '2026-02-20' },
  ];

  // ==========================================================================
  // Chart instances
  // ==========================================================================
  private charts: Chart[] = [];

  // ==========================================================================
  // Lifecycle
  // ==========================================================================
  constructor() {
    this.generateBurnDownTable();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.destroyCharts();
      // Only init charts for the default tab (tab 0 = LCR)
      // Other tabs' canvases don't exist in the DOM yet (hidden by @if)
      this.initLcrTabCharts();
    }, 100);
  }

  private generateBurnDownTable(): void {
    const initialAssets = 5000;
    const initialDeposits = 8000;
    const dailyRunoffRate = 0.08;

    let assets = initialAssets;
    let deposits = initialDeposits;

    for (let day = 1; day <= 30; day++) {
      const outflow = deposits * dailyRunoffRate * 0.5; // 50% of withdrawing depositors drain assets
      assets = Math.max(0, assets - outflow);
      deposits = Math.max(0, deposits - deposits * dailyRunoffRate);
      // Inflows from asset liquidation
      const inflowFromLiquidation = Math.min(outflow * 0.7, assets * 0.1);
      assets = assets - outflow + inflowFromLiquidation;
      if (assets < 0) assets = 0;

      const ratio = deposits > 0 ? (assets / deposits) * 100 : 0;
      this.burnDownTable.push({
        day,
        depositOutflow: outflow,
        remainingAssets: assets,
        remainingDeposits: deposits,
        liquidityRatio: ratio,
        breach: ratio < 100,
      });
    }
  }

  onTabChange(index: number): void {
    this.destroyCharts();
    this.activeTab = index;
    setTimeout(() => {
      switch (index) {
        case 0: this.initLcrTabCharts(); break;
        case 1: this.initNsfrTabCharts(); break;
        case 2: this.initStressTabCharts(); break;
        case 3: this.initCfpTabCharts(); break;
        case 4: this.initGapTabCharts(); break;
        case 5: this.initBurnTabCharts(); break;
      }
    }, 100);
  }

  parseFloat(value: string): number {
    return parseFloat(value.replace(/[^0-9.]/g, ''));
  }

  private destroyCharts(): void {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  }

  // ==========================================================================
  // Tab 1 Charts: LCR
  // ==========================================================================
  private initLcrTabCharts(): void {
    // Waterfall chart
    const wfCanvas = this.lcrWaterfallCanvas?.nativeElement;
    if (wfCanvas) {
      const totalHqla = 2100;
      const totalInflows = this.lcrData.reduce((s, r) => s + r.inflows, 0);
      const totalOutflows = this.lcrData.reduce((s, r) => s + r.outflows, 0);
      const netOutflows = totalOutflows - totalInflows;
      const lcrPct = netOutflows > 0 ? Math.round((totalHqla / netOutflows) * 100) : 0;

      const chart = new Chart(wfCanvas, {
        type: 'bar',
        data: {
          labels: ['HQLA', 'Total Inflows', 'Total Outflows', 'Net Outflows', 'LCR %'],
          datasets: [{
            label: 'Amount (€M)',
            data: [totalHqla, totalInflows, totalOutflows, netOutflows, lcrPct],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(249, 115, 22, 0.8)',
              'rgba(168, 85, 247, 0.8)',
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(59, 130, 246)',
              'rgb(239, 68, 68)',
              'rgb(249, 115, 22)',
              'rgb(168, 85, 247)',
            ],
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `${(ctx.parsed.y ?? 0).toLocaleString()}${ctx.dataIndex === 4 ? '%' : ' €M'}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }

    // LCR Trend chart
    const trendCanvas = this.lcrTrendCanvas?.nativeElement;
    if (trendCanvas) {
      const chart = new Chart(trendCanvas, {
        type: 'line',
        data: {
          labels: this.lcrTrendData.map(d => d.day),
          datasets: [
            {
              label: 'LCR %',
              data: this.lcrTrendData.map(d => d.value),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: 'Min 100%',
              data: this.lcrTrendData.map(() => 100),
              borderColor: 'rgb(239, 68, 68)',
              borderDash: [6, 4],
              borderWidth: 2,
              pointRadius: 0,
              fill: false,
            },
            {
              label: 'Target 120%',
              data: this.lcrTrendData.map(() => 120),
              borderColor: 'rgb(34, 197, 94)',
              borderDash: [6, 4],
              borderWidth: 2,
              pointRadius: 0,
              fill: false,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
          },
          scales: {
            y: {
              min: 90,
              max: 140,
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }

  // ==========================================================================
  // Tab 2 Charts: NSFR
  // ==========================================================================
  private initNsfrTabCharts(): void {
    // ASF vs RSF bar chart
    const barCanvas = this.nsfrBarCanvas?.nativeElement;
    if (barCanvas) {
      const asfTotal = this.asfComponents.reduce((s, i) => s + i.asfAmount, 0);
      const rsfTotal = this.rsfComponents.reduce((s, i) => s + i.rsfAmount, 0);

      const chart = new Chart(barCanvas, {
        type: 'bar',
        data: {
          labels: ['ASF', 'RSF'],
          datasets: [{
            label: 'Amount (€M)',
            data: [asfTotal, rsfTotal],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(239, 68, 68)',
            ],
            borderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }

    // NSFR Forward chart
    const fwdCanvas = this.nsfrForwardCanvas?.nativeElement;
    if (fwdCanvas) {
      const chart = new Chart(fwdCanvas, {
        type: 'line',
        data: {
          labels: this.forwardProjections.map(p => p.month),
          datasets: [
            {
              label: 'Base',
              data: this.forwardProjections.map(p => p.base),
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: true,
              tension: 0.3,
            },
            {
              label: 'Stress',
              data: this.forwardProjections.map(p => p.stress),
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: true,
              tension: 0.3,
            },
            {
              label: 'Custom',
              data: this.forwardProjections.map(p => p.custom),
              borderColor: 'rgb(249, 115, 22)',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              fill: true,
              tension: 0.3,
              borderDash: [4, 3],
            },
            {
              label: 'Min 100%',
              data: this.forwardProjections.map(() => 100),
              borderColor: 'rgb(239, 68, 68)',
              borderDash: [6, 4],
              borderWidth: 2,
              pointRadius: 0,
              fill: false,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
          },
          scales: {
            y: {
              min: 80,
              max: 125,
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }

  // ==========================================================================
  // Tab 3 Charts: Stress Testing
  // ==========================================================================
  private initStressTabCharts(): void {
    // LCR Impact chart
    const impactCanvas = this.lcrImpactCanvas?.nativeElement;
    if (impactCanvas) {
      const lcrValues = this.scenarioResults
        .filter(r => r.metric === 'LCR (%)')
        .flatMap(r => [parseFloat(r.base), parseFloat(r.mild), parseFloat(r.moderate), parseFloat(r.severe)]);

      const chart = new Chart(impactCanvas, {
        type: 'bar',
        data: {
          labels: ['Base', 'Mild', 'Moderate', 'Severe'],
          datasets: [{
            label: 'LCR (%)',
            data: lcrValues.length ? lcrValues : [126, 118, 95, 72],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(249, 115, 22, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(59, 130, 246)',
              'rgb(249, 115, 22)',
              'rgb(239, 68, 68)',
            ],
            borderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              min: 0,
              max: 140,
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }

    // Liquidity Gap chart
    const gapCanvas = this.liquidityGapCanvas?.nativeElement;
    if (gapCanvas) {
      const buckets = this.lcrData.map(r => r.bucket);
      // Simulate stressed gaps: base gaps with 40% outflow increase
      const baseGaps = this.lcrData.map(r => r.inflows - r.outflows);
      const stressedGaps = this.lcrData.map(r => r.inflows - r.outflows * 1.4);

      const chart = new Chart(gapCanvas, {
        type: 'bar',
        data: {
          labels: buckets,
          datasets: [
            {
              label: 'Base Gap (€M)',
              data: baseGaps,
              backgroundColor: 'rgba(59, 130, 246, 0.7)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1,
            },
            {
              label: 'Severe Stress Gap (€M)',
              data: stressedGaps,
              backgroundColor: 'rgba(239, 68, 68, 0.7)',
              borderColor: 'rgb(239, 68, 68)',
              borderWidth: 1,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
          },
          scales: {
            y: {
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }

  // ==========================================================================
  // Tab 4 Charts: CFP
  // ==========================================================================
  private initCfpTabCharts(): void {
    // EWI Radar chart
    const radarCanvas = this.ewiRadarCanvas?.nativeElement;
    if (radarCanvas) {
      // Normalize EWI values to 0-100 scale for radar display
      const normalValues = [85, 72, 90, 80, 95, 78];
      const thresholdValues = [100, 100, 100, 100, 100, 100];

      const chart = new Chart(radarCanvas, {
        type: 'radar',
        data: {
          labels: this.ewiData.map(e => e.name),
          datasets: [
            {
              label: 'Current Risk Level',
              data: normalValues,
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 2,
              pointBackgroundColor: 'rgb(59, 130, 246)',
              pointRadius: 4,
            },
            {
              label: 'Threshold',
              data: thresholdValues,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'rgb(239, 68, 68)',
              borderWidth: 2,
              borderDash: [4, 4],
              pointRadius: 0,
              fill: false,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
          },
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: { stepSize: 20 },
              grid: { color: 'rgba(0,0,0,0.08)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }

    // CFP Phase Timeline chart
    const tlCanvas = this.cfpTimelineCanvas?.nativeElement;
    if (tlCanvas) {
      const chart = new Chart(tlCanvas, {
        type: 'bar',
        data: {
          labels: ['Phase 1\n(Green)', 'Phase 2\n(Amber)', 'Phase 3\n(Orange)', 'Phase 4\n(Red)'],
          datasets: [{
            label: 'Red EWIs Required',
            data: [0, 2, 4, 6],
            backgroundColor: [
              'rgba(34, 197, 94, 0.7)',
              'rgba(250, 204, 21, 0.7)',
              'rgba(249, 115, 22, 0.7)',
              'rgba(239, 68, 68, 0.7)',
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(250, 204, 21)',
              'rgb(249, 115, 22)',
              'rgb(239, 68, 68)',
            ],
            borderWidth: 2,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              min: 0,
              max: 7,
              title: {
                display: true,
                text: 'Number of Red EWIs',
              },
              grid: { color: 'rgba(0,0,0,0.06)' },
            },
            y: {
              grid: { display: false },
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }

  // ==========================================================================
  // Tab 5 Charts: Liquidity Gap
  // ==========================================================================
  private initGapTabCharts(): void {
    // Gap Ladder chart
    const ladderCanvas = this.gapLadderCanvas?.nativeElement;
    if (ladderCanvas) {
      const buckets = this.behavioralGap.map(g => g.bucket);
      const inflows = this.behavioralGap.map(g => g.inflows);
      const outflows = this.behavioralGap.map(g => g.outflows);
      const gaps = this.behavioralGap.map(g => g.gap);
      const cumulatives = this.behavioralGap.map(g => g.cumulative);

      const chart = new Chart(ladderCanvas, {
        type: 'bar',
        data: {
          labels: buckets,
          datasets: [
            {
              label: 'Inflows (€M)',
              data: inflows,
              backgroundColor: 'rgba(34, 197, 94, 0.6)',
              borderColor: 'rgb(34, 197, 94)',
              borderWidth: 1,
              order: 2,
            },
            {
              label: 'Outflows (€M)',
              data: outflows,
              backgroundColor: 'rgba(239, 68, 68, 0.6)',
              borderColor: 'rgb(239, 68, 68)',
              borderWidth: 1,
              order: 2,
            },
            {
              label: 'Cumulative (€M)',
              data: cumulatives,
              type: 'line',
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: false,
              tension: 0.3,
              pointRadius: 4,
              pointBackgroundColor: 'rgb(59, 130, 246)',
              borderWidth: 2,
              order: 1,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
          },
          scales: {
            y: {
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }

    // Cumulative Surplus chart
    const surplusCanvas = this.cumulativeSurplusCanvas?.nativeElement;
    if (surplusCanvas) {
      const buckets = this.behavioralGap.map(g => g.bucket);
      const cumulatives = this.behavioralGap.map(g => g.cumulative);

      const chart = new Chart(surplusCanvas, {
        type: 'line',
        data: {
          labels: buckets,
          datasets: [{
            label: 'Cumulative Surplus / Deficit (€M)',
            data: cumulatives,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: (ctx) => {
              const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
              gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
              return gradient;
            },
            fill: true,
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: (ctx) => {
              const val = ctx.dataset.data[ctx.dataIndex] as number;
              return val >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)';
            },
            borderWidth: 3,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
          },
          scales: {
            y: {
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }

  // ==========================================================================
  // Tab 6 Charts: Bank-Run Stress
  // ==========================================================================
  private initBurnTabCharts(): void {
    // Remaining Assets vs Deposits
    const assetsCanvas = this.burnAssetsCanvas?.nativeElement;
    if (assetsCanvas) {
      const days = this.burnDownTable.map(d => `Day ${d.day}`);
      const assets = this.burnDownTable.map(d => d.remainingAssets);
      const deposits = this.burnDownTable.map(d => d.remainingDeposits);

      const chart = new Chart(assetsCanvas, {
        type: 'line',
        data: {
          labels: days,
          datasets: [
            {
              label: 'Remaining Assets (€M)',
              data: assets,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 1,
            },
            {
              label: 'Remaining Deposits (€M)',
              data: deposits,
              borderColor: 'rgb(249, 115, 22)',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 1,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.06)' },
            },
            x: {
              ticks: {
                maxTicksLimit: 15,
              },
              grid: { display: false },
            }
          }
        }
      });
      this.charts.push(chart);
    }

    // Liquidity Ratio Trend
    const ratioCanvas = this.burnRatioCanvas?.nativeElement;
    if (ratioCanvas) {
      const days = this.burnDownTable.map(d => `Day ${d.day}`);
      const ratios = this.burnDownTable.map(d => d.liquidityRatio);

      const chart = new Chart(ratioCanvas, {
        type: 'line',
        data: {
          labels: days,
          datasets: [
            {
              label: 'Liquidity Ratio (%)',
              data: ratios,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: (ctx) => {
                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
                gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
                return gradient;
              },
              fill: true,
              tension: 0.3,
              pointRadius: (ctx) => {
                const val = ctx.dataset.data[ctx.dataIndex] as number;
                return val < 100 ? 5 : 2;
              },
              pointBackgroundColor: (ctx) => {
                const val = ctx.dataset.data[ctx.dataIndex] as number;
                return val < 100 ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)';
              },
              pointBorderColor: (ctx) => {
                const val = ctx.dataset.data[ctx.dataIndex] as number;
                return val < 100 ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)';
              },
              borderWidth: 2,
            },
            {
              label: '100% Threshold',
              data: ratios.map(() => 100),
              borderColor: 'rgb(239, 68, 68)',
              borderDash: [6, 4],
              borderWidth: 2,
              pointRadius: 0,
              fill: false,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
          },
          scales: {
            y: {
              min: 0,
              max: 150,
              grid: { color: 'rgba(0,0,0,0.06)' },
            },
            x: {
              ticks: {
                maxTicksLimit: 15,
              },
              grid: { display: false },
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }
}
