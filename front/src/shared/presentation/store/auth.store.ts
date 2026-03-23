import type { AuthEntity } from '@/modules/auth/domain/entity/auth.entity';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
    user: AuthEntity | null;
    token: string | null;
    authstatus: 'authenticated' | 'unauthenticated' | 'loading';

    setLogin: (user: AuthEntity, token: string) => Promise<void>;
    logout: () => void;

}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            authstatus: 'unauthenticated',

            setLogin: async (user: AuthEntity, token: string) => {
                set({ user, token, authstatus: 'authenticated' });
            },
            logout: () => set({ user: null, token: null, authstatus: 'unauthenticated' }),
        }),
        {
            name: 'auth-storage',
        }
    )
);