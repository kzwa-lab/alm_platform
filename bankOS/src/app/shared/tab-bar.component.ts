import { Component, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tab-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border-b border-neutral-200 dark:border-neutral-700 mb-6 overflow-x-auto">
      <nav class="flex space-x-1 min-w-max">
        <button *ngFor="let t of tabs; let i = index"
                (click)="selectTab(i)"
                class="px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap"
                [ngClass]="activeIndex === i ? 
                  'bg-white dark:bg-neutral-800 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 shadow-sm' :
                  'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700/50'">
          {{ t }}
        </button>
      </nav>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class TabBarComponent {
  @Input() tabs: string[] = [];
  @Input() activeIndex = 0;
  readonly tabChange = output<number>();

  selectTab(index: number) {
    this.activeIndex = index;
    this.tabChange.emit(index);
  }
}
