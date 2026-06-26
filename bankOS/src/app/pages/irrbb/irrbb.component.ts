import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-irrbb',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Interest Rate Risk (IRRBB) Module</h2>
          
          <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-3">Module Overview</h3>
            <p class="text-neutral-600 dark:text-neutral-300 mb-4">
              The IRRBB module implements Bank of Ghana's standardised 19-bucket framework for measuring 
              interest rate risk in the banking book. It calculates Economic Value of Equity (EVE) and Net 
              Interest Income (NII) under six shock scenarios and monitors supervisory outlier thresholds.
            </p>

            <h4 class="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2 mt-6">Key Features</h4>
            <ul class="list-disc list-inside text-neutral-600 dark:text-neutral-300 space-y-1 ml-4">
              <li>19-bucket standardised maturity framework</li>
              <li>EVE Sensitivity under 6 shock scenarios (Parallel Up/Down, Steepener, Flattener, Short Rate Up/Down)</li>
              <li>NII Forecast for 12-quarter horizon</li>
              <li>Repricing Gap analysis with bucket alignment</li>
              <li>Supervisory Outlier Test (EVE decline > 15% of Tier 1 triggers alert)</li>
              <li>Yield curve management with Ghana Reference Rate (GRR)</li>
            </ul>
          </div>

          <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">EVE Sensitivity Analysis</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="sticky-header">
                  <tr class="bg-neutral-50 dark:bg-neutral-800">
                    <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Scenario</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">EVE Change (€M)</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Capital Impact (%)</th>
                    <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of eveData" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                    <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.scenario }}</td>
                    <td class="p-3 text-right font-mono" [ngClass]="row.eveChange >= 0 ? 'text-success-600' : 'text-alert-600'">{{ row.eveChange | number:'1.0-0' }}</td>
                    <td class="p-3 text-right font-mono">{{ row.capitalImpact }}%</td>
                    <td class="p-3 text-center">
                      <span class="px-3 py-1 rounded-full text-xs font-medium" 
                            [ngClass]="{
                              'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400': row.status === 'Compliant',
                              'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400': row.status === 'Warning',
                              'bg-alert-100 text-alert-700 dark:bg-alert-900/30 dark:text-alert-400': row.status === 'Breach'
                            }">
                        {{ row.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Repricing Gap 19-Bucket Analysis</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="sticky-header">
                  <tr class="bg-neutral-50 dark:bg-neutral-800">
                    <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Time Bucket</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Gap (€M)</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Rate Sensitivity (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of gapData" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                    <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.bucket }}</td>
                    <td class="p-3 text-right font-mono" [ngClass]="row.gap >= 0 ? 'text-success-600' : 'text-alert-600'">{{ row.gap | number:'1.0-0' }}</td>
                    <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.sensitivity }}%</td>
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
export class IRRBBComponent {
  eveData = [
    { scenario: 'Parallel Up (+100bps)', eveChange: -185, capitalImpact: -3.2, status: 'Warning' },
    { scenario: 'Parallel Down (-100bps)', eveChange: 42, capitalImpact: 0.7, status: 'Compliant' },
    { scenario: 'Steepener (+50/–50)', eveChange: -95, capitalImpact: -1.6, status: 'Compliant' },
    { scenario: 'Flattener (–50/+50)', eveChange: 38, capitalImpact: 0.6, status: 'Compliant' },
    { scenario: 'Short Rate Up', eveChange: -210, capitalImpact: -3.6, status: 'Warning' },
    { scenario: 'Short Rate Down', eveChange: 28, capitalImpact: 0.5, status: 'Compliant' },
  ];

  gapData = [
    { bucket: '0-1 months', gap: 150, sensitivity: 0.5 },
    { bucket: '1-3 months', gap: 420, sensitivity: 1.2 },
    { bucket: '3-6 months', gap: 380, sensitivity: 2.1 },
    { bucket: '6-12 months', gap: 290, sensitivity: 3.4 },
    { bucket: '1-2 years', gap: 180, sensitivity: 4.8 },
    { bucket: '2-3 years', gap: -45, sensitivity: 5.2 },
    { bucket: '3-5 years', gap: -120, sensitivity: 6.1 },
    { bucket: '5+ years', gap: -320, sensitivity: 7.3 },
  ];
}