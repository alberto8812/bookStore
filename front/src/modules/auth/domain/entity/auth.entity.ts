export interface AuthEntity {
    id: string;
    username: string;
    email: string;
    password: string;
    token: string;
}


export type LoginUser = Omit<AuthEntity, 'password' | 'token'>;