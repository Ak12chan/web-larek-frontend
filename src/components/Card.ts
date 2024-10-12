import { Component } from "./base/Component";
import { IProduct } from "../types";
import { IEvents } from "./base/events";

export class Card  extends Component<IProduct>{
	protected events: IEvents;
	protected cardId: string;
	protected cardDescription: HTMLParagraphElement;
	protected cardImage: HTMLImageElement;
	protected cardTitle: HTMLHeadingElement;
	protected cardCategory: HTMLSpanElement;
	protected cardPrice: HTMLSpanElement;
	protected cardIndex: HTMLSpanElement;

	protected addButton: HTMLButtonElement;
	protected removeButton: HTMLButtonElement;

	constructor(protected container: HTMLTemplateElement, events: IEvents) {
		super(container);
		this.events = events;

		this.cardDescription = this.container.querySelector('.card__text');
		this.cardImage = this.container.querySelector('.card__image');
		this.cardTitle = this.container.querySelector('.card__title');
		this.cardCategory = this.container.querySelector('.card__category');
		this.cardPrice = this.container.querySelector('.card__price');
		this.cardIndex = this.container.querySelector('.basket__item-index');
		this.addButton = this.container.querySelector('.button');
		this.removeButton = this.container.querySelector('.basket__item-delete');
		if(this.addButton) {
			this.addButton.addEventListener('click', () => this.events.emit('bids:add', { id: this.getId() }))
		} else if (this.removeButton) {
			this.removeButton.addEventListener('click', () => this.events.emit('bids:remove', { id: this.getId() }))
		} else {
			this.container.addEventListener('click', () =>  this.events.emit('card:select', { id: this.getId() }))
		}
	}
	set id (id: string) {
		this.cardId = id;
	}
	set description (description: string) {
		if (this.cardDescription) this.cardDescription.textContent = description;
	}
	set image (image: string) {
		if (this.cardImage) this.cardImage.src = image;
	}
	set title (title: string) {
		this.cardTitle.textContent = title;
		if (this.cardImage) this.cardImage.alt = title;
	}
	set category (category: string) {
		if(this.cardCategory) {
			this.cardCategory.textContent = category;
			switch (category) {
				case 'софт-скил':
					this.cardCategory.classList.add('card__category_soft');
					break;
				case 'хард-скил':
					this.cardCategory.classList.add('card__category_hard');
					break;
				case 'другое':
					this.cardCategory.classList.add('card__category_other');
					break;
				case 'дополнительное':
					this.cardCategory.classList.add('card__category_additional');
					break;
				case 'кнопка':
					this.cardCategory.classList.add('card__category_button');
					break;
			}
		}
	}
	set price (price: number | null) {
		if (price === null) {
			this.cardPrice.textContent = 'Бесценно';
		} else {
			this.cardPrice.textContent = `${price} синапсов`;
		}
	}
	lockedButton (value: boolean) {
		if (value) {
			this.addButton.disabled = true;
		} else {
			this.addButton.disabled = false;
		}
	}

	setIndex (index: number) {
		this.cardIndex.textContent = index.toString();
	}
	getId() {
		return this.cardId;
	}
}