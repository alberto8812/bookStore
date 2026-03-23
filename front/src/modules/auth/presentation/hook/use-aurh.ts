import { useQueryModule } from "@/shared/presentation/hook/use-query-module";
import * as actions from "../../aplication/use-case/Auth.action";
import type { AuthEntity } from "@/modules/book/domain/entity/auth.entity";


export const useAuth = (id?: string) => {
    return useQueryModule<AuthEntity>("auth", actions, { id, disableQuery: true });
}                 