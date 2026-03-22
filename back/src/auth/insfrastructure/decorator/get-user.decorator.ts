import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext) => {// obtenemos la data si son varios argumento sedeve enviar en array , el contexto en el cual se esta ejecutando la funcion tiene acceso a la request

        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if (!user) {
            throw new InternalServerErrorException('user no found');
        }

        return user;
    }
)