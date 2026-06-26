import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { TabBarComponent, FeatureCardComponent, StatusBadgeComponent, GhanaRegulatoryDetailComponent } from '../../shared/index';

@Component({
  selector: 'app-rtgs',
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
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">RTGS & Intraday Liquidity</h2>

          <tab-bar [tabs]="tabLabels" [activeIndex]="activeTab" (tabChange)="onTabChange($event)"></tab-bar>

          <!-- TAB 1: RTGS Feed Monitor -->
          @if (activeTab === 0) {
            <feature-card
              [title]="'RTGS Feed Monitor'"
              [description]="'Real-time monitoring of Bank of Ghana RTGS feeds with connection health, message throughput, and latency tracking.'"
              [userStories]="rtgsFeedStories"
            ></feature-card>

            <ghana-regulatory-detail [detail]="rtgsRegulatoryDetail"></ghana-regulatory-detail>

            <!-- Table 1: Connection Status -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Connection Status</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Connection</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Latency (ms)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Uptime (%)</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Last Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of connectionStatus; track row.name) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ row.name }}</td>
                        <td class="p-3">
                          <status-badge [status]="row.statusColor" [label]="row.statusLabel"></status-badge>
                        </td>
                        <td class="p-3 text-right font-mono"
                          [ngClass]="row.latency <= 5 ? 'text-success-600' : row.latency <= 10 ? 'text-warning-600' : 'text-alert-600'">
                          {{ row.latency }}
                        </td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.uptime }}</td>
                        <td class="p-3 font-mono text-sm text-neutral-700 dark:text-neutral-200">{{ row.lastSeen }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Recent Messages -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Recent Messages</h3>
              <div class="overflow-x-auto max-h-80 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Time</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Message ID</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Type</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Amount (&#8373;)</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (msg of recentMessages; track msg.msgId) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-mono text-sm text-neutral-700 dark:text-neutral-200">{{ msg.time }}</td>
                        <td class="p-3 font-mono text-sm font-medium text-neutral-800 dark:text-neutral-200">{{ msg.msgId }}</td>
                        <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ msg.type }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ msg.amount | number:'1.0-0' }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="msg.statusColor" [label]="msg.statusLabel"></status-badge>
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
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Feed Health Gauge</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="rtgsChart1"></canvas>
                </div>
              </div>
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Message Volume</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="rtgsChart2"></canvas>
                </div>
              </div>
            </div>
          }

          <!-- TAB 2: Intraday Liquidity Position -->
          @if (activeTab === 1) {
            <feature-card
              [title]="'Intraday Liquidity Position'"
              [description]="'Real-time settlement balances, payment queues, and intraday liquidity metrics for RTGS operations.'"
              [userStories]="intradayLiquidityStories"
            ></feature-card>

            <!-- Table 1: Settlement Balance -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Settlement Balance</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Account</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Opening (&#8373;M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Current (&#8373;M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Peak (&#8373;M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Minimum (&#8373;M)</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of settlementBalances; track row.account) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ row.account }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.opening | number:'1.0-0' }}</td>
                        <td class="p-3 text-right font-mono font-semibold"
                          [ngClass]="row.current >= 0 ? 'text-success-600' : 'text-alert-600'">
                          {{ row.current | number:'1.0-0' }}
                        </td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.peak | number:'1.0-0' }}</td>
                        <td class="p-3 text-right font-mono"
                          [ngClass]="row.minimum >= 0 ? 'text-neutral-700 dark:text-neutral-200' : 'text-alert-600'">
                          {{ row.minimum | number:'1.0-0' }}
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Payment Queue -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Payment Queue</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Priority</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Count</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Total Value (&#8373;M)</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of paymentQueue; track row.priority) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium">
                          <status-badge
                            [status]="row.priority === 'High' ? 'red' : row.priority === 'Medium' ? 'amber' : 'green'"
                            [label]="row.priority">
                          </status-badge>
                        </td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.count }}</td>
                        <td class="p-3 text-right font-mono font-semibold text-neutral-700 dark:text-neutral-200">{{ row.totalValue | number:'1.0-0' }}</td>
                      </tr>
                    }
                  </tbody>
                  <tfoot>
                    <tr class="bg-neutral-100 dark:bg-neutral-700 font-semibold">
                      <td class="p-3 text-neutral-800 dark:text-neutral-100">Total</td>
                      <td class="p-3 text-right font-mono text-neutral-800 dark:text-neutral-100">{{ totalQueueCount }}</td>
                      <td class="p-3 text-right font-mono text-neutral-800 dark:text-neutral-100">{{ totalQueueValue | number:'1.0-0' }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Intraday Balance</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="rtgsChart3"></canvas>
                </div>
              </div>
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Throughput</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="rtgsChart4"></canvas>
                </div>
              </div>
            </div>
          }

          <!-- TAB 3: LRMD System Capability -->
          @if (activeTab === 2) {
            <feature-card
              [title]="'LRMD System Capability'"
              [description]="'Demonstrate system capability compliance with BoG LRMD 2026 requirements for real-time aggregation and reporting.'"
              [userStories]="lrmdSystemStories"
            ></feature-card>

            <ghana-regulatory-detail [detail]="lrmdRegulatoryDetail"></ghana-regulatory-detail>

            <!-- Table 1: Capability Checklist -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Capability Checklist</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Requirement</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Evidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of capabilityChecklist; track row.requirement) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ row.requirement }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.statusColor" [label]="row.statusLabel"></status-badge>
                        </td>
                        <td class="p-3 text-sm text-neutral-600 dark:text-neutral-300 max-w-[300px] truncate">{{ row.evidence }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Compliance by Requirement</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="rtgsChart5"></canvas>
                </div>
              </div>
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">System Uptime</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="rtgsChart6"></canvas>
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
export class RTGSComponent implements AfterViewInit, OnDestroy {
  tabLabels = ['RTGS Feed Monitor', 'Intraday Liquidity Position', 'LRMD System Capability'];
  activeTab = 0;

  private chartInstances: Chart[] = [];

  // ── User Stories ──────────────────────────────────────────────────

  rtgsFeedStories = [
    'Data Engineer: Monitor RTGS feed connection health and latency across primary, secondary, and fallback channels.',
    'Treasury Ops Manager: Track intraday payment flows and ensure timely settlement of high-value transactions.',
    'Compliance Officer: Verify RTGS feed compliance with BoG LRMD 2026 real-time aggregation requirements.',
  ];

  intradayLiquidityStories = [
    'Treasury Manager: Monitor intraday settlement balance and payment queue to manage liquidity positions.',
    'ALMO Member: Review peak and minimum balance positions to assess intraday liquidity adequacy.',
    'Risk Manager: Identify potential settlement shortfalls before they materialise during the day.',
  ];

  lrmdSystemStories = [
    'Compliance Officer: Demonstrate LRMD 2026 system capability compliance with documented evidence.',
    'IT Director: Prove real-time aggregation capability without manual intervention for regulatory audit.',
    'CRO: Certify that system meets all BoG LRMD 2026 data residency and encryption requirements.',
  ];

  // ── Regulatory Detail ──────────────────────────────────────────────

  rtgsRegulatoryDetail = 'BoG LRMD 2026: System capability demonstration - prove real-time aggregation without manual intervention. RTGS feed latency < 5 seconds. Availability 99.9% during business hours. TLS 1.3 encryption. Data residency: all RTGS data in Ghana.';

  lrmdRegulatoryDetail = 'BoG LRMD 2026: System capability demonstration — prove real-time aggregation without manual intervention. RTGS feed latency < 5 seconds. Availability 99.9% during business hours. TLS 1.3 encryption. Data residency: all RTGS data in Ghana.';

  // ── Data: Tab 1 (RTGS Feed Monitor) ───────────────────────────────

  connectionStatus = [
    { name: 'Primary (MT940)', statusColor: 'green' as const, statusLabel: 'Connected', latency: 2, uptime: 99.95, lastSeen: '2026-04-08 14:32:15' },
    { name: 'Secondary (SWIFT)', statusColor: 'green' as const, statusLabel: 'Connected', latency: 4, uptime: 99.87, lastSeen: '2026-04-08 14:32:14' },
    { name: 'Fallback (File Based)', statusColor: 'amber' as const, statusLabel: 'Standby', latency: 0, uptime: 99.50, lastSeen: '2026-04-08 12:15:00' },
  ];

  recentMessages = [
    { time: '14:32:15', msgId: 'MSG-20260408-142315', type: 'Payment Credit', amount: 15000000, statusColor: 'green' as const, statusLabel: 'Settled' },
    { time: '14:31:58', msgId: 'MSG-20260408-143158', type: 'Payment Debit', amount: 8250000, statusColor: 'green' as const, statusLabel: 'Settled' },
    { time: '14:30:42', msgId: 'MSG-20260408-143042', type: 'Liquidity Transfer', amount: 50000000, statusColor: 'green' as const, statusLabel: 'Settled' },
    { time: '14:29:30', msgId: 'MSG-20260408-142930', type: 'Payment Debit', amount: 12000000, statusColor: 'amber' as const, statusLabel: 'Pending' },
    { time: '14:28:15', msgId: 'MSG-20260408-142815', type: 'Payment Credit', amount: 23400000, statusColor: 'green' as const, statusLabel: 'Settled' },
    { time: '14:27:00', msgId: 'MSG-20260408-142700', type: 'Payment Credit', amount: 6750000, statusColor: 'green' as const, statusLabel: 'Settled' },
    { time: '14:25:45', msgId: 'MSG-20260408-142545', type: 'Payment Debit', amount: 45000000, statusColor: 'red' as const, statusLabel: 'Failed' },
    { time: '14:24:30', msgId: 'MSG-20260408-142430', type: 'Liquidity Transfer', amount: 25000000, statusColor: 'green' as const, statusLabel: 'Settled' },
    { time: '14:23:15', msgId: 'MSG-20260408-142315', type: 'Payment Credit', amount: 18000000, statusColor: 'green' as const, statusLabel: 'Settled' },
    { time: '14:22:00', msgId: 'MSG-20260408-142200', type: 'Payment Debit', amount: 9500000, statusColor: 'amber' as const, statusLabel: 'Pending' },
  ];

  // ── Data: Tab 2 (Intraday Liquidity Position) ─────────────────────

  settlementBalances = [
    { account: 'BoG Settlement (GHS)', opening: 1250, current: 980, peak: 1450, minimum: 720 },
    { account: 'USD Nostro (GHS equiv)', opening: 450, current: 385, peak: 520, minimum: 310 },
    { account: 'EUR Nostro (GHS equiv)', opening: 180, current: 155, peak: 210, minimum: 120 },
    { account: 'GBP Nostro (GHS equiv)', opening: 95, current: 82, peak: 110, minimum: 65 },
  ];

  paymentQueue = [
    { priority: 'High', count: 12, totalValue: 185000000 },
    { priority: 'Medium', count: 28, totalValue: 92000000 },
    { priority: 'Low', count: 45, totalValue: 38000000 },
  ];

  get totalQueueCount(): number {
    return this.paymentQueue.reduce((s, r) => s + r.count, 0);
  }

  get totalQueueValue(): number {
    return this.paymentQueue.reduce((s, r) => s + r.totalValue, 0);
  }

  // ── Data: Tab 3 (LRMD System Capability) ─────────────────────────

  capabilityChecklist = [
    { requirement: 'Real-time aggregation without manual intervention', statusColor: 'green' as const, statusLabel: 'Compliant', evidence: 'Automated RTGS feed ingestion via SWIFT MT940. Aggregation pipeline processes messages within 2 seconds.' },
    { requirement: 'RTGS feed latency < 5 seconds', statusColor: 'green' as const, statusLabel: 'Compliant', evidence: 'Average feed-to-display latency: 2.3s (measured hourly, max 4.1s in last 30 days).' },
    { requirement: 'System availability 99.9% business hours', statusColor: 'green' as const, statusLabel: 'Compliant', evidence: 'Current month uptime: 99.95%. Rolling 12-month average: 99.92%. No SLA breaches.' },
    { requirement: 'TLS 1.3 encryption on all RTGS channels', statusColor: 'green' as const, statusLabel: 'Enforced', evidence: 'TLS 1.3 configured on primary (MT940) and secondary (SWIFT) channels. Cipher suite: TLS_AES_256_GCM_SHA384.' },
    { requirement: 'Data residency - all RTGS data in Ghana', statusColor: 'green' as const, statusLabel: 'Compliant', evidence: 'All servers physically located at Accra data centre. No cross-border data transfer for RTGS data.' },
    { requirement: 'Business continuity / disaster recovery', statusColor: 'amber' as const, statusLabel: 'Partial', evidence: 'RTO: 15 minutes (target: 5). RPO: < 1 second. DR tested quarterly. Last test: 2026-02-15 (passed).' },
    { requirement: 'Audit trail for all RTGS transactions', statusColor: 'green' as const, statusLabel: 'Compliant', evidence: 'Immutable audit log with SHA-256 hash chain. 7-year retention policy active.' },
    { requirement: 'Automated LRMD report generation', statusColor: 'green' as const, statusLabel: 'Compliant', evidence: 'LRMD templates pre-mapped. Report generation time: < 30s for quarterly aggregate.' },
    { requirement: 'Real-time dashboard for liquidity monitoring', statusColor: 'green' as const, statusLabel: 'Operational', evidence: 'Intraday liquidity dashboard live. Refresh interval: 1 second. Historical replay available.' },
    { requirement: 'Escalation and alerting on threshold breach', statusColor: 'amber' as const, statusLabel: 'Partial', evidence: 'Alerts configured: (a) balance < &#8373;200M critical, (b) latency > 5s warning. SMS + email active. Siren: pending.' },
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
    // Gauge/Donut: Feed Health
    const ctx1 = document.getElementById('rtgsChart1') as HTMLCanvasElement | null;
    if (ctx1) {
      const healthScore = 96;
      const chart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
          labels: ['Health Score', 'Remaining'],
          datasets: [{
            data: [healthScore, 100 - healthScore],
            backgroundColor: ['#22c55e', '#e5e7eb'],
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: `Feed Health Score: ${healthScore}/100`,
              font: { size: 16 }
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ctx.label === 'Health Score' ? `${ctx.parsed}%` : ''
              }
            }
          }
        }
      });
      this.addChart(chart);
    }

    // Line chart: Message Volume
    const ctx2 = document.getElementById('rtgsChart2') as HTMLCanvasElement | null;
    if (ctx2) {
      const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
      const chart = new Chart(ctx2, {
        type: 'line',
        data: {
          labels: hours,
          datasets: [
            {
              label: 'Payment Credits',
              data: [15, 28, 42, 55, 38, 48, 52, 18],
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'Payment Debits',
              data: [12, 32, 38, 48, 42, 45, 50, 22],
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'Liquidity Transfers',
              data: [5, 8, 12, 15, 10, 14, 18, 6],
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              fill: true,
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
              text: 'Message Volume Today (Hourly)'
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
    // Line chart: Intraday Balance
    const ctx3 = document.getElementById('rtgsChart3') as HTMLCanvasElement | null;
    if (ctx3) {
      const intradayLabels = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
      const chart = new Chart(ctx3, {
        type: 'line',
        data: {
          labels: intradayLabels,
          datasets: [
            {
              label: 'GHS Settlement Balance (&#8373;M)',
              data: [1250, 1180, 1050, 1120, 980, 1020, 950, 980],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'Minimum Threshold (&#8373;200M)',
              data: intradayLabels.map(() => 200),
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
              text: 'Intraday Settlement Balance (&#8373;M)'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Balance (&#8373;M)' }
            }
          }
        }
      });
      this.addChart(chart);
    }

    // Bar chart: Throughput
    const ctx4 = document.getElementById('rtgsChart4') as HTMLCanvasElement | null;
    if (ctx4) {
      const chart = new Chart(ctx4, {
        type: 'bar',
        data: {
          labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
          datasets: [
            {
              label: 'Messages Processed',
              data: [32, 68, 92, 118, 90, 107, 120, 46],
              backgroundColor: 'rgba(59, 130, 246, 0.7)',
              borderRadius: 4,
            },
            {
              label: 'Value Processed (&#8373;M)',
              data: [180, 420, 680, 920, 540, 780, 850, 310],
              backgroundColor: 'rgba(34, 197, 94, 0.7)',
              borderRadius: 4,
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
              text: 'Hourly Throughput — Count & Value'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              position: 'left',
              title: { display: true, text: 'Count' }
            },
            y1: {
              beginAtZero: true,
              position: 'right',
              title: { display: true, text: 'Value (&#8373;M)' },
              grid: { display: false },
            }
          }
        }
      });
      this.addChart(chart);
    }
  }

  // ── Tab 3 Charts ──────────────────────────────────────────────────

  private initTab3Charts() {
    // Bar chart: Compliance by Requirement
    const ctx5 = document.getElementById('rtgsChart5') as HTMLCanvasElement | null;
    if (ctx5) {
      const statusColors = this.capabilityChecklist.map(r =>
        r.statusColor === 'green' ? 'rgba(34, 197, 94, 0.7)' :
        r.statusColor === 'amber' ? 'rgba(245, 158, 11, 0.7)' :
        'rgba(239, 68, 68, 0.7)'
      );
      const statusValues = this.capabilityChecklist.map(r =>
        r.statusColor === 'green' ? 100 :
        r.statusColor === 'amber' ? 60 : 20
      );

      const chart = new Chart(ctx5, {
        type: 'bar',
        data: {
          labels: this.capabilityChecklist.map(r => r.requirement.substring(0, 40) + '...'),
          datasets: [{
            label: 'Compliance Score (%)',
            data: statusValues,
            backgroundColor: statusColors,
            borderRadius: 4,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'LRMD 2026 Compliance by Requirement'
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 100,
              title: { display: true, text: 'Compliance Score (%)' }
            }
          }
        }
      });
      this.addChart(chart);
    }

    // Gauge: System Uptime
    const ctx6 = document.getElementById('rtgsChart6') as HTMLCanvasElement | null;
    if (ctx6) {
      const uptime = 99.95;
      const chart = new Chart(ctx6, {
        type: 'doughnut',
        data: {
          labels: ['Uptime', 'Downtime'],
          datasets: [{
            data: [uptime, +(100 - uptime).toFixed(2)],
            backgroundColor: ['#22c55e', '#e5e7eb'],
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: `System Uptime: ${uptime}%`,
              font: { size: 16 }
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
  }
}
