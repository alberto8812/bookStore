



export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    status: 'available' | 'unavailable';
}