'use strict';
var config = {
    form: "editForm",
    list: "bookList",
    app: "app"
};

var app = new App(config);

function App(config) {
    var key;
    if (!config) {
        throw new Error("Не задана конфигурация приложения");
    }

    for (key in config) {
        if (!config[key]) throw new Error("Пустое значение поля: " + key);
    }
    this.form = document.querySelector('[data-app-form=' + config.form + ']');
    this.list = document.querySelector('[data-app-list=' + config.list + ']');
    this.container = document.querySelector('[data-app-container=' + config.app + ']');
};

App.prototype.service = function() {

    var self = this;
    var appError = function(msg) {
        throw new Error(msg);
    };
    var createId = function(str) {

        var hash = 0,
            i, char;

        if (str.length == 0) return hash;
        for (i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        //Convert to string
        return hash.toString(36).slice(2);

    }
    var eventEmmitter = function(name, data) {
        var appEvent = new CustomEvent(self.constructor.name + ":" + name, {
            bubbles: true,
            detail: data
        });
        self.container.dispatchEvent(appEvent);
    };
    return {
        createId: createId,
        appError: appError,
        eventEmmitter: eventEmmitter
    }
}.call(app);


App.prototype.Controller = function() {
    var self = this;

    this.form.addEventListener('submit', formHandler, false);
    this.list.addEventListener('click', listHandler, false);

    function listHandler(event) {

        if (!event.target.dataset.appAction) return;
        var action = event.target.dataset.appAction,
            id = event.target.closest('[data-app-item-id]').dataset.appItemId;
        // Создаем свое событие о том что у нас есть запрос на изменение/удаление
        self.service.eventEmmitter(action, {
            nativeEvent: event,
            id: id
        });
        event.preventDefault();
    }

    function formHandler(event) {
        event.preventDefault();
        var appItem = {
            author: event.target.querySelector('[data-app-input=author]').value,
            pubyear: event.target.querySelector('[data-app-input=pubyear]').value,
            name: event.target.querySelector('[data-app-input=name]').value,
            pagenum: event.target.querySelector('[data-app-input=pagenum]').value,
        };
        console.log(self);
        // Создаем свое событие о том что у нас есть новые данные 
        self.service.eventEmmitter("createItem", {
            nativeEvent: event,
            appItem: appItem
        });

    }
}.call(app);


App.prototype.Model = function() {
    var self = this;
    var dataList = {
        "a5ol5": {
            author: "Булгаков М.А.",
            pubyear: 1966,
            name: "Мастер и Маргарита",
            pagenum: 451
        }
    };

    function getAllItems(argument) {
        return dataList;
    }

    function getItem(argument) {
        return dataList[argument];
    }

    function setItem(argument) {
        console.log(argument);
        var id = app.service.createId(argument.name),
            i;

        if (dataList.id) {
            console.log(id, argument);
            return false;
        }

        dataList[id] = argument;
        console.log(dataList);
        return id;
    }
    //Подписываемся на события
    this.container.addEventListener(this.constructor.name + ':createItem', function(event) {
        console.log(event);
        var id = setItem(event.detail.appItem);
        if (id) {
            self.service.eventEmmitter("createItemSuccess", {
                successText: "Элемент успешно создан",
                id: id
            });
        } else {
            self.service.eventEmmitter("createItemError", {
                errorText: "Такой элемент уже существует",
                id: id
            });
        }

    });
    this.container.addEventListener(this.constructor.name + ':readItem', function(event) {
        console.log(event.type);
    });
    this.container.addEventListener(this.constructor.name + ':updateItem', function(event) {
        console.log(event.type);
    });
    this.container.addEventListener(this.constructor.name + ':deleteItem', function(event) {
        console.log(event.type);
    });
    return {
        dataList: dataList
    }
}.call(app);

App.prototype.View = function() {

}.call(app);
