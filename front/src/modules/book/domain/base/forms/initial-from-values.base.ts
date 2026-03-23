import type { Book } from "../../entity/book.entity";

export const initialFormValues: Partial<Book> = {
    title: "",
    autor: "",
    description: "",
    price: 0,
    status: "available",
};