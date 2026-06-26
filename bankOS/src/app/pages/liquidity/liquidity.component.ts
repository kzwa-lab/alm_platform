import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-liquidity',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
          
          <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-3">Module Overview</h3>
            <p class="text-neutral-600 dark:text-neutral-300 mb-4">
              The Liquidity Risk Management module enables the bank to calculate, monitor, and stress-test its liquidity position under both Basel III LCR/NSFR and Bank of Ghana LMTD/LRMD. It provides comprehensive compliance with Ghana's 2026 prudential package.
            </p>

            <h4 class="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2 mt-6">Key Features</h4>
            <div class="grid md:grid-cols-2 gap-4">
              <ul class="list-disc list-inside text-neutral-600 dark:text-neutral-300 space-y-1 ml-4">
                <li>LCR/NSFR calculation with 19 time buckets</li>
                <li>BoG LMTD prudential ratios (Narrow/Broad)</li>
                <li>13-band maturity mismatch analysis</li>
                <li>Funding concentration monitoring</li>
              </ul>
              <ul class="list-disc list-inside text-neutral-600 dark:text-neutral-300 space-y-1 ml-4">
                <li>Liquidity stress testing (Idiosyncratic + Market-wide)</li>
                <li>Contingency Funding Plan (CFP) triggers</li>
                <li>E-money float account classification</li>
                <li>Intraday liquidity monitoring with RTGS integration</li>
              </ul>
            </div>
          </div>

          <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">LCR Calculation Table</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="sticky-header">
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

          <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Early Warning Indicators (CFP Triggers)</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="sticky-header">
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
                      <span class="px-3 py-1 rounded-full text-xs font-medium" 
                            [ngClass]="{
                              'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400': row.status === 'Normal',
                              'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400': row.status === 'Watch',
                              'bg-alert-100 text-alert-700 dark:bg-alert-900/30 dark:text-alert-400': row.status === 'Action'
                            }">
                        {{ row.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class LiquidityComponent {
  lcrData = [
    { bucket: 'Day 1', hqla: 2100, inflows: 150, outflows: 200, netFlow: -50 },
    { bucket: 'Day 2-7', hqla: 1800, inflows: 1200, outflows: 800, netFlow: 400 },
    { bucket: 'Day 8-14', hqla: 1500, inflows: 900, outflows: 600, netFlow: 300 },
    { bucket: 'Day 15-21', hqla: 1200, inflows: 600, outflows: 400, netFlow: 200 },
    { bucket: 'Day 22-30', hqla: 900, inflows: 400, outflows: 250, netFlow: 150 },
    { bucket: 'Day 31-60', hqla: 600, inflows: 200, outflows: 150, netFlow: 50 },
    { bucket: 'Day 61-90', hqla: 300, inflows: 100, outflows: 100, netFlow: 0 },
  ];

  ewiData = [
    { name: 'LCR 30-day trend', current: '-1.5pp', threshold: '-5pp', status: 'Normal' },
    { name: 'Wholesale funding conc.', current: '28%', threshold: '35%', status: 'Normal' },
    { name: 'Daily deposit outflows', current: 'EUR 5M', threshold: 'EUR 50M', status: 'Normal' },
    { name: 'Credit rating (Fitch)', current: 'A', threshold: 'BBB', status: 'Normal' },
    { name: 'Collateral available', current: 'EUR 1.2bn', threshold: 'EUR 500M', status: 'Normal' },
    { name: '5Y CDS spread', current: '85bps', threshold: '200bps', status: 'Normal' },
  ];
}