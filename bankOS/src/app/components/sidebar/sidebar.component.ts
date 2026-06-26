import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="fixed inset-y-0 left-0 z-30 flex flex-col h-full transition-all duration-300"
         [class]="collapsed ? 'w-16' : 'w-64'">
      <div class="flex flex-col h-full bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
        <!-- Header -->
        <div class="h-16 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-700">
          <span *ngIf="!collapsed" class="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            BankOS
          </span>
          <button (click)="toggleCollapse()" 
                  class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  [title]="collapsed ? 'Expand' : 'Collapse'">
            <span class="text-neutral-600 dark:text-neutral-300">{{ collapsed ? '→' : '←' }}</span>
          </button>
        </div>

        <!-- Modules -->
        <div class="flex-1 py-4 overflow-y-auto">
          <a *ngFor="let module of modules" 
             [routerLink]="module.route"
             routerLinkActive="bg-primary-50 dark:bg-primary-900/30 text-primary-600 border-l-3 border-primary-500"
             [routerLinkActiveOptions]="{ exact: false }"
             class="flex items-center gap-3 px-4 py-3 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
             [class.justify-center]="collapsed"
             [title]="collapsed ? module.name : ''">
            <span class="text-lg">{{ module.icon }}</span>
            <span *ngIf="!collapsed">{{ module.name }}</span>
          </a>
        </div>

        <!-- Footer -->
        <div class="border-t border-neutral-200 dark:border-neutral-700 p-4">
          <button (click)="toggleTheme()" 
                  class="flex items-center gap-3 px-4 py-3 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg transition-colors w-full"
                  [class.justify-center]="collapsed">
            <span class="text-lg">{{ themeIcon }}</span>
            <span *ngIf="!collapsed">{{ themeText }}</span>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  modules = [
    { name: 'Dashboard', route: '/', icon: '📊' },
    { name: 'Liquidity', route: '/liquidity', icon: '💧' },
    { name: 'Capital', route: '/capital', icon: '🛡' },
    { name: 'IRRBB', route: '/irrbb', icon: '📈' },
    { name: 'ECL', route: '/ecl', icon: '⚠' },
    { name: 'FTP', route: '/ftp', icon: '🔄' },
    { name: 'Optimization', route: '/optimization', icon: '🎯' },
  ];

  themeIcon = '🌙';
  themeText = 'Dark Mode';

  constructor(private themeService: ThemeService) {
    this.themeService.isDark$.subscribe(isDark => {
      this.themeIcon = isDark ? '☀️' : '🌙';
      this.themeText = isDark ? 'Light Mode' : 'Dark Mode';
    });
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}