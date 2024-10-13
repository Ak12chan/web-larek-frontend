import './scss/styles.scss';
import { EventEmitter } from "./components/base/events";
import { AppApi } from "./components/AppApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { ProductsData } from "./components/ProductsData";
import { OrderData } from "./components/OrderData";
import { Page } from "./components/Page";
import { Modal } from "./components/common/Modal";
import { Card } from "./components/Card";
import { cloneTemplate } from "./utils/utils";
import { IId, TOrderDelivery, TOrderContact, TOrderAnswer } from "./types";
import { Basket } from "./components/Basket";
import { Order } from "./components/Order";
import { Contacts } from "./components/Contacts";
import { Success } from "./components/Success";

const cardTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
const orderTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsTemplate: HTMLTemplateElement = document.querySelector('#contacts');
const successTemplate: HTMLTemplateElement = document.querySelector('#success');
const modalContainer: HTMLElement = document.querySelector('#modal-container');
const events = new EventEmitter();
const appApi = new AppApi(API_URL, CDN_URL);
const productsData = new ProductsData(events);
const orderData = new OrderData(events);
const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);

// Создание экземпляров статичных форм
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

appApi.getProductList()
	.then((data) => productsData.products = data)
	.catch(err => console.error(err));

events.on('products:changed', () => {
	const cardArray = productsData.products.map(item => {
		const cardInstant = new Card(cloneTemplate(cardTemplate), events);
		return cardInstant.render(item);
	});
	page.render({ catalog: cardArray });
});

events.on('card:select', (item: IId) => {
	const cardInstant = new Card(cloneTemplate(cardPreviewTemplate), events);
	if (orderData.getProduct(item.id)) cardInstant.lockedButton(true);
	modal.render({ content: cardInstant.render(productsData.getProduct(item.id)) });
});

events.on('bids:add', (item: IId) => {
	orderData.addProduct(productsData.getProduct(item.id));
	events.emit('bids:change');
	modal.close();
});

events.on('bids:remove', (item: IId) => {
	orderData.deleteProduct(item.id);
	events.emit('bids:change');
	events.emit('bids:render');
});

events.on('bids:change', () => {
	page.counter = orderData.getCount();
	// Здесь можно обновить другие элементы страницы, если необходимо
});

events.on('bids:render', () => {
	let count = 1;
	const basketArray = orderData.getProducts().map(item => {
		const cardInstant = new Card(cloneTemplate(cardBasketTemplate), events);
		cardInstant.setIndex(count);
		count++;
		return cardInstant.render(item);
	});
	modal.render({ content: basket.render({ list: basketArray, price: orderData.getTotal() }) });
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
		.catch(err => console.error(err));
});

events.on('success:close', () => modal.close());
events.on('modal:open', () => {
	page.locked(true);
});
events.on('modal:close', () => {
	page.locked(false);
});

