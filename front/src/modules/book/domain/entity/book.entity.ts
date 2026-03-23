



export interface Book {
    id: string;
    title: string;
    autor: string;
    description: string;
    published_at: string;
    price: number;
    status: 'available' | 'unavailable';
}

export type CreateBookDTO = Omit<Book, 'id'>;