import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { IModalData } from "../../types";
/**
 * Класс отвечает за создание модального окна, единого для всего приложения
 */
export class Modal extends Component<IModalData> {
	protected _content: HTMLElement;
	protected closeButton: HTMLButtonElement;
	protected events: IEvents
	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		// контейнер для содержимого модального окна
		this._content = container.querySelector('.modal__content');
		// кнопка закрытия модального окна
		this.closeButton = container.querySelector('.modal__close');
		// слушатель на контейнер, закрывает модальное окно при любом клике, неважно внутри или снаружи окна
		this.container.addEventListener('click', this.close.bind(this));
		// слушатель, который предотвращает закрытие окна, когда клик произошёл внутри окна(не на overlay)
		this._content.addEventListener('click', (event) => event.stopPropagation());
		// слушатель на кнопку закрытия модального окна. Если нажали, закрываем окно
		this.closeButton.addEventListener('click', this.close.bind(this));
	}

	/**
	 * Сеттер `content`\
	 * Принимает HTML элемент, который будет отображаться внутри модального окна.\
	 * Принимаемый элемент становится дочерним, для элемента, который находится в свойстве `_content`
	 */
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}
	/**
	 * Mетод `open`\
	 * Открывает модальное окно, при помощи добавления класса `modal_active`\
	 * Генерирует событие `modal:open`
	 */
	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}
	/**
	 * Метод `close`\
	 * Закрывает модальное окно, при помощи удаления класса `modal_active`\
	 * Генерирует событие `modal:close`
	 */
	close() {
		this.container.classList.remove('modal_active');
		this.events.emit('modal:close');
	}
	/**
	 * Метод `render`\
	 * Расширяет родительский метод.\
	 * Принимает HTML элемент, который будет отображаться внутри модального окна.\
	 * Возвращает уже готовый HTML элемент модального окна.\
	 * Принимаемый элемент передаётся в родительский метод.\
	 * Родительский метод через сеттер `content` задаёт значение полю `_content`.\
	 * Затем вызывается метод `open`, который открывает окно.
	 */
	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}