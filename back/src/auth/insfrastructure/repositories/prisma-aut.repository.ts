import { IAuthRepository } from "src/auth/domain/repository/auth.repository.interface";
import { PrismaService } from "src/shared/db/postgres/prisma-manager.service";

export class PrismaAuthRepository implements IAuthRepository {
    constructor(
        private readonly prisma: PrismaService
    ) { }
    create(createUserDto: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    findByEmail(email: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

}