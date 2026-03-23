import { generiActionQuery } from "@/shared/aplication/use-case/generi-action-query";
import type { Book } from "../../domain/entity/book.entity";

const actions = generiActionQuery<Book>("/book-store");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
