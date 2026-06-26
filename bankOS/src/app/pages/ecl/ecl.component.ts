import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { TabBarComponent, FeatureCardComponent, StatusBadgeComponent, GhanaRegulatoryDetailComponent } from '../../shared/index';

@Component({
  selector: 'app-ecl',
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
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">ECL / Credit Risk Module</h2>

          <tab-bar [tabs]="tabLabels" [activeIndex]="activeTab" (tabChange)="onTabChange($event)"></tab-bar>

          <!-- TAB 1: ECL Calculator -->
          @if (activeTab === 0) {
            <feature-card
              [title]="'ECL Calculator – Three-Stage Model'"
              [description]="'Calculate Expected Credit Loss under IFRS 9 for Ghanaian banking portfolios using the three-stage impairment model.'"
              [userStories]="eclCalculatorStories"
            ></feature-card>

            <ghana-regulatory-detail [detail]="eclRegulatoryDetail"></ghana-regulatory-detail>

            <!-- Table 1: ECL by Stage -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">ECL Provision by Stage</h3>
              <div class="overflow-x-auto max-h-80 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Stage</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Exposure (&#8373;M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">PD (%)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">LGD (%)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">ECL (&#8373;M)</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of eclData; track row.stage) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium"
                          [ngClass]="{
                            'text-success-600': row.stage === 1,
                            'text-warning-600': row.stage === 2,
                            'text-alert-600': row.stage === 3
                          }">
                          Stage {{ row.stage }} ({{ row.stage === 1 ? 'Performing' : (row.stage === 2 ? 'SICR' : 'Defaulted') }})
                        </td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.exposure | number:'1.0-0' }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.pd }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.lgd }}</td>
                        <td class="p-3 text-right font-mono font-semibold text-neutral-700 dark:text-neutral-200">{{ row.ecl | number:'1.0-0' }}</td>
                      </tr>
                    }
                  </tbody>
                  <tfoot>
                    <tr class="bg-neutral-100 dark:bg-neutral-700 font-semibold">
                      <td class="p-3 text-neutral-800 dark:text-neutral-100">Total</td>
                      <td class="p-3 text-right font-mono text-neutral-800 dark:text-neutral-100">{{ totalExposure | number:'1.0-0' }}</td>
                      <td class="p-3"></td>
                      <td class="p-3"></td>
                      <td class="p-3 text-right font-mono text-neutral-800 dark:text-neutral-100">{{ totalEcl | number:'1.0-0' }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Table 2: Portfolio Breakdown by Segment -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Portfolio Breakdown by Segment</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Segment</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Exposure (&#8373;bn)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">ECL (&#8373;M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">ECL Rate (%)</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (seg of portfolioSegments; track seg.name) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ seg.name }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ seg.exposure }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ seg.ecl | number:'1.0-0' }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ seg.eclRate }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="seg.status" [label]="seg.statusLabel"></status-badge>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 3: Scenario-Weighted ECL -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Scenario-Weighted ECL</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Scenario</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Weight (%)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">ECL (&#8373;M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Weighted ECL (&#8373;M)</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (sc of scenarioEcl; track sc.name) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ sc.name }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ sc.weight }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ sc.ecl | number:'1.0-0' }}</td>
                        <td class="p-3 text-right font-mono font-semibold text-neutral-700 dark:text-neutral-200">{{ sc.weightedEcl | number:'1.0-0' }}</td>
                      </tr>
                    }
                  </tbody>
                  <tfoot>
                    <tr class="bg-neutral-100 dark:bg-neutral-700 font-semibold">
                      <td class="p-3 text-neutral-800 dark:text-neutral-100">Total</td>
                      <td class="p-3 text-right font-mono text-neutral-800 dark:text-neutral-100">100%</td>
                      <td class="p-3"></td>
                      <td class="p-3 text-right font-mono text-neutral-800 dark:text-neutral-100">{{ totalScenarioEcl | number:'1.0-0' }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">ECL by Stage</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="eclChart1"></canvas>
                </div>
              </div>
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Portfolio ECL by Segment</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="eclChart2"></canvas>
                </div>
              </div>
            </div>
          }

          <!-- TAB 2: Macroeconomic Scenario Manager -->
          @if (activeTab === 1) {
            <feature-card
              [title]="'Macroeconomic Scenario Manager'"
              [description]="'Define and manage Ghana-specific macroeconomic variables across multiple scenarios for IFRS 9 ECL calculation.'"
              [userStories]="macroScenarioStories"
            ></feature-card>

            <ghana-regulatory-detail [detail]="macroRegulatoryDetail"></ghana-regulatory-detail>

            <!-- Table 1: Scenario Variables -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Scenario Variables</h3>
              <div class="overflow-x-auto max-h-96 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700 min-w-[140px]">Variable</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Base</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Upside</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Downside</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Severe</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of scenarioVariables; track row.variable) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ row.variable }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.base }}</td>
                        <td class="p-3 text-right font-mono text-success-600">{{ row.upside }}</td>
                        <td class="p-3 text-right font-mono text-warning-600">{{ row.downside }}</td>
                        <td class="p-3 text-right font-mono text-alert-600">{{ row.severe }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: ECL Sensitivity -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">ECL Sensitivity (&#177;1pp Change Impact)</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Variable</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">+1pp Impact (&#8373;M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">&#8722;1pp Impact (&#8373;M)</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Direction</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of eclSensitivity; track row.variable) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ row.variable }}</td>
                        <td class="p-3 text-right font-mono"
                          [ngClass]="row.positiveImpact >= 0 ? 'text-alert-600' : 'text-success-600'">
                          {{ row.positiveImpact >= 0 ? '+' : '' }}{{ row.positiveImpact | number:'1.0-1' }}
                        </td>
                        <td class="p-3 text-right font-mono"
                          [ngClass]="row.negativeImpact >= 0 ? 'text-alert-600' : 'text-success-600'">
                          {{ row.negativeImpact >= 0 ? '+' : '' }}{{ row.negativeImpact | number:'1.0-1' }}
                        </td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.direction" [label]="row.directionLabel"></status-badge>
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
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Scenario Comparison (3-Year Projection)</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="eclChart3"></canvas>
                </div>
              </div>
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">ECL Sensitivity Tornado</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="eclChart4"></canvas>
                </div>
              </div>
            </div>
          }

          <!-- TAB 3: SICR Monitoring & Stage Migration -->
          @if (activeTab === 2) {
            <feature-card
              [title]="'SICR Monitoring & Stage Migration'"
              [description]="'Track significant increases in credit risk triggers and monitor stage migration across the portfolio.'"
              [userStories]="sicrMonitoringStories"
            ></feature-card>

            <ghana-regulatory-detail [detail]="sicrRegulatoryDetail"></ghana-regulatory-detail>

            <!-- Table 1: SICR Trigger Log -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">SICR Trigger Log</h3>
              <div class="overflow-x-auto max-h-80 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Date</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Instrument</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Trigger Type</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Old Stage</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">New Stage</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">ECL Impact (&#8373;M)</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (event of sicrTriggerLog; track event.date + event.instrument) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-mono text-sm text-neutral-700 dark:text-neutral-200">{{ event.date }}</td>
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ event.instrument }}</td>
                        <td class="p-3">
                          <status-badge [status]="event.triggerColor" [label]="event.triggerType"></status-badge>
                        </td>
                        <td class="p-3 text-center">
                          <status-badge [status]="event.oldStageColor" [label]="'Stage ' + event.oldStage"></status-badge>
                        </td>
                        <td class="p-3 text-center">
                          <status-badge [status]="event.newStageColor" [label]="'Stage ' + event.newStage"></status-badge>
                        </td>
                        <td class="p-3 text-right font-mono font-semibold text-neutral-700 dark:text-neutral-200">{{ event.eclImpact | number:'1.0-1' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Stage Migration Matrix -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Stage Migration Matrix</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">From &rarr; To</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Stage 1</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Stage 2</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Stage 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of stageMigrationMatrix; track row.from) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">Stage {{ row.from }}</td>
                        <td class="p-3 text-center font-mono text-neutral-700 dark:text-neutral-200"
                            [ngClass]="{'bg-success-50 dark:bg-success-900/10': row.from === 1}">{{ row.toStage1 }}</td>
                        <td class="p-3 text-center font-mono text-neutral-700 dark:text-neutral-200"
                            [ngClass]="{'bg-warning-50 dark:bg-warning-900/10': row.from === 2}">{{ row.toStage2 }}</td>
                        <td class="p-3 text-center font-mono text-neutral-700 dark:text-neutral-200"
                            [ngClass]="{'bg-alert-50 dark:bg-alert-900/10': row.from === 3}">{{ row.toStage3 }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Stage Migration Flow</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="eclChart5"></canvas>
                </div>
              </div>
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">SICR Trend (New Triggers per Month)</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="eclChart6"></canvas>
                </div>
              </div>
            </div>
          }

          <!-- TAB 4: Overlay Governance & PMA -->
          @if (activeTab === 3) {
            <feature-card
              [title]="'Overlay Governance & Post-Model Adjustments'"
              [description]="'Track and govern post-model adjustments (PMA) and management overlays applied to ECL calculations.'"
              [userStories]="overlayGovernanceStories"
            ></feature-card>

            <ghana-regulatory-detail [detail]="overlayRegulatoryDetail"></ghana-regulatory-detail>

            <!-- Table 1: PMA Register -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">PMA Register</h3>
              <div class="overflow-x-auto max-h-80 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Portfolio</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Adjustment Type</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Amount (&#8373;M)</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Rationale</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Approver</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Effective</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Expiry</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (pma of pmaRegister; track pma.portfolio + pma.effectiveDate) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ pma.portfolio }}</td>
                        <td class="p-3">
                          <status-badge [status]="pma.typeColor" [label]="pma.adjustmentType"></status-badge>
                        </td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ pma.amount | number:'1.0-1' }}</td>
                        <td class="p-3 text-sm text-neutral-600 dark:text-neutral-300 max-w-[200px] truncate">{{ pma.rationale }}</td>
                        <td class="p-3 text-sm text-neutral-700 dark:text-neutral-200">{{ pma.approver }}</td>
                        <td class="p-3 font-mono text-sm text-neutral-700 dark:text-neutral-200">{{ pma.effectiveDate }}</td>
                        <td class="p-3 font-mono text-sm text-neutral-700 dark:text-neutral-200">{{ pma.expiryDate }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: Overlay Backtesting -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Overlay Backtesting</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="sticky-header">
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">PMA Name</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">PMA Amount (&#8373;M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Actual Impact (&#8373;M)</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Variance (&#8373;M)</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (bt of overlayBacktesting; track bt.name) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-medium text-neutral-800 dark:text-neutral-200">{{ bt.name }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ bt.pmaAmount | number:'1.0-1' }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ bt.actualImpact | number:'1.0-1' }}</td>
                        <td class="p-3 text-right font-mono font-semibold"
                          [ngClass]="bt.variance >= 0 ? 'text-alert-600' : 'text-success-600'">
                          {{ bt.variance >= 0 ? '+' : '' }}{{ bt.variance | number:'1.0-1' }}
                        </td>
                        <td class="p-3 text-center">
                          <status-badge [status]="bt.status" [label]="bt.statusLabel"></status-badge>
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
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Overlay Impact by Portfolio</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="eclChart7"></canvas>
                </div>
              </div>
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Backtesting Accuracy</h3>
                <div class="relative" style="height: 280px;">
                  <canvas id="eclChart8"></canvas>
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
export class ECLComponent implements AfterViewInit, OnDestroy {
  tabLabels = ['ECL Calculator', 'Macroeconomic Scenario Manager', 'SICR Monitoring & Stage Migration', 'Overlay Governance & PMA'];
  activeTab = 0;

  private chartInstances: Chart[] = [];

  // ── Data: Tab 1 (ECL Calculator) ──────────────────────────────────

  eclData = [
    { stage: 1, exposure: 12500, pd: '0.8%', lgd: '45%', ecl: 479 },
    { stage: 2, exposure: 3200, pd: '8.5%', lgd: '65%', ecl: 181 },
    { stage: 3, exposure: 450, pd: '45.0%', lgd: '85%', ecl: 166 },
  ];

  get totalExposure(): number {
    return this.eclData.reduce((s, r) => s + r.exposure, 0);
  }

  get totalEcl(): number {
    return this.eclData.reduce((s, r) => s + r.ecl, 0);
  }

  portfolioSegments = [
    { name: 'Mortgages', exposure: 8.5, ecl: 285, eclRate: '3.4%', status: 'green' as const, statusLabel: 'Stable' },
    { name: 'Corporate', exposure: 4.2, ecl: 198, eclRate: '4.7%', status: 'amber' as const, statusLabel: 'Watch' },
    { name: 'SME', exposure: 2.8, ecl: 156, eclRate: '5.6%', status: 'amber' as const, statusLabel: 'Watch' },
    { name: 'Consumer', exposure: 1.5, ecl: 97, eclRate: '6.5%', status: 'red' as const, statusLabel: 'Action' },
    { name: 'Agriculture', exposure: 0.8, ecl: 58, eclRate: '7.3%', status: 'red' as const, statusLabel: 'Action' },
  ];

  scenarioEcl = [
    { name: 'Base', weight: '50%', ecl: 826, weightedEcl: 413 },
    { name: 'Upside', weight: '20%', ecl: 512, weightedEcl: 102 },
    { name: 'Downside', weight: '20%', ecl: 1340, weightedEcl: 268 },
    { name: 'Severe', weight: '10%', ecl: 2150, weightedEcl: 215 },
  ];

  get totalScenarioEcl(): number {
    return this.scenarioEcl.reduce((s, r) => s + r.weightedEcl, 0);
  }

  eclCalculatorStories = [
    'Credit Risk Manager: Run monthly ECL calculation batch for all portfolios with stage allocation logic.',
    'Finance / Accounting: Review IFRS 9 provisions by stage for quarterly financial reporting and disclosures.',
    'ALCO Member: Assess the impact of macro scenarios on ECL and ensure adequate capital under ICAAP.',
    'Compliance Officer: Validate ECL methodology against Bank of Ghana IFRS 9 guidelines and BoG 2026 directives.',
  ];

  eclRegulatoryDetail = 'IFRS 9 ECL: Three-stage model (Stage 1: 12-month ECL, Stage 2: Lifetime ECL for SICR, Stage 3: Lifetime ECL for credit-impaired). SICR triggers: PD deterioration >3x at origination, 30+ DPD, forbearance, watch list, rating downgrade >=3 notches. Ghana-specific sectoral adjustments: agriculture (drought risk), mining (commodity price volatility), trade (GHS/USD volatility). POCI assets treated separately.';

  // ── Data: Tab 2 (Macroeconomic Scenario Manager) ──────────────────

  scenarioVariables = [
    { variable: 'GDP Growth (%)', base: '4.5', upside: '6.0', downside: '2.5', severe: '0.5' },
    { variable: 'Inflation - CPI (%)', base: '18.5', upside: '14.0', downside: '24.0', severe: '30.0' },
    { variable: 'BoG Policy Rate (%)', base: '24.5', upside: '21.0', downside: '28.0', severe: '32.0' },
    { variable: 'GHS/USD (GHS/$)', base: '15.8', upside: '13.5', downside: '18.5', severe: '22.0' },
    { variable: 'GoT-Bill Yield (%)', base: '22.0', upside: '18.0', downside: '27.0', severe: '32.0' },
    { variable: 'Cocoa Price ($/tonne)', base: '4500', upside: '5200', downside: '3600', severe: '2800' },
    { variable: 'Gold Price ($/oz)', base: '2200', upside: '2600', downside: '1800', severe: '1500' },
    { variable: 'Oil Price ($/bbl)', base: '82', upside: '70', downside: '100', severe: '120' },
  ];

  eclSensitivity = [
    { variable: 'GDP Growth', positiveImpact: -42.5, negativeImpact: 58.3, direction: 'amber' as const, directionLabel: 'Inverse' },
    { variable: 'Inflation (CPI)', positiveImpact: 35.2, negativeImpact: -28.1, direction: 'green' as const, directionLabel: 'Direct' },
    { variable: 'BoG Policy Rate', positiveImpact: 22.8, negativeImpact: -18.4, direction: 'amber' as const, directionLabel: 'Inverse' },
    { variable: 'GHS/USD', positiveImpact: 48.6, negativeImpact: -35.2, direction: 'red' as const, directionLabel: 'Direct' },
    { variable: 'GoT-Bill Yield', positiveImpact: 12.4, negativeImpact: -9.8, direction: 'amber' as const, directionLabel: 'Inverse' },
    { variable: 'Cocoa Price', positiveImpact: -8.2, negativeImpact: 14.7, direction: 'green' as const, directionLabel: 'Inverse' },
    { variable: 'Gold Price', positiveImpact: -5.6, negativeImpact: 9.3, direction: 'green' as const, directionLabel: 'Inverse' },
    { variable: 'Oil Price', positiveImpact: 18.9, negativeImpact: -12.5, direction: 'amber' as const, directionLabel: 'Direct' },
  ];

  macroScenarioStories = [
    'Economist: Define and calibrate Ghana-specific macro variables for IFRS 9 scenario generation.',
    'Risk Manager: Run scenario sensitivity analysis to identify key ECL drivers for the portfolio.',
    'ALCO Member: Review scenario weights and approve forward-looking assumptions for ECL.',
    'Regulatory Reporting: Document scenario methodology for BoG regulatory submissions.',
  ];

  macroRegulatoryDetail = 'Ghana-specific macro variables: GDP growth, inflation (CPI), BoG policy rate, GHS/USD exchange rate, GoT-bill yield, cocoa price, gold price, oil price. Scenario weights: Base 50%, Upside 20%, Downside 20%, Severe 10%. Variables must be plausible and internally consistent.';

  // ── Data: Tab 3 (SICR Monitoring & Stage Migration) ───────────────

  sicrTriggerLog = [
    { date: '2026-03-15', instrument: 'Tema Port Terminal Loan', triggerType: 'PD Deterioration >3x', triggerColor: 'red' as const, oldStage: 1, oldStageColor: 'green' as const, newStage: 2, newStageColor: 'amber' as const, eclImpact: 12.5 },
    { date: '2026-03-10', instrument: 'Kumasi SME Facility', triggerType: '30+ DPD', triggerColor: 'amber' as const, oldStage: 1, oldStageColor: 'green' as const, newStage: 2, newStageColor: 'amber' as const, eclImpact: 3.8 },
    { date: '2026-03-08', instrument: 'Obuasi Mining Credit', triggerType: 'Watch List', triggerColor: 'red' as const, oldStage: 2, oldStageColor: 'amber' as const, newStage: 3, newStageColor: 'red' as const, eclImpact: 28.4 },
    { date: '2026-03-05', instrument: 'Accra Corporate Bond', triggerType: 'Rating Downgrade >=3', triggerColor: 'red' as const, oldStage: 1, oldStageColor: 'green' as const, newStage: 2, newStageColor: 'amber' as const, eclImpact: 6.2 },
    { date: '2026-02-28', instrument: 'Takoradi Port Loan', triggerType: 'Forbearance', triggerColor: 'red' as const, oldStage: 2, oldStageColor: 'amber' as const, newStage: 3, newStageColor: 'red' as const, eclImpact: 15.7 },
    { date: '2026-02-20', instrument: 'Koforidua Agric Loan', triggerType: '30+ DPD', triggerColor: 'amber' as const, oldStage: 1, oldStageColor: 'green' as const, newStage: 2, newStageColor: 'amber' as const, eclImpact: 2.1 },
    { date: '2026-02-15', instrument: 'Cocoa Marketing Board', triggerType: 'Watch List', triggerColor: 'amber' as const, oldStage: 1, oldStageColor: 'green' as const, newStage: 2, newStageColor: 'amber' as const, eclImpact: 9.6 },
    { date: '2026-02-10', instrument: 'West African Gold Refinery', triggerType: 'PD Deterioration >3x', triggerColor: 'red' as const, oldStage: 1, oldStageColor: 'green' as const, newStage: 2, newStageColor: 'amber' as const, eclImpact: 4.3 },
  ];

  stageMigrationMatrix = [
    { from: 1, toStage1: '12,450', toStage2: '320', toStage3: '15' },
    { from: 2, toStage1: '85', toStage2: '1,850', toStage3: '210' },
    { from: 3, toStage1: '0', toStage2: '12', toStage3: '780' },
  ];

  sicrMonitoringStories = [
    'Credit Risk Manager: Monitor SICR triggers daily and ensure timely stage reclassification for all instruments.',
    'Risk Analyst: Investigate trigger patterns and update remediation plans for migrated exposures.',
    'Compliance Officer: Verify SICR thresholds align with IFRS 9 and BoG regulatory definitions.',
    'Portfolio Manager: Review stage migration trends and assess impact on portfolio risk profile.',
  ];

  sicrRegulatoryDetail = 'SICR triggers monitored: PD deterioration >3x at origination, 30+ DPD, forbearance measures, watch list inclusion, rating downgrade >=3 notches. Ghana-specific thresholds apply to agriculture and commodity sectors per BoG 2026 guidelines. Reclassification must be evidenced and documented within 5 business days.';

  // ── Data: Tab 4 (Overlay Governance & PMA) ────────────────────────

  pmaRegister = [
    { portfolio: 'Agriculture Portfolio', adjustmentType: 'Sectoral Overlay', typeColor: 'amber' as const, amount: 24.5, rationale: 'Drought impact on cocoa belt yields', approver: 'CRO', effectiveDate: '2026-01-01', expiryDate: '2026-06-30' },
    { portfolio: 'SME Portfolio', adjustmentType: 'Economic Uncertainty', typeColor: 'amber' as const, amount: 18.2, rationale: 'GHS volatility and imported inflation', approver: 'CRO', effectiveDate: '2026-02-01', expiryDate: '2026-07-31' },
    { portfolio: 'Corporate - Mining', adjustmentType: 'Commodity Price', typeColor: 'red' as const, amount: 32.0, rationale: 'Gold price decline and operational cost pressures', approver: 'Board Credit Committee', effectiveDate: '2026-01-15', expiryDate: '2026-09-30' },
    { portfolio: 'Consumer Loans', adjustmentType: 'Model Risk', typeColor: 'green' as const, amount: 8.5, rationale: 'PD model recalibration for consumer segment', approver: 'Head of Risk', effectiveDate: '2026-03-01', expiryDate: '2026-08-31' },
    { portfolio: 'Trade Finance', adjustmentType: 'FX Volatility', typeColor: 'red' as const, amount: 15.8, rationale: 'GHS/USD depreciation and import cost pass-through', approver: 'ALCO', effectiveDate: '2026-02-15', expiryDate: '2026-08-15' },
  ];

  overlayBacktesting = [
    { name: 'Agriculture Sectoral Overlay', pmaAmount: 24.5, actualImpact: 22.1, variance: -2.4, status: 'green' as const, statusLabel: 'Within Range' },
    { name: 'SME Economic Uncertainty', pmaAmount: 18.2, actualImpact: 21.8, variance: 3.6, status: 'amber' as const, statusLabel: 'Overestimated' },
    { name: 'Mining Commodity Price', pmaAmount: 32.0, actualImpact: 28.5, variance: -3.5, status: 'amber' as const, statusLabel: 'Overestimated' },
    { name: 'Consumer Model Risk', pmaAmount: 8.5, actualImpact: 7.2, variance: -1.3, status: 'green' as const, statusLabel: 'Within Range' },
    { name: 'Trade Finance FX Volatility', pmaAmount: 15.8, actualImpact: 19.4, variance: 3.6, status: 'red' as const, statusLabel: 'Action Required' },
  ];

  overlayGovernanceStories = [
    'Risk Manager: Document and track all post-model adjustments with proper justification and approval.',
    'Internal Audit: Verify PMA governance framework compliance and overlay backtesting results.',
    'CRO: Approve management overlays and ensure they are time-bound with expiry monitoring.',
    'Board Risk Committee: Review material PMAs and challenge management judgement overlays.',
  ];

  overlayRegulatoryDetail = 'Post-Model Adjustments (PMA) must be approved by CRO for amounts <$50M or Board Credit Committee for amounts >=$50M. All PMAs require documented rationale, expiry date (max 12 months), and quarterly backtesting. Per BoG 2026 guidelines: overlays must be clearly distinguished from modelled ECL in regulatory reporting. Zero PMA tolerance for POCI assets.';

  // ── Tab Management ─────────────────────────────────────────────────

  onTabChange(index: number) {
    this.activeTab = index;
    this.destroyCharts();
    setTimeout(() => this.initCharts(), 100);
  }

  // ── Lifecycle ──────────────────────────────────────────────────────

  ngAfterViewInit() {
    this.destroyCharts();
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
      case 3: this.initTab4Charts(); break;
    }
  }

  private addChart(chart: Chart) {
    this.chartInstances.push(chart);
  }

  // ── Tab 1 Charts ──────────────────────────────────────────────────

  private initTab1Charts() {
    // Donut: ECL by Stage
    const ctx1 = document.getElementById('eclChart1') as HTMLCanvasElement | null;
    if (ctx1) {
      const chart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
          labels: ['Stage 1 (Performing)', 'Stage 2 (SICR)', 'Stage 3 (Defaulted)'],
          datasets: [{
            data: [479, 181, 166],
            backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
            borderWidth: 2,
            borderColor: '#ffffff',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
                  const pct = ((ctx.parsed as number) / total * 100).toFixed(1);
                  return `\u20b5${ctx.parsed}M (${pct}%)`;
                }
              }
            }
          }
        }
      });
      this.addChart(chart);
    }

    // Stacked bar: Portfolio ECL by Segment
    const ctx2 = document.getElementById('eclChart2') as HTMLCanvasElement | null;
    if (ctx2) {
      const chart = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: this.portfolioSegments.map(s => s.name),
          datasets: [
            {
              label: 'ECL (\u20b5M)',
              data: this.portfolioSegments.map(s => s.ecl),
              backgroundColor: ['#22c55e', '#f59e0b', '#f59e0b', '#ef4444', '#ef4444'],
              borderRadius: 4,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'ECL (\u20b5M)' }
            }
          }
        }
      });
      this.addChart(chart);
    }
  }

  // ── Tab 2 Charts ──────────────────────────────────────────────────

  private initTab2Charts() {
    // Line chart: Scenario Comparison (3-year projection for selected variables)
    const ctx3 = document.getElementById('eclChart3') as HTMLCanvasElement | null;
    if (ctx3) {
      const years = ['Year 1', 'Year 2', 'Year 3'];
      const chart = new Chart(ctx3, {
        type: 'line',
        data: {
          labels: years,
          datasets: [
            {
              label: 'Base',
              data: [4.5, 4.2, 4.0],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: false,
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'Upside',
              data: [6.0, 5.5, 5.2],
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: false,
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'Downside',
              data: [2.5, 2.0, 1.8],
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              fill: false,
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'Severe',
              data: [0.5, 0.2, -0.5],
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: false,
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
              text: 'GDP Growth (%) - Scenario Projections'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'GDP Growth (%)' }
            }
          }
        }
      });
      this.addChart(chart);
    }

    // Tornado chart: ECL Sensitivity (horizontal bar)
    const ctx4 = document.getElementById('eclChart4') as HTMLCanvasElement | null;
    if (ctx4) {
      const labels = this.eclSensitivity.map(s => s.variable);
      const positiveData = this.eclSensitivity.map(s => s.positiveImpact);
      const negativeData = this.eclSensitivity.map(s => s.negativeImpact);

      const chart = new Chart(ctx4, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: '-1pp Impact',
              data: negativeData,
              backgroundColor: 'rgba(34, 197, 94, 0.7)',
              borderRadius: 4,
            },
            {
              label: '+1pp Impact',
              data: positiveData,
              backgroundColor: 'rgba(239, 68, 68, 0.7)',
              borderRadius: 4,
            }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'ECL Sensitivity (\u00b11pp Change Impact, \u20b5M)'
            }
          },
          scales: {
            x: {
              title: { display: true, text: 'ECL Impact (\u20b5M)' }
            }
          }
        }
      });
      this.addChart(chart);
    }
  }

  // ── Tab 3 Charts ──────────────────────────────────────────────────

  private initTab3Charts() {
    // Bar chart: Stage Migration Flow
    const ctx5 = document.getElementById('eclChart5') as HTMLCanvasElement | null;
    if (ctx5) {
      const chart = new Chart(ctx5, {
        type: 'bar',
        data: {
          labels: ['Stage 1', 'Stage 2', 'Stage 3'],
          datasets: [
            {
              label: 'Stayed in Stage',
              data: [12450, 1850, 780],
              backgroundColor: 'rgba(34, 197, 94, 0.7)',
              borderRadius: 4,
            },
            {
              label: 'Upgraded',
              data: [0, 85, 12],
              backgroundColor: 'rgba(59, 130, 246, 0.7)',
              borderRadius: 4,
            },
            {
              label: 'Downgraded',
              data: [320, 210, 0],
              backgroundColor: 'rgba(239, 68, 68, 0.7)',
              borderRadius: 4,
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
              text: 'Stage Migration Flow (Count)'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Number of Instruments' }
            }
          }
        }
      });
      this.addChart(chart);
    }

    // Line chart: SICR Trend
    const ctx6 = document.getElementById('eclChart6') as HTMLCanvasElement | null;
    if (ctx6) {
      const chart = new Chart(ctx6, {
        type: 'line',
        data: {
          labels: ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'],
          datasets: [
            {
              label: 'PD Deterioration',
              data: [3, 2, 4, 5, 3, 4],
              borderColor: '#ef4444',
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: '30+ DPD',
              data: [5, 4, 6, 3, 5, 2],
              borderColor: '#f59e0b',
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'Watch List',
              data: [2, 3, 2, 4, 3, 1],
              borderColor: '#8b5cf6',
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'Rating Downgrade',
              data: [1, 2, 1, 3, 2, 1],
              borderColor: '#3b82f6',
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'Forbearance',
              data: [1, 1, 2, 1, 2, 1],
              borderColor: '#ec4899',
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
              text: 'New SICR Triggers per Month'
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

  // ── Tab 4 Charts ──────────────────────────────────────────────────

  private initTab4Charts() {
    // Bar chart: Overlay Impact by Portfolio
    const ctx7 = document.getElementById('eclChart7') as HTMLCanvasElement | null;
    if (ctx7) {
      const chart = new Chart(ctx7, {
        type: 'bar',
        data: {
          labels: this.pmaRegister.map(p => p.portfolio),
          datasets: [{
            label: 'PMA Amount (\u20b5M)',
            data: this.pmaRegister.map(p => p.amount),
            backgroundColor: ['#f59e0b', '#f59e0b', '#ef4444', '#22c55e', '#ef4444'],
            borderRadius: 4,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Overlay Impact by Portfolio (\u20b5M)'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount (\u20b5M)' }
            }
          }
        }
      });
      this.addChart(chart);
    }

    // Line chart: Backtesting Accuracy
    const ctx8 = document.getElementById('eclChart8') as HTMLCanvasElement | null;
    if (ctx8) {
      const chart = new Chart(ctx8, {
        type: 'line',
        data: {
          labels: ['Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026'],
          datasets: [
            {
              label: 'PMA Estimated',
              data: [28.0, 32.5, 35.0, 30.2],
              borderColor: '#3b82f6',
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'Actual Impact',
              data: [26.5, 30.2, 33.8, 28.4],
              borderColor: '#22c55e',
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: 'Variance (absolute)',
              data: [1.5, 2.3, 1.2, 1.8],
              borderColor: '#f59e0b',
              borderDash: [5, 5],
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
              text: 'Overlay Backtesting Accuracy (\u20b5M)'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount (\u20b5M)' }
            }
          }
        }
      });
      this.addChart(chart);
    }
  }
}
