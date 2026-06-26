import { create } from 'zustand';

interface ModuleState {
  currentModuleId: string;
  currentRoute: string;
  expandedModules: string[];
  setCurrentModule: (moduleId: string, route: string) => void;
  toggleModuleExpanded: (moduleId: string) => void;
  isModuleExpanded: (moduleId: string) => boolean;
}

export const useModuleStore = create<ModuleState>((set, get) => ({
  currentModuleId: 'dashboard',
  currentRoute: '/dashboard',
  expandedModules: ['liquidity', 'interest-rate', 'capital'],
  setCurrentModule: (moduleId, route) => set({ currentModuleId: moduleId, currentRoute: route }),
  toggleModuleExpanded: (moduleId) => {
    set((state) => ({
      expandedModules: state.expandedModules.includes(moduleId)
        ? state.expandedModules.filter((id) => id !== moduleId)
        : [...state.expandedModules, moduleId],
    }));
  },
  isModuleExpanded: (moduleId) => get().expandedModules.includes(moduleId),
}));
