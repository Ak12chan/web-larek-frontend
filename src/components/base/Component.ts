export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {
	}
	/**
	 * Метод `render`\
	 * Родительский метод.\
	 * Принимает данные, которыми необходимо заполнить элемент, находящийся в свойстве `container`.\
	 * Возвращает заполненый `container`.
	 */
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}