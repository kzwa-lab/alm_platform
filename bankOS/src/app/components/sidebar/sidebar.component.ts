import { Component, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Mobile overlay when sidebar is expanded -->
    @if (!collapsed && isMobile) {
      <div class="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden" (click)="toggleCollapse()"></div>
    }

    <nav class="fixed inset-y-0 left-0 z-30 flex flex-col h-full transition-all duration-300"
         [class]="collapsed ? 'w-16' : 'w-64'"
         [class.-translate-x-full]="isMobile && !collapsedOnMobile && collapsed"
         [class.translate-x-0]="!isMobile || !collapsed">

      <div class="flex flex-col h-full bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
        <!-- Header -->
        <div class="h-16 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-700">
          @if (!collapsed) {
            <span class="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">BankOS</span>
          }
          <button (click)="toggleCollapse()"
                  class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shrink-0"
                  [title]="collapsed ? 'Expand' : 'Collapse'">
            <span class="text-neutral-600 dark:text-neutral-300">{{ collapsed ? '☰' : '✕' }}</span>
          </button>
        </div>

        <!-- Modules -->
        <div class="flex-1 py-4 overflow-y-auto">
          @for (m of modules; track m.route) {
            <a [routerLink]="m.route"
               routerLinkActive="bg-primary-50 dark:bg-primary-900/30 text-primary-600 border-l-3 border-primary-500"
               [routerLinkActiveOptions]="{ exact: false }"
               class="flex items-center gap-3 px-4 py-3 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
               [class.justify-center]="collapsed"
               [title]="collapsed ? m.name : ''"
               (click)="onNavigate()">
              <span class="text-lg shrink-0">{{ m.icon }}</span>
              @if (!collapsed) {
                <span class="truncate">{{ m.name }}</span>
              }
            </a>
          }
        </div>

        <!-- Footer -->
        <div class="border-t border-neutral-200 dark:border-neutral-700 p-4">
          <button (click)="toggleTheme()"
                  class="flex items-center gap-3 px-4 py-3 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg transition-colors w-full"
                  [class.justify-center]="collapsed">
            <span class="text-lg">{{ themeIcon }}</span>
            @if (!collapsed) {
              <span>{{ themeText }}</span>
            }
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host { display: block; }
    nav { scrollbar-width: thin; scrollbar-color: #475569 transparent; }
  `]
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() navigated = new EventEmitter<void>();

  collapsedOnMobile = true;
  isMobile = false;

  modules = [
    { name: 'Dashboard', route: '/', icon: '📊' },
    { name: 'Data Foundation', route: '/data-foundation', icon: '🏗' },
    { name: 'Liquidity', route: '/liquidity', icon: '💧' },
    { name: 'Capital', route: '/capital', icon: '🛡' },
    { name: 'IRRBB', route: '/irrbb', icon: '📈' },
    { name: 'ECL', route: '/ecl', icon: '⚠' },
    { name: 'FTP', route: '/ftp', icon: '🔄' },
    { name: 'Optimization', route: '/optimization', icon: '🎯' },
    { name: 'Recovery', route: '/recovery', icon: '🔄' },
    { name: 'GRC', route: '/grc', icon: '🔒' },
    { name: 'Regulatory', route: '/regulatory-reporting', icon: '📋' },
    { name: 'Behavioral', route: '/behavioral-models', icon: '📊' },
    { name: 'RTGS', route: '/rtgs', icon: '⚡' },
  ];

  themeIcon = '🌙';
  themeText = 'Dark Mode';

  private resizeHandler: (() => void) | null = null;

  constructor(private themeService: ThemeService) {
    this.themeService.isDark$.subscribe((isDark: boolean) => {
      this.themeIcon = isDark ? '☀️' : '🌙';
      this.themeText = isDark ? 'Light Mode' : 'Dark Mode';
    });
  }

  ngOnInit(): void {
    this.checkMobile();
    this.resizeHandler = () => this.checkMobile();
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy(): void {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth < 1024;
    if (this.isMobile && !this.collapsed) {
      this.collapsed = true;
      this.collapsedChange.emit(this.collapsed);
    }
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  onNavigate(): void {
    this.navigated.emit();
    if (this.isMobile) {
      this.collapsed = true;
      this.collapsedChange.emit(this.collapsed);
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
