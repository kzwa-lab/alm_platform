import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthContext } from '@alm/shared';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthContext | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken: string, user: AuthContext) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: (token, refreshToken, user) =>
        set({ token, refreshToken, user, isAuthenticated: true, isLoading: false }),
      logout: () =>
        set({ token: null, refreshToken: null, user: null, isAuthenticated: false, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'alm-auth-storage',
      partialize: (state) => ({ token: state.token, refreshToken: state.refreshToken, user: state.user }),
    }
  )
);
