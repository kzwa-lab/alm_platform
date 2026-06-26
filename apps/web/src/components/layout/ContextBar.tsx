import { Building2, Calendar, Layers, CircleDollarSign, Percent } from 'lucide-react';
import { useContextStore } from '@stores/contextStore';

export function ContextBar() {
  const {
    entityName,
    reportingDate,
    scenario,
    currency,
    referenceRate,
    setReportingDate,
    setScenario,
    setCurrency,
  } = useContextStore();

  const scenarios = [
    { value: 'base', label: 'Base Case' },
    { value: 'upside', label: 'Upside' },
    { value: 'downside', label: 'Downside' },
    { value: 'severe', label: 'Severe' },
    { value: 'recovery', label: 'Recovery' },
  ] as const;

  const currencies = ['GHS', 'USD', 'EUR', 'GBP'];

  return (
    <div className="flex items-center gap-4 px-6 py-3 bg-bg-secondary border-b border-border-color overflow-x-auto">
      {/* Entity */}
      <div className="flex items-center gap-2 shrink-0">
        <Building2 size={14} className="text-text-muted" />
        <div>
          <div className="text-xs text-text-muted">Entity</div>
          <div className="text-sm font-medium text-text-primary">{entityName}</div>
        </div>
      </div>

      <div className="w-px h-8 bg-border-color" />

      {/* Reporting Date */}
      <div className="flex items-center gap-2 shrink-0">
        <Calendar size={14} className="text-text-muted" />
        <div>
          <div className="text-xs text-text-muted">Reporting Date</div>
          <input
            type="date"
            value={reportingDate}
            onChange={(e) => setReportingDate(e.target.value)}
            className="text-sm font-medium text-text-primary bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="w-px h-8 bg-border-color" />

      {/* Scenario */}
      <div className="flex items-center gap-2 shrink-0">
        <Layers size={14} className="text-text-muted" />
        <div>
          <div className="text-xs text-text-muted">Scenario</div>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value as typeof scenario)}
            className="text-sm font-medium text-text-primary bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
          >
            {scenarios.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-px h-8 bg-border-color" />

      {/* Currency */}
      <div className="flex items-center gap-2 shrink-0">
        <CircleDollarSign size={14} className="text-text-muted" />
        <div>
          <div className="text-xs text-text-muted">Currency</div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="text-sm font-medium text-text-primary bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-px h-8 bg-border-color" />

      {/* Reference Rate */}
      <div className="flex items-center gap-2 shrink-0">
        <Percent size={14} className="text-text-muted" />
        <div>
          <div className="text-xs text-text-muted">Reference Rate</div>
          <div className="text-sm font-medium text-text-primary">
            {referenceRate ? `GRR ${referenceRate.toFixed(2)}%` : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}
