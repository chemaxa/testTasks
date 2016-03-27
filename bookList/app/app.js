'use strict';

/**
 * @param {Object}  Config - application config
 * App constructor
 */
var App = function() {
    var key,
        instance;

    function App(config) {
        if (instance) {
            return instance;
        }


        if (!config) {
            throw new Error("Не задана конфигурация приложения");
        }

        var propertyNames = ['form', 'list', 'app'],
            i = 0;

        propertyNames.forEach(function(item, i) {
            if (!config[item]) throw new Error("Не задано свойство: " + item);
        });

        // Singleton of App
        instance = this;

        this.form = document.querySelector('[data-app-form=' + config.form + ']');
        this.list = document.querySelector('[data-app-list=' + config.list + ']');
        this.container = document.querySelector('[data-app-container=' + config.app + ']');
        this.inputs = {};
        for (key in config.inputs) {
            this.inputs[key] = this.form.querySelector('[data-app-input=' + key + ']');
        }

        /**
         * Set "this" in Controller, Model,  View  to our app instance
         */
        this.service = this.service.call(this);
        this.Controller = this.Controller.call(this);
        this.Model = this.Model.call(this);
        this.View = this.View.call(this);
    }
    return App;
}();
/**
 * Service function for Application
 * @return {object}
 */
App.prototype.service = function() {
    var self = this;
    /**
     * @param  {String} - String with describe of error 
     */
    var appError = function(msg) {
        throw new Error(msg);
    };
    /**
     * @param  {string} - string that require unique id
     * @return {string} - unique id for input string
     */
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
        /**
         * @param  {string} - Name of application event (create, read, update ...)
         * @param  {any} - Data that will be added to event 
         */
    var eventEmmitter = function(name, data) {
        var appEvent = new CustomEvent(self.constructor.name + ":" + name, {
            bubbles: true,
            detail: data
        });
        self.container.dispatchEvent(appEvent);
    };

    var formValidator = function(form) {
        var key;
        var inputs = form.querySelectorAll('input');
        console.dir(inputs);
        for (var i = inputs.length - 1; i >= 0; i--) {
            if (!inputs[i].value) {
                self.service.eventEmmitter("formValidateError", {
                    message: "Не заполнено поле " + inputs[i].placeholder // Да брать данные из HTML не комильфо, но писать для тестового задания список сообщений просто лень
                });
            }
        }
    }

    return {
        createId: createId,
        appError: appError,
        eventEmmitter: eventEmmitter,
        formValidate: formValidator
    }
};


App.prototype.Controller = function() {
    var self = this;

    this.form.addEventListener('submit', formHandler, false);
    this.list.addEventListener('click', listHandler, false);

    function listHandler(event) {

        if (!event.target.dataset.appAction) return;
        var action = event.target.dataset.appAction,
            id = event.target.closest('[data-app-item-id]').dataset.appItemId;
        // Создаем свое событие о том что у нас есть запрос на изменение/удаление
        console.log(self);
        self.service.eventEmmitter(action, {
            nativeEvent: event,
            id: id
        });
        event.preventDefault();
    }

    function formHandler(event) {
        event.preventDefault();
        console.log(self)
        return false;
        var appItem = {
            propName: event.target.querySelector('[data-app-input=' + self.input + ']').value,
            pubyear: event.target.querySelector('[data-app-input=pubyear]').value,
            name: event.target.querySelector('[data-app-input=name]').value,
            pagenum: event.target.querySelector('[data-app-input=pagenum]').value,
        };
        // Создаем свое событие о том что у нас есть новые данные 
        self.service.eventEmmitter("createItem", {
            nativeEvent: event,
            appItem: appItem
        });

    }
};


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

        var id = app.service.createId(argument.name + argument.pubyear),
            i;
        console.log(dataList);
        if (!!dataList[id]) {
            return false;
        }

        dataList[id] = argument;
        console.log(dataList);
        return id;
    }
    //Подписываемся на события
    this.container.addEventListener(this.constructor.name + ':createItem', function(event) {
        var id = setItem(event.detail.appItem);
        console.log(id);
        if (id) {
            self.service.eventEmmitter("createItemSuccess", {
                message: "Элемент успешно создан",
                id: id
            });
        } else {
            self.service.eventEmmitter("createItemError", {
                message: "Такой элемент уже существует",
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
};

App.prototype.View = function() {
    this.container.addEventListener(this.constructor.name + ':createItemSuccess', function(event) {
        console.log(event.type);
    });
    this.container.addEventListener(this.constructor.name + ':createItemError', function(event) {
        console.log(event.type, event.detail.message);
    });
};
