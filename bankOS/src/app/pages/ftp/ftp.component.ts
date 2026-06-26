import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ftp',
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
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">FTP & Pricing Module</h2>
          
          <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-3">Module Overview</h3>
            <p class="text-neutral-600 dark:text-neutral-300 mb-4">
              Funds Transfer Pricing (FTP) module implements Ghana Reference Rate (GRR) based curve 
              construction, Non-Maturing Deposit (NMD) behavioral modeling, deal-level profitability 
              analysis, and Liquidity Transfer Pricing (LTP) attribution.
            </p>

            <h4 class="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2 mt-6">Key Features</h4>
            <ul class="list-disc list-inside text-neutral-600 dark:text-neutral-300 space-y-1 ml-4">
              <li>Ghana Reference Rate (GRR) curve construction</li>
              <li>NMD core/volatile split with BoG caps</li>
              <li>Deal-level profitability calculation</li>
              <li>Liquidity Transfer Pricing (LTP) attribution</li>
              <li>Loan pricing calculator</li>
              <li>Term structure analysis for funding curves</li>
            </ul>
          </div>

          <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">FTP Curve Rates</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="sticky-header">
                  <tr class="bg-neutral-50 dark:bg-neutral-800">
                    <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Tenor</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">FTP Rate (%)</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">GRR + Spread (bps)</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">NMD Beta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of ftpData" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                    <td class="p-3 text-neutral-700 dark:text-neutral-200 font-mono">{{ row.tenor }}</td>
                    <td class="p-3 text-right font-mono text-primary-600">{{ row.rate }}%</td>
                    <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.spread }}bps</td>
                    <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.beta }}</td>
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
export class FTPComponent {
  ftpData = [
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
}