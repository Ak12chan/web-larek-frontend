import { Component } from "./base/Component";
import { IBasket } from "../types";
import { IEvents } from "./base/events";

export class Basket  extends Component<IBasket>{
	protected _list: HTMLElement;
	protected _price: HTMLSpanElement;
	protected button: HTMLButtonElement;
	protected events: IEvents;

	constructor(protected container: HTMLTemplateElement, events: IEvents) {
		super(container);
		this.events = events;
		this._list = this.container.querySelector('.basket__list');
		this._price = this.container.querySelector('.basket__price');
		this.button = this.container.querySelector('.basket__button');
		this.button.addEventListener('click', () => this.events.emit('order:render'));
	}

	set price (price: number) {
		this._price.textContent = `${price} синапсов`;
		if(!price) this.button.disabled = true;
	}

	set list (items: HTMLElement[]) {
		this._list.replaceChildren(...items);
	}
}