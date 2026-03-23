import { authLoginModel, AuthRepositoryModel, AuthWithoutPassword, CreateAuthModel } from "src/auth/domain/model/auth-repository.model";
import { IAuthRepository } from "src/auth/domain/repository/auth.repository.interface";
import { PrismaService } from "src/shared/db/postgres/prisma-manager.service";
import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/auth/insfrastructure/interface/jwt.payload.interface";
import { LoginUserDto } from "src/auth/aplication/dto/login-user.dto";

@Injectable()
export class PrismaAuthRepository implements IAuthRepository {
    private readonly logger = new Logger(PrismaAuthRepository.name);
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }
    async create(createUserDto: CreateAuthModel): Promise<{ token: string, email: string, name: string }> {
        try {
            const { password, ...rest } = createUserDto;

            const excist = await this.findByEmail(createUserDto.email);
            if (excist) {
                throw new BadRequestException('User with this email already exists');
            }
            const hashPassword = bcrypt.hashSync(password, 10);
            const user = await this.prisma.auth.create({
                data: {
                    ...rest,
                    password: hashPassword
                }
            });


            return {
                ...rest,
                token: this.GetJwtToken({ id: user.id, email: user.email })
            }

        } catch (error) {
            this.logger.error('Error creating user', error);
            this.handleDBEceptions(error)

        }

    }

    async findByEmail(email: string): Promise<AuthRepositoryModel | null> {

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


    async login(loginUserDto: authLoginModel): Promise<{ token: string, user: AuthWithoutPassword }> {
        try {
            const { email, password } = loginUserDto;
            const user = await this.findByEmail(email);
            if (!user) {
                throw new BadRequestException('Invalid credentials');
            }
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                throw new BadRequestException('Invalid credentials');
            }
            const payload: JwtPayload = { email: user.email, id: user.id };
            const token = this.GetJwtToken(payload);
            const { password: _, ...userWithoutPassword } = user;
            return {
                user: userWithoutPassword,
                token
            }
        } catch (error) {
            this.logger.error('Error logging in', error);
            this.handleDBEceptions(error)
        }
    }

    private GetJwtToken(payload: JwtPayload) {
        const token = this.jwtService.sign(payload);//codigo es sincrono
        return token;
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