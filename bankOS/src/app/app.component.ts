import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
      <app-sidebar
        [(collapsed)]="sidebarCollapsed"
        (navigated)="onNavigated()">
      </app-sidebar>

      <!-- Main content: margin-left follows sidebar width -->
      <main class="transition-all duration-300 min-h-screen"
            [class.ml-16]="sidebarCollapsed"
            [class.ml-64]="!sidebarCollapsed">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class AppComponent {
  sidebarCollapsed = false;

  constructor(private themeService: ThemeService) {}

  onNavigated(): void {
    // On mobile, this collapses the sidebar. On desktop it stays open
    // since the user asked for collapse-on-nav on big screens too.
    if (window.innerWidth >= 1024) {
      this.sidebarCollapsed = true;
    }
  }
}
