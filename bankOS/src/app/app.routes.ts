import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'liquidity', loadComponent: () => import('./pages/liquidity/liquidity.component').then(m => m.LiquidityComponent) },
  { path: 'capital', loadComponent: () => import('./pages/capital/capital.component').then(m => m.CapitalComponent) },
  { path: 'irrbb', loadComponent: () => import('./pages/irrbb/irrbb.component').then(m => m.IRRBBComponent) },
  { path: 'ecl', loadComponent: () => import('./pages/ecl/ecl.component').then(m => m.ECLComponent) },
  { path: 'ftp', loadComponent: () => import('./pages/ftp/ftp.component').then(m => m.FTPComponent) },
  { path: 'optimization', loadComponent: () => import('./pages/optimization/optimization.component').then(m => m.OptimizationComponent) },
  { path: '**', redirectTo: '' }
];