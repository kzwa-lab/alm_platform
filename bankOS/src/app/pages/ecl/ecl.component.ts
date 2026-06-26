import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ecl',
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
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">ECL / Credit Risk Module</h2>
          
          <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-3">Module Overview</h3>
            <p class="text-neutral-600 dark:text-neutral-300 mb-4">
              Expected Credit Loss (ECL) module implements IFRS 9 compliant credit risk provisioning 
              with stage migration monitoring, SICR triggers, and macroeconomic scenario adjustments 
              for the Ghanaian banking environment.
            </p>

            <h4 class="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2 mt-6">Key Features</h4>
            <ul class="list-disc list-inside text-neutral-600 dark:text-neutral-300 space-y-1 ml-4">
              <li>IFRS 9 Stage 1/2/3 provision calculation</li>
              <li>SICR (Significant Increase in Credit Risk) trigger monitoring</li>
              <li>Ghana macro scenarios (GDP, inflation, exchange rate factors)</li>
              <li>PD/LGD/EAD parameter management</li>
              <li>Post-Model Adjustments (PMA) tracking</li>
              <li>Collective vs Individual provision breakdown</li>
            </ul>
          </div>

          <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">ECL Provision by Stage</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="sticky-header">
                  <tr class="bg-neutral-50 dark:bg-neutral-800">
                    <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Stage</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Exposure (€M)</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">PD (%)</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">LGD (%)</th>
                    <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">ECL (€M)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of eclData" class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                    <td class="p-3 font-medium" [ngClass]="{
                      'text-success-600': row.stage === 1,
                      'text-warning-600': row.stage === 2,
                      'text-alert-600': row.stage === 3
                    }">{{ row.stage === 1 ? 'Stage 1 (Performing)' : (row.stage === 2 ? 'Stage 2 (SICR)' : 'Stage 3 (Defaulted)') }}</td>
                    <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.exposure | number:'1.0-0' }}</td>
                    <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.pd }}%</td>
                    <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.lgd }}%</td>
                    <td class="p-3 text-right font-mono font-semibold text-neutral-700 dark:text-neutral-200">{{ row.ecl | number:'1.0-0' }}</td>
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
export class ECLComponent {
  eclData = [
    { stage: 1, exposure: 12500, pd: 0.8, lgd: 45, ecl: 479 },
    { stage: 2, exposure: 3200, pd: 8.5, lgd: 65, ecl: 181 },
    { stage: 3, exposure: 450, pd: 45.0, lgd: 85, ecl: 166 },
  ];
}