import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { IPage } from "../types";

export class Page extends Component<IPage> {
	protected _counter: HTMLSpanElement;
	protected _catalog: HTMLElement;
	protected basket: HTMLButtonElement;
	protected events: IEvents;
	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._counter = container.querySelector('.header__basket-counter');
		this._catalog = container.querySelector('.gallery');
		this.basket = container.querySelector('.header__basket');
		this.basket.addEventListener('click', () => { this.events.emit('bids:render') });
	}

	set counter(value: number) {
		this._counter.textContent = value.toString();
	}
	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}
	locked(value: boolean) {
		if (value) {
			this.container.classList.add('page_locked');
		} else {
			this.container.classList.remove('page_locked');
		}
	}
}