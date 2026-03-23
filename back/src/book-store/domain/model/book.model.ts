
export enum StatusBook {
    AVAILABLE = 'available',
    RESERVED = 'reserved',
}

export interface BookModel {
    id: string;
    title: string;
    autor: string;
    price: number;
    published_at: Date;
    description: string;
    status: StatusBook;
    created_by_id: string;
}

export type CreateBookStore = Omit<BookModel, 'id' | 'created_by_id'>;

export type UpdateBookStore = Partial<CreateBookStore>;