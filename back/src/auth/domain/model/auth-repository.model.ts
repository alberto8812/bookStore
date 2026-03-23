export interface AuthRepositoryModel {
    id: string;
    email: string;
    password: string;
    name: string;
}

export type CreateAuthModel = Omit<AuthRepositoryModel, 'id'>;

