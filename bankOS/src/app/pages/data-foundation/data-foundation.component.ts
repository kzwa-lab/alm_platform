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

interface SourceStatus {
  name: string;
  type: string;
  lastRun: string;
  status: string;
  rows: number;
}

interface DataInput {
  input: string;
  source: string;
  format: string;
  frequency: string;
}

interface FeedHealthItem {
  name: string;
  successRate: number;
}

interface IngestionTimelineItem {
  date: string;
  actual: number;
  target: number;
}

interface ProductCatalogItem {
  productId: string;
  name: string;
  type: string;
  bogLmtd: string;
  irrbbClassification: string;
}

interface AssetClassificationItem {
  category: string;
  definition: string;
  amount: number;
}

interface DqDimensionScore {
  dimension: string;
  score: number;
  trend: string;
}

interface SourceQualityItem {
  source: string;
  completeness: number;
  accuracy: number;
  timeliness: number;
}

interface DqTrendItem {
  month: string;
  score: number;
}

interface AlcoMeeting {
  date: string;
  title: string;
  chair: string;
  status: string;
}

interface AlcoActionItem {
  id: string;
  action: string;
  owner: string;
  dueDate: string;
  status: string;
}

interface AlcoAgendaItem {
  item: string;
  priority: number;
}

interface AlcoActionStatusItem {
  status: string;
  count: number;
}

interface AuditChange {
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  detail: string;
}

interface LineageTraceItem {
  step: string;
  source: string;
  target: string;
  transform: string;
}

interface AuditActivityItem {
  type: string;
  count: number;
}

interface DataFreshnessItem {
  date: string;
  age: number;
}

interface ReconItem {
  status: string;
  tbAmount: number;
  xtelAmount: number;
  variance: number;
}

interface ChecklistItem {
  step: string;
  status: string;
  owner: string;
}

interface ReconVarianceItem {
  category: string;
  variance: number;
}

interface RunStatusItem {
  run: string;
  timestamp: string;
  status: string;
}

interface DealAttribute {
  attribute: string;
  value: string;
  dealId: string;
}

interface StrategyComparisonItem {
  strategy: string;
  npv: number;
  duration: number;
  convexity: number;
}

interface CashflowProjectionItem {
  period: string;
  fixedRate: number;
  floatingRate: number;
}

interface RateScenarioItem {
  scenario: string;
  curve: string;
  impact: number;
}

@Component({
  selector: 'app-data-foundation',
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
          <span class="text-neutral-700 dark:text-neutral-300">Data Foundation</span>
        </div>
      </header>

      <main class="flex-1 p-6 overflow-y-auto">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Data Foundation Module</h2>

          <tab-bar [tabs]="tabs" [activeIndex]="activeTab" (tabChange)="onTabChange($event)"></tab-bar>

          <!-- ================================================================ -->
          <!-- TAB 1: Data Ingestion Pipeline                                    -->
          <!-- ================================================================ -->
          @if (activeTab === 0) {
            <feature-card
              title="Data Ingestion Pipeline"
              description="Monitor end-of-day batch ingestion across all source systems with real-time feed health and SLA tracking."
              [userStories]="ingestionUserStories"
            ></feature-card>

            <ghana-regulatory-detail detail="BoG LRMD 2026: Data lineage retention 7 years. Data residency: all production data in Ghana. Cross-border transfer requires Board Risk Committee approval. E-money float accounts classified as volatile liabilities. Daily batch complete within 2 hours of EOD."></ghana-regulatory-detail>

            <!-- Table 1: Source Status -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Source System Status</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Source System</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Type</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Last Run</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Rows</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of sourceStatusData" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.name }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.type }}</td>
                      <td class="p-3 font-mono text-neutral-700 dark:text-neutral-200">{{ item.lastRun }}</td>
                      <td class="p-3 text-center">
                        <status-badge [status]="item.status"></status-badge>
                      </td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.rows | number }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Data Inputs Summary -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Data Inputs Summary</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Input</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Source</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Format</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of dataInputs" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.input }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.source }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.format }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.frequency }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Chart 1: Feed Health -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Feed Health</h3>
              <div class="relative h-72">
                <canvas #feedHealthCanvas></canvas>
              </div>
            </div>

            <!-- Chart 2: Ingestion Timeline -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Ingestion Timeline</h3>
              <div class="relative h-72">
                <canvas #ingestionTimelineCanvas></canvas>
              </div>
            </div>
          }

          <!-- ================================================================ -->
          <!-- TAB 2: Master Data Management                                     -->
          <!-- ================================================================ -->
          @if (activeTab === 1) {
            <feature-card
              title="Master Data Management"
              description="Centralised product catalogue and asset classification reference data aligned to BoG LMTD 2026 definitions."
              [userStories]="masterDataUserStories"
            ></feature-card>

            <!-- Table 1: Product Catalog -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Product Catalog</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Product ID</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Name</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Type</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">BoG LMTD</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">IRRBB Classification</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of productCatalog" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 font-mono text-neutral-700 dark:text-neutral-200">{{ item.productId }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.name }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.type }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.bogLmtd }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.irrbbClassification }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Ghana Asset Classification -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Ghana Asset Classification (BoG Definitions)</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Category</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Definition</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Amount (€M)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of assetClassifications" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">{{ item.category }}</td>
                      <td class="p-3 text-neutral-600 dark:text-neutral-300">{{ item.definition }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.amount | number:'1.0-0' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Chart 1: Classification Donut -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Asset Classification Breakdown</h3>
              <div class="relative h-72">
                <canvas #classificationDonutCanvas></canvas>
              </div>
            </div>

            <!-- Chart 2: Encumbrance Pie -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Encumbrance by Asset Type</h3>
              <div class="relative h-72">
                <canvas #encumbrancePieCanvas></canvas>
              </div>
            </div>
          }

          <!-- ================================================================ -->
          <!-- TAB 3: Data Quality Scorecard                                     -->
          <!-- ================================================================ -->
          @if (activeTab === 2) {
            <feature-card
              title="Data Quality Scorecard"
              description="Five-dimensional data quality monitoring with automated scoring, trend analysis, and regulatory triggers."
              [userStories]="dqUserStories"
            ></feature-card>

            <ghana-regulatory-detail detail="Overall DQ score < 85% auto-includes data quality review in ALCO agenda. < 70% pauses all downstream calculations. Monthly attestation by CRO."></ghana-regulatory-detail>

            <!-- Table 1: Dimension Scores -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Dimension Scores</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Dimension</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Score</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of dqDimensionScores" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">{{ item.dimension }}</td>
                      <td class="p-3 text-right font-mono font-semibold" [ngClass]="item.score >= 95 ? 'text-success-600' : item.score >= 85 ? 'text-warning-600' : 'text-alert-600'">{{ item.score }}%</td>
                      <td class="p-3 text-center">
                        <status-badge [status]="item.score >= 95 ? 'green' : item.score >= 85 ? 'amber' : 'red'" [label]="item.score >= 95 ? 'Good' : item.score >= 85 ? 'Warning' : 'Critical'"></status-badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Source Quality Breakdown -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Source Quality Breakdown</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Source</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Completeness</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Accuracy</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Timeliness</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of sourceQuality" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.source }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.completeness }}%</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.accuracy }}%</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.timeliness }}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Chart 1: Score Gauge -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Overall DQ Score Gauge</h3>
              <div class="relative h-72">
                <canvas #dqGaugeCanvas></canvas>
              </div>
            </div>

            <!-- Chart 2: Trend Line -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">DQ Score Trend (6 Months)</h3>
              <div class="relative h-72">
                <canvas #dqTrendCanvas></canvas>
              </div>
            </div>
          }

          <!-- ================================================================ -->
          <!-- TAB 4: ALCO Workflow Engine                                       -->
          <!-- ================================================================ -->
          @if (activeTab === 3) {
            <feature-card
              title="ALCO Workflow Engine"
              description="Schedule, track, and manage ALCO meetings, agenda items, and action items across the enterprise."
              [userStories]="alcoUserStories"
            ></feature-card>

            <!-- Table 1: Upcoming Meetings -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Upcoming ALCO Meetings</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Date</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Title</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Chair</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of alcoMeetings" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 font-mono text-neutral-700 dark:text-neutral-200">{{ item.date }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.title }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.chair }}</td>
                      <td class="p-3 text-center">
                        <status-badge [status]="item.status"></status-badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Action Items -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Action Items</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">ID</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Action</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Owner</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Due Date</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of alcoActions" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 font-mono text-neutral-500 dark:text-neutral-400">{{ item.id }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.action }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.owner }}</td>
                      <td class="p-3 font-mono text-neutral-700 dark:text-neutral-200">{{ item.dueDate }}</td>
                      <td class="p-3 text-center">
                        <status-badge [status]="item.status"></status-badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Chart 1: Agenda Priority Pie -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Agenda Priority Distribution</h3>
              <div class="relative h-72">
                <canvas #agendaPriorityCanvas></canvas>
              </div>
            </div>

            <!-- Chart 2: Action Status Bar -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Action Items by Status</h3>
              <div class="relative h-72">
                <canvas #actionStatusCanvas></canvas>
              </div>
            </div>
          }

          <!-- ================================================================ -->
          <!-- TAB 5: Audit Trail & Data Lineage                                 -->
          <!-- ================================================================ -->
          @if (activeTab === 4) {
            <feature-card
              title="Audit Trail & Data Lineage"
              description="Comprehensive audit logging with full data lineage traceability for regulatory compliance and forensic analysis."
              [userStories]="auditUserStories"
            ></feature-card>

            <!-- Table 1: Recent Changes -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Recent Changes</h3>
              <div class="overflow-x-auto max-h-72 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="sticky top-0 bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Timestamp</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">User</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Action</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Entity</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of recentChanges" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 font-mono text-neutral-500 dark:text-neutral-400 text-xs">{{ item.timestamp }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.user }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.action }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.entity }}</td>
                      <td class="p-3 text-neutral-600 dark:text-neutral-300 text-xs">{{ item.detail }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Lineage Trace -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Lineage Trace: ALM Dashboard TB Extract</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Step</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Source</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Target</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Transform</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of lineageTrace" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 font-mono text-neutral-500 dark:text-neutral-400">{{ item.step }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.source }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.target }}</td>
                      <td class="p-3 text-neutral-600 dark:text-neutral-300 text-xs">{{ item.transform }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Chart 1: Audit Activity by Type -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Audit Activity by Type</h3>
              <div class="relative h-72">
                <canvas #auditActivityCanvas></canvas>
              </div>
            </div>

            <!-- Chart 2: Data Freshness Line -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Data Freshness (Hours Since Last Update)</h3>
              <div class="relative h-72">
                <canvas #dataFreshnessCanvas></canvas>
              </div>
            </div>
          }

          <!-- ================================================================ -->
          <!-- TAB 6: ALM Control Tower                                          -->
          <!-- ================================================================ -->
          @if (activeTab === 5) {
            <feature-card
              title="ALM Control Tower"
              description="Central reconciliation and run-launch control dashboard with three-way matching and dual-approval override gates."
              [userStories]="controlTowerUserStories"
            ></feature-card>

            <ghana-regulatory-detail detail="Three-way reconciliation: TB vs XTEL. Variance > 0.1% blocks run launch. Override requires dual approval."></ghana-regulatory-detail>

            <!-- Table 1: Reconciliation Status -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Reconciliation Status</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">TB (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">XTEL (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Variance (€M)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of reconStatus" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">
                        <status-badge [status]="item.status === 'Matched' ? 'green' : item.status === 'Unmapped ALM' ? 'amber' : 'red'" [label]="item.status"></status-badge>
                      </td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.tbAmount | number:'1.0-0' }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.xtelAmount | number:'1.0-0' }}</td>
                      <td class="p-3 text-right font-mono font-semibold" [ngClass]="item.variance === 0 ? 'text-success-600' : 'text-alert-600'">{{ item.variance | number:'1.2-2' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Tracker Checklist -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Run Launch Tracker Checklist</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Step</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of checklistItems" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.step }}</td>
                      <td class="p-3 text-center">
                        <status-badge [status]="item.status"></status-badge>
                      </td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.owner }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Chart 1: Reconciliation Variance Bar -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Reconciliation Variance by Category</h3>
              <div class="relative h-72">
                <canvas #reconVarianceCanvas></canvas>
              </div>
            </div>

            <!-- Chart 2: Run Status Timeline -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Run Status Timeline</h3>
              <div class="relative h-72">
                <canvas #runStatusCanvas></canvas>
              </div>
            </div>
          }

          <!-- ================================================================ -->
          <!-- TAB 7: Instrument Modeling Workbench                              -->
          <!-- ================================================================ -->
          @if (activeTab === 6) {
            <feature-card
              title="Instrument Modeling Workbench"
              description="Model financial instruments with cashflow projections, rate scenario comparison, and strategy optimisation."
              [userStories]="modelingUserStories"
            ></feature-card>

            <!-- Table 1: Deal Attributes -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Deal Attributes</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Attribute</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Value</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Deal ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of dealAttributes" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">{{ item.attribute }}</td>
                      <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ item.value }}</td>
                      <td class="p-3 font-mono text-neutral-500 dark:text-neutral-400">{{ item.dealId }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Strategy Comparison -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Strategy Comparison</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Strategy</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">NPV (€M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Duration</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Convexity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of strategyComparison" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td class="p-3 font-medium text-neutral-700 dark:text-neutral-200">{{ item.strategy }}</td>
                      <td class="p-3 text-right font-mono font-semibold" [ngClass]="item.npv >= 0 ? 'text-success-600' : 'text-alert-600'">{{ item.npv | number:'1.1-1' }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.duration | number:'1.2-2' }}</td>
                      <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ item.convexity | number:'1.2-2' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Chart 1: Cashflow Projection -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Cashflow Projection</h3>
              <div class="relative h-72">
                <canvas #cashflowCanvas></canvas>
              </div>
            </div>

            <!-- Chart 2: Rate Scenario Comparison -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Rate Scenario Comparison</h3>
              <div class="relative h-72">
                <canvas #rateScenarioCanvas></canvas>
              </div>
            </div>
          }

        </div>
      </main>
    </div>
  `
})
export class DataFoundationComponent implements AfterViewInit {
  // ==========================================================================
  // ViewChild references for charts
  // ==========================================================================
  @ViewChild('feedHealthCanvas', { static: false }) feedHealthCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ingestionTimelineCanvas', { static: false }) ingestionTimelineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('classificationDonutCanvas', { static: false }) classificationDonutCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('encumbrancePieCanvas', { static: false }) encumbrancePieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('dqGaugeCanvas', { static: false }) dqGaugeCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('dqTrendCanvas', { static: false }) dqTrendCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('agendaPriorityCanvas', { static: false }) agendaPriorityCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('actionStatusCanvas', { static: false }) actionStatusCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('auditActivityCanvas', { static: false }) auditActivityCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('dataFreshnessCanvas', { static: false }) dataFreshnessCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('reconVarianceCanvas', { static: false }) reconVarianceCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('runStatusCanvas', { static: false }) runStatusCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cashflowCanvas', { static: false }) cashflowCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rateScenarioCanvas', { static: false }) rateScenarioCanvas!: ElementRef<HTMLCanvasElement>;

  // ==========================================================================
  // Tab state
  // ==========================================================================
  tabs = [
    'Data Ingestion Pipeline',
    'Master Data Management',
    'Data Quality Scorecard',
    'ALCO Workflow Engine',
    'Audit Trail & Data Lineage',
    'ALM Control Tower',
    'Instrument Modeling Workbench'
  ];
  activeTab = 0;

  // ==========================================================================
  // User stories by tab
  // ==========================================================================
  ingestionUserStories = [
    'As a Data Engineer, I want to see real-time feed health and ingestion SLA status so that I can identify and resolve pipeline failures.',
    'As a Treasurer, I want to verify the daily batch completed within the 2-hour EOD window so that regulatory reporting is on time.',
    'As a Risk Manager, I want to review source system row counts and timestamps so that I can confirm data completeness before running models.',
  ];

  masterDataUserStories = [
    'As a Data Steward, I want to maintain the product catalogue with correct BoG LMTD classifications so that regulatory reporting is accurate.',
    'As a Risk Analyst, I want to view Ghana asset classifications (Narrow/Broad/Non-Liquid) so that I can compute the liquidity ratios correctly.',
    'As a Compliance Officer, I want to audit product type mappings to IRRBB categories so that interest rate risk is properly captured.',
  ];

  dqUserStories = [
    'As a CRO, I want to see the overall DQ score and dimension breakdown so that I can identify data quality risks and escalate if needed.',
    'As a Data Governance Lead, I want monthly trend data so that I can demonstrate improvement in data quality metrics to the Board.',
    'As an ALCO Member, I want automatic alerts when scores fall below 85% so that data quality review is placed on the agenda.',
  ];

  alcoUserStories = [
    'As an ALCO Secretary, I want to schedule meetings and track agenda items so that the committee operates efficiently.',
    'As a CRO, I want to assign and monitor action items so that decisions are implemented before the next meeting.',
    'As a Board Member, I want to review meeting status and action completion rates so that I can assess ALCO effectiveness.',
  ];

  auditUserStories = [
    'As an Internal Auditor, I want to view a complete audit trail of all data changes so that I can verify integrity for regulatory review.',
    'As a Compliance Officer, I want to trace data lineage from source to report so that I can demonstrate compliance with BoG LRMD 2026.',
    'As a Risk Manager, I want to monitor data freshness so that I know the age of data used in downstream calculations.',
  ];

  controlTowerUserStories = [
    'As a Treasurer, I want to see three-way reconciliation status before launching a run so that I can ensure data integrity.',
    'As a Risk Manager, I want variance thresholds enforced so that runs are blocked when discrepancies exceed 0.1%.',
    'As a Compliance Officer, I want dual-approval override tracking so that all manual overrides are properly documented.',
  ];

  modelingUserStories = [
    'As a Structurer, I want to model deal attributes and cashflows so that I can price new instruments accurately.',
    'As a Risk Analyst, I want to compare NPV across hedging strategies so that I can recommend the optimal approach.',
    'As a Treasurer, I want to see rate scenario impacts on instrument valuations so that I can manage balance sheet risk.',
  ];

  // ==========================================================================
  // Tab 1 Data: Data Ingestion Pipeline
  // ==========================================================================
  sourceStatusData: SourceStatus[] = [
    { name: 'Core Banking GL', type: 'SQL Server', lastRun: '26 Jun 2026 21:32', status: 'green', rows: 2548301 },
    { name: 'Loan System', type: 'Oracle', lastRun: '26 Jun 2026 21:45', status: 'green', rows: 892450 },
    { name: 'Deposit System', type: 'Oracle', lastRun: '26 Jun 2026 21:28', status: 'green', rows: 1456200 },
    { name: 'Securities', type: 'Bloomberg', lastRun: '26 Jun 2026 21:55', status: 'green', rows: 52134 },
    { name: 'Market Data', type: 'Reuters', lastRun: '26 Jun 2026 20:10', status: 'amber', rows: 18200 },
  ];

  dataInputs: DataInput[] = [
    { input: 'General Ledger Balances', source: 'Core Banking GL', format: 'CSV', frequency: 'Daily (EOD)' },
    { input: 'Loan Portfolio Details', source: 'Loan System', format: 'XML', frequency: 'Daily (EOD)' },
    { input: 'Deposit Portfolio Details', source: 'Deposit System', format: 'XML', frequency: 'Daily (EOD)' },
    { input: 'Security Holdings & Prices', source: 'Securities', format: 'API/JSON', frequency: 'Daily (EOD)' },
    { input: 'FX Rates & Yield Curves', source: 'Market Data', format: 'API/JSON', frequency: 'Intraday + EOD' },
  ];

  feedHealthData: FeedHealthItem[] = [
    { name: 'Core Banking GL', successRate: 99.8 },
    { name: 'Loan System', successRate: 99.5 },
    { name: 'Deposit System', successRate: 99.7 },
    { name: 'Securities', successRate: 98.9 },
    { name: 'Market Data', successRate: 97.2 },
  ];

  ingestionTimeline: IngestionTimelineItem[] = [
    { date: 'Mon', actual: 62, target: 120 },
    { date: 'Tue', actual: 85, target: 120 },
    { date: 'Wed', actual: 70, target: 120 },
    { date: 'Thu', actual: 110, target: 120 },
    { date: 'Fri', actual: 95, target: 120 },
    { date: 'Sat', actual: 45, target: 60 },
    { date: 'Sun', actual: 40, target: 60 },
  ];

  // ==========================================================================
  // Tab 2 Data: Master Data Management
  // ==========================================================================
  productCatalog: ProductCatalogItem[] = [
    { productId: 'P-001', name: 'Prime Mortgage', type: 'Loan', bogLmtd: 'Broad Liquid', irrbbClassification: 'Non-trading (banking book)' },
    { productId: 'P-002', name: 'Corporate Overdraft', type: 'Loan', bogLmtd: 'Narrow Liquid', irrbbClassification: 'Non-trading (banking book)' },
    { productId: 'P-003', name: 'T-Bill (91-day)', type: 'Security', bogLmtd: 'Narrow Liquid', irrbbClassification: 'Trading book' },
    { productId: 'P-004', name: 'Retail Time Deposit', type: 'Deposit', bogLmtd: 'Non-Liquid', irrbbClassification: 'Non-trading (banking book)' },
    { productId: 'P-005', name: 'SME Term Loan', type: 'Loan', bogLmtd: 'Broad Liquid', irrbbClassification: 'Non-trading (banking book)' },
    { productId: 'P-006', name: 'Ghana Gov Bond (5Y)', type: 'Security', bogLmtd: 'Narrow Liquid', irrbbClassification: 'Trading book' },
    { productId: 'P-007', name: 'E-money Float', type: 'Deposit', bogLmtd: 'Volatile Liability', irrbbClassification: 'Non-trading (banking book)' },
  ];

  assetClassifications: AssetClassificationItem[] = [
    { category: 'Narrow Liquid Assets', definition: 'Cash, central bank reserves, high-grade govt securities (Level 1 HQLA)', amount: 2100 },
    { category: 'Broad Liquid Assets', definition: 'Narrow liquid + Level 2A/2B HQLA assets with haircut applied', amount: 2780 },
    { category: 'Non-Liquid Assets', definition: 'All other assets not meeting narrow/broad liquid definitions', amount: 5200 },
  ];

  encumbranceData = [
    { label: 'Unencumbered - Level 1', value: 1600 },
    { label: 'Unencumbered - Level 2A', value: 500 },
    { label: 'Unencumbered - Level 2B', value: 150 },
    { label: 'Encumbered - Repo', value: 700 },
    { label: 'Encumbered - Collateralised', value: 900 },
  ];

  // ==========================================================================
  // Tab 3 Data: Data Quality Scorecard
  // ==========================================================================
  dqDimensionScores: DqDimensionScore[] = [
    { dimension: 'Completeness', score: 96, trend: 'up' },
    { dimension: 'Accuracy', score: 92, trend: 'flat' },
    { dimension: 'Timeliness', score: 98, trend: 'up' },
    { dimension: 'Consistency', score: 89, trend: 'down' },
    { dimension: 'Validity', score: 95, trend: 'flat' },
  ];

  sourceQuality: SourceQualityItem[] = [
    { source: 'Core Banking GL', completeness: 99, accuracy: 97, timeliness: 98 },
    { source: 'Loan System', completeness: 96, accuracy: 93, timeliness: 99 },
    { source: 'Deposit System', completeness: 97, accuracy: 95, timeliness: 98 },
    { source: 'Securities', completeness: 92, accuracy: 90, timeliness: 95 },
    { source: 'Market Data', completeness: 88, accuracy: 85, timeliness: 90 },
  ];

  dqTrendData: DqTrendItem[] = [
    { month: 'Jan', score: 91 },
    { month: 'Feb', score: 92 },
    { month: 'Mar', score: 90 },
    { month: 'Apr', score: 93 },
    { month: 'May', score: 94 },
    { month: 'Jun', score: 94 },
  ];

  // ==========================================================================
  // Tab 4 Data: ALCO Workflow Engine
  // ==========================================================================
  alcoMeetings: AlcoMeeting[] = [
    { date: '2026-07-01', title: 'Monthly ALCO - July', chair: 'CRO (Akua Mensah)', status: 'green' },
    { date: '2026-07-08', title: 'DQ Review (Special)', chair: 'Data Gov Lead', status: 'amber' },
    { date: '2026-07-15', title: 'IRRBB Deep Dive', chair: 'Treasurer (Kwame Asante)', status: 'green' },
    { date: '2026-08-05', title: 'Monthly ALCO - Aug', chair: 'CRO (Akua Mensah)', status: 'green' },
  ];

  alcoActions: AlcoActionItem[] = [
    { id: 'ACT-042', action: 'Review and approve Q2 liquidity stress test results', owner: 'CRO', dueDate: '2026-07-05', status: 'amber' },
    { id: 'ACT-043', action: 'Update NSFR forward projection with July data', owner: 'Treasury', dueDate: '2026-07-03', status: 'green' },
    { id: 'ACT-044', action: 'Resolve data quality issues in Market Data feed', owner: 'Data Eng', dueDate: '2026-06-30', status: 'red' },
    { id: 'ACT-045', action: 'Document override rationale for TB-XTEL variance', owner: 'Risk Mgmt', dueDate: '2026-07-10', status: 'amber' },
    { id: 'ACT-046', action: 'Prepare LCR trend analysis for Board pack', owner: 'Treasury', dueDate: '2026-07-12', status: 'green' },
  ];

  alcoAgendaData: AlcoAgendaItem[] = [
    { item: 'Regulatory Update', priority: 1 },
    { item: 'LCR / NSFR Review', priority: 1 },
    { item: 'Data Quality Report', priority: 2 },
    { item: 'Stress Test Results', priority: 1 },
    { item: 'New Product Approval', priority: 3 },
    { item: 'Policy Amendments', priority: 3 },
    { item: 'Action Item Review', priority: 2 },
  ];

  alcoActionStatusData: AlcoActionStatusItem[] = [
    { status: 'Completed', count: 8 },
    { status: 'In Progress', count: 5 },
    { status: 'Overdue', count: 2 },
    { status: 'Not Started', count: 3 },
  ];

  // ==========================================================================
  // Tab 5 Data: Audit Trail & Data Lineage
  // ==========================================================================
  recentChanges: AuditChange[] = [
    { timestamp: '2026-06-26 21:45:12', user: 'System', action: 'UPDATE', entity: 'TB Balances', detail: 'Batch EOD load: 2,548,301 rows inserted' },
    { timestamp: '2026-06-26 21:30:05', user: 'System', action: 'UPDATE', entity: 'Loan Portfolio', detail: 'Batch EOD load: 892,450 rows inserted' },
    { timestamp: '2026-06-26 19:22:33', user: 'akua.mensah', action: 'MODIFY', entity: 'Stress Scenario', detail: 'Updated severe scenario outflow parameters' },
    { timestamp: '2026-06-26 15:10:48', user: 'kwame.asante', action: 'APPROVE', entity: 'LCR Report', detail: 'Approved daily LCR calc for 26-Jun' },
    { timestamp: '2026-06-26 14:05:21', user: 'yaw.owusu', action: 'VIEW', entity: 'Audit Trail', detail: 'Exported audit log for regulatory review' },
    { timestamp: '2026-06-25 22:00:00', user: 'System', action: 'UPDATE', entity: 'Market Data', detail: 'Batch EOD load: 18,200 rows inserted' },
    { timestamp: '2026-06-25 10:30:15', user: 'data.engineer', action: 'MODIFY', entity: 'Feed Config', detail: 'Adjusted Market Data API polling interval' },
  ];

  lineageTrace: LineageTraceItem[] = [
    { step: 'S1', source: 'Core Banking GL', target: 'Data Lake (raw)', transform: 'CSV ingest, column mapping, checksum validation' },
    { step: 'S2', source: 'Data Lake (raw)', target: 'ALM Staging (curated)', transform: 'Account reconciliation, currency normalisation' },
    { step: 'S3', source: 'ALM Staging (curated)', target: 'TB Extract', transform: 'GL balance aggregation, product type mapping' },
    { step: 'S4', source: 'TB Extract', target: 'XTEL Engine', transform: 'Cashflow generation, behavioural assumption overlay' },
    { step: 'S5', source: 'XTEL Engine', target: 'ALM Dashboard', transform: 'Metric calculation, time-bucket aggregation' },
  ];

  auditActivityData: AuditActivityItem[] = [
    { type: 'UPDATE (System Batch)', count: 42 },
    { type: 'MODIFY (Manual)', count: 18 },
    { type: 'APPROVE', count: 12 },
    { type: 'VIEW / EXPORT', count: 25 },
    { type: 'CONFIG CHANGE', count: 5 },
  ];

  dataFreshnessData: DataFreshnessItem[] = [
    { date: '26 Jun 08:00', age: 0.5 },
    { date: '26 Jun 10:00', age: 0.8 },
    { date: '26 Jun 12:00', age: 1.2 },
    { date: '26 Jun 14:00', age: 2.0 },
    { date: '26 Jun 16:00', age: 1.5 },
    { date: '26 Jun 18:00', age: 0.9 },
    { date: '26 Jun 20:00', age: 1.8 },
    { date: '26 Jun 22:00', age: 0.3 },
  ];

  // ==========================================================================
  // Tab 6 Data: ALM Control Tower
  // ==========================================================================
  reconStatus: ReconItem[] = [
    { status: 'Matched', tbAmount: 12500000, xtelAmount: 12500000, variance: 0 },
    { status: 'Unmapped ALM', tbAmount: 425000, xtelAmount: 0, variance: 425000 },
    { status: 'Unmapped TB', tbAmount: 0, xtelAmount: 182000, variance: 182000 },
    { status: 'Unmapped XTEL', tbAmount: 0, xtelAmount: 95000, variance: 95000 },
  ];

  checklistItems: ChecklistItem[] = [
    { step: '1. TB Data Ingestion Complete', status: 'green', owner: 'Data Eng' },
    { step: '2. XTEL Data Ingestion Complete', status: 'green', owner: 'Data Eng' },
    { step: '3. Three-Way Reconciliation Passed', status: 'green', owner: 'Risk Mgmt' },
    { step: '4. DQ Score >= 85%', status: 'green', owner: 'Data Gov' },
    { step: '5. Variance <= 0.1% Threshold', status: 'amber', owner: 'Treasury' },
    { step: '6. Run Launch Authorised', status: 'amber', owner: 'CRO' },
  ];

  reconVarianceData: ReconVarianceItem[] = [
    { category: 'Cash & Cash Eq.', variance: 0.02 },
    { category: 'Loans & Advances', variance: 0.08 },
    { category: 'Investment Securities', variance: 0.15 },
    { category: 'Deposits', variance: 0.03 },
    { category: 'Borrowings', variance: 0.12 },
    { category: 'Off-Balance Sheet', variance: 0.21 },
  ];

  runStatusData: RunStatusItem[] = [
    { run: 'EOD-2026-06-26', timestamp: '21:32', status: 'green' },
    { run: 'EOD-2026-06-25', timestamp: '21:28', status: 'green' },
    { run: 'EOD-2026-06-24', timestamp: '22:05', status: 'amber' },
    { run: 'EOD-2026-06-23', timestamp: '21:15', status: 'green' },
    { run: 'EOD-2026-06-22', timestamp: '23:30', status: 'red' },
    { run: 'EOD-2026-06-21', timestamp: '22:10', status: 'amber' },
  ];

  // ==========================================================================
  // Tab 7 Data: Instrument Modeling Workbench
  // ==========================================================================
  dealAttributes: DealAttribute[] = [
    { attribute: 'Notional', value: '€10,000,000', dealId: 'DL-2026-001' },
    { attribute: 'Maturity', value: '5 Years (2031-06-26)', dealId: 'DL-2026-001' },
    { attribute: 'Coupon', value: 'Fixed 4.25% p.a.', dealId: 'DL-2026-001' },
    { attribute: 'Amortisation', value: 'Bullet (full at maturity)', dealId: 'DL-2026-001' },
    { attribute: 'Collateral', value: 'Ghana Government Bond (AAA)', dealId: 'DL-2026-001' },
    { attribute: 'Prepayment Option', value: 'None (non-callable)', dealId: 'DL-2026-001' },
  ];

  strategyComparison: StrategyComparisonItem[] = [
    { strategy: 'Hold to Maturity', npv: 0, duration: 4.25, convexity: 18.5 },
    { strategy: 'Pay Fixed Swap (5Y)', npv: 125000, duration: 2.10, convexity: 8.2 },
    { strategy: 'Receive Floating (3M)', npv: 95000, duration: 0.75, convexity: 2.1 },
    { strategy: 'Bond Futures Hedge', npv: 72000, duration: 3.80, convexity: 15.3 },
    { strategy: 'Swaption Collar', npv: 158000, duration: 1.50, convexity: 5.7 },
  ];

  cashflowProjections: CashflowProjectionItem[] = [
    { period: 'Y1', fixedRate: 425, floatingRate: 380 },
    { period: 'Y2', fixedRate: 425, floatingRate: 410 },
    { period: 'Y3', fixedRate: 425, floatingRate: 445 },
    { period: 'Y4', fixedRate: 425, floatingRate: 470 },
    { period: 'Y5', fixedRate: 10425, floatingRate: 10520 },
  ];

  rateScenarioData: RateScenarioItem[] = [
    { scenario: '+100bps Parallel', curve: 'Par Yield', impact: -380 },
    { scenario: '+200bps Parallel', curve: 'Par Yield', impact: -720 },
    { scenario: '+100bps Short-end', curve: '2Y-5Y Steep', impact: -210 },
    { scenario: '-50bps Parallel', curve: 'Par Yield', impact: 195 },
    { scenario: '+100bps Long-end', curve: '10Y+ Bear', impact: -140 },
  ];

  // ==========================================================================
  // Chart instances
  // ==========================================================================
  private charts: Chart[] = [];

  // ==========================================================================
  // Lifecycle
  // ==========================================================================
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.destroyCharts();
      this.initIngestionTabCharts();
    }, 100);
  }

  onTabChange(index: number): void {
    this.destroyCharts();
    this.activeTab = index;
    setTimeout(() => {
      this.renderChartsForActiveTab();
    }, 100);
  }

  private destroyCharts(): void {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  }

  private renderChartsForActiveTab(): void {
    switch (this.activeTab) {
      case 0: this.initIngestionTabCharts(); break;
      case 1: this.initMasterDataTabCharts(); break;
      case 2: this.initDqTabCharts(); break;
      case 3: this.initAlcoTabCharts(); break;
      case 4: this.initAuditTabCharts(); break;
      case 5: this.initControlTowerTabCharts(); break;
      case 6: this.initModelingTabCharts(); break;
    }
  }

  // ==========================================================================
  // Tab 1 Charts: Data Ingestion Pipeline
  // ==========================================================================
  private initIngestionTabCharts(): void {
    // Feed Health bar chart
    const feedCanvas = this.feedHealthCanvas?.nativeElement;
    if (feedCanvas) {
      const chart = new Chart(feedCanvas, {
        type: 'bar',
        data: {
          labels: this.feedHealthData.map(d => d.name),
          datasets: [{
            label: 'Success Rate (%)',
            data: this.feedHealthData.map(d => d.successRate),
            backgroundColor: this.feedHealthData.map(d =>
              d.successRate >= 99.0 ? 'rgba(34, 197, 94, 0.8)' :
              d.successRate >= 97.0 ? 'rgba(250, 204, 21, 0.8)' :
              'rgba(239, 68, 68, 0.8)'
            ),
            borderColor: this.feedHealthData.map(d =>
              d.successRate >= 99.0 ? 'rgb(34, 197, 94)' :
              d.successRate >= 97.0 ? 'rgb(250, 204, 21)' :
              'rgb(239, 68, 68)'
            ),
            borderWidth: 1,
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
              min: 95,
              max: 100,
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }

    // Ingestion Timeline line chart
    const timelineCanvas = this.ingestionTimelineCanvas?.nativeElement;
    if (timelineCanvas) {
      const chart = new Chart(timelineCanvas, {
        type: 'line',
        data: {
          labels: this.ingestionTimeline.map(d => d.date),
          datasets: [
            {
              label: 'Actual (minutes)',
              data: this.ingestionTimeline.map(d => d.actual),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 5,
              pointBackgroundColor: 'rgb(59, 130, 246)',
            },
            {
              label: 'Target (minutes)',
              data: this.ingestionTimeline.map(d => d.target),
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
              min: 0,
              title: { display: true, text: 'Duration (min)' },
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }

  // ==========================================================================
  // Tab 2 Charts: Master Data Management
  // ==========================================================================
  private initMasterDataTabCharts(): void {
    // Classification donut chart
    const donutCanvas = this.classificationDonutCanvas?.nativeElement;
    if (donutCanvas) {
      const chart = new Chart(donutCanvas, {
        type: 'doughnut',
        data: {
          labels: this.assetClassifications.map(c => c.category),
          datasets: [{
            data: this.assetClassifications.map(c => c.amount),
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(59, 130, 246)',
              'rgb(239, 68, 68)',
            ],
            borderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
                  const val = ctx.parsed as unknown as number;
                  const pct = ((val / total) * 100).toFixed(1);
                  return `${ctx.label}: €${val.toLocaleString()}M (${pct}%)`;
                }
              }
            }
          }
        }
      });
      this.charts.push(chart);
    }

    // Encumbrance pie chart
    const pieCanvas = this.encumbrancePieCanvas?.nativeElement;
    if (pieCanvas) {
      const chart = new Chart(pieCanvas, {
        type: 'pie',
        data: {
          labels: this.encumbranceData.map(e => e.label),
          datasets: [{
            data: this.encumbranceData.map(e => e.value),
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(168, 85, 247, 0.8)',
              'rgba(249, 115, 22, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(59, 130, 246)',
              'rgb(168, 85, 247)',
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
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
                  const val = ctx.parsed as unknown as number;
                  const pct = ((val / total) * 100).toFixed(1);
                  return `${ctx.label}: €${val.toLocaleString()}M (${pct}%)`;
                }
              }
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }

  // ==========================================================================
  // Tab 3 Charts: Data Quality Scorecard
  // ==========================================================================
  private initDqTabCharts(): void {
    // DQ Score gauge (doughnut with single arc)
    const gaugeCanvas = this.dqGaugeCanvas?.nativeElement;
    if (gaugeCanvas) {
      const overallScore = this.dqDimensionScores.reduce((s, d) => s + d.score, 0) / this.dqDimensionScores.length;
      const chart = new Chart(gaugeCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Current Score', 'Remaining'],
          datasets: [{
            data: [overallScore, 100 - overallScore],
            backgroundColor: [
              overallScore >= 90 ? 'rgba(34, 197, 94, 0.8)' :
              overallScore >= 85 ? 'rgba(250, 204, 21, 0.8)' :
              'rgba(239, 68, 68, 0.8)',
              'rgba(0, 0, 0, 0.05)',
            ],
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          }
        },
        plugins: [{
          id: 'gaugeCenterText',
          afterDraw: (chart) => {
            const { width, height } = chart;
            const ctx = chart.ctx;
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 42px monospace';
            ctx.fillStyle = overallScore >= 90 ? '#22c55e' : overallScore >= 85 ? '#eab308' : '#ef4444';
            ctx.fillText(`${overallScore.toFixed(0)}%`, width / 2, height / 2 - 10);
            ctx.font = '14px sans-serif';
            ctx.fillStyle = '#6b7280';
            ctx.fillText('Overall DQ Score', width / 2, height / 2 + 30);
            ctx.restore();
          }
        }]
      });
      this.charts.push(chart);
    }

    // DQ Trend line chart
    const trendCanvas = this.dqTrendCanvas?.nativeElement;
    if (trendCanvas) {
      const chart = new Chart(trendCanvas, {
        type: 'line',
        data: {
          labels: this.dqTrendData.map(d => d.month),
          datasets: [
            {
              label: 'Overall DQ Score',
              data: this.dqTrendData.map(d => d.score),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: (ctx) => {
                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
                gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
                return gradient;
              },
              fill: true,
              tension: 0.3,
              pointRadius: 5,
              pointBackgroundColor: 'rgb(59, 130, 246)',
              borderWidth: 3,
            },
            {
              label: '85% Warning Threshold',
              data: this.dqTrendData.map(() => 85),
              borderColor: 'rgb(250, 204, 21)',
              borderDash: [6, 4],
              borderWidth: 2,
              pointRadius: 0,
              fill: false,
            },
            {
              label: '70% Critical Threshold',
              data: this.dqTrendData.map(() => 70),
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
              min: 65,
              max: 100,
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }

  // ==========================================================================
  // Tab 4 Charts: ALCO Workflow Engine
  // ==========================================================================
  private initAlcoTabCharts(): void {
    // Agenda Priority pie chart
    const agendaCanvas = this.agendaPriorityCanvas?.nativeElement;
    if (agendaCanvas) {
      const priorityCounts = [0, 0, 0];
      this.alcoAgendaData.forEach(a => {
        if (a.priority === 1) priorityCounts[0]++;
        else if (a.priority === 2) priorityCounts[1]++;
        else priorityCounts[2]++;
      });

      const chart = new Chart(agendaCanvas, {
        type: 'pie',
        data: {
          labels: ['High Priority', 'Medium Priority', 'Low Priority'],
          datasets: [{
            data: priorityCounts,
            backgroundColor: [
              'rgba(239, 68, 68, 0.8)',
              'rgba(250, 204, 21, 0.8)',
              'rgba(34, 197, 94, 0.8)',
            ],
            borderColor: [
              'rgb(239, 68, 68)',
              'rgb(250, 204, 21)',
              'rgb(34, 197, 94)',
            ],
            borderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
          }
        }
      });
      this.charts.push(chart);
    }

    // Action Status bar chart
    const statusCanvas = this.actionStatusCanvas?.nativeElement;
    if (statusCanvas) {
      const chart = new Chart(statusCanvas, {
        type: 'bar',
        data: {
          labels: this.alcoActionStatusData.map(a => a.status),
          datasets: [{
            label: 'Action Items',
            data: this.alcoActionStatusData.map(a => a.count),
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(156, 163, 175, 0.8)',
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(59, 130, 246)',
              'rgb(239, 68, 68)',
              'rgb(156, 163, 175)',
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
              ticks: { stepSize: 1 },
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }

  // ==========================================================================
  // Tab 5 Charts: Audit Trail & Data Lineage
  // ==========================================================================
  private initAuditTabCharts(): void {
    // Audit Activity by Type bar chart
    const auditCanvas = this.auditActivityCanvas?.nativeElement;
    if (auditCanvas) {
      const chart = new Chart(auditCanvas, {
        type: 'bar',
        data: {
          labels: this.auditActivityData.map(a => a.type),
          datasets: [{
            label: 'Count',
            data: this.auditActivityData.map(a => a.count),
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(249, 115, 22, 0.8)',
              'rgba(34, 197, 94, 0.8)',
              'rgba(168, 85, 247, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ],
            borderColor: [
              'rgb(59, 130, 246)',
              'rgb(249, 115, 22)',
              'rgb(34, 197, 94)',
              'rgb(168, 85, 247)',
              'rgb(239, 68, 68)',
            ],
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { stepSize: 5 },
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

    // Data Freshness line chart
    const freshnessCanvas = this.dataFreshnessCanvas?.nativeElement;
    if (freshnessCanvas) {
      const chart = new Chart(freshnessCanvas, {
        type: 'line',
        data: {
          labels: this.dataFreshnessData.map(d => d.date),
          datasets: [{
            label: 'Data Age (hours)',
            data: this.dataFreshnessData.map(d => d.age),
            borderColor: 'rgb(249, 115, 22)',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            fill: true,
            tension: 0.3,
            pointBackgroundColor: (ctx) => {
              const val = ctx.dataset.data[ctx.dataIndex] as number;
              return val > 2 ? 'rgb(239, 68, 68)' : 'rgb(249, 115, 22)';
            },
            pointBorderColor: (ctx) => {
              const val = ctx.dataset.data[ctx.dataIndex] as number;
              return val > 2 ? 'rgb(239, 68, 68)' : 'rgb(249, 115, 22)';
            },
            pointRadius: (ctx) => {
              const val = ctx.dataset.data[ctx.dataIndex] as number;
              return val > 2 ? 7 : 4;
            },
            borderWidth: 2,
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
              min: 0,
              title: { display: true, text: 'Hours' },
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }

  // ==========================================================================
  // Tab 6 Charts: ALM Control Tower
  // ==========================================================================
  private initControlTowerTabCharts(): void {
    // Reconciliation Variance bar chart
    const reconCanvas = this.reconVarianceCanvas?.nativeElement;
    if (reconCanvas) {
      const chart = new Chart(reconCanvas, {
        type: 'bar',
        data: {
          labels: this.reconVarianceData.map(r => r.category),
          datasets: [{
            label: 'Variance (%)',
            data: this.reconVarianceData.map(r => r.variance),
            backgroundColor: this.reconVarianceData.map(r =>
              r.variance <= 0.05 ? 'rgba(34, 197, 94, 0.8)' :
              r.variance <= 0.10 ? 'rgba(250, 204, 21, 0.8)' :
              r.variance <= 0.20 ? 'rgba(249, 115, 22, 0.8)' :
              'rgba(239, 68, 68, 0.8)'
            ),
            borderColor: this.reconVarianceData.map(r =>
              r.variance <= 0.05 ? 'rgb(34, 197, 94)' :
              r.variance <= 0.10 ? 'rgb(250, 204, 21)' :
              r.variance <= 0.20 ? 'rgb(249, 115, 22)' :
              'rgb(239, 68, 68)'
            ),
            borderWidth: 1,
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
              title: { display: true, text: 'Variance %' },
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }

    // Run Status Timeline chart
    const runCanvas = this.runStatusCanvas?.nativeElement;
    if (runCanvas) {
      const statusValues = this.runStatusData.map(r => {
        switch (r.status) {
          case 'green': return 3;
          case 'amber': return 2;
          case 'red': return 1;
          default: return 0;
        }
      });
      const chart = new Chart(runCanvas, {
        type: 'line',
        data: {
          labels: this.runStatusData.map(r => r.run),
          datasets: [{
            label: 'Run Status',
            data: statusValues,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.2,
            pointRadius: 8,
            pointBackgroundColor: this.runStatusData.map(r => {
              switch (r.status) {
                case 'green': return 'rgb(34, 197, 94)';
                case 'amber': return 'rgb(250, 204, 21)';
                case 'red': return 'rgb(239, 68, 68)';
                default: return 'rgb(156, 163, 175)';
              }
            }),
            pointBorderColor: this.runStatusData.map(r => {
              switch (r.status) {
                case 'green': return 'rgb(34, 197, 94)';
                case 'amber': return 'rgb(250, 204, 21)';
                case 'red': return 'rgb(239, 68, 68)';
                default: return 'rgb(156, 163, 175)';
              }
            }),
            pointBorderWidth: 2,
            borderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const item = this.runStatusData[ctx.dataIndex];
                  return `Run: ${item.run} | Time: ${item.timestamp} | Status: ${item.status}`;
                }
              }
            }
          },
          scales: {
            y: {
              min: 0,
              max: 4,
              ticks: {
                stepSize: 1,
                callback: (value) => {
                  switch (value) {
                    case 1: return 'Failed';
                    case 2: return 'Warning';
                    case 3: return 'Success';
                    default: return '';
                  }
                }
              },
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }

  // ==========================================================================
  // Tab 7 Charts: Instrument Modeling Workbench
  // ==========================================================================
  private initModelingTabCharts(): void {
    // Cashflow Projection chart
    const cashflowCanvas = this.cashflowCanvas?.nativeElement;
    if (cashflowCanvas) {
      const chart = new Chart(cashflowCanvas, {
        type: 'bar',
        data: {
          labels: this.cashflowProjections.map(c => c.period),
          datasets: [
            {
              label: 'Fixed Rate (€K)',
              data: this.cashflowProjections.map(c => c.fixedRate),
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1,
            },
            {
              label: 'Floating Rate (€K)',
              data: this.cashflowProjections.map(c => c.floatingRate),
              backgroundColor: 'rgba(249, 115, 22, 0.8)',
              borderColor: 'rgb(249, 115, 22)',
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
              beginAtZero: true,
              title: { display: true, text: 'Cashflow (€K)' },
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }

    // Rate Scenario Comparison chart
    const rateCanvas = this.rateScenarioCanvas?.nativeElement;
    if (rateCanvas) {
      const chart = new Chart(rateCanvas, {
        type: 'bar',
        data: {
          labels: this.rateScenarioData.map(r => r.scenario),
          datasets: [{
            label: 'NPV Impact (€K)',
            data: this.rateScenarioData.map(r => r.impact),
            backgroundColor: this.rateScenarioData.map(r =>
              r.impact >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
            ),
            borderColor: this.rateScenarioData.map(r =>
              r.impact >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
            ),
            borderWidth: 1,
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
              title: { display: true, text: 'NPV Impact (€K)' },
              grid: { color: 'rgba(0,0,0,0.06)' },
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }
}
