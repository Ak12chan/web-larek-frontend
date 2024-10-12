import { IOrderData, IProduct, TOrderDelivery, TOrderContact } from "../types";
import { IEvents } from "./base/events";

export class OrderData implements IOrderData {
	protected payment: string;
	protected email: string;
	protected phone: string;
	protected address: string;
	protected items: IProduct[];
	protected events: IEvents;
	constructor(events: IEvents) {
		this.events = events;
		this.items = [];

	}
	addProduct(item: IProduct) {
		this.items.push(item);
		this.events.emit('order:changed');
	}
	deleteProduct(id: string) {
		this.items = this.items.filter( item => item.id !== id);
		this.events.emit('order:changed');
	}
	getProducts() {
		return this.items;
	}
	getProduct(id: string) {
		return this.items.find(item => item.id === id)
	}
	setDelivery(delivery: TOrderDelivery) {
		this.payment = delivery.payment;
		this.address = delivery.address;
	}
	setContact(contact: TOrderContact) {
		this.email = contact.email;
		this.phone = contact.phone;
	}
	getTotal() {
		let count: number = 0;
		this.items.forEach(item => {
			if(item.price) count = count + item.price
		})
		return count;
	}
	getCount() {
		return this.items.length;
	}
	getOrder() {
		const masId: string[] = [];
		this.items.forEach(item => {
			if(item.price !== null) {
				masId.push(item.id)
			}
		})
		return {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address,
			total: this.getTotal(),
			items: masId,
		}
	}
	clearOrder() {
		this.payment = '';
		this.email = '';
		this.phone = '';
		this.address = '';
		this.items = [];
		this.events.emit('order:changed');
	}
}