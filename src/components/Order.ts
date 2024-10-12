import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class Order  extends Component<null> {
	protected cardButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;
	protected inputAddress: HTMLInputElement;
	protected submitButton: HTMLButtonElement;
	protected fotmError: HTMLSpanElement;
	protected payment: string;
	protected address: string;
	protected events: IEvents;

	constructor(protected container: HTMLTemplateElement, events: IEvents) {
		super(container);
		this.events = events;
		this.cardButton = this.container.querySelector('button[name="card"]');
		this.cashButton = this.container.querySelector('button[name="cash"]');
		this.inputAddress = this.container.querySelector('input[name="address"]');
		this.submitButton = this.container.querySelector('.order__button');
		this.fotmError = this.container.querySelector('.form__errors');


		this.cardButton.addEventListener('click', () => {this.setPayment('card')});
		this.cashButton.addEventListener('click', () => {this.setPayment('cash')});
		this.inputAddress.addEventListener('input', () => {this.checkButton()});
		this.submitButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.address = this.inputAddress.value;
			this.events.emit('contacts:render', {payment: this.payment, address: this.address});
		})
	}
	checkButton() {
		if(this.payment && this.inputAddress.value) {
			this.submitButton.disabled = false;
			this.fotmError.textContent = '';
		} else {
			this.submitButton.disabled = true;
			this.fotmError.textContent = 'Укажите способ оплаты и адрес.'
		}
	}
	setPayment(type: string) {
		if (type === 'card') {
			this.payment = 'card';
			this.cardButton.classList.add('button_alt-active');
			this.cashButton.classList.remove('button_alt-active');
		} else {
			this.payment = 'cash';
			this.cardButton.classList.remove('button_alt-active');
			this.cashButton.classList.add('button_alt-active');
		}
		this.checkButton();
	}
}