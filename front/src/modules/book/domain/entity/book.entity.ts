



export interface Book {
    id: string;
    title: string;
    autor: string;
    description: string;
    price: number;
    status: 'available' | 'unavailable';
}