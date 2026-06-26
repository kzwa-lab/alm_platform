import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TabBarComponent, FeatureCardComponent, StatusBadgeComponent, GhanaRegulatoryDetailComponent } from '../../shared/index';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-capital',
  standalone: true,
  imports: [CommonModule, RouterModule, TabBarComponent, FeatureCardComponent, StatusBadgeComponent, GhanaRegulatoryDetailComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
      <header class="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4">
        <div class="max-w-7xl mx-auto flex items-center gap-4">
          <h1 class="text-2xl font-bold text-neutral-800 dark:text-neutral-100 font-mono">
            <a routerLink="/" class="hover:text-primary-500 transition-colors">BankOS</a>
          </h1>
          <span class="text-neutral-400">|</span>
          <span class="text-neutral-700 dark:text-neutral-300">Capital Management</span>
        </div>
      </header>

      <main class="flex-1 p-6 overflow-y-auto">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">Capital Management Module</h2>
          <p class="text-neutral-500 dark:text-neutral-400 mb-6">Regulatory capital ratios, RWA, ICAAP stress testing, and capital instrument tracking under Bank of Ghana requirements.</p>

          <tab-bar [tabs]="tabs" [activeIndex]="activeTab" (tabChange)="onTabChange($event)"></tab-bar>

          <!-- ===== TAB 1: Capital Ratio Dashboard ===== -->
          @if (activeTab === 0) {
            <feature-card title="Capital Ratio Dashboard" description="Monitor regulatory capital ratios, buffer headroom, and capital allocation across business units."
              [userStories]="[
                'As CRO, I need real-time visibility into CET1, Tier 1, and Total Capital ratios to ensure ongoing BoG compliance.',
                'As Capital Manager, I want to track buffer headroom (CCB, D-SIB, CCyB, Pillar 2A/2B) to avoid restrictions on distributions.',
                'As ALCO Member, I need to see capital consumption by business unit to optimise risk-adjusted returns.',
                'As Compliance Officer, I must verify that all regulatory minima and combined buffer requirements are met before dividend approval.'
              ]">
            </feature-card>

            <ghana-regulatory-detail detail="BoG Capital Adequacy Framework: CET1 minimum 4.5%, Tier 1 minimum 6.0%, Total Capital minimum 8.0%, Leverage Ratio minimum 3.0%. Capital Conservation Buffer: 2.5%. D-SIB surcharge: 0.5-2.0% CET1. Countercyclical buffer set by BoG (currently 0%). Pillar 2A from BoG SREP. ICAAP submitted annually within 4 months of year-end."></ghana-regulatory-detail>

            <div class="grid lg:grid-cols-2 gap-6 mb-6">
              <!-- Capital Stack Table -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Capital Stack</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-neutral-50 dark:bg-neutral-800">
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Capital Tier</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Amount (GHS M)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">% RWA</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Min</th>
                        <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of capitalStack; track row.tier) {
                        <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                          <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.tier }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.amount | number:'1.0-0' }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.percentRWA }}%</td>
                          <td class="p-3 text-right font-mono text-neutral-500 dark:text-neutral-400">{{ row.minimum }}%</td>
                          <td class="p-3 text-center">
                            <status-badge [status]="row.status" [label]="row.status"></status-badge>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart: Capital Stack bar -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Capital Stack Composition</h3>
                <div class="relative" style="height:280px">
                  <canvas #capitalStackChart></canvas>
                </div>
              </div>
            </div>

            <!-- Buffer Headroom Detail -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Buffer Headroom Detail</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Buffer</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Required</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Actual</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Headroom</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of bufferHeadroom; track row.buffer) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.buffer }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.required }}%</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.actual }}%</td>
                        <td class="p-3 text-right font-mono" [ngClass]="row.headroom >= 0 ? 'text-success-600' : 'text-alert-600'">{{ row.headroom >= 0 ? '+' : '' }}{{ row.headroom }}%</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.status" [label]="row.status"></status-badge>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-6 mb-6">
              <!-- Capital Consumption by BU -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Capital Consumption by Business Unit</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-neutral-50 dark:bg-neutral-800">
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">BU</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">RWA (GHS M)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Capital (GHS M)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">ROE</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of buConsumption; track row.bu) {
                        <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                          <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.bu }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.rwa | number:'1.0-0' }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.capital | number:'1.0-0' }}</td>
                          <td class="p-3 text-right font-mono text-success-600">{{ row.roe }}%</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart: 12-month Capital Trend -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">12-Month Capital Trend</h3>
                <div class="relative" style="height:280px">
                  <canvas #capitalTrendChart></canvas>
                </div>
              </div>
            </div>
          }

          <!-- ===== TAB 2: RWA Calculator ===== -->
          @if (activeTab === 1) {
            <ghana-regulatory-detail detail="BoG Standardised Approach: GoG sovereign 0% (GHS) / 20% (FX), BoG 0%, Domestic banks 20-50%, Corporates 20-150%, Retail 75%, SME 75%, Past due 150% (provisions <20%). Off-balance-sheet CCF: 0/20/50/100% per BoG."></ghana-regulatory-detail>

            <div class="grid lg:grid-cols-2 gap-6 mb-6">
              <!-- RWA by Risk Type -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">RWA by Risk Type</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-neutral-50 dark:bg-neutral-800">
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Risk Type</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">RWA (GHS B)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of rwaByRisk; track row.riskType) {
                        <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                          <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.riskType }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.rwa | number:'1.1-1' }}</td>
                          <td class="p-3 text-right font-mono text-neutral-500 dark:text-neutral-400">{{ row.share }}%</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart: RWA Composition donut -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">RWA Composition</h3>
                <div class="relative" style="height:280px">
                  <canvas #rwaCompositionChart></canvas>
                </div>
              </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-6 mb-6">
              <!-- Credit RWA by Exposure Class -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Credit RWA by Exposure Class</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-neutral-50 dark:bg-neutral-800">
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Exposure Class</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">EAD (GHS M)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">RW</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">RWA (GHS M)</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of creditRwa; track row.exposureClass) {
                        <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                          <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.exposureClass }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.ead | number:'1.0-0' }}</td>
                          <td class="p-3 text-right font-mono text-neutral-500 dark:text-neutral-400">{{ row.rw }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.rwa | number:'1.0-0' }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart: Credit RWA by class horizontal bar -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Credit RWA by Exposure Class</h3>
                <div class="relative" style="height:280px">
                  <canvas #creditRwaChart></canvas>
                </div>
              </div>
            </div>
          }

          <!-- ===== TAB 3: ICAAP Stress Testing ===== -->
          @if (activeTab === 2) {
            <ghana-regulatory-detail detail="BoG ICAAP: Pillar 2B add-ons for IRRBB (SOT-based), concentration risk, liquidity risk. Ghana-specific scenarios: sovereign default, currency crisis, commodity price shock."></ghana-regulatory-detail>

            <div class="grid lg:grid-cols-2 gap-6 mb-6">
              <!-- Pillar 2 Breakdown -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Pillar 2 Capital Add-ons</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-neutral-50 dark:bg-neutral-800">
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Risk Type</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Add-on (%)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Capital (GHS M)</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of pillar2Breakdown; track row.riskType) {
                        <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                          <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.riskType }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.addon }}%</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.capital | number:'1.0-0' }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart: Capital Requirement waterfall -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Capital Requirement Waterfall</h3>
                <div class="relative" style="height:280px">
                  <canvas #waterfallChart></canvas>
                </div>
              </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-6 mb-6">
              <!-- 3-Year Capital Projection -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">3-Year Capital Projection</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-neutral-50 dark:bg-neutral-800">
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Metric</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Year 1</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Year 2</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Year 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of capitalProjection; track row.metric) {
                        <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                          <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.metric }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.year1 }}%</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.year2 }}%</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.year3 }}%</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart: Stress Impact -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Stress Scenario Impact</h3>
                <div class="relative" style="height:280px">
                  <canvas #stressImpactChart></canvas>
                </div>
              </div>
            </div>
          }

          <!-- ===== TAB 4: Capital Instrument Tracker ===== -->
          @if (activeTab === 3) {
            <div class="grid lg:grid-cols-2 gap-6 mb-6">
              <!-- Instrument Register -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Capital Instrument Register</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-neutral-50 dark:bg-neutral-800">
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Instrument</th>
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Type</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Amount (GHS M)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Coupon</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Maturity</th>
                        <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Eligible</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of instrumentRegister; track row.instrument) {
                        <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                          <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.instrument }}</td>
                          <td class="p-3 text-neutral-600 dark:text-neutral-300">{{ row.type }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.amount | number:'1.0-0' }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.coupon }}</td>
                          <td class="p-3 text-right font-mono text-neutral-500 dark:text-neutral-400">{{ row.maturity }}</td>
                          <td class="p-3 text-center">
                            <status-badge [status]="row.eligible ? 'compliant' : 'warning'" [label]="row.eligible ? 'Yes' : 'No'"></status-badge>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart: Maturity profile -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Maturity Profile</h3>
                <div class="relative" style="height:280px">
                  <canvas #maturityProfileChart></canvas>
                </div>
              </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-6 mb-6">
              <!-- Maturity Schedule -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Maturity Schedule (Next 5 Years)</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-neutral-50 dark:bg-neutral-800">
                        <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Year</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Maturing (GHS M)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">CET1 Impact (GHS M)</th>
                        <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Refinancing Gap (GHS M)</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of maturitySchedule; track row.year) {
                        <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                          <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.year }}</td>
                          <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.maturing | number:'1.0-0' }}</td>
                          <td class="p-3 text-right font-mono" [ngClass]="row.cet1Impact >= 0 ? 'text-success-600' : 'text-alert-600'">{{ row.cet1Impact | number:'1.0-0' }}</td>
                          <td class="p-3 text-right font-mono" [ngClass]="row.refinancingGap <= 0 ? 'text-success-600' : 'text-alert-600'">{{ row.refinancingGap | number:'1.0-0' }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Chart: Cost of Capital -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Cost of Capital</h3>
                <div class="relative" style="height:280px">
                  <canvas #costOfCapitalChart></canvas>
                </div>
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class CapitalComponent implements AfterViewInit {
  // --- Tab state ---
  tabs = ['Capital Ratio Dashboard', 'RWA Calculator', 'ICAAP Stress Testing', 'Capital Instrument Tracker'];
  activeTab = 0;

  // --- Chart refs ---
  @ViewChild('capitalStackChart') capitalStackChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('capitalTrendChart') capitalTrendChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rwaCompositionChart') rwaCompositionChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('creditRwaChart') creditRwaChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('waterfallChart') waterfallChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('stressImpactChart') stressImpactChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('maturityProfileChart') maturityProfileChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('costOfCapitalChart') costOfCapitalChartRef!: ElementRef<HTMLCanvasElement>;

  private chartInstances: Chart[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.renderCharts();
  }

  onTabChange(index: number) {
    this.activeTab = index;
    this.cdr.detectChanges();
    // Destroy existing charts before re-creating on the new tab
    this.destroyCharts();
    setTimeout(() => this.renderCharts(), 50);
  }

  private destroyCharts() {
    for (const c of this.chartInstances) {
      c.destroy();
    }
    this.chartInstances = [];
  }

  private renderCharts() {
    if (this.activeTab === 0) {
      this.renderCapitalStackChart();
      this.renderCapitalTrendChart();
    } else if (this.activeTab === 1) {
      this.renderRwaCompositionChart();
      this.renderCreditRwaChart();
    } else if (this.activeTab === 2) {
      this.renderWaterfallChart();
      this.renderStressImpactChart();
    } else if (this.activeTab === 3) {
      this.renderMaturityProfileChart();
      this.renderCostOfCapitalChart();
    }
  }

  // ===== CHART RENDERERS =====

  private renderCapitalStackChart() {
    const el = this.capitalStackChartRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['CET1', 'AT1', 'T2', 'CCB', 'TC'],
        datasets: [{
          label: 'Amount (GHS M)',
          data: [4200, 800, 600, 1800, 5600],
          backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#6366f1'],
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private renderCapitalTrendChart() {
    const el = this.capitalTrendChartRef?.nativeElement;
    if (!el) return;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const chart = new Chart(el, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'CET1 (%)',
            data: [14.2, 14.0, 14.3, 14.1, 14.5, 14.8, 14.6, 14.9, 15.1, 14.7, 14.8, 14.8],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 3,
          },
          {
            label: 'Tier 1 (%)',
            data: [17.0, 16.8, 17.1, 16.9, 17.3, 17.6, 17.4, 17.7, 17.9, 17.5, 17.6, 17.6],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139,92,246,0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 3,
          },
          {
            label: 'Total Capital (%)',
            data: [19.0, 18.8, 19.2, 18.9, 19.4, 19.7, 19.5, 19.8, 20.0, 19.6, 19.7, 19.7],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 3,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 12,
            grid: { color: 'rgba(0,0,0,0.05)' }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private renderRwaCompositionChart() {
    const el = this.rwaCompositionChartRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'doughnut',
      data: {
        labels: ['Credit Risk', 'Market Risk', 'Operational Risk', 'CVA Risk'],
        datasets: [{
          data: [8.2, 1.8, 1.2, 0.8],
          backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } }
        },
        cutout: '55%',
      }
    });
    this.chartInstances.push(chart);
  }

  private renderCreditRwaChart() {
    const el = this.creditRwaChartRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['GoG', 'Domestic Banks', 'Corporates', 'Retail', 'SME', 'Past Due', 'OBS'],
        datasets: [{
          label: 'RWA (GHS M)',
          data: [0, 320, 2800, 1800, 1600, 980, 700],
          backgroundColor: ['#6b7280', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'],
          borderRadius: 4,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private renderWaterfallChart() {
    const el = this.waterfallChartRef?.nativeElement;
    if (!el) return;
    // Use a stacked bar approach, hiding specific segments to create waterfall effect
    // Actually use a simple bar chart showing Pillar 2 breakdown + Pillar 1 base
    const chart = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['Pillar 1\n(Base 8%)', 'IRRBB', 'Concentration', 'Liquidity', 'Operational', 'Strategic', 'Total'],
        datasets: [{
          label: 'Capital Requirement (%)',
          data: [8.0, 0.5, 0.3, 0.2, 0.3, 0.2, 9.5],
          backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#6366f1'],
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private renderStressImpactChart() {
    const el = this.stressImpactChartRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['Sovereign Default', 'Currency Crisis', 'Commodity Shock', 'Recession', 'Combined'],
        datasets: [
          {
            label: 'Pre-Stress CET1 (%)',
            data: [14.8, 14.8, 14.8, 14.8, 14.8],
            backgroundColor: 'rgba(59,130,246,0.5)',
            borderRadius: 4,
          },
          {
            label: 'Post-Stress CET1 (%)',
            data: [12.1, 10.4, 13.2, 11.8, 8.9],
            backgroundColor: 'rgba(239,68,68,0.7)',
            borderRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private renderMaturityProfileChart() {
    const el = this.maturityProfileChartRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['2026', '2027', '2028', '2029', '2030', '2030+'],
        datasets: [{
          label: 'Maturing Amount (GHS M)',
          data: [200, 800, 600, 1200, 1400, 2000],
          backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#6366f1'],
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private renderCostOfCapitalChart() {
    const el = this.costOfCapitalChartRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['CET1\n(Equity)', 'AT1\n(Perpetual)', 'T2\n(Sub Debt)', 'Preferred\nStock', 'Avg\nWACC'],
        datasets: [{
          label: 'Cost (%)',
          data: [14.5, 8.2, 6.5, 7.0, 11.2],
          backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#6366f1'],
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { callback: (val) => val + '%' }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  // ===== DATA =====

  capitalStack = [
    { tier: 'CET1 Capital', amount: 4200, percentRWA: 14.8, minimum: 4.5, status: 'Compliant' },
    { tier: 'Additional Tier 1', amount: 800, percentRWA: 2.8, minimum: 0, status: 'Compliant' },
    { tier: 'Tier 2 Capital', amount: 600, percentRWA: 2.1, minimum: 0, status: 'Compliant' },
    { tier: 'Capital Conservation Buffer', amount: 1800, percentRWA: 6.3, minimum: 2.5, status: 'Compliant' },
    { tier: 'Total Capital Ratio', amount: 5600, percentRWA: 19.7, minimum: 8.0, status: 'Compliant' },
  ];

  bufferHeadroom = [
    { buffer: 'CET1 Minimum', required: 4.5, actual: 14.8, headroom: 10.3, status: 'Compliant' },
    { buffer: 'Capital Conservation Buffer', required: 2.5, actual: 6.3, headroom: 3.8, status: 'Compliant' },
    { buffer: 'D-SIB Surcharge', required: 1.0, actual: 14.8, headroom: 13.8, status: 'Compliant' },
    { buffer: 'Countercyclical Buffer', required: 0.0, actual: 14.8, headroom: 14.8, status: 'Compliant' },
    { buffer: 'Pillar 2A (SREP)', required: 2.0, actual: 14.8, headroom: 12.8, status: 'Compliant' },
    { buffer: 'Pillar 2B (ICAAP)', required: 1.5, actual: 14.8, headroom: 13.3, status: 'Compliant' },
  ];

  buConsumption = [
    { bu: 'Retail Banking', rwa: 4200, capital: 820, roe: 18.5 },
    { bu: 'Corporate Banking', rwa: 3800, capital: 740, roe: 14.2 },
    { bu: 'Treasury', rwa: 1800, capital: 350, roe: 9.8 },
    { bu: 'SME Banking', rwa: 2700, capital: 530, roe: 16.1 },
  ];

  rwaByRisk = [
    { riskType: 'Credit Risk', rwa: 8.2, share: 65.6 },
    { riskType: 'Market Risk', rwa: 1.8, share: 14.4 },
    { riskType: 'Operational Risk', rwa: 1.2, share: 9.6 },
    { riskType: 'CVA Risk', rwa: 0.8, share: 6.4 },
    { riskType: 'Total', rwa: 12.5, share: 100.0 },
  ];

  creditRwa = [
    { exposureClass: 'GoG Sovereign (GHS)', ead: 5000, rw: '0%', rwa: 0 },
    { exposureClass: 'Domestic Banks', ead: 1600, rw: '20%', rwa: 320 },
    { exposureClass: 'Corporates', ead: 2800, rw: '100%', rwa: 2800 },
    { exposureClass: 'Retail', ead: 2400, rw: '75%', rwa: 1800 },
    { exposureClass: 'SME', ead: 2133, rw: '75%', rwa: 1600 },
    { exposureClass: 'Past Due (<20% prov)', ead: 653, rw: '150%', rwa: 980 },
    { exposureClass: 'OBS (weighted CCF)', ead: 1400, rw: '50%', rwa: 700 },
  ];

  pillar2Breakdown = [
    { riskType: 'IRRBB (SOT-based)', addon: 0.5, capital: 280 },
    { riskType: 'Concentration Risk', addon: 0.3, capital: 170 },
    { riskType: 'Liquidity Risk', addon: 0.2, capital: 110 },
    { riskType: 'Operational Risk', addon: 0.3, capital: 170 },
    { riskType: 'Strategic Risk', addon: 0.2, capital: 110 },
  ];

  capitalProjection = [
    { metric: 'CET1 Ratio', year1: 14.8, year2: 14.2, year3: 13.5 },
    { metric: 'Tier 1 Ratio', year1: 17.6, year2: 17.0, year3: 16.3 },
    { metric: 'Total Capital', year1: 19.7, year2: 19.1, year3: 18.4 },
    { metric: 'Leverage Ratio', year1: 5.8, year2: 5.6, year3: 5.3 },
  ];

  instrumentRegister = [
    { instrument: 'Common Equity', type: 'CET1', amount: 4000, coupon: 'Variable', maturity: 'Perpetual', eligible: true },
    { instrument: 'Retained Earnings', type: 'CET1', amount: 200, coupon: 'N/A', maturity: 'Perpetual', eligible: true },
    { instrument: 'Perpetual Bond Series A', type: 'AT1', amount: 500, coupon: '8.50%', maturity: 'Perpetual (Call 2029)', eligible: true },
    { instrument: 'Perpetual Bond Series B', type: 'AT1', amount: 300, coupon: '7.75%', maturity: 'Perpetual (Call 2028)', eligible: true },
    { instrument: 'Sub Debt Tranche 1', type: 'T2', amount: 400, coupon: '6.25%', maturity: '15-Jun-2032', eligible: true },
    { instrument: 'Sub Debt Tranche 2', type: 'T2', amount: 200, coupon: '5.80%', maturity: '30-Sep-2028', eligible: true },
    { instrument: 'Legacy Preferred', type: 'Grandfathered', amount: 150, coupon: '9.00%', maturity: 'Perpetual', eligible: false },
  ];

  maturitySchedule = [
    { year: '2026', maturing: 200, cet1Impact: -200, refinancingGap: 200 },
    { year: '2027', maturing: 800, cet1Impact: -180, refinancingGap: 620 },
    { year: '2028', maturing: 600, cet1Impact: -150, refinancingGap: 450 },
    { year: '2029', maturing: 1200, cet1Impact: -300, refinancingGap: 900 },
    { year: '2030', maturing: 1400, cet1Impact: -400, refinancingGap: 1000 },
  ];
}
