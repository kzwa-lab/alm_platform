import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Displays BoG-specific regulatory limits, Ghana directives, and compliance thresholds. */
@Component({
  selector: 'ghana-regulatory-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
      <div class="flex items-start gap-3">
        <span class="text-amber-600 dark:text-amber-400 text-lg font-bold mt-0.5">&#9888;</span>
        <div>
          <h4 class="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">Bank of Ghana 2026 Requirement</h4>
          <p class="text-sm text-amber-700 dark:text-amber-400">{{ detail }}</p>
        </div>
      </div>
    </div>
  `
})
export class GhanaRegulatoryDetailComponent {
  @Input() detail = '';
}

/** Displays feature description with user stories, acceptance criteria, and business rules. */
@Component({
  selector: 'feature-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 mb-6">
      <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-2">{{ title }}</h3>
      <p class="text-sm text-neutral-600 dark:text-neutral-300 mb-3">{{ description }}</p>
      
      <ng-content></ng-content>
      
      <div *ngIf="userStories && userStories.length" class="mt-3">
        <h4 class="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">User Stories</h4>
        <ul class="space-y-1">
          <li *ngFor="let story of userStories" class="text-sm text-neutral-600 dark:text-neutral-300 flex items-start gap-2">
            <span class="text-primary-500 mt-0.5">&#9656;</span>
            <span>{{ story }}</span>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class FeatureCardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() userStories?: string[];
}

/** Displays a status badge: Compliant/Green, Warning/Amber, Breach/Red */
@Component({
  selector: 'status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="px-3 py-1 rounded-full text-xs font-medium inline-block"
          [ngClass]="{
            'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400': status === 'green' || status === 'compliant' || status === 'normal' || status === 'on track' || status === 'within cap',
            'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400': status === 'amber' || status === 'warning' || status === 'watch' || status === 'below min' || status === 'mismatched',
            'bg-alert-100 text-alert-700 dark:bg-alert-900/30 dark:text-alert-400': status === 'red' || status === 'breach' || status === 'action' || status === 'overdue'
          }">
      {{ label || status }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() status = 'green';
  @Input() label?: string;
}
