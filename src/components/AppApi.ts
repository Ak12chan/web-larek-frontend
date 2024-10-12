import { IOrder, TOrderAnswer, TProductAnswer, IAppApi } from '../types';
import { Api } from './base/api';

export class AppApi extends Api implements IAppApi {
	readonly cdn: string;

	constructor(baseUrl: string, cdn: string) {
		super(baseUrl);
		this.cdn = cdn;
	}

	getProductList() {
		return this.get(`/product`).then((data: TProductAnswer) =>
			data.items.map((item) => ({ ...item, image: this.cdn + item.image }))
		);
	}

	postOrder(order: IOrder) {
		return this.post(`/order`, order).then((data: TOrderAnswer) => data);
	}
}
