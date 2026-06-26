import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
      <app-sidebar></app-sidebar>
      
      <main class="flex-1 p-8 transition-all duration-300">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-2 font-mono">
            ALM Platform Training
          </h1>
          <p class="text-neutral-600 dark:text-neutral-400 mb-8 text-lg">
            Bank of Ghana 2026-Aligned Asset Liability Management Platform
          </p>

          <!-- Module Interaction Diagram -->
          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Module Interaction</h2>
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 overflow-x-auto">
              <pre class="text-xs text-neutral-700 dark:text-neutral-300 font-mono leading-relaxed">
                     ┌─────────────────────────┐
                     │  DATA FOUNDATION         │
                     │  (MDM, ETL, ALCO, Rules)│
                     │  Ghana Ref Rate, RTGS   │
                     └────────┬────────────────┘
                              │
            ┌─────────────────┼─────────────────┬─────────────────┐
            │                 │                 │                 │
            ▼                 ▼                 ▼                 ▼
     ┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐
     │ LIQUIDITY  │   │  CAPITAL   │   │   ECL      │   │  RECOVERY  │
     │ RISK       │   │ MANAGEMENT │   │ (IFRS 9)   │   │ PLANNING   │
     │ LMTD/LRMD  │   │ RWA/SA     │   │ SICR/PD    │   │ Triggers   │
     └─────┬──────┘   └─────┬──────┘   └─────┬──────┘   └─────┬──────┘
           │                │                │                │
           │                ▼                │                │
           │         ┌────────────┐        │                │
           │         │  BALANCE   │        │                │
           │         │  SHEET     │        │                │
           │         │  OPTIMIZE  │        │                │
           │         └─────┬──────┘        │                │
           │               │               │                │
           └────────┬──────┴────────┬──────┘                │
                    │               │                         │
                    ▼               ▼                         ▼
               ┌────────────┐   ┌────────────┐          ┌────────────┐
               │ INTEREST   │   │  FUNDS     │          │    GRC     │
               │ RATE RISK  │   │ TRANSFER   │          │  RISK FRAME│
               │ IRRBB (19) │   │ PRICING    │          │  3LoD/RAS  │
               └────────────┘   └────────────┘          └────────────┘
                    │               │                         │
                    └───────────────┴─────────────┬─────────────┘
                                                  │
                                                  ▼
                                           ┌────────────┐
                                           │ REGULATORY │
                                           │ REPORTING    │
                                           │ ORASS        │
                                           │ Templates    │
                                           └────────────┘
              </pre>
            </div>
          </section>

          <!-- Module Grid -->
          <section>
            <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Platform Modules</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <module-card 
                title="Liquidity Risk" 
                icon="💧" 
                description="LCR, NSFR, Gap Analysis, Stress Testing for BoG compliance"
                route="/liquidity">
              </module-card>
              <module-card 
                title="Capital Management" 
                icon="🛡" 
                description="CET1, RWA, Leverage Ratio, Output Floor calculations"
                route="/capital">
              </module-card>
              <module-card 
                title="IRRBB" 
                icon="📈" 
                description="EVE Sensitivity, NII Forecast, 19-bucket framework, SOT"
                route="/irrbb">
              </module-card>
              <module-card 
                title="ECL / Credit Risk" 
                icon="⚠" 
                description="IFRS 9 provisioning, SICR triggers, macro scenarios"
                route="/ecl">
              </module-card>
              <module-card 
                title="FTP & Pricing" 
                icon="🔄" 
                description="Ghana Reference Rate curve, NMD modeling, deal profitability"
                route="/ftp">
              </module-card>
              <module-card 
                title="Optimization" 
                icon="🎯" 
                description="NIM attribution, what-if scenarios, balance sheet planning"
                route="/optimization">
              </module-card>
              <module-card
                title="Recovery Planning"
                icon="🔄"
                description="Recovery options, triggers, plan repository, BoG submission"
                route="/recovery">
              </module-card>
              <module-card
                title="GRC"
                icon="🔒"
                description="RMF, Risk Universe, RAS, 3LoD RBAC, Limit Breach Workflow"
                route="/grc">
              </module-card>
              <module-card
                title="Data Foundation"
                icon="🏗"
                description="ETL, MDM, Data Quality, ALCO Workflow, Control Tower"
                route="/data-foundation">
              </module-card>
              <module-card
                title="Regulatory Reporting"
                icon="📋"
                description="BoG templates, ORASS integration, submission scheduler"
                route="/regulatory-reporting">
              </module-card>
              <module-card
                title="Behavioral Models"
                icon="📊"
                description="NMD core/volatile, CPR, TDRR, BoG regulatory caps"
                route="/behavioral-models">
              </module-card>
              <module-card
                title="RTGS Intraday"
                icon="⚡"
                description="Real-time feed, intraday liquidity, LRMD capability"
                route="/rtgs">
              </module-card>
            </div>
          </section>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class LandingPageComponent {}

@Component({
  selector: 'module-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a [routerLink]="route" 
       class="block bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 hover:shadow-lg transition-shadow hover:border-primary-500 dark:hover:border-primary-400">
      <div class="text-3xl mb-3">{{ icon }}</div>
      <h3 class="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-2">{{ title }}</h3>
      <p class="text-neutral-600 dark:text-neutral-400 text-sm">{{ description }}</p>
    </a>
  `,
  inputs: ['title', 'icon', 'description', 'route']
})
export class ModuleCardComponent {}