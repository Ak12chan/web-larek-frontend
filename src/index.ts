import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductsData } from './components/ProductsData';
import { OrderData } from './components/OrderData';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Card } from './components/Card';
import { cloneTemplate } from './utils/utils';
import { IId, TOrderDelivery, TOrderContact, TOrderAnswer } from './types';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

// Приведение типов и проверка на null
const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement | null;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement | null;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement | null;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement | null;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement | null;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement | null;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement | null;
const modalContainer = document.querySelector('#modal-container') as HTMLElement | null;

if (!cardTemplate || !cardPreviewTemplate || !cardBasketTemplate || !basketTemplate || !orderTemplate || !contactsTemplate || !successTemplate || !modalContainer) {
	throw new Error('One or more required templates or containers are missing');
}

const events = new EventEmitter();
const appApi = new AppApi(API_URL, CDN_URL);
const productsData = new ProductsData(events);
const orderData = new OrderData(events);
const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);

// Создание статических экземпляров
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

// Загрузка данных о продуктах
appApi
	.getProductList()
	.then((data) => (productsData.products = data))
	.catch((err) => console.error(err));

// Обработчики событий
events.on('products:changed', () => {
	const cardArray = productsData.products.map((item) => {
		const cardInstant = new Card(cloneTemplate(cardTemplate), events);
		return cardInstant.render(item);
	});
	page.render({ catalog: cardArray });
});

events.on('card:select', (item: IId) => {
	const cardInstant = new Card(cloneTemplate(cardPreviewTemplate), events);
	if (orderData.getProduct(item.id)) cardInstant.lockedButton(true);
	modal.render({
		content: cardInstant.render(productsData.getProduct(item.id)),
	});
});

events.on('bids:add', (item: IId) => {
	orderData.addProduct(productsData.getProduct(item.id));
	events.emit('bids:change');
	modal.close();
});

events.on('bids:remove', (item: IId) => {
	orderData.deleteProduct(item.id);
	events.emit('bids:change');
});

events.on('bids:change', () => {
	page.counter = orderData.getCount();
});

events.on('bids:render', () => {
	let count = 1;
	const basketArray = orderData.getProducts().map((item) => {
		const cardInstant = new Card(cloneTemplate(cardBasketTemplate), events);
		cardInstant.setIndex(count);
		count++;
		return cardInstant.render(item);
	});
	modal.render({
		content: basket.render({ list: basketArray, price: orderData.getTotal() }),
	});
});

events.on('order:render', () => {
	modal.render({ content: order.render() });
});

events.on('contacts:render', (data: TOrderDelivery) => {
	orderData.setDelivery(data);
	modal.render({ content: contacts.render() });
});

events.on('success:render', (data: TOrderContact) => {
	orderData.setContact(data);
	console.log(orderData.getOrder());
	appApi.postOrder(orderData.getOrder())
		.then((data: TOrderAnswer) => {
			orderData.clearOrder();
			modal.render({ content: success.render({ total: data.total }) });
		})
		.catch((err) => console.error(err));
});

events.on('success:close', () => modal.close());
events.on('modal:open', () => {
	page.locked(true);
});
events.on('modal:close', () => {
	page.locked(false);
});

