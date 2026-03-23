import { useQueryModule } from "@/shared/presentation/hook/use-query-module";
import * as actions from "../../aplication/use-case/book.action";
import type { Book } from "../../domain/entity/book.entity";


export const useBook = (id?: string) => {
    return useQueryModule<Book>("book-store", actions, { id });
}                 