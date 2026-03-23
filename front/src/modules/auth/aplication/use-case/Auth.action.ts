import { generiActionQuery } from "@/shared/aplication/use-case/generi-action-query";
import type { AuthEntity } from "@/modules/book/domain/entity/auth.entity";

const actions = generiActionQuery<AuthEntity>("/auth");

export const create = actions.create;
export const update = actions.update;
export const login = actions.login;
export const findById = actions.findById;
export const remove = actions.remove;
export const findAllPaginated = actions.findAllPaginated;
