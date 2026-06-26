import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-optimization',
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
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Balance Sheet Optimization Module</h2>
          
          <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-3">Module Overview</h3>
            <p class="text-neutral-600 dark:text-neutral-300 mb-4">
              Balance Sheet Optimization module provides NIM attribution analysis, what-if scenario building, 
              structural hedging recommendations, and ALCO pack generation for strategic decision-making.
            </p>

            <h4 class="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2 mt-6">Key Features</h4>
            <ul class="list-disc list-inside text-neutral-600 dark:text-neutral-300 space-y-1 ml-4">
              <li>NIM Attribution by product, currency, business unit</li>
              <li>What-If Scenario Builder with rate/path changes</li>
              <li>Structural hedging status and recommendations</li>
              <li>Deposit pricing guidance engine</li>
              <li>Loan origination recommendations</li>
              <li>ALCO Pack auto-generation (PDF/PowerPoint)</li>
            </ul>
          </div>

          <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">NIM Attribution</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="sticky-header">
                  <tr class="bg-neutral-50 dark:bg-neutral-800">
                    <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Product Group</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Earning Assets (€M)</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Interest Income (€M)</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Interest Expense (€M)</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">NIM (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of nimData" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                    <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.product }}</td>
                    <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.assets | number:'1.0-0' }}</td>
                    <td class="p-3 text-right font-mono text-success-600">{{ row.income | number:'1.0-0' }}</td>
                    <td class="p-3 text-right font-mono text-alert-600">{{ row.expense | number:'1.0-0' }}</td>
                    <td class="p-3 text-right font-mono font-semibold" [ngClass]="row.nim >= 2.0 ? 'text-success-600' : 'text-warning-600'">{{ row.nim }}%</td>
                  </tr>
                </tbody>
                <tfoot class="sticky-header">
                  <tr class="bg-neutral-50 dark:bg-neutral-800 font-semibold">
                    <td class="p-3 text-neutral-800 dark:text-neutral-100">Total</td>
                    <td class="p-3 text-right font-mono">12,500</td>
                    <td class="p-3 text-right font-mono">302.5</td>
                    <td class="p-3 text-right font-mono">254.8</td>
                    <td class="p-3 text-right font-mono text-warning-600">2.42%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class OptimizationComponent {
  nimData = [
    { product: 'Retail Deposits', assets: 2100, income: 85, expense: 0, nim: 4.05 },
    { product: 'SME Loans', assets: 3400, income: 148, expense: 92, nim: 1.65 },
    { product: 'Corporate Loans', assets: 4200, income: 124, expense: 98, nim: 1.33 },
    { product: 'Government Bonds', assets: 2800, income: 45, expense: 64, nim: 1.61 },
  ];
}