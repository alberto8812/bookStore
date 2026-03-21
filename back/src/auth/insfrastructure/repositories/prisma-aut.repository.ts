import { CreateAuthModel } from "src/auth/domain/model/auth-repository.model";
import { IAuthRepository } from "src/auth/domain/repository/auth.repository.interface";
import { PrismaService } from "src/shared/db/postgres/prisma-manager.service";
import * as bcrypt from 'bcrypt';
import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";

export class PrismaAuthRepository implements IAuthRepository {
    private readonly logger = new Logger(PrismaAuthRepository.name);
    constructor(
        private readonly prisma: PrismaService
    ) { }
    async create(createUserDto: CreateAuthModel): Promise<any> {
        try {
            const { password, ...rest } = createUserDto;

            const excist = await this.findByEmail(createUserDto.email);
            if (excist) {
                throw new BadRequestException('User with this email already exists');
            }
            const hashPassword = bcrypt.hashSync(password, 10);
            await this.prisma.auth.create({
                data: {
                    ...rest,
                    password: hashPassword
                }
            });


            return {
                ...rest,
                token: "llll"
            }

        } catch (error) {
            this.logger.error('Error creating user', error);
            this.handleDBEceptions(error)

        }

    }
    async findByEmail(email: string): Promise<any> {

        try {
            const user = await this.prisma.auth.findUnique({
                where: {
                    email
                }
            })

            if (user) {
                return user;
            }
            return null;

        } catch (error) {
            this.logger.error('Error finding user by email', error);
            this.handleDBEceptions(error)
        }
    }

    private handleDBEceptions(error: any): never {
        console.log(error)
        if (error.code === 11000) {
            throw new BadRequestException(error.errorResponse.errmsg);
        }
        this.logger.error(error);
        throw new InternalServerErrorException(
            'Unexpected error, check server log',
        );
    }

}