import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ModuleCardComponent } from '../../shared/module-card.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, ModuleCardComponent],
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
          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Module Interaction</h2>
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 overflow-x-auto">
              <pre class="text-xs text-neutral-700 dark:text-neutral-300 font-mono leading-relaxed">
                     &#x250C;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2510;
                     &#x2502;  DATA FOUNDATION         &#x2502;
                     &#x2502;  (MDM, ETL, ALCO, Rules)&#x2502;
                     &#x2502;  Ghana Ref Rate, RTGS   &#x2502;
                     &#x2514;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x252C;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2518;
              </pre>
            </div>
          </section>
          <section>
            <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Platform Modules</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <module-card title="Liquidity Risk" icon="&#x1F4A7;" description="LCR, NSFR, Gap Analysis, Stress Testing for BoG compliance" route="/liquidity"></module-card>
              <module-card title="Capital Management" icon="&#x1F6E1;" description="CET1, RWA, Leverage Ratio, Output Floor calculations" route="/capital"></module-card>
              <module-card title="IRRBB" icon="&#x1F4C8;" description="EVE Sensitivity, NII Forecast, 19-bucket framework, SOT" route="/irrbb"></module-card>
              <module-card title="ECL / Credit Risk" icon="&#x26A0;" description="IFRS 9 provisioning, SICR triggers, macro scenarios" route="/ecl"></module-card>
              <module-card title="FTP & Pricing" icon="&#x1F504;" description="Ghana Reference Rate curve, NMD modeling, deal profitability" route="/ftp"></module-card>
              <module-card title="Optimization" icon="&#x1F3AF;" description="NIM attribution, what-if scenarios, balance sheet planning" route="/optimization"></module-card>
              <module-card title="Recovery Planning" icon="&#x1F504;" description="Recovery options, triggers, plan repository, BoG submission" route="/recovery"></module-card>
              <module-card title="GRC" icon="&#x1F512;" description="RMF, Risk Universe, RAS, 3LoD RBAC, Limit Breach Workflow" route="/grc"></module-card>
              <module-card title="Data Foundation" icon="&#x1F3D7;" description="ETL, MDM, Data Quality, ALCO Workflow, Control Tower" route="/data-foundation"></module-card>
              <module-card title="Regulatory Reporting" icon="&#x1F4CB;" description="BoG templates, ORASS integration, submission scheduler" route="/regulatory-reporting"></module-card>
              <module-card title="Behavioral Models" icon="&#x1F4CA;" description="NMD core/volatile, CPR, TDRR, BoG regulatory caps" route="/behavioral-models"></module-card>
              <module-card title="RTGS Intraday" icon="&#x26A1;" description="Real-time feed, intraday liquidity, LRMD capability" route="/rtgs"></module-card>
            </div>
          </section>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class LandingPageComponent {}
