import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-capital',
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
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Capital Management Module</h2>
          
          <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-3">Module Overview</h3>
            <p class="text-neutral-600 dark:text-neutral-300 mb-4">
              Capital Management module calculates regulatory capital ratios (CET1, Tier 1, Total Capital), 
              Risk-Weighted Assets (RWA) under the Standardised Approach, and monitors capital buffers 
              and output floor for Bank of Ghana compliance.
            </p>

            <h4 class="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2 mt-6">Key Features</h4>
            <ul class="list-disc list-inside text-neutral-600 dark:text-neutral-300 space-y-1 ml-4">
              <li>CET1, AT1, T2 capital calculations</li>
              <li>Standardised Approach RWA (credit, market, operational risk)</li>
              <li>Capital Conservation Buffer monitoring</li>
              <li>Output Floor calculation and impact analysis</li>
              <li>Leverage Ratio calculation</li>
              <li>ICAAP/ILAAP integration</li>
            </ul>
          </div>

          <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Capital Stack Table</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="sticky-header">
                  <tr class="bg-neutral-50 dark:bg-neutral-800">
                    <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Capital Tier</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Amount (€M)</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-700 dark:border-neutral-700">Percentage</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Minimum</th>
                    <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of capitalData" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                    <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.tier }}</td>
                    <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.amount | number:'1.0-0' }}</td>
                    <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.percentage }}%</td>
                    <td class="p-3 text-right font-mono text-neutral-500 dark:text-neutral-400">{{ row.minimum }}%</td>
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
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class CapitalComponent {
  capitalData = [
    { tier: 'CET1 Capital', amount: 4200, percentage: 14.8, minimum: 4.5, status: 'Compliant' },
    { tier: 'Additional Tier 1', amount: 800, percentage: 2.8, minimum: 0, status: 'Compliant' },
    { tier: 'Tier 2 Capital', amount: 600, percentage: 2.1, minimum: 0, status: 'Compliant' },
    { tier: 'Capital Conservation Buffer', amount: 1800, percentage: 6.3, minimum: 2.8, status: 'Compliant' },
    { tier: 'Total Capital Ratio', amount: 5600, percentage: 19.7, minimum: 8.0, status: 'Compliant' },
  ];
}