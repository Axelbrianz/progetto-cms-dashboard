//interfaccia per prodotti
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    inStock: boolean;
    howManyAvailable: number;
}


let users = [
    {
 id: 1 , 
 email: 'admin@example.com',
    password: 'adminpass',
    role: 'admin',
    name: 'Admin User'
    }
    ,
    {
 id: 2 , 
 email: 'user@example.com',
    password: 'userpass',
    role: 'user',
    name: 'Regular User'
    }
];

let products: Product[] = [
    {
        id: 1,
        name: 'Pompa immersione',
        description: 'Pompa per acqua sporca adatta per uso domestico e industriale.',
         price: 120.00,
        category: 'Elettrodomestici',
        inStock: true,
        howManyAvailable: 15
    },
    {
        id: 2,
        name: 'Trapano avvitatore',
        description: 'Trapano avvitatore cordless con batteria al litio.',
        price: 85.50,
        category: 'Utensili',
        inStock: true,
        howManyAvailable: 30
    },
    {
        id: 3,
        name: 'Smerigliatrice angolare',
        description: 'Smerigliatrice angolare potente per taglio e levigatura.',
        price: 95.00,
        category: 'Utensili',
        inStock: false,
        howManyAvailable: 0
    }
];

// esporto usando Es6 modules
export { users, products };