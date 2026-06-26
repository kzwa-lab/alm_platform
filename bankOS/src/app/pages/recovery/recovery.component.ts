import { Component, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import {
  TabBarComponent,
  FeatureCardComponent,
  StatusBadgeComponent,
  GhanaRegulatoryDetailComponent
} from '../../shared/index';

interface PlanVersion {
  version: string;
  date: string;
  status: string;
  approver: string;
  bogStatus: string;
}

interface PlanSection {
  section: string;
  status: string;
  lastUpdated: string;
}

interface RecoveryOption {
  option: string;
  description: string;
  impact: string;
  timeline: string;
  status: string;
}

interface ImpactQuantification {
  option: string;
  lcrImpact: string;
  cet1Impact: string;
  niiImpact: string;
  timeline: string;
}

interface TriggerMatrixRow {
  trigger: string;
  threshold: string;
  current: string;
  status: string;
}

interface BreachLogRow {
  date: string;
  trigger: string;
  value: string;
  severity: string;
  action: string;
}

interface KpiSummaryRow {
  metric: string;
  current: string;
  target: string;
  status: string;
}

@Component({
  selector: 'app-recovery',
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
          <span class="text-neutral-700 dark:text-neutral-300">Recovery Planning</span>
        </div>
      </header>

      <main class="flex-1 p-6 overflow-y-auto">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Recovery Planning Module</h2>

          <tab-bar [tabs]="tabs" [activeIndex]="activeTab" (tabChange)="onTabChange($event)"></tab-bar>

          <!-- ============================================================ -->
          <!-- TAB 1: Recovery Plan Repository                              -->
          <!-- ============================================================ -->
          @if (activeTab === 0) {
            <feature-card
              title="Recovery Plan Repository"
              description="Central repository for recovery planning documentation, versioning, and regulatory submissions under BoG Recovery Planning Directive."
              [userStories]="[
                'As Recovery Planning Officer, I need to maintain version-controlled recovery plans with full audit trail for BoG submission.',
                'As CRO, I need to review and approve plan sections with quantified impact analysis before Board Risk Committee approval.',
                'As Compliance Officer, I need to verify that all recovery options are documented with quantified impact and annual self-assessment is completed.',
                'As Board Risk Committee Member, I need to review the consolidated recovery plan and submission timeline for BoG compliance.'
              ]"
            ></feature-card>

            <ghana-regulatory-detail detail="BoG Recovery Planning Directive: Plan to BoG by Dec 31 annually. Board Risk Committee approval required. All recovery options must have quantified impact. Annual self-assessment and gap analysis."></ghana-regulatory-detail>

            <!-- Table 1: Plan Version History -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Plan Version History</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Version</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Date</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Approver</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">BoG Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of planVersions; track row.version) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-mono text-neutral-700 dark:text-neutral-200 font-medium">{{ row.version }}</td>
                        <td class="p-3 text-neutral-600 dark:text-neutral-300">{{ row.date }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.status" [label]="row.status"></status-badge>
                        </td>
                        <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.approver }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.bogStatus" [label]="row.bogStatus"></status-badge>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Plan Sections -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Plan Sections</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Section</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of planSections; track row.section) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.section }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.status" [label]="row.status"></status-badge>
                        </td>
                        <td class="p-3 text-neutral-600 dark:text-neutral-300">{{ row.lastUpdated }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-6 mb-6">
              <!-- Chart 1: Submission Timeline -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Submission Timeline</h3>
                <div class="relative" style="height:280px">
                  <canvas #submissionTimelineCanvas></canvas>
                </div>
              </div>
              <!-- Chart 2: Plan Status donut -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Plan Status Distribution</h3>
                <div class="relative" style="height:280px">
                  <canvas #planStatusDonutCanvas></canvas>
                </div>
              </div>
            </div>
          }

          <!-- ============================================================ -->
          <!-- TAB 2: Recovery Options Menu                                -->
          <!-- ============================================================ -->
          @if (activeTab === 1) {
            <feature-card
              title="Recovery Options Menu"
              description="Comprehensive catalogue of recovery options with quantified impact analysis, implementation timelines, and regulatory assessments."
              [userStories]="[
                'As Recovery Planning Officer, I need to maintain a complete menu of recovery options with quantified impact on LCR, CET1, and NII.',
                'As CRO, I need to assess the feasibility and effectiveness of each recovery option under different stress scenarios.',
                'As ALCO Member, I need to understand the implementation timeline and interdependencies between recovery options.'
              ]"
            ></feature-card>

            <ghana-regulatory-detail detail="BoG Recovery Planning Directive: All recovery options must have quantified impact on capital, liquidity, and profitability. Options must be credible and implementable within specified timeframes. Annual review and update required."></ghana-regulatory-detail>

            <!-- Table 1: Recovery Options -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Recovery Options</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Option</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Description</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Impact</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Timeline</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of recoveryOptions; track row.option) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.option }}</td>
                        <td class="p-3 text-neutral-600 dark:text-neutral-300 max-w-xs">{{ row.description }}</td>
                        <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.impact }}</td>
                        <td class="p-3 text-neutral-600 dark:text-neutral-300">{{ row.timeline }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.status" [label]="row.status"></status-badge>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-6 mb-6">
              <!-- Chart 1: Option Impact comparison bar -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Option Impact Comparison</h3>
                <div class="relative" style="height:280px">
                  <canvas #optionImpactCanvas></canvas>
                </div>
              </div>
              <!-- Chart 2: Implementation Timeline Gantt-style -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Implementation Timeline</h3>
                <div class="relative" style="height:280px">
                  <canvas #implementationTimelineCanvas></canvas>
                </div>
              </div>
            </div>

            <!-- Table 2: Impact Quantification -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Impact Quantification Matrix</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Option</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">LCR Impact</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">CET1 Impact</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">NII Impact</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Timeline</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of impactQuantifications; track row.option) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.option }}</td>
                        <td class="p-3 text-right font-mono" [ngClass]="parseFloat(row.lcrImpact) >= 0 ? 'text-success-600' : 'text-alert-600'">{{ row.lcrImpact }}</td>
                        <td class="p-3 text-right font-mono" [ngClass]="parseFloat(row.cet1Impact) >= 0 ? 'text-success-600' : 'text-alert-600'">{{ row.cet1Impact }}</td>
                        <td class="p-3 text-right font-mono" [ngClass]="parseFloat(row.niiImpact) >= 0 ? 'text-success-600' : 'text-alert-600'">{{ row.niiImpact }}</td>
                        <td class="p-3 text-neutral-600 dark:text-neutral-300">{{ row.timeline }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- ============================================================ -->
          <!-- TAB 3: Quantitative Indicators & Triggers                   -->
          <!-- ============================================================ -->
          @if (activeTab === 2) {
            <feature-card
              title="Quantitative Indicators & Triggers"
              description="Early warning indicators and trigger matrix for recovery plan activation under BoG guidelines."
              [userStories]="[
                'As CRO, I need to monitor quantitative triggers against current metrics to know when recovery plan activation is required.',
                'As Recovery Planning Officer, I need to maintain the trigger matrix and breach log with full audit trail.',
                'As ALCO Member, I need to see breach trends and severity to assess the urgency of recovery measures.'
              ]"
            ></feature-card>

            <ghana-regulatory-detail detail="BoG Recovery Planning Directive: Recovery plan triggers must include CET1 < 7%, LCR < 100%, NSFR < 100%. Additional entity-specific triggers based on risk profile. Breach notification to BoG within 10 business days."></ghana-regulatory-detail>

            <!-- Table 1: Trigger Matrix -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Trigger Matrix</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Trigger</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Threshold</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Current</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of triggerMatrix; track row.trigger) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.trigger }}</td>
                        <td class="p-3 text-right font-mono text-neutral-500 dark:text-neutral-400">{{ row.threshold }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.current }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.status" [label]="row.status"></status-badge>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-6 mb-6">
              <!-- Chart 1: Trigger Status radar -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Trigger Status Radar</h3>
                <div class="relative" style="height:280px">
                  <canvas #triggerRadarCanvas></canvas>
                </div>
              </div>
              <!-- Chart 2: Breach Trend line -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Breach Trend</h3>
                <div class="relative" style="height:280px">
                  <canvas #breachTrendCanvas></canvas>
                </div>
              </div>
            </div>

            <!-- Table 2: Breach Log -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Breach Log</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Date</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Trigger</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Value</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Severity</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Action Taken</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of breachLog; track row.date) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 text-neutral-600 dark:text-neutral-300">{{ row.date }}</td>
                        <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.trigger }}</td>
                        <td class="p-3 text-right font-mono text-alert-600">{{ row.value }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.severity" [label]="row.severity"></status-badge>
                        </td>
                        <td class="p-3 text-neutral-600 dark:text-neutral-300 max-w-xs">{{ row.action }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- ============================================================ -->
          <!-- TAB 4: Recovery MIS Dashboard                               -->
          <!-- ============================================================ -->
          @if (activeTab === 3) {
            <feature-card
              title="Recovery MIS Dashboard"
              description="Management Information System dashboard for executive oversight of recovery readiness, trigger status, and key performance indicators."
              [userStories]="[
                'As CRO, I need an executive dashboard showing recovery readiness, trigger status, and key metrics at a glance.',
                'As CEO, I need to see the overall recovery preparedness score and any immediate action items.',
                'As Board Risk Committee Member, I need to review recovery readiness metrics for governance reporting.'
              ]"
            ></feature-card>

            <ghana-regulatory-detail detail="BoG Recovery Planning Directive: Quarterly recovery plan review by Board Risk Committee. MIS dashboard must include trigger status, recovery option availability, and implementation readiness scores."></ghana-regulatory-detail>

            <!-- Table 1: Executive KPI Summary -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Executive KPI Summary</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Metric</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Current</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Target</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of kpiSummary; track row.metric) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.metric }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.current }}</td>
                        <td class="p-3 text-right font-mono text-neutral-500 dark:text-neutral-400">{{ row.target }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.status" [label]="row.status"></status-badge>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-6 mb-6">
              <!-- Chart 1: Recovery Readiness gauge -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Recovery Readiness Score</h3>
                <div class="relative" style="height:280px">
                  <canvas #readinessGaugeCanvas></canvas>
                </div>
              </div>
              <!-- Chart 2: Trigger Breach timeline -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Trigger Breach Timeline</h3>
                <div class="relative" style="height:280px">
                  <canvas #triggerBreachTimelineCanvas></canvas>
                </div>
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class RecoveryComponent implements AfterViewInit {
  // --- Tab state ---
  tabs = ['Recovery Plan Repository', 'Recovery Options Menu', 'Quantitative Indicators & Triggers', 'Recovery MIS Dashboard'];
  activeTab = 0;

  // --- Chart refs ---
  @ViewChild('submissionTimelineCanvas') submissionTimelineCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('planStatusDonutCanvas') planStatusDonutCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('optionImpactCanvas') optionImpactCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('implementationTimelineCanvas') implementationTimelineCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('triggerRadarCanvas') triggerRadarCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('breachTrendCanvas') breachTrendCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('readinessGaugeCanvas') readinessGaugeCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('triggerBreachTimelineCanvas') triggerBreachTimelineCanvasRef!: ElementRef<HTMLCanvasElement>;

  private chartInstances: Chart[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.renderCharts();
  }

  onTabChange(index: number) {
    this.activeTab = index;
    this.cdr.detectChanges();
    this.destroyCharts();
    setTimeout(() => this.renderCharts(), 50);
  }

  private destroyCharts() {
    for (const c of this.chartInstances) {
      c.destroy();
    }
    this.chartInstances = [];
  }

  private renderCharts() {
    if (this.activeTab === 0) {
      this.renderSubmissionTimelineChart();
      this.renderPlanStatusDonutChart();
    } else if (this.activeTab === 1) {
      this.renderOptionImpactChart();
      this.renderImplementationTimelineChart();
    } else if (this.activeTab === 2) {
      this.renderTriggerRadarChart();
      this.renderBreachTrendChart();
    } else if (this.activeTab === 3) {
      this.renderReadinessGaugeChart();
      this.renderTriggerBreachTimelineChart();
    }
  }

  // ===== HELPER =====
  parseFloat(val: string): number {
    return parseFloat(val.replace('%', '').replace('+', ''));
  }

  // ===== TAB 1: Recovery Plan Repository Charts =====

  private renderSubmissionTimelineChart() {
    const el = this.submissionTimelineCanvasRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Plan Progress (%)',
          data: [15, 25, 40, 50, 55, 65, 70, 75, 80, 85, 95, 100],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: '#3b82f6',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { callback: (val) => val + '%' }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private renderPlanStatusDonutChart() {
    const el = this.planStatusDonutCanvasRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'doughnut',
      data: {
        labels: ['Approved', 'In Review', 'Draft', 'Submitted to BoG'],
        datasets: [{
          data: [2, 2, 1, 3],
          backgroundColor: ['#10b981', '#f59e0b', '#6b7280', '#3b82f6'],
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } }
        },
        cutout: '55%',
      }
    });
    this.chartInstances.push(chart);
  }

  // ===== TAB 2: Recovery Options Menu Charts =====

  private renderOptionImpactChart() {
    const el = this.optionImpactCanvasRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['Dividend Cut', 'Asset Sales', 'Capital Issuance', 'Deposit Rate Inc', 'Balance Sheet Contr'],
        datasets: [
          {
            label: 'LCR Impact (pp)',
            data: [5, 15, 8, 12, 10],
            backgroundColor: 'rgba(59,130,246,0.7)',
            borderRadius: 4,
          },
          {
            label: 'CET1 Impact (pp)',
            data: [0.5, 0.3, 2.5, 0, 0.2],
            backgroundColor: 'rgba(16,185,129,0.7)',
            borderRadius: 4,
          },
          {
            label: 'NII Impact (GHS M)',
            data: [12, -5, -8, -15, -20],
            backgroundColor: 'rgba(239,68,68,0.7)',
            borderRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private renderImplementationTimelineChart() {
    const el = this.implementationTimelineCanvasRef?.nativeElement;
    if (!el) return;
    // Gantt-style horizontal bar chart
    const chart = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['Dividend Cut', 'Asset Sales', 'Capital Issuance', 'Deposit Rate Inc', 'Balance Sheet Contr'],
        datasets: [
          {
            label: 'Preparation',
            data: [1, 2, 3, 1, 2],
            backgroundColor: 'rgba(107,114,128,0.5)',
            borderRadius: 0,
          },
          {
            label: 'Implementation',
            data: [1, 3, 4, 2, 4],
            backgroundColor: 'rgba(59,130,246,0.7)',
            borderRadius: 0,
          },
          {
            label: 'Monitoring',
            data: [2, 3, 3, 2, 3],
            backgroundColor: 'rgba(16,185,129,0.7)',
            borderRadius: 0,
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } }
        },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
            title: { display: true, text: 'Months' },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          y: {
            stacked: true,
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  // ===== TAB 3: Quantitative Indicators & Triggers Charts =====

  private renderTriggerRadarChart() {
    const el = this.triggerRadarCanvasRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'radar',
      data: {
        labels: ['CET1 < 7%', 'LCR < 100%', 'NSFR < 100%', 'Leverage < 3%', 'NIM < 1%'],
        datasets: [
          {
            label: 'Current Values',
            data: [8.5, 118, 112, 5.2, 2.8],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.2)',
            pointBackgroundColor: '#3b82f6',
            pointRadius: 4,
          },
          {
            label: 'Threshold',
            data: [7, 100, 100, 3, 1],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.1)',
            borderDash: [5, 5],
            pointBackgroundColor: '#ef4444',
            pointRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } }
        },
        scales: {
          r: {
            beginAtZero: true,
            ticks: { stepSize: 20, font: { size: 9 } },
            grid: { color: 'rgba(0,0,0,0.05)' }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private renderBreachTrendChart() {
    const el = this.breachTrendCanvasRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'line',
      data: {
        labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'],
        datasets: [
          {
            label: 'Breach Count',
            data: [3, 5, 2, 4, 6, 3, 1, 2],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: '#ef4444',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { stepSize: 1 }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  // ===== TAB 4: Recovery MIS Dashboard Charts =====

  private renderReadinessGaugeChart() {
    const el = this.readinessGaugeCanvasRef?.nativeElement;
    if (!el) return;
    const readinessScore = 82;
    const config: any = {
      type: 'doughnut',
      data: {
        labels: ['Score', 'Remaining'],
        datasets: [{
          data: [readinessScore, 100 - readinessScore],
          backgroundColor: ['#10b981', '#e5e7eb'],
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      },
      plugins: [{
        id: 'gaugeCenterText',
        afterDraw: (chart: Chart) => {
          const { ctx, width, height } = chart;
          ctx.save();
          const centerX = width / 2;
          const centerY = height / 2;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = 'bold 36px monospace';
          ctx.fillStyle = '#10b981';
          ctx.fillText(readinessScore + '%', centerX, centerY - 6);
          ctx.font = '12px sans-serif';
          ctx.fillStyle = '#6b7280';
          ctx.fillText('READY', centerX, centerY + 20);
          ctx.restore();
        }
      }]
    };
    const chart = new Chart(el, config);
    this.chartInstances.push(chart);
  }

  private renderTriggerBreachTimelineChart() {
    const el = this.triggerBreachTimelineCanvasRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'CET1 Breach',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(59,130,246,0.7)',
            borderRadius: 2,
          },
          {
            label: 'LCR Breach',
            data: [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(16,185,129,0.7)',
            borderRadius: 2,
          },
          {
            label: 'NSFR Breach',
            data: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(245,158,11,0.7)',
            borderRadius: 2,
          },
          {
            label: 'Leverage Breach',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(239,68,68,0.7)',
            borderRadius: 2,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } }
        },
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { stepSize: 1 }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  // ===== DATA =====

  planVersions: PlanVersion[] = [
    { version: 'v2026.1', date: '15-Oct-2026', status: 'draft', approver: 'Pending BRC', bogStatus: 'amber' },
    { version: 'v2025.2', date: '01-Dec-2025', status: 'compliant', approver: 'Board Risk Committee', bogStatus: 'compliant' },
    { version: 'v2025.1', date: '30-Jun-2025', status: 'compliant', approver: 'Board Risk Committee', bogStatus: 'compliant' },
    { version: 'v2024.2', date: '01-Dec-2024', status: 'compliant', approver: 'Board Risk Committee', bogStatus: 'compliant' },
  ];

  planSections: PlanSection[] = [
    { section: 'Executive Summary', status: 'compliant', lastUpdated: '15-Oct-2026' },
    { section: 'Recovery Options', status: 'compliant', lastUpdated: '12-Oct-2026' },
    { section: 'Trigger Framework', status: 'compliant', lastUpdated: '10-Oct-2026' },
    { section: 'Governance', status: 'warning', lastUpdated: '08-Oct-2026' },
    { section: 'Communication Plan', status: 'draft', lastUpdated: '05-Oct-2026' },
  ];

  recoveryOptions: RecoveryOption[] = [
    { option: 'Dividend Cut', description: 'Suspend dividend payments to conserve capital and improve CET1 ratio.', impact: '+0.5% CET1, +€12M NII', timeline: '1-3 months', status: 'compliant' },
    { option: 'Asset Sales', description: 'Sale of non-core assets and securities portfolio to generate liquidity.', impact: '+15% LCR, +€150M liquidity', timeline: '3-6 months', status: 'compliant' },
    { option: 'Capital Issuance', description: 'Rights issue or private placement of common equity Tier 1 capital.', impact: '+2.5% CET1, +€500M capital', timeline: '6-12 months', status: 'compliant' },
    { option: 'Deposit Rate Increase', description: 'Increase deposit rates to attract retail and wholesale deposits.', impact: '+12% LCR, -€15M NII', timeline: '1-3 months', status: 'warning' },
    { option: 'Balance Sheet Contraction', description: 'Reduce lending and allow assets to run off to improve capital ratios.', impact: '+10% LCR, -€20M NII', timeline: '6-12 months', status: 'warning' },
  ];

  impactQuantifications: ImpactQuantification[] = [
    { option: 'Dividend Cut', lcrImpact: '+0%', cet1Impact: '+0.5%', niiImpact: '+€12M', timeline: '1-3 months' },
    { option: 'Asset Sales', lcrImpact: '+15%', cet1Impact: '+0.3%', niiImpact: '-€5M', timeline: '3-6 months' },
    { option: 'Capital Issuance', lcrImpact: '+8%', cet1Impact: '+2.5%', niiImpact: '-€8M', timeline: '6-12 months' },
    { option: 'Deposit Rate Increase', lcrImpact: '+12%', cet1Impact: '+0%', niiImpact: '-€15M', timeline: '1-3 months' },
    { option: 'Balance Sheet Contraction', lcrImpact: '+10%', cet1Impact: '+0.2%', niiImpact: '-€20M', timeline: '6-12 months' },
  ];

  triggerMatrix: TriggerMatrixRow[] = [
    { trigger: 'CET1 < 7%', threshold: '7.0%', current: '8.5%', status: 'compliant' },
    { trigger: 'LCR < 100%', threshold: '100%', current: '118%', status: 'compliant' },
    { trigger: 'NSFR < 100%', threshold: '100%', current: '112%', status: 'compliant' },
    { trigger: 'Leverage < 3%', threshold: '3.0%', current: '5.2%', status: 'compliant' },
    { trigger: 'NIM < 1%', threshold: '1.0%', current: '2.8%', status: 'compliant' },
  ];

  breachLog: BreachLogRow[] = [
    { date: '15-Sep-2025', trigger: 'LCR < 100%', value: '97.2%', severity: 'breach', action: 'CFP Phase 2 activated; BoG notified within 5 days' },
    { date: '22-Jun-2025', trigger: 'NSFR < 100%', value: '98.5%', severity: 'breach', action: 'Corrective actions initiated; deposit strategy revised' },
    { date: '10-Mar-2025', trigger: 'LCR < 100%', value: '95.8%', severity: 'breach', action: 'Emergency liquidity facility drawn; collateral posted' },
    { date: '05-Jan-2025', trigger: 'LCR < 100%', value: '99.1%', severity: 'amber', action: 'Preventive measures; liquidity buffer increased' },
    { date: '12-Oct-2024', trigger: 'CET1 < 7%', value: '6.8%', severity: 'breach', action: 'Dividend suspended; capital plan submitted to BoG' },
    { date: '28-Jul-2024', trigger: 'LCR < 100%', value: '96.5%', severity: 'breach', action: 'Asset sale programme accelerated' },
    { date: '15-Apr-2024', trigger: 'NSFR < 100%', value: '97.0%', severity: 'breach', action: 'Long-term funding plan revised' },
    { date: '02-Feb-2024', trigger: 'Leverage < 3%', value: '2.9%', severity: 'amber', action: 'Balance sheet reduction initiated' },
  ];

  kpiSummary: KpiSummaryRow[] = [
    { metric: 'Recovery Plan Readiness', current: '82%', target: '≥80%', status: 'compliant' },
    { metric: 'Active Trigger Breaches', current: '0', target: '0', status: 'compliant' },
    { metric: 'Recovery Options Available', current: '5', target: '≥5', status: 'compliant' },
    { metric: 'Plan Review Currency', current: 'Current', target: 'Annual', status: 'compliant' },
    { metric: 'Board Approval Status', current: 'Pending', target: 'Approved', status: 'amber' },
    { metric: 'BoG Submission Status', current: 'On Track', target: '31-Dec', status: 'compliant' },
  ];
}
