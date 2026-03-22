export interface AuthRepositoryModel {
    id: number;
    email: string;
    password: string;
    name: string;
}

export type CreateAuthModel = Omit<AuthRepositoryModel, 'id'>;

