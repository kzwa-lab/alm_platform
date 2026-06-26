import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { TabBarComponent, FeatureCardComponent, StatusBadgeComponent, GhanaRegulatoryDetailComponent } from '../../shared/index';

@Component({
  selector: 'app-regulatory-reporting',
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
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Regulatory Reporting</h2>

          <tab-bar [tabs]="tabLabels" [activeIndex]="activeTab" (tabChange)="onTabChange($event)"></tab-bar>

          <!-- TAB 1: BoG Template Catalogue -->
          @if (activeTab === 0) {
            <feature-card
              [title]="'BoG Template Catalogue'"
              [description]="'Central catalogue of all Bank of Ghana regulatory reporting templates with version control, data source mappings, and submission timelines.'"
              [userStories]="templateCatalogueStories"
            ></feature-card>

            <ghana-regulatory-detail [detail]="templateRegulatoryDetail"></ghana-regulatory-detail>

            <!-- Table 1: Template List -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Template List</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Template</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Directive</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Frequency</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Format</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Version</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of templateList; track row.name) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ row.name }}</td>
                        <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.directive }}</td>
                        <td class="p-3 text-center font-mono text-neutral-700 dark:text-neutral-200">{{ row.frequency }}</td>
                        <td class="p-3 text-center font-mono text-neutral-700 dark:text-neutral-200">{{ row.format }}</td>
                        <td class="p-3 text-center font-mono text-neutral-700 dark:text-neutral-200">{{ row.version }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.statusColor" [label]="row.statusLabel"></status-badge>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Data Source Mapping -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Data Source Mapping</h3>
              <div class="overflow-x-auto max-h-80 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Template Field</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">ALM Module</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Source Table</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Mapping Rule</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of dataSourceMappings; track row.field) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ row.field }}</td>
                        <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.module }}</td>
                        <td class="p-3 font-mono text-sm text-neutral-700 dark:text-neutral-200">{{ row.sourceTable }}</td>
                        <td class="p-3 text-sm text-neutral-600 dark:text-neutral-300 max-w-[250px] truncate">{{ row.mappingRule }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.statusColor" [label]="row.statusLabel"></status-badge>
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
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Template Status</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="rrChart1"></canvas>
                </div>
              </div>
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Submission Timeline</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="rrChart2"></canvas>
                </div>
              </div>
            </div>
          }

          <!-- TAB 2: Submission Scheduler -->
          @if (activeTab === 1) {
            <feature-card
              [title]="'Submission Scheduler'"
              [description]="'Schedule, track, and manage regulatory submission deadlines with compliance monitoring and turnaround analytics.'"
              [userStories]="submissionSchedulerStories"
            ></feature-card>

            <!-- Table 1: Upcoming Submissions -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Upcoming Submissions (Next 6 Months)</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Template</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Reporting Period</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Due Date</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Days Left</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Assignee</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of upcomingSubmissions; track row.template) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ row.template }}</td>
                        <td class="p-3 font-mono text-sm text-neutral-700 dark:text-neutral-200">{{ row.period }}</td>
                        <td class="p-3 font-mono text-sm text-neutral-700 dark:text-neutral-200">{{ row.dueDate }}</td>
                        <td class="p-3 text-center font-mono font-semibold"
                          [ngClass]="row.daysLeft <= 5 ? 'text-alert-600' : row.daysLeft <= 14 ? 'text-warning-600' : 'text-neutral-700 dark:text-neutral-200'">
                          {{ row.daysLeft }}
                        </td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.statusColor" [label]="row.statusLabel"></status-badge>
                        </td>
                        <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.assignee }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Submission History -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Submission History</h3>
              <div class="overflow-x-auto max-h-80 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Template</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Period</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Submitted</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Turnaround (Days)</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Compliant</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of submissionHistory; track row.template + row.period) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ row.template }}</td>
                        <td class="p-3 font-mono text-sm text-neutral-700 dark:text-neutral-200">{{ row.period }}</td>
                        <td class="p-3 font-mono text-sm text-neutral-700 dark:text-neutral-200">{{ row.submittedDate }}</td>
                        <td class="p-3 text-center font-mono text-neutral-700 dark:text-neutral-200">{{ row.turnaroundDays }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.compliant ? 'green' : 'red'" [label]="row.compliant ? 'Yes' : 'No'"></status-badge>
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
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Deadline Compliance</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="rrChart3"></canvas>
                </div>
              </div>
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Submission Turnaround</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="rrChart4"></canvas>
                </div>
              </div>
            </div>
          }

          <!-- TAB 3: ORASS Integration -->
          @if (activeTab === 2) {
            <feature-card
              [title]="'ORASS Integration'"
              [description]="'Monitor integration status with the Bank of Ghana Online Regulatory Analysis and Submission System (ORASS) for direct electronic submissions.'"
              [userStories]="orassIntegrationStories"
            ></feature-card>

            <!-- Table 1: Submission Status -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">ORASS Submission Status</h3>
              <div class="overflow-x-auto max-h-80 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Submission ID</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Template</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Date</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of orassSubmissions; track row.submissionId) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-mono text-sm font-medium text-neutral-800 dark:text-neutral-200">{{ row.submissionId }}</td>
                        <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.template }}</td>
                        <td class="p-3 font-mono text-sm text-neutral-700 dark:text-neutral-200">{{ row.date }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.statusColor" [label]="row.statusLabel"></status-badge>
                        </td>
                        <td class="p-3 text-sm text-neutral-600 dark:text-neutral-300 max-w-[200px] truncate">{{ row.response }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Submission Success Rate</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="rrChart5"></canvas>
                </div>
              </div>
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">API Response Time</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="rrChart6"></canvas>
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
export class RegulatoryReportingComponent implements AfterViewInit, OnDestroy {
  tabLabels = ['BoG Template Catalogue', 'Submission Scheduler', 'ORASS Integration'];
  activeTab = 0;

  private chartInstances: Chart[] = [];

  // ── User Stories ──────────────────────────────────────────────────

  templateCatalogueStories = [
    'Regulatory Reporting Manager: Maintain a central catalogue of all BoG templates with version control and audit trail.',
    'Compliance Officer: Verify template versions and cross-reference directive references for accuracy.',
    'Data Owner: Map template fields to ALM module data sources and validate transformation rules.',
  ];

  submissionSchedulerStories = [
    'Regulatory Reporting Manager: Schedule and track all regulatory submissions across monthly, quarterly, and annual cycles.',
    'Compliance Officer: Monitor deadline compliance and ensure all submissions are filed before cut-off.',
    'Data Owner: Review submission timelines and allocate resources for data preparation and validation.',
  ];

  orassIntegrationStories = [
    'Regulatory Reporting Manager: Monitor ORASS submission status and handle rejection/query responses.',
    'IT/Integration Lead: Track API response times and ensure system-to-system reliability with BoG portal.',
    'Compliance Officer: Verify ORASS acknowledgment receipts and maintain submission evidence trail.',
  ];

  // ── Regulatory Detail ──────────────────────────────────────────────

  templateRegulatoryDetail = 'BoG ORASS: LMTD returns monthly (9 days), LRMD quarterly, IRRBB quarterly, Capital Adequacy quarterly, ICAAP annual (4 months post year-end). Pillar 3 disclosures annual. Template version control required.';

  // ── Data: Tab 1 (BoG Template Catalogue) ──────────────────────────

  templateList = [
    { name: 'LMTD', directive: 'BoG LMTD 2026', frequency: 'Monthly', format: 'XLSX', version: 'v3.2', statusColor: 'green' as const, statusLabel: 'Active' },
    { name: 'LRMD', directive: 'BoG LRMD 2026', frequency: 'Quarterly', format: 'XLSX', version: 'v2.1', statusColor: 'green' as const, statusLabel: 'Active' },
    { name: 'IRRBB', directive: 'BoG IRRBB 2026', frequency: 'Quarterly', format: 'XLSX', version: 'v4.0', statusColor: 'green' as const, statusLabel: 'Active' },
    { name: 'Capital Adequacy', directive: 'BoG CAR 2026', frequency: 'Quarterly', format: 'XLSX', version: 'v3.5', statusColor: 'green' as const, statusLabel: 'Active' },
    { name: 'Recovery Plan', directive: 'BoG Recovery 2026', frequency: 'Annual', format: 'PDF', version: 'v2.0', statusColor: 'amber' as const, statusLabel: 'Review' },
    { name: 'ICAAP', directive: 'BoG ICAAP 2026', frequency: 'Annual', format: 'PDF+Data', version: 'v3.1', statusColor: 'green' as const, statusLabel: 'Active' },
    { name: 'Pillar 3 Disclosures', directive: 'Basel III / BoG', frequency: 'Annual', format: 'PDF+Data', version: 'v2.3', statusColor: 'amber' as const, statusLabel: 'Drafting' },
  ];

  dataSourceMappings = [
    { field: 'LMTD.Total Assets', module: 'ALM General Ledger', sourceTable: 'gl_balances', mappingRule: 'SUM(debit) BY account_type=asset', statusColor: 'green' as const, statusLabel: 'Verified' },
    { field: 'LMTD.Liquid Assets', module: 'Liquidity', sourceTable: 'lcr_hqla_inventory', mappingRule: 'hqla_value AFTER haircut', statusColor: 'green' as const, statusLabel: 'Verified' },
    { field: 'LMTD.Deposit Base', module: 'FTP / Deposits', sourceTable: 'deposit_ledger', mappingRule: 'SUM(balance) BY product_type', statusColor: 'green' as const, statusLabel: 'Verified' },
    { field: 'LRMD.RTGS Aggregates', module: 'RTGS / Payments', sourceTable: 'rtgs_message_log', mappingRule: 'AGG(volume, value) BY currency', statusColor: 'amber' as const, statusLabel: 'Pending Validation' },
    { field: 'IRRBB.EVE Sensitivity', module: 'IRRBB Engine', sourceTable: 'irrbb_eve_results', mappingRule: 'eve_change BY scenario', statusColor: 'green' as const, statusLabel: 'Verified' },
    { field: 'IRRBB.NII Forecast', module: 'IRRBB Engine', sourceTable: 'irrbb_nii_forecast', mappingRule: 'nii_value BY scenario BY bucket', statusColor: 'green' as const, statusLabel: 'Verified' },
    { field: 'CAR.CET1 Capital', module: 'Capital', sourceTable: 'capital_components', mappingRule: 'amount WHERE component=CET1', statusColor: 'green' as const, statusLabel: 'Verified' },
    { field: 'CAR.RWA Total', module: 'Capital', sourceTable: 'rwa_summary', mappingRule: 'rwa_total BY approach', statusColor: 'green' as const, statusLabel: 'Verified' },
    { field: 'ICAAP.ECL Projections', module: 'ECL', sourceTable: 'ecl_scenario_summary', mappingRule: 'weighted_ecl BY scenario', statusColor: 'amber' as const, statusLabel: 'Pending Validation' },
    { field: 'ICAAP.Stress Test Results', module: 'Optimization', sourceTable: 'stress_test_results', mappingRule: 'capital_impact BY scenario', statusColor: 'red' as const, statusLabel: 'Mapping Needed' },
  ];

  // ── Data: Tab 2 (Submission Scheduler) ─────────────────────────────

  upcomingSubmissions = [
    { template: 'LMTD', period: 'Apr 2026', dueDate: '2026-05-09', daysLeft: 3, statusColor: 'red' as const, statusLabel: 'Due Soon', assignee: 'Alice Mensah' },
    { template: 'LMTD', period: 'May 2026', dueDate: '2026-06-09', daysLeft: 34, statusColor: 'green' as const, statusLabel: 'On Track', assignee: 'Alice Mensah' },
    { template: 'LRMD', period: 'Q2 2026', dueDate: '2026-07-15', daysLeft: 70, statusColor: 'green' as const, statusLabel: 'On Track', assignee: 'Kwame Asante' },
    { template: 'IRRBB', period: 'Q2 2026', dueDate: '2026-07-20', daysLeft: 75, statusColor: 'green' as const, statusLabel: 'On Track', assignee: 'Yaa Ofori' },
    { template: 'Capital Adequacy', period: 'Q2 2026', dueDate: '2026-07-25', daysLeft: 80, statusColor: 'green' as const, statusLabel: 'On Track', assignee: 'Kwame Asante' },
    { template: 'ICAAP', period: 'FY 2025', dueDate: '2026-04-30', daysLeft: -6, statusColor: 'red' as const, statusLabel: 'Overdue', assignee: 'Yaa Ofori' },
    { template: 'Recovery Plan', period: 'FY 2026', dueDate: '2026-09-30', daysLeft: 147, statusColor: 'amber' as const, statusLabel: 'Planning', assignee: 'CRO Office' },
    { template: 'Pillar 3', period: 'FY 2025', dueDate: '2026-06-30', daysLeft: 55, statusColor: 'amber' as const, statusLabel: 'In Progress', assignee: 'Alice Mensah' },
  ];

  submissionHistory = [
    { template: 'LMTD', period: 'Mar 2026', submittedDate: '2026-04-08', turnaroundDays: 7, compliant: true },
    { template: 'LMTD', period: 'Feb 2026', submittedDate: '2026-03-07', turnaroundDays: 6, compliant: true },
    { template: 'LMTD', period: 'Jan 2026', submittedDate: '2026-02-06', turnaroundDays: 5, compliant: true },
    { template: 'LRMD', period: 'Q1 2026', submittedDate: '2026-04-12', turnaroundDays: 11, compliant: true },
    { template: 'IRRBB', period: 'Q1 2026', submittedDate: '2026-04-18', turnaroundDays: 17, compliant: true },
    { template: 'Capital Adequacy', period: 'Q1 2026', submittedDate: '2026-04-20', turnaroundDays: 14, compliant: true },
    { template: 'LMTD', period: 'Dec 2025', submittedDate: '2026-01-07', turnaroundDays: 6, compliant: true },
    { template: 'ICAAP', period: 'FY 2024', submittedDate: '2025-05-28', turnaroundDays: 28, compliant: true },
    { template: 'Pillar 3', period: 'FY 2024', submittedDate: '2025-07-02', turnaroundDays: 2, compliant: true },
    { template: 'Recovery Plan', period: 'FY 2025', submittedDate: '2025-09-25', turnaroundDays: 5, compliant: true },
  ];

  // ── Data: Tab 3 (ORASS Integration) ────────────────────────────────

  orassSubmissions = [
    { submissionId: 'ORASS-2026-00421', template: 'LMTD - Mar 2026', date: '2026-04-08', statusColor: 'green' as const, statusLabel: 'Accepted', response: 'Acknowledged - Ref: BOG/LMTD/2026/0421' },
    { submissionId: 'ORASS-2026-00389', template: 'LMTD - Feb 2026', date: '2026-03-07', statusColor: 'green' as const, statusLabel: 'Accepted', response: 'Acknowledged - Ref: BOG/LMTD/2026/0389' },
    { submissionId: 'ORASS-2026-00345', template: 'LRMD - Q1 2026', date: '2026-04-12', statusColor: 'green' as const, statusLabel: 'Accepted', response: 'Acknowledged - Ref: BOG/LRMD/2026/0345' },
    { submissionId: 'ORASS-2026-00321', template: 'IRRBB - Q1 2026', date: '2026-04-18', statusColor: 'amber' as const, statusLabel: 'Queried', response: 'Validation warning: EVE NMD cap exceeded for GHS portfolio - review required' },
    { submissionId: 'ORASS-2026-00310', template: 'Capital - Q1 2026', date: '2026-04-20', statusColor: 'green' as const, statusLabel: 'Accepted', response: 'Acknowledged - Ref: BOG/CAR/2026/0310' },
    { submissionId: 'ORASS-2025-00987', template: 'ICAAP - FY 2024', date: '2025-05-28', statusColor: 'green' as const, statusLabel: 'Accepted', response: 'Acknowledged - Ref: BOG/ICAAP/2025/0987' },
    { submissionId: 'ORASS-2025-00854', template: 'Pillar 3 - FY 2024', date: '2025-07-02', statusColor: 'amber' as const, statusLabel: 'Queried', response: 'Additional disclosure required for ECL sensitivity analysis section 4.3' },
    { submissionId: 'ORASS-2025-00722', template: 'LMTD - Jun 2025', date: '2025-07-05', statusColor: 'red' as const, statusLabel: 'Rejected', response: 'Schema validation failed: field LMTD.0102 missing required attribute' },
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
    // Pie chart: Template Status
    const ctx1 = document.getElementById('rrChart1') as HTMLCanvasElement | null;
    if (ctx1) {
      const chart = new Chart(ctx1, {
        type: 'pie',
        data: {
          labels: ['Active', 'Review', 'Drafting'],
          datasets: [{
            data: [5, 1, 1],
            backgroundColor: ['#22c55e', '#f59e0b', '#3b82f6'],
            borderWidth: 2,
            borderColor: '#ffffff',
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
                  const pct = ((ctx.parsed as number) / total * 100).toFixed(1);
                  return `${ctx.label}: ${ctx.parsed} (${pct}%)`;
                }
              }
            }
          }
        }
      });
      this.addChart(chart);
    }

    // Line chart: Submission Timeline
    const ctx2 = document.getElementById('rrChart2') as HTMLCanvasElement | null;
    if (ctx2) {
      const chart = new Chart(ctx2, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Submissions Due',
              data: [3, 2, 3, 4, 2, 2, 4, 2, 3, 2, 2, 3],
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: false,
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'Submissions Completed',
              data: [3, 2, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0],
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: false,
              tension: 0.3,
              pointRadius: 4,
              borderDash: [5, 5],
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
              text: 'Monthly Submission Schedule'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Count' }
            }
          }
        }
      });
      this.addChart(chart);
    }
  }

  // ── Tab 2 Charts ──────────────────────────────────────────────────

  private initTab2Charts() {
    // Gauge: Deadline Compliance (doughnut representing compliance rate)
    const ctx3 = document.getElementById('rrChart3') as HTMLCanvasElement | null;
    if (ctx3) {
      const compliantPct = 90;
      const chart = new Chart(ctx3, {
        type: 'doughnut',
        data: {
          labels: ['On-Time', 'Late'],
          datasets: [{
            data: [compliantPct, 100 - compliantPct],
            backgroundColor: ['#22c55e', '#ef4444'],
            borderWidth: 2,
            borderColor: '#ffffff',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: `Deadline Compliance: ${compliantPct}%`
            },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.label}: ${ctx.parsed}%`
              }
            }
          }
        }
      });
      this.addChart(chart);
    }

    // Bar chart: Submission Turnaround
    const ctx4 = document.getElementById('rrChart4') as HTMLCanvasElement | null;
    if (ctx4) {
      const chart = new Chart(ctx4, {
        type: 'bar',
        data: {
          labels: this.submissionHistory.slice(-6).map(s => s.template.substring(0, 8) + '...'),
          datasets: [{
            label: 'Turnaround (Days)',
            data: this.submissionHistory.slice(-6).map(s => s.turnaroundDays),
            backgroundColor: ['#22c55e', '#22c55e', '#22c55e', '#22c55e', '#f59e0b', '#22c55e'],
            borderRadius: 4,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Recent Submission Turnaround (Days)'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Days' }
            }
          }
        }
      });
      this.addChart(chart);
    }
  }

  // ── Tab 3 Charts ──────────────────────────────────────────────────

  private initTab3Charts() {
    // Donut: Submission Success Rate
    const ctx5 = document.getElementById('rrChart5') as HTMLCanvasElement | null;
    if (ctx5) {
      const chart = new Chart(ctx5, {
        type: 'doughnut',
        data: {
          labels: ['Accepted', 'Queried', 'Rejected'],
          datasets: [{
            data: [5, 2, 1],
            backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
            borderWidth: 2,
            borderColor: '#ffffff',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'ORASS Submission Outcomes'
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
                  const pct = ((ctx.parsed as number) / total * 100).toFixed(1);
                  return `${ctx.label}: ${ctx.parsed} (${pct}%)`;
                }
              }
            }
          }
        }
      });
      this.addChart(chart);
    }

    // Line chart: API Response Time
    const ctx6 = document.getElementById('rrChart6') as HTMLCanvasElement | null;
    if (ctx6) {
      const chart = new Chart(ctx6, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Avg Response Time (s)',
              data: [2.1, 1.8, 2.4, 1.5, 1.9, 1.6],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'SLA Threshold (5s)',
              data: [5, 5, 5, 5, 5, 5],
              borderColor: '#ef4444',
              borderDash: [8, 4],
              pointRadius: 0,
              fill: false,
              borderWidth: 2,
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
              text: 'ORASS API Response Time'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Seconds' }
            }
          }
        }
      });
      this.addChart(chart);
    }
  }
}
