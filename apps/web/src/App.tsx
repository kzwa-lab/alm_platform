import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ModuleLayout } from '@components/layout/ModuleLayout';
import { Dashboard } from '@modules/dashboard/Dashboard';

// Lazy load modules for code splitting
const LiquidityModule = lazy(() => import('@modules/liquidity/liquidityModule'));
const InterestRateModule = lazy(() => import('@modules/interest-rate/interestrateModule'));
const CapitalModule = lazy(() => import('@modules/capital/capitalModule'));
const EclModule = lazy(() => import('@modules/ecl/eclModule'));
const FtpModule = lazy(() => import('@modules/ftp/ftpModule'));
const BalanceSheetModule = lazy(() => import('@modules/balance-sheet/balancesheetModule'));
const RecoveryModule = lazy(() => import('@modules/recovery/recoveryModule'));
const GrcModule = lazy(() => import('@modules/grc/grcModule'));
const RegulatoryModule = lazy(() => import('@modules/regulatory/regulatoryModule'));
const BehaviouralModule = lazy(() => import('@modules/behavioural/behaviouralModule'));
const CyberModule = lazy(() => import('@modules/cyber/cyberModule'));
const RtgsModule = lazy(() => import('@modules/rtgs/rtgsModule'));
const DataFoundationModule = lazy(() => import('@modules/data-foundation/datafoundationModule'));

function App() {
  return (
    <ModuleLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/liquidity/*" element={<LiquidityModule />} />
          <Route path="/interest-rate/*" element={<InterestRateModule />} />
          <Route path="/capital/*" element={<CapitalModule />} />
          <Route path="/ecl/*" element={<EclModule />} />
          <Route path="/ftp/*" element={<FtpModule />} />
          <Route path="/balance-sheet/*" element={<BalanceSheetModule />} />
          <Route path="/recovery/*" element={<RecoveryModule />} />
          <Route path="/grc/*" element={<GrcModule />} />
          <Route path="/regulatory/*" element={<RegulatoryModule />} />
          <Route path="/behavioural/*" element={<BehaviouralModule />} />
          <Route path="/cyber/*" element={<CyberModule />} />
          <Route path="/rtgs/*" element={<RtgsModule />} />
          <Route path="/data-foundation/*" element={<DataFoundationModule />} />
        </Routes>
      </Suspense>
    </ModuleLayout>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );
}

export default App;
