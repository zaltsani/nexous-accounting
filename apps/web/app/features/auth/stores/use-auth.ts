import type { IAuthToken, ILoginResult, ISelectTenantResponse, ITenant, IUser } from "@nexous-accounting/types";
import { create } from "zustand";
import { persist } from 'zustand/middleware';

type AuthState = {
  user: IUser | null;
  tenant: ITenant | null;
  authToken: IAuthToken | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  setHydrated: (state: boolean) => void;
  login: (loginResult: ILoginResult) => void;
  logout: () => void;
  selectTenant: (res: ISelectTenantResponse) => void;
  isTokenValid: () => boolean;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tenant: null,
      authToken: null,
      isAuthenticated: false,
      isHydrated: false,

      setHydrated: (state) => set({ isHydrated: state }),

      login: (loginResult) =>
        set({
          user: loginResult.user,
          tenant: loginResult.tenant,
          authToken: loginResult.tokens,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          tenant: null,
          authToken: null,
          isAuthenticated: false,
        }),

      selectTenant: (res) =>
        set({
          tenant: res.membership.tenant,
          authToken: res.authToken,
        }),

      isTokenValid: () => {
        const { authToken } = get();
        if (!authToken) return false;
        return true;
      },
    }),
    {
      name: 'auth',
      partialize: (state) => ({
        user: state.user,
        tenant: state.tenant,
        authToken: state.authToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);