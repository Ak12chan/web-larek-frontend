# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении
Товар
```
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```
Заказ
```
interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}
```
Данные из модального окна доставки товара
```
type TOrderDelivery = Pick<IOrder, 'payment' | 'address'>;
```
Данные из модального окна контактов
```
type TOrderContact = Pick<IOrder, 'email' | 'phone'>;
```
Интерфейс для модели данных списка товаров
```
interface IProductsData {
  products: IProduct[];
  getProduct(id: string): IProduct | undefined;
}
```
Интерфейс для модели данных заказа
```
interface IOrderData {
  addProduct(item: IProduct): void;
  deleteProduct(id: string): void;
  getProducts(): IProduct[];
  getProduct(id: string): IProduct | undefined;
  setDelivery(delivery: TOrderDelivery): void;
  setContact(contact: TOrderContact): void;
  getTotal(): number;
  getCount(): number;
  getOrder(): IOrder;
  clearOrder(): void;
}
```
Данные списка товаров, получаемые с сервера
```
type TProductAnswer = {total: number, items: IProduct[]};
```
Ответ сервера после отправки заказа
```
export type TOrderAnswer = {id: string, total: number};
```
Интерфейс для взаимодействия с сервером.
```
interface IAppApi {
  getProductList: () => Promise<IProduct[]>;
  postOrder: (order: IOrder) => Promise<TOrderAnswer>;
}
```
Интерфейс для заполнения всплывающего окна
```
interface IModalData {
  content: HTMLElement;
}
```
Интерфейс для заполнения основной страницы.
```
interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked(value: boolean): void;
}
```
Интерфейс для наполнение корзины.
```
interface IBasket {
  list: HTMLElement[];
  price: number;
}
```
Интерфейс для отображения окна успешного оформления.
```
interface ISuccess {
  total: number;
}
```
Интерфейс для передачи идентификатора товара.
```
interface IId {
  id: string;
}
```
## Архитектура приложения
Приложение разделено на 3 слоя и использует парадигму MVP
- Слой Model отвечает за данные и работу с ними
- Слой View отвечает за отображение на странице
- Слой Presenter отвечает за связь Model с View
  Приложение использует событийно-ориентированный подход. Это означает что объекты представления напрямую не взаимодействуют ни между собой ни с объектами данных, всё происходит посредством событий.\
  Пример взаимодействия:
- Пользователь просматривает каталог товаров и нажимает на один из них, чтобы просмотреть.
- При нажатии, создаётся событие  `card:select` и передаётя id товара, который нужно открыть в всплывающем окне.
- Срабатывает обработчик события `card:select`, который по id получает объект с товаром из модели и затем рендерит всплывающие окно с полученными данными.
### Базовый код
#### Класс Api
Содержит в себе логику отправки запросов.
В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.\
Методы:
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
#### Класс EventEmitter
Реализует паттерн «Наблюдатель», предоставляя возможность подписываться на события и информировать подписчиков о их наступлении..\
Методы:
- `on` ,  `off` ,  `emit` — для подписки, отписки от события и уведомления подписчиков о его наступлении.
- `onAll` и  `offAll` — для подписки на все события и отмены подписки у всех подписчиков.
- `trigger` — Создает определенное событие с указанными аргументами, что позволяет использовать его в качестве обработчика событий в других классах. Эти классы смогут генерировать события, не имея при этом прямой зависимости от класса EventEmitter.
### Слой данных
#### Класс ProductsData
Класс отвечает за хранение и работу со списком товаров.\
Конструктор класса принимает инстант брокера событий.\
Поля класса
- _products: IProduct[] - массив объектов карточек товара
- events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменении данных.
  Методы класса
- set products(products: IProduct[]) - сеттер устанавливает массив карточек товаров.
- get products(): IProduct[] - геттер возвращает массив карточек товаров.
- getCard(id: string): IProduct | undefined - возвращает карточку товара по её id, если такая есть.
#### Класс OrderData
Класс отвечает за хранение и работу с товарами, которые были добавлены в корзину и данными пользователя для заказа\
Конструктор класса принимает инстант брокера событий.\
Поля класса
- payment: string - способ оплаты
- email: string - электронная почта покупателя
- phone: string - номер телефона покупателя
- address: string - адрес
- items: IProduct[] - массив товаров в корзине
- events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменении данных
  Методы класса
- addProduct(item: IProduct): void - добавляет товар в заказ
- deleteProduct(id: string): void - удаляет товар из заказа
- getProducts(): IProduct[] - возвращает массив товаров в заказе
- getProduct(id: string): IProduct | undefined - ищет товар в заказе по id и возвращает его если такой имееется
- setDelivery(delivery: TOrderDelivery): void - добавляет способ оплаты и адрес
- setContact(contact: TOrderContact): void - добавляет электронную почту и телефон
- getTotal(): number - возвращает общую стоимость товаров в заказе
- getCount(): number - возвращает количество товаров в заказе
- getOrder(): IOrder - возвращает объект заказа, в виде необходимом для отправки на сервер
- clearOrder(): void - очищает заказ
### Классы представления
#### Базовый Класс Component
Класс является дженериком и служит родителем для всех компонентов слоя представления. В дженерик передается тип объекта, который будет использоваться для передачи данных в метод `render` с целью отображения информации в компоненте.
#### Класс Page
Класс предназначен для отображения всего каталога товаров и главной страницы. Поля класса:
- constructor(container: HTMLElement, events: IEvents) - конструктор принимает селектор, саму страницу и экземпляр класса `EventEmitter`.
  Поля класса
- _counter: HTMLElement - количество товаров в корзине
- _catalog: HTMLElement - контейнер, для списка товаров
- basket: HTMLElement - значок корзины
- events: IEvents - брокер событий
  Методы класса
- set counter(value: number) - сеттер устанавливает количество товаров в корзине
- set catalog(items: HTMLElement[]) - сеттер добавляет список товаров на страницу
- locked(value: boolean) - блокирует или разблокирует прокрутку страницы
#### Класс Modal
Реализует модальное окно.
- constructor(container: HTMLElement, events: IEvents) - конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.
  Поля класса
- _content: HTMLElement - элемент, который будет отображаться внутри модального окна
- closeButton: HTMLButtonElement - кнопка закрытия модального окна
- events: IEvents - брокер событий
  Методы класса
- set content(value: HTMLElement) - сеттер устанавливает отображаемый элемент внутри окна
- open() - открывает окно
- close() - закрывает окно
- render(data: IModalData): HTMLElement - получает элемент, который будет отображён внутри модального окна.Метод расширяет родительский, так как необходимо ещё открывать модальное окно.
#### Класс Card
 Класс карточек товара
- constructor( container: HTMLTemplateElement, events: IEvents) - конструктор принимает темплейт необходимой карточки и экземпляр класса `EventEmitter`
  Поля класса
- cardId: string - id товара
- cardDescription: HTMLElement - подробное описание товара
- cardImage: HTMLImageElement - картинка товара
- cardTitle: HTMLElement - название товара
- cardCategory: HTMLElement - категория товара
- cardPrice: HTMLElement - цена товара
- cardIndex: HTMLElement - индекс товара в корзине
- addButton: HTMLButtonElement - кнопка добавления товара в корзину
- removeButton: HTMLButtonElement - кнопка удаления товара из корзины
- events: IEvents - брокер событий
  Методы класса
- set id(id: string) - сеттер устанавливает карточке id соответсвующего товара
- set description (description: string) - сеттер устанавливает описание товара
- set image (image: string) - сеттер устанавливает изображение товара
- set title (title: string) - сеттер устанавливает название товара
- set category (category: string) - сеттер устанавливает категорию товара
- set price (price: number | null) - сеттер устанавливает цену товара
- disabledButton () - выключает кнопку купить
- enabledButton () - включает кнопку купить
- setIndex (index: number) - устанавливает номер товара в корзине
- getId() - возвращает id карточки
- deleteCard() - удаляет карточку
#### Класс Basket
Предназначен для отображения корзины.
- constructor(container: HTMLTemplateElement, events: IEvents) - конструктор принимает темплейт корзины и экземпляр класса `EventEmitter`
  Поля класса
- container: HTMLTemplateElement - сама корзина
- _list: HTMLElement - список товаров в корзине
- _price: HTMLElement - сумма заказа
- button: HTMLButtonElement - кнопка Оформить
- events: IEvents - брокер событий
  Методы класса
- set price (price: number) - сеттер устанавливает стоимость заказа
- set list (items: HTMLElement[]) - сеттер добавляет список тваров
#### Класс Order
Отвечает за отбражение данных в окне оформления заказа, где пользователь выбирает способ оплаты и вводит адрес доставки. Родительский метод render не устанавливает никаких значений, а только возвращает элемент для его отображения в модальном окне.
- constructor(container: HTMLTemplateElement, events: IEvents) - конструктор принимает темплейт необходимого окна и экземпляр класса `EventEmitter`
  Поля класса
- container: HTMLTemplateElement - окно оформления заказа
- cardButton: HTMLButtonElement - кнопка, отвечающая за оплату картой
- cashButton: HTMLButtonElement - кнопка, отвечающая за оплату наличными
- inputAddress: HTMLInputElement - поле адреса доставки
- submitButton: HTMLButtonElement - кнопка перехода к следующему шагу
- fotmError: HTMLElement - элемент отвечающий за вывод сообщения об ошибке
- payment: string - выбранный способ оплаты
- address: string - адрес доставки
- events: IEvents - брокер событий
  Методы класса
- checkButton() - проверяет условия и делает кнопку перехода к следующему шагу активной или неактивной
- setPayment(type: string) - устанавливает выбранный тип оплаты
#### Класс Contacts
Отвечает за отбражение данных в окне оформления заказа, где пользователь вводит электронную почту и телефон.
Родительский метод render не устанавливает никаких значений, а только возвращает элемент для его отображения в модальном окне.
- constructor(container: HTMLTemplateElement, events: IEvents) - конструктор принимает темплейт необходимого окна и экземпляр класса `EventEmitter`
  Поля класса
- container: HTMLTemplateElement - окно оформления заказа
- inputEmail: HTMLInputElement - поле электронной почты
- inputPhone: HTMLInputElement - поле телефона
- submitButton: HTMLButtonElement - кнопка отправки заказа
- fotmError: HTMLElement - элемент отвечающий за вывод сообщения об ошибке
- email: string - электронная почта
- phone: string - телефон
- events: IEvents - брокер событий
  Методы класса
- checkButton() - проверяет условия и делает кнопку отправки заказа активной или неактивной
#### Класс Success
Окно успешного оформления заказа.  В родительский метод render передаём стоимость оформленного заказа, которую получаем в ответе от сервера.
- constructor(container: HTMLTemplateElement, events: IEvents) - конструктор принимает темплейт необходимого окна и экземпляр класса `EventEmitter`
  Поля класса
- container: HTMLTemplateElement - окно успешного оформления заказа
- closeButton: HTMLButtonElement - кнопка закрытия окна
- checkForm: HTMLElement - элемент отобажающий стоимость заказа
- events: IEvents - брокер событий
  Методы класса
- set total(total: number) - устанавливает стоимость заказа
### Слой коммуникации
#### Класс AppApi
Расширяет класс Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.
Поля класса
- cdn: string - адрес сервера изображений
  Методы класса
- getProductList() - получает с сервера список товаров
- postOrder(order: IOrder) - отправляет на сервер заказ
## Взаимодействие компонентов
Код, описывающий взаимодействие данных между собой находится в файле `index.ts`.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.
*Список событий, которые могут генерироваться в системе:*\
*События изменения данных*
- `order:changed` - изменение списка товаров в заказе
- `products:changed` - изменение массива товаров
  *События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна
- `card:select` - выбор товара для открытия
- `bids:open` - открытие корзины
- `bids:add` - добавление товара в корзину
- `bids:remove` - удаление товара из корзины
- `order: open` - открытие окна добавления контактов
- `contacts:open` - открытие окна добавления контактов
- `success:open` - открытие окна успешного оформления заказа
- `success:close` - закрытие окна успешного оформления заказа