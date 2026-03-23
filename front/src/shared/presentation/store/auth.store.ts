import type { AuthEntity, LoginUser } from '@/modules/auth/domain/entity/auth.entity';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
    user: LoginUser | null;
    token: string | null;
    authstatus: 'authenticated' | 'unauthenticated' | 'loading';

    setLogin: (user: LoginUser, token: string) => Promise<void>;
    logout: () => void;

}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            authstatus: 'unauthenticated',

            setLogin: async (user: LoginUser, token: string) => {
                set({ user, token, authstatus: 'authenticated' });
            },
            logout: () => set({ user: null, token: null, authstatus: 'unauthenticated' }),
        }),
        {
            name: 'auth-storage',
        }
    )
);