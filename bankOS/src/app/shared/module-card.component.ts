import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
})
export class ModuleCardComponent {
  @Input() title = '';
  @Input() icon = '';
  @Input() description = '';
  @Input() route = '';
}
