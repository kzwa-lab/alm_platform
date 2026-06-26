import { Component, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import {
  TabBarComponent,
  FeatureCardComponent,
  StatusBadgeComponent,
  GhanaRegulatoryDetailComponent
} from '../../shared/index';

interface PolicySection {
  section: string;
  policiesCount: number;
  status: string;
  lastUpdated: string;
}

interface RegulatoryMappingRow {
  regulation: string;
  reqCount: number;
  mapped: number;
  gaps: number;
}

interface RiskCategory {
  category: string;
  count: number;
  severity: string;
}

interface RiskHeatmapRow {
  likelihood: string;
  veryLow: number;
  low: number;
  medium: number;
  high: number;
  veryHigh: number;
}

interface RasLimit {
  limit: string;
  value: string;
  appetite: string;
  tolerance: string;
  status: string;
}

interface RasBreach {
  date: string;
  limit: string;
  value: string;
  severity: string;
  action: string;
}

interface RoleAssignment {
  role: string;
  line: string;
  user: string;
  permissions: string;
}

interface SodMatrix {
  role1: string;
  role2: string;
  conflict: string;
}

interface ActiveBreach {
  id: string;
  limit: string;
  severity: string;
  responseTime: string;
  status: string;
}

interface EscalationMatrix {
  level: string;
  trigger: string;
  responsible: string;
  timeframe: string;
}

@Component({
  selector: 'app-grc',
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
          <span class="text-neutral-700 dark:text-neutral-300">Governance, Risk & Compliance</span>
        </div>
      </header>

      <main class="flex-1 p-6 overflow-y-auto">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">GRC Module</h2>

          <tab-bar [tabs]="tabs" [activeIndex]="activeTab" (tabChange)="onTabChange($event)"></tab-bar>

          <!-- ============================================================ -->
          <!-- TAB 1: Digitised RMF                                       -->
          <!-- ============================================================ -->
          @if (activeTab === 0) {
            <feature-card
              title="Digitised Risk Management Framework"
              description="Comprehensive digital RMF covering governance, risk identification, measurement, monitoring, reporting, and control under BoG RMD 2021."
              [userStories]="[
                'As CRO, I need to maintain a digitised RMF with up-to-date policies mapped to regulatory requirements for compliance assurance.',
                'As Compliance Officer, I need to track policy updates, regulatory mapping, and compliance gaps for BoG reporting.',
                'As Internal Auditor, I need to review the RMF policy framework and identify control gaps in the three lines of defence model.'
              ]"
            ></feature-card>

            <ghana-regulatory-detail detail="BoG RMD 2021: Three Lines of Defence. CRO independence: no dual-hatting as CFO/COO/Internal Audit. Front/back-office segregation enforced. Breach notification to BoG within 10 days."></ghana-regulatory-detail>

            <!-- Table 1: Policy Sections -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Policy Sections</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Section</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Policies</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of policySections; track row.section) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.section }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.policiesCount }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.status" [label]="row.status"></status-badge>
                        </td>
                        <td class="p-3 text-neutral-600 dark:text-neutral-300">{{ row.lastUpdated }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-6 mb-6">
              <!-- Chart 1: Policy Status bar -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Policy Status</h3>
                <div class="relative" style="height:280px">
                  <canvas #policyStatusCanvas></canvas>
                </div>
              </div>
              <!-- Chart 2: Compliance Gap bar -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Compliance Gaps</h3>
                <div class="relative" style="height:280px">
                  <canvas #complianceGapCanvas></canvas>
                </div>
              </div>
            </div>

            <!-- Table 2: Regulatory Mapping -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Regulatory Mapping</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Regulation</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Requirements</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Mapped</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Gaps</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of regulatoryMappings; track row.regulation) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.regulation }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.reqCount }}</td>
                        <td class="p-3 text-right font-mono text-success-600">{{ row.mapped }}</td>
                        <td class="p-3 text-right font-mono" [ngClass]="row.gaps > 0 ? 'text-alert-600' : 'text-success-600'">{{ row.gaps }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- ============================================================ -->
          <!-- TAB 2: Risk Universe Register                               -->
          <!-- ============================================================ -->
          @if (activeTab === 1) {
            <feature-card
              title="Risk Universe Register"
              description="Comprehensive risk register covering all material risk categories with heatmap visualisation and severity assessment."
              [userStories]="[
                'As CRO, I need a complete risk universe register with heatmap visualisation to identify concentration and emerging risks.',
                'As Risk Manager, I need to maintain risk categories and update risk assessments on a quarterly basis.',
                'As Board Risk Committee Member, I need to see the aggregate risk profile and concentration by category.'
              ]"
            ></feature-card>

            <ghana-regulatory-detail detail="BoG RMD 2021: Comprehensive risk register covering all material risks. Risk appetite statement approved by Board annually. Stress testing for all material risks. ICAAP submission within 4 months of year-end."></ghana-regulatory-detail>

            <!-- Table 1: Risk Categories -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Risk Categories</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Category</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Risk Count</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Overall Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of riskCategories; track row.category) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.category }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.count }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.severity" [label]="row.severity"></status-badge>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-6 mb-6">
              <!-- Chart 1: Risk Category donut -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Risk Category Distribution</h3>
                <div class="relative" style="height:280px">
                  <canvas #riskCategoryDonutCanvas></canvas>
                </div>
              </div>
              <!-- Chart 2: Heatmap grid -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Risk Heatmap (Likelihood vs Impact)</h3>
                <div class="relative" style="height:280px">
                  <canvas #heatmapCanvas></canvas>
                </div>
              </div>
            </div>

            <!-- Table 2: Risk Heatmap Matrix -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Risk Heatmap Matrix</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Likelihood \\ Impact</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Very Low</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Low</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Medium</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">High</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Very High</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of heatmapData; track row.likelihood) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.likelihood }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.veryLow }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.low }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.medium }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.high }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.veryHigh }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- ============================================================ -->
          <!-- TAB 3: Risk Appetite Statement                              -->
          <!-- ============================================================ -->
          @if (activeTab === 2) {
            <feature-card
              title="Risk Appetite Statement"
              description="Board-approved risk appetite limits with real-time utilisation monitoring and breach tracking."
              [userStories]="[
                'As CRO, I need to monitor risk appetite limits and tolerance thresholds to ensure ongoing compliance with Board-approved RAS.',
                'As Risk Manager, I need to track limit utilisation and escalate breaches according to the escalation matrix.',
                'As Board Risk Committee Member, I need to review risk appetite utilisation trends and breach activity.'
              ]"
            ></feature-card>

            <ghana-regulatory-detail detail="BoG RMD 2021: Risk appetite statement approved by Board annually. Quantitative limits for all material risks. Breach escalation within 24 hours. Quarterly RAS review by Board Risk Committee."></ghana-regulatory-detail>

            <!-- Table 1: RAS Limits -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">RAS Limits</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Limit</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Value</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Appetite</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Tolerance</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of rasLimits; track row.limit) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.limit }}</td>
                        <td class="p-3 text-right font-mono text-neutral-700 dark:text-neutral-200">{{ row.value }}</td>
                        <td class="p-3 text-right font-mono text-neutral-500 dark:text-neutral-400">{{ row.appetite }}</td>
                        <td class="p-3 text-right font-mono text-neutral-500 dark:text-neutral-400">{{ row.tolerance }}</td>
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
              <!-- Chart 1: Limit Utilization gauge -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Limit Utilization</h3>
                <div class="relative" style="height:280px">
                  <canvas #limitUtilizationCanvas></canvas>
                </div>
              </div>
              <!-- Chart 2: Breach Trend line -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Breach Trend</h3>
                <div class="relative" style="height:280px">
                  <canvas #rasBreachTrendCanvas></canvas>
                </div>
              </div>
            </div>

            <!-- Table 2: Breach Log -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">RAS Breach Log</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Date</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Limit</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Value</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Severity</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Action Taken</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of rasBreaches; track row.date) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 text-neutral-600 dark:text-neutral-300">{{ row.date }}</td>
                        <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.limit }}</td>
                        <td class="p-3 text-right font-mono text-alert-600">{{ row.value }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.severity" [label]="row.severity"></status-badge>
                        </td>
                        <td class="p-3 text-neutral-600 dark:text-neutral-300 max-w-xs">{{ row.action }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- ============================================================ -->
          <!-- TAB 4: 3LoD RBAC                                           -->
          <!-- ============================================================ -->
          @if (activeTab === 3) {
            <feature-card
              title="Three Lines of Defence RBAC"
              description="Role-based access control aligned with the Three Lines of Defence model, enforcing segregation of duties and CRO independence."
              [userStories]="[
                'As CRO, I need system-enforced independence with no dual-hatting violations to comply with BoG RMD 2021.',
                'As Compliance Officer, I need to monitor segregation of duties and prevent conflicts across the three lines of defence.',
                'As Internal Auditor, I need to review role assignments and verify that front/back-office segregation is enforced.'
              ]"
            ></feature-card>

            <ghana-regulatory-detail detail="1st Line (Business Units), 2nd Line (Risk/Compliance), 3rd Line (Internal Audit). CRO independence system-enforced. No dual-hatting allowed. Front/back-office segregation enforced per BoG RMD 2021 Section 3.2."></ghana-regulatory-detail>

            <!-- Table 1: Role Assignments -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Role Assignments</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Role</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Line of Defence</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">User</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of roleAssignments; track row.role) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.role }}</td>
                        <td class="p-3 text-neutral-600 dark:text-neutral-300">{{ row.line }}</td>
                        <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.user }}</td>
                        <td class="p-3 text-neutral-600 dark:text-neutral-300">{{ row.permissions }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-6 mb-6">
              <!-- Chart 1: Role Distribution pie -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Role Distribution by Line of Defence</h3>
                <div class="relative" style="height:280px">
                  <canvas #roleDistributionCanvas></canvas>
                </div>
              </div>
              <!-- Chart 2: Segregation Violations bar -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Segregation Violations</h3>
                <div class="relative" style="height:280px">
                  <canvas #sodViolationsCanvas></canvas>
                </div>
              </div>
            </div>

            <!-- Table 2: Segregation of Duties matrix -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Segregation of Duties Matrix</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Role 1</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Role 2</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Conflict</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of sodMatrix; track row.role1) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.role1 }}</td>
                        <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.role2 }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.conflict" [label]="row.conflict"></status-badge>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- ============================================================ -->
          <!-- TAB 5: Limit Breach Workflow                                -->
          <!-- ============================================================ -->
          @if (activeTab === 4) {
            <feature-card
              title="Limit Breach Workflow"
              description="Automated breach detection, escalation, and resolution workflow with severity-based response time tracking."
              [userStories]="[
                'As CRO, I need real-time breach alerts with severity-based escalation to ensure timely remediation.',
                'As Risk Manager, I need to manage active breaches, assign owners, and track resolution status.',
                'As Compliance Officer, I need to verify that breach notifications to BoG are made within regulatory timeframes.'
              ]"
            ></feature-card>

            <ghana-regulatory-detail detail="BoG RMD 2021: Breach notification to BoG within 10 business days. Immediate escalation for critical breaches. Response times: Critical < 4hrs, High < 24hrs, Medium < 3 days, Low < 7 days."></ghana-regulatory-detail>

            <!-- Table 1: Active Breaches -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Active Breaches</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">ID</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Limit</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Severity</th>
                      <th class="text-right font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Response Time</th>
                      <th class="text-center font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of activeBreaches; track row.id) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 font-mono text-neutral-700 dark:text-neutral-200">{{ row.id }}</td>
                        <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.limit }}</td>
                        <td class="p-3 text-center">
                          <status-badge [status]="row.severity" [label]="row.severity"></status-badge>
                        </td>
                        <td class="p-3 text-right font-mono" [ngClass]="row.responseTime.includes('hr') ? 'text-alert-600' : 'text-neutral-600'">{{ row.responseTime }}</td>
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
              <!-- Chart 1: Breach Severity pie -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Breach Severity Distribution</h3>
                <div class="relative" style="height:280px">
                  <canvas #breachSeverityCanvas></canvas>
                </div>
              </div>
              <!-- Chart 2: Response Time bar -->
              <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Response Time by Severity</h3>
                <div class="relative" style="height:280px">
                  <canvas #responseTimeCanvas></canvas>
                </div>
              </div>
            </div>

            <!-- Table 2: Escalation Matrix -->
            <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
              <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Escalation Matrix</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-neutral-50 dark:bg-neutral-800">
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Level</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Trigger</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Responsible</th>
                      <th class="text-left font-semibold text-neutral-700 dark:text-neutral-200 p-3 border-b border-neutral-200 dark:border-neutral-700">Timeframe</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of escalationMatrix; track row.level) {
                      <tr class="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                        <td class="p-3 text-neutral-700 dark:text-neutral-200 font-medium">{{ row.level }}</td>
                        <td class="p-3 text-neutral-600 dark:text-neutral-300">{{ row.trigger }}</td>
                        <td class="p-3 text-neutral-700 dark:text-neutral-200">{{ row.responsible }}</td>
                        <td class="p-3 text-neutral-600 dark:text-neutral-300">{{ row.timeframe }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class GrcComponent implements AfterViewInit {
  // --- Tab state ---
  tabs = ['Digitised RMF', 'Risk Universe Register', 'Risk Appetite Statement', '3LoD RBAC', 'Limit Breach Workflow'];
  activeTab = 0;

  // --- Chart refs ---
  @ViewChild('policyStatusCanvas') policyStatusCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('complianceGapCanvas') complianceGapCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('riskCategoryDonutCanvas') riskCategoryDonutCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heatmapCanvas') heatmapCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('limitUtilizationCanvas') limitUtilizationCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rasBreachTrendCanvas') rasBreachTrendCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('roleDistributionCanvas') roleDistributionCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('sodViolationsCanvas') sodViolationsCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('breachSeverityCanvas') breachSeverityCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('responseTimeCanvas') responseTimeCanvasRef!: ElementRef<HTMLCanvasElement>;

  private chartInstances: Chart[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    setTimeout(() => this.renderCharts(), 100);
  }

  onTabChange(index: number) {
    this.activeTab = index;
    this.cdr.detectChanges();
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
      this.renderPolicyStatusChart();
      this.renderComplianceGapChart();
    } else if (this.activeTab === 1) {
      this.renderRiskCategoryDonutChart();
      this.renderHeatmapChart();
    } else if (this.activeTab === 2) {
      this.renderLimitUtilizationChart();
      this.renderRasBreachTrendChart();
    } else if (this.activeTab === 3) {
      this.renderRoleDistributionChart();
      this.renderSodViolationsChart();
    } else if (this.activeTab === 4) {
      this.renderBreachSeverityChart();
      this.renderResponseTimeChart();
    }
  }

  // ===== TAB 1: Digitised RMF Charts =====

  private renderPolicyStatusChart() {
    const el = this.policyStatusCanvasRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['Governance', 'ID', 'Measurement', 'Monitoring', 'Reporting', 'Control'],
        datasets: [{
          label: 'Policies',
          data: [4, 3, 5, 3, 2, 4],
          backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'],
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
            ticks: { stepSize: 1 }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private renderComplianceGapChart() {
    const el = this.complianceGapCanvasRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['RMD 2021', 'CISD 2026', 'LMTD', 'LRMD', 'IRRBB', 'Recovery'],
        datasets: [
          {
            label: 'Mapped',
            data: [42, 18, 25, 30, 15, 20],
            backgroundColor: 'rgba(16,185,129,0.7)',
            borderRadius: 4,
          },
          {
            label: 'Gaps',
            data: [3, 2, 1, 0, 2, 1],
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
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { stepSize: 5 }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  // ===== TAB 2: Risk Universe Register Charts =====

  private renderRiskCategoryDonutChart() {
    const el = this.riskCategoryDonutCanvasRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'doughnut',
      data: {
        labels: ['Credit', 'Market', 'Liquidity', 'Operational', 'Strategic', 'Cyber', 'Climate', 'ESG'],
        datasets: [{
          data: [18, 8, 6, 12, 5, 4, 3, 2],
          backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'],
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

  private renderHeatmapChart() {
    const el = this.heatmapCanvasRef?.nativeElement;
    if (!el) return;
    // Use a matrix-like bar chart to represent heatmap
    const chart = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
        datasets: [
          { label: 'Very Low', data: [0, 0, 0, 0, 0], backgroundColor: 'rgba(34,197,94,0.7)', borderRadius: 2 },
          { label: 'Low', data: [2, 0, 0, 0, 0], backgroundColor: 'rgba(132,204,22,0.7)', borderRadius: 2 },
          { label: 'Medium', data: [0, 3, 4, 0, 0], backgroundColor: 'rgba(250,204,21,0.7)', borderRadius: 2 },
          { label: 'High', data: [0, 0, 5, 6, 0], backgroundColor: 'rgba(251,146,60,0.7)', borderRadius: 2 },
          { label: 'Very High', data: [0, 0, 0, 3, 4], backgroundColor: 'rgba(239,68,68,0.7)', borderRadius: 2 },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label} Impact: ${ctx.parsed.y} risks`
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            title: { display: true, text: 'Impact' }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { stepSize: 1 }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  // ===== TAB 3: Risk Appetite Statement Charts =====

  private renderLimitUtilizationChart() {
    const el = this.limitUtilizationCanvasRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['CET1 Ratio', 'LCR', 'NSFR', 'Leverage', 'NIM', 'Credit RWAs'],
        datasets: [
          {
            label: 'Utilization (%)',
            data: [65, 78, 85, 60, 55, 72],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6366f1'],
            borderRadius: 4,
          },
          {
            label: 'Tolerance Limit',
            data: [100, 100, 100, 100, 100, 100],
            backgroundColor: 'rgba(239,68,68,0.2)',
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
            max: 120,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { callback: (val) => val + '%' }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private renderRasBreachTrendChart() {
    const el = this.rasBreachTrendCanvasRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'line',
      data: {
        labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'],
        datasets: [{
          label: 'Breach Count',
          data: [8, 6, 4, 5, 7, 3, 2, 1],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: '#ef4444',
        }]
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
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { stepSize: 1 }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  // ===== TAB 4: 3LoD RBAC Charts =====

  private renderRoleDistributionChart() {
    const el = this.roleDistributionCanvasRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'pie',
      data: {
        labels: ['1st Line (Business)', '2nd Line (Risk/Compliance)', '3rd Line (Internal Audit)'],
        datasets: [{
          data: [12, 8, 5],
          backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private renderSodViolationsChart() {
    const el = this.sodViolationsCanvasRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['Front Office / Back Office', 'Trading / Settlement', 'Risk / Business', 'Compliance / Ops', 'Audit / Any', 'CRO / CFO'],
        datasets: [{
          label: 'Violations',
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: ['#10b981', '#10b981', '#10b981', '#10b981', '#10b981', '#10b981'],
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
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { stepSize: 1 }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  // ===== TAB 5: Limit Breach Workflow Charts =====

  private renderBreachSeverityChart() {
    const el = this.breachSeverityCanvasRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'pie',
      data: {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{
          data: [1, 2, 3, 2],
          backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'],
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private renderResponseTimeChart() {
    const el = this.responseTimeCanvasRef?.nativeElement;
    if (!el) return;
    const chart = new Chart(el, {
      type: 'bar',
      data: {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{
          label: 'Avg Response Time (hrs)',
          data: [3.5, 18, 48, 96],
          backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'],
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
            title: { display: true, text: 'Hours' }
          }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  // ===== DATA =====

  policySections: PolicySection[] = [
    { section: 'Governance', policiesCount: 4, status: 'compliant', lastUpdated: '15-Oct-2026' },
    { section: 'Identification', policiesCount: 3, status: 'compliant', lastUpdated: '10-Oct-2026' },
    { section: 'Measurement', policiesCount: 5, status: 'compliant', lastUpdated: '12-Oct-2026' },
    { section: 'Monitoring', policiesCount: 3, status: 'warning', lastUpdated: '08-Oct-2026' },
    { section: 'Reporting', policiesCount: 2, status: 'compliant', lastUpdated: '05-Oct-2026' },
    { section: 'Control', policiesCount: 4, status: 'breach', lastUpdated: '01-Oct-2026' },
  ];

  regulatoryMappings: RegulatoryMappingRow[] = [
    { regulation: 'RMD 2021', reqCount: 45, mapped: 42, gaps: 3 },
    { regulation: 'CISD 2026', reqCount: 20, mapped: 18, gaps: 2 },
    { regulation: 'LMTD', reqCount: 26, mapped: 25, gaps: 1 },
    { regulation: 'LRMD', reqCount: 30, mapped: 30, gaps: 0 },
    { regulation: 'IRRBB', reqCount: 17, mapped: 15, gaps: 2 },
    { regulation: 'Recovery', reqCount: 21, mapped: 20, gaps: 1 },
  ];

  riskCategories: RiskCategory[] = [
    { category: 'Credit Risk', count: 18, severity: 'high' },
    { category: 'Market Risk', count: 8, severity: 'medium' },
    { category: 'Liquidity Risk', count: 6, severity: 'medium' },
    { category: 'Operational Risk', count: 12, severity: 'high' },
    { category: 'Strategic Risk', count: 5, severity: 'low' },
    { category: 'Cyber Risk', count: 4, severity: 'high' },
    { category: 'Climate Risk', count: 3, severity: 'low' },
    { category: 'ESG Risk', count: 2, severity: 'low' },
  ];

  heatmapData: RiskHeatmapRow[] = [
    { likelihood: 'Very Low', veryLow: 0, low: 0, medium: 0, high: 0, veryHigh: 0 },
    { likelihood: 'Low', veryLow: 2, low: 0, medium: 0, high: 0, veryHigh: 0 },
    { likelihood: 'Medium', veryLow: 0, low: 3, medium: 4, high: 0, veryHigh: 0 },
    { likelihood: 'High', veryLow: 0, low: 0, medium: 5, high: 6, veryHigh: 0 },
    { likelihood: 'Very High', veryLow: 0, low: 0, medium: 0, high: 3, veryHigh: 4 },
  ];

  rasLimits: RasLimit[] = [
    { limit: 'CET1 Ratio', value: '14.8%', appetite: '>12%', tolerance: '>7%', status: 'compliant' },
    { limit: 'LCR', value: '118%', appetite: '>120%', tolerance: '>100%', status: 'compliant' },
    { limit: 'NSFR', value: '112%', appetite: '>110%', tolerance: '>100%', status: 'compliant' },
    { limit: 'Leverage Ratio', value: '5.2%', appetite: '>4.5%', tolerance: '>3.0%', status: 'compliant' },
    { limit: 'NIM', value: '2.8%', appetite: '>2.5%', tolerance: '>1.5%', status: 'compliant' },
    { limit: 'Credit RWAs', value: 'GHS 8.2B', appetite: '<GHS 9B', tolerance: '<GHS 10B', status: 'compliant' },
  ];

  rasBreaches: RasBreach[] = [
    { date: '15-Sep-2025', limit: 'LCR', value: '97.2%', severity: 'breach', action: 'CFP activated; liquidity contingency plan initiated' },
    { date: '10-Mar-2025', limit: 'NSFR', value: '98.5%', severity: 'breach', action: 'Long-term funding programme accelerated' },
    { date: '05-Jan-2025', limit: 'LCR', value: '99.1%', severity: 'amber', action: 'Preventive monitoring; liquidity buffer review' },
    { date: '12-Oct-2024', limit: 'CET1 Ratio', value: '6.8%', severity: 'breach', action: 'Dividend suspended; capital restoration plan submitted' },
    { date: '28-Jul-2024', limit: 'LCR', value: '96.5%', severity: 'breach', action: 'Emergency liquidity facility drawn' },
    { date: '02-Feb-2024', limit: 'Leverage', value: '2.9%', severity: 'amber', action: 'Balance sheet optimisation initiated' },
  ];

  roleAssignments: RoleAssignment[] = [
    { role: 'CRO', line: '2nd Line', user: 'Dr. Mensah', permissions: 'Full risk oversight, independent reporting to BRC' },
    { role: 'CFO', line: '1st Line', user: 'Mrs. Ofori', permissions: 'Financial operations, capital management' },
    { role: 'COO', line: '1st Line', user: 'Mr. Asante', permissions: 'Business operations, front office management' },
    { role: 'Risk Manager', line: '2nd Line', user: 'Ms. Adjei', permissions: 'Risk measurement, monitoring, reporting' },
    { role: 'Compliance Officer', line: '2nd Line', user: 'Mr. Owusu', permissions: 'Regulatory compliance, AML/CFT, BoG reporting' },
    { role: 'Internal Auditor', line: '3rd Line', user: 'Mr. Ampofo', permissions: 'Independent audit, control assurance' },
    { role: 'Head of Treasury', line: '1st Line', user: 'Mrs. Akyeampong', permissions: 'Treasury operations, liquidity management' },
    { role: 'Head of Credit', line: '1st Line', user: 'Mr. Boadi', permissions: 'Credit origination, portfolio management' },
  ];

  sodMatrix: SodMatrix[] = [
    { role1: 'Front Office (Trading)', role2: 'Back Office (Settlement)', conflict: 'No Conflict' },
    { role1: 'Front Office (Trading)', role2: 'Risk Management', conflict: 'No Conflict' },
    { role1: 'CRO', role2: 'CFO', conflict: 'No Conflict' },
    { role1: 'CRO', role2: 'COO', conflict: 'No Conflict' },
    { role1: 'CRO', role2: 'Internal Audit', conflict: 'No Conflict' },
    { role1: 'Compliance Officer', role2: 'Internal Audit', conflict: 'No Conflict' },
    { role1: 'CFO', role2: 'Treasury', conflict: 'No Conflict' },
  ];

  activeBreaches: ActiveBreach[] = [
    { id: 'BR-2026-001', limit: 'LCR', severity: 'amber', responseTime: '18 hrs', status: 'action' },
    { id: 'BR-2026-002', limit: 'NSFR', severity: 'breach', responseTime: '3 hrs', status: 'action' },
    { id: 'BR-2025-015', limit: 'CET1 Ratio', severity: 'breach', responseTime: '45 min', status: 'action' },
    { id: 'BR-2025-014', limit: 'Leverage', severity: 'amber', responseTime: '6 hrs', status: 'action' },
    { id: 'BR-2025-012', limit: 'NIM', severity: 'amber', responseTime: '2 days', status: 'warning' },
    { id: 'BR-2025-009', limit: 'LCR', severity: 'breach', responseTime: '2 hrs', status: 'compliant' },
  ];

  escalationMatrix: EscalationMatrix[] = [
    { level: 'Level 1', trigger: 'Limit approaching tolerance (90-100%)', responsible: 'Risk Manager', timeframe: 'Within 24 hrs' },
    { level: 'Level 2', trigger: 'Limit breach (100-110%)', responsible: 'CRO', timeframe: 'Within 4 hrs' },
    { level: 'Level 3', trigger: 'Material breach (>110%)', responsible: 'CEO / ALCO', timeframe: 'Within 1 hr' },
    { level: 'Level 4', trigger: 'Critical breach / Capital erosion', responsible: 'Board Risk Committee', timeframe: 'Immediate' },
    { level: 'Regulatory', trigger: 'Any breach >10 days unresolved', responsible: 'Compliance Officer / BoG', timeframe: 'Within 10 business days' },
  ];
}
