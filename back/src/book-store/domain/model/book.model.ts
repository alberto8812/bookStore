
export enum StatusBook {
    AVAILABLE = 'available',
    RESERVED = 'reserved',
}

export interface BookModel {
    id: string;
    title: string;
    autor: string;
    price: number;
    description: string;
    status: StatusBook;
}

export type CreateBookStore = Omit<BookModel, 'id'>;

export type UpdateBookStore = Partial<CreateBookStore>;