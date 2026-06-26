import { useNavigate } from 'react-router-dom';
import { KpiCard } from '@components/design-system/KpiCard';
import { TrafficLight } from '@components/design-system/TrafficLight';
import { LineChart } from '@components/charts/LineChart';
import { BarChart } from '@components/charts/BarChart';
import { ChartContainer } from '@components/design-system/ChartContainer';
import { formatCurrency, formatPercent } from '@alm/shared';
void formatCurrency;
void formatPercent;
import {
  Droplets,
  TrendingUp,
  Shield,
  AlertCircle,
  ArrowLeftRight,
  BarChart3,
  LifeBuoy,
  ShieldCheck,
  FileCheck,
  Brain,
  Lock,
  Zap,
  Database,
} from 'lucide-react';

const MODULE_ICONS: Record<string, React.ReactNode> = {
  liquidity: <Droplets size={20} />,
  'interest-rate': <TrendingUp size={20} />,
  capital: <Shield size={20} />,
  ecl: <AlertCircle size={20} />,
  ftp: <ArrowLeftRight size={20} />,
  'balance-sheet': <BarChart3 size={20} />,
  recovery: <LifeBuoy size={20} />,
  grc: <ShieldCheck size={20} />,
  regulatory: <FileCheck size={20} />,
  behavioural: <Brain size={20} />,
  cyber: <Lock size={20} />,
  rtgs: <Zap size={20} />,
  'data-foundation': <Database size={20} />,
};

const DASHBOARD_KPIS = [
  { moduleId: 'liquidity', title: 'LCR', value: '136.2%', status: 'green' as const, trend: 'down' as const, trendValue: '-1.5pp', subtitle: 'Buffer: +36.2pp' },
  { moduleId: 'liquidity', title: 'NSFR', value: '124.8%', status: 'green' as const, trend: 'up' as const, trendValue: '+0.3pp', subtitle: 'Stable funding adequate' },
  { moduleId: 'interest-rate', title: 'EVE Impact', value: '-8.5%', status: 'green' as const, trend: 'flat' as const, trendValue: '0.0pp', subtitle: 'vs Tier 1 Capital' },
  { moduleId: 'capital', title: 'CET1 Ratio', value: '14.2%', status: 'green' as const, trend: 'up' as const, trendValue: '+0.3pp', subtitle: 'Buffer: +2.7pp' },
  { moduleId: 'ecl', title: 'Total ECL', value: '₵ 245M', status: 'amber' as const, trend: 'up' as const, trendValue: '+15M', subtitle: 'Coverage: 1.85%' },
  { moduleId: 'ftp', title: 'GRR', value: '25.50%', status: 'neutral' as const, trend: 'up' as const, trendValue: '+50bp', subtitle: 'BoG Policy Rate: 26.00%' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const LCR_TREND = [
  { name: 'LCR', value: 128.5 }, { name: 'LCR', value: 130.2 }, { name: 'LCR', value: 131.8 },
  { name: 'LCR', value: 133.1 }, { name: 'LCR', value: 134.5 }, { name: 'LCR', value: 135.8 },
  { name: 'LCR', value: 136.2 }, { name: 'LCR', value: 137.0 }, { name: 'LCR', value: 136.5 },
  { name: 'LCR', value: 135.9 }, { name: 'LCR', value: 135.2 }, { name: 'LCR', value: 136.2 },
];

const CAPITAL_TREND = [
  { name: 'CET1', value: 13.2 }, { name: 'CET1', value: 13.4 }, { name: 'CET1', value: 13.5 },
  { name: 'CET1', value: 13.7 }, { name: 'CET1', value: 13.8 }, { name: 'CET1', value: 14.0 },
  { name: 'CET1', value: 14.1 }, { name: 'CET1', value: 14.2 }, { name: 'CET1', value: 14.3 },
  { name: 'CET1', value: 14.2 }, { name: 'CET1', value: 14.1 }, { name: 'CET1', value: 14.2 },
];

const ECL_BY_STAGE = [
  { name: 'Stage 1', value: 45 },
  { name: 'Stage 2', value: 120 },
  { name: 'Stage 3', value: 80 },
];

const RECENT_ALERTS = [
  { id: '1', module: 'Liquidity', message: 'LCR buffer narrowing — review HQLA', status: 'warning' as const, time: '2 min ago' },
  { id: '2', module: 'GRC', message: 'FX exposure limit breached by 12%', status: 'error' as const, time: '1 hour ago' },
  { id: '3', module: 'Regulatory', message: 'ORASS LMTD submission due in 3 days', status: 'info' as const, time: '3 hours ago' },
  { id: '4', module: 'Capital', message: 'CET1 buffer headroom below 1.5pp', status: 'warning' as const, time: '5 hours ago' },
  { id: '5', module: 'RTGS', message: 'Feed latency exceeded 5s threshold', status: 'warning' as const, time: '6 hours ago' },
];

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">ALM Dashboard</h1>
        <p className="text-text-muted mt-1">Real-time overview of all ALM risk metrics and regulatory compliance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {DASHBOARD_KPIS.map((kpi) => (
          <div
            key={kpi.title}
            className="cursor-pointer"
            onClick={() => navigate(`/${kpi.moduleId}`)}
          >
            <KpiCard
              title={kpi.title}
              value={kpi.value}
              subtitle={kpi.subtitle}
              status={kpi.status}
              trend={kpi.trend}
              trendValue={kpi.trendValue}
              icon={MODULE_ICONS[kpi.moduleId]}
            />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="LCR Trend (12 Months)" subtitle="Liquidity Coverage Ratio over time">
          <LineChart data={LCR_TREND} xAxisData={MONTHS} color="#06B6D4" height={280} area />
        </ChartContainer>

        <ChartContainer title="CET1 Ratio Trend (12 Months)" subtitle="Capital adequacy trajectory">
          <LineChart data={CAPITAL_TREND} xAxisData={MONTHS} color="#10B981" height={280} area />
        </ChartContainer>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartContainer title="ECL by Stage" subtitle="Expected credit loss distribution">
          <BarChart data={ECL_BY_STAGE} color="#F59E0B" height={250} />
        </ChartContainer>

        <div className="lg:col-span-2 card p-5">
          <h3 className="section-title mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {RECENT_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-bg-secondary hover:bg-bg-tertiary transition-colors cursor-pointer"
              >
                <TrafficLight
                  status={
                    alert.status === 'error' ? 'red' : alert.status === 'warning' ? 'amber' : 'neutral'
                  }
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-text-muted uppercase">{alert.module}</span>
                    <span className="text-xs text-text-muted">{alert.time}</span>
                  </div>
                  <p className="text-sm text-text-primary mt-0.5">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module Quick Links */}
      <div className="card p-5">
        <h3 className="section-title mb-4">Module Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(MODULE_ICONS).map(([moduleId, icon]) => (
            <button
              key={moduleId}
              onClick={() => navigate(`/${moduleId}`)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-bg-secondary hover:bg-bg-tertiary transition-colors"
            >
              <div className="text-text-muted">{icon}</div>
              <span className="text-xs text-text-secondary capitalize">
                {moduleId.replace(/-/g, ' ')}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
