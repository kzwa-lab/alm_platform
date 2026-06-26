import { create } from 'zustand';

interface ContextState {
  entityId: string;
  entityName: string;
  reportingDate: string;
  scenario: 'base' | 'upside' | 'downside' | 'severe' | 'recovery';
  currency: string;
  referenceRate: number | null;
  setEntity: (id: string, name: string) => void;
  setReportingDate: (date: string) => void;
  setScenario: (scenario: ContextState['scenario']) => void;
  setCurrency: (currency: string) => void;
  setReferenceRate: (rate: number | null) => void;
}

export const useContextStore = create<ContextState>((set) => ({
  entityId: 'tenant-ecobank-gh',
  entityName: 'Ecobank Ghana PLC (Consolidated)',
  reportingDate: '2026-06-30',
  scenario: 'base',
  currency: 'GHS',
  referenceRate: 25.50,
  setEntity: (id, name) => set({ entityId: id, entityName: name }),
  setReportingDate: (date) => set({ reportingDate: date }),
  setScenario: (scenario) => set({ scenario }),
  setCurrency: (currency) => set({ currency }),
  setReferenceRate: (rate) => set({ referenceRate: rate }),
}));
