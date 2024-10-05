export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}
export type TOrderDelivery = Pick<IOrder, 'payment' | 'address'>;
export type TOrderContact = Pick<IOrder, 'email' | 'phone'>;
export interface IProductsData {
	products: IProduct[];
	getProduct(id: string): IProduct | undefined;
}
export interface IOrderData {
	addProduct(item: IProduct): void;
	deleteProduct(id: string): void;
	getProducts(): IProduct[];
	getProduct(id: string): IProduct | undefined;
	setDelivery(delivery: TOrderDelivery): void;
	setContact(contact: TOrderContact): void;
	getTotal(): number;
	getCount(): number;
	getOrder(): IOrder;
	clearOrder(): void;
}
export type TProductAnswer = {total: number, items: IProduct[]};
export type TOrderAnswer = {id: string, total: number};