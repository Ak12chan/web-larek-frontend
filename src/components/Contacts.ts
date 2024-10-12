import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class Contacts  extends Component<null> {
	protected inputEmail: HTMLInputElement;
	protected inputPhone: HTMLInputElement;
	protected submitButton: HTMLButtonElement;
	protected fotmError: HTMLSpanElement;
	protected email: string;
	protected phone: string;
	protected events: IEvents;

	constructor(protected container: HTMLTemplateElement, events: IEvents) {
		super(container);
		this.events = events;
		this.inputEmail = this.container.querySelector('input[name="email"]');
		this.inputPhone = this.container.querySelector('input[name="phone"]');
		this.submitButton = this.container.querySelector('.button');
		this.fotmError = this.container.querySelector('.form__errors');
		this.inputEmail.addEventListener('input', () => this.checkButton());
		this.inputPhone.addEventListener('input', () => this.checkButton());
		this.submitButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.email = this.inputEmail.value;
			this.phone = this.inputPhone.value;
			this.events.emit('success:render', {email: this.email, phone: this.phone});
		})
	}
	checkButton() {
		if(this.inputEmail.value && this.inputPhone.value) {
			this.submitButton.disabled = false;
			this.fotmError.textContent = '';
		} else {
			this.submitButton.disabled = true;
			this.fotmError.textContent = 'Укажите электронную почту и телефон.'
		}
	}
}