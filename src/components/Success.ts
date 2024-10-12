import { Component } from "./base/Component";
import { ISuccess } from "../types";
import { IEvents } from "./base/events";

export class Success  extends Component<ISuccess> {
	protected closeButton: HTMLButtonElement;
	protected checkForm: HTMLParagraphElement;
	protected events: IEvents;

	constructor(protected container: HTMLTemplateElement, events: IEvents) {
		super(container);
		this.events = events;
		this.checkForm = this.container.querySelector('.order-success__description');
		this.closeButton = this.container.querySelector('.button');
		this.closeButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.events.emit('success:close');
		})
	}

	set total(total: number) {
		this.checkForm.textContent = `Списано ${total} синапсов`;
	}
}