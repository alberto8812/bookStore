import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AuthRepositoryModel } from "src/auth/domain/model/auth-repository.model";
import { AUTH_REPOSITORY, IAuthRepository } from "src/auth/domain/repository/auth.repository.interface";
import { JwtPayload } from "src/auth/insfrastructure/interface/jwt.payload.interface";
import { envs } from "src/config/envs";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
    ) {
        super({
            secretOrKey: envs.jwtSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),//POSICION QUE VAMOS A ENVIAR EL JSON WEB TOKEN
        })
    }
    async validate(payload: JwtPayload): Promise<AuthRepositoryModel> {
        const { email, id } = payload;
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Token not valid');
        }
        return user;// se envia en la request
    }

}