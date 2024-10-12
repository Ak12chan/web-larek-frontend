import { IProductsData, IProduct } from "../types";
import { IEvents } from "./base/events";

export class ProductsData implements IProductsData {
	protected _products: IProduct[];
	protected events: IEvents;
	constructor(events: IEvents) {
		this.events = events;
	}

	set products(products: IProduct[]) {
		this._products = products;
		this.events.emit('products:changed');
	}

	get products() {
		return this._products;
	}

	getProduct(id: string) {
		return this._products.find(item => item.id === id)
	}
}