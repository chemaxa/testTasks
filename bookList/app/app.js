'use strict';
/**
 * 
 * @param {Object}  Config - application config
 * App constructor
 */
var App = function() {
    var key,
        instance;

    document.addEventListener("DOMContentLoaded", init);

    function init() {
        if (instance) {
            instance.service.eventEmmitter("App", "Init", {});
        } else {
            console.log("App is not runnig yet");
        }
    }

    function App() {
        if (instance) {
            return instance;
        }

        // Singleton of App
        instance = this;

        var container = this.container = document.querySelector('[data-app-container]');
        if (!container) throw new Error("Нет контейнера приложения");
        this.form = container.querySelector('[data-app-form]');
        if (!this.form) throw new Error("Нет формы добавления элементов");
        this.list = container.querySelector('[data-app-list]');
        if (!this.list) throw new Error("Нет списка элементов");

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

            if (str.length === 0) return hash;
            for (i = 0; i < str.length; i++) {
                char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            //Convert to string
            return hash.toString(36).slice(2);
        };
        /**
         * @param  {string} - Name of application event (create, read, update ...)
         * @param  {any} - Data that will be added to event 
         */
    var eventEmmitter = function(initiator, name, data) {
        var appEvent = new CustomEvent(self.constructor.name + ":" + initiator + ":" + name, {
            bubbles: true,
            detail: data
        });
        self.container.dispatchEvent(appEvent);
    };
    var messages = {
        createItemSuccess: "Элемент успешно создан",
        createItemFailure: "Элемент c указанными данными уже существует",
        updateItemSuccess: "Элемент успешно обновлен",
        updateItemFailure: "Элемент c указанными данными уже существует",
    };
    return {
        createId: createId,
        appError: appError,
        eventEmmitter: eventEmmitter,
        messages: messages
    };
};


App.prototype.Controller = function() {
    var self = this,
        initiator = "controller";

    this.form.addEventListener('submit', formHandler, false);
    this.list.addEventListener('click', listHandler, false);

    function listHandler(event) {

        if (!event.target.dataset.appAction) return;
        var action = event.target.dataset.appAction,
            id = event.target.closest('[data-app-item-id]').dataset.appItemId;
        // Создаем свое событие о том что у нас есть запрос на изменение/удаление
        self.service.eventEmmitter(initiator, action, {
            nativeEvent: event,
            id: id
        });
        event.preventDefault();
    }

    function formHandler(event) {
        event.preventDefault();
        var dataItem = {},
            i,
            inputsArr = self.form.querySelectorAll('input');
        for (i = inputsArr.length - 1; i >= 0; i--) {
            dataItem[inputsArr[i].name] = inputsArr[i].value;
            inputsArr[i].value = '';
        }
        self.service.eventEmmitter(initiator, "createItem", {
            nativeEvent: event,
            dataItem: dataItem
        });
    }
};


App.prototype.Model = function() {
    var self = this,
        initiator = "model",
        publisher = "controller",
        storage=localStorage,
        dataList;
    /*var dataList = {
        "26xj": {
            author: "Булгаков М.А.",
            pubyear: "1966",
            name: "Мастер и Маргарита",
            pagenum: "451",
            id: "26xj"
        }
    };*/

    function setToStorage(data) {
        storage.setItem(self.constructor.name, JSON.stringify(data));
    }

    function getFromStorage() {
        return JSON.parse(storage.getItem(self.constructor.name));
    }

    function getAllItems() {
        dataList = getFromStorage()||{};
        return dataList;
    }

    function getItem(id) {
        return dataList[id];
    }

    function createItem(dataItem) {
        var id = self.service.createId(dataItem.name + dataItem.pubyear + dataItem.author + dataItem.pagenum),
            i;

        if (!!dataList[id]) {
            return false;
        }
        dataItem.id = id;
        dataList[id] = dataItem;
        setToStorage(dataList);
        return dataItem;
    }

    function updateItem(dataItem) {
        var previousItemId = dataItem.id;
        var dataItem = createItem(dataItem);
        if (!dataItem) return false;
        deleteItem(previousItemId);
        return dataItem;
    }

    function deleteItem(id) {
        delete dataList[id];
        setToStorage(dataList);
    }

    this.container.addEventListener(this.constructor.name + ':App:Init', function(event) {
        var status = "success";

        self.service.eventEmmitter(initiator, "readAllItems", {
            dataList: getAllItems(),
            status: status
        });
    });

    this.container.addEventListener(this.constructor.name + ':' + publisher + ':createItem', function(event) {
        var dataItem, message, status, id, previousItemId;
        if (event.detail.dataItem.id) {
            previousItemId = event.detail.dataItem.id;
            dataItem = updateItem(event.detail.dataItem);
            message = (dataItem.id) ? self.service.messages.updateItemSuccess : self.service.messages.updateItemFailure;
            status = (dataItem.id) ? "success" : "failure";
            console.log(dataList);
            self.service.eventEmmitter(initiator, "updateItem", {
                dataItem: dataItem,
                message: message,
                status: status,
                previousItemId: previousItemId
            });

        } else {
            dataItem = createItem(event.detail.dataItem);
            id = dataItem.id;
            status = (id) ? "success" : "failure";
            message = (id) ? self.service.messages.createItemSuccess : self.service.messages.createItemFailure;

            self.service.eventEmmitter(initiator, "createItem", {
                message: message,
                dataItem: dataItem,
                status: status
            });
        }
    });

    this.container.addEventListener(this.constructor.name + ':' + publisher + ':readItem', function(event) {
        var id = event.detail.id;
        self.service.eventEmmitter(initiator, "readItem", {
            dataItem: dataList[id],
            status: "success"
        });
    });

    this.container.addEventListener(this.constructor.name + ':' + publisher + ':editItem', function(event) {
        var id = event.detail.id;
        self.service.eventEmmitter(initiator, "editItem", {
            dataItem: dataList[id],
            status: "success"
        });
    });
    this.container.addEventListener(this.constructor.name + ':' + publisher + ':deleteItem', function(event) {
        var id = event.detail.id;
        deleteItem(id);
        self.service.eventEmmitter(initiator, "deleteItem", {
            dataId: event.detail.id,
            status: "success"
        });
    });
    return {
        dataList: dataList
    };
};

App.prototype.View = function() {
    var self = this,
        publisher = "model";
    this.container.addEventListener(this.constructor.name + ':' + publisher + ':createItem', createItemEventHandler);
    this.container.addEventListener(this.constructor.name + ':' + publisher + ':deleteItem', deleteItemEventHandler);
    this.container.addEventListener(this.constructor.name + ':' + publisher + ':editItem', editItemEventHandler);
    this.container.addEventListener(this.constructor.name + ':' + publisher + ':updateItem', updateItemEventHandler);
    this.container.addEventListener(this.constructor.name + ':' + publisher + ':readAllItems', readAllItemsEventHandler);

    function editItemEventHandler(event) {
        var dataItem = event.detail.dataItem,
            inputsArr = self.form.querySelectorAll('input'),
            i;
        for (i = inputsArr.length - 1; i >= 0; i--) {
            inputsArr[i].value = dataItem[inputsArr[i].name];
        }
    }

    function updateItemEventHandler(event) {
        var dataItem = event.detail.dataItem;
        var isSuccess = (event.detail.status == "success") ? true : false;
        addMessageToHTML(event.detail.message, isSuccess);
        console.log(event.detail);
        if (!isSuccess) return;
        updateItem(event.detail, isSuccess);
    }

    function updateItem(data) {
        var itemEl = self.list.querySelector('[data-app-item-id="' + data.previousItemId + '"]');
        itemEl.querySelector('[data-app-item-name]').textContent = data.dataItem.name;
        itemEl.querySelector('[data-app-item-author]').textContent = data.dataItem.author;
        itemEl.dataset.appItemId = data.dataItem.id;
    }

    function readAllItemsEventHandler(event) {
        var dataList = event.detail.dataList,
            key;
        for (key in dataList) {
            addItemToHTML(dataList[key]);
        }
    }

    function createItemEventHandler(event) {
        var isSuccess = (event.detail.status == "success") ? true : false;
        addMessageToHTML(event.detail.message, isSuccess);
        if (isSuccess) addItemToHTML(event.detail.dataItem);
    }

    function addMessageToHTML(message, isSuccess) {
        var messageEl = self.container.querySelector("[data-app-message]"),
            messageClassName = isSuccess ? "alert-success" : "alert-danger";
        if (!messageEl) {
            messageEl = '<div class="alert ' + messageClassName + '"  role="alert" data-app-message="message">' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span></button>' +
                '<div class="alert__message" data-app-message-text="message-text">' + message + '</div></div>';
            self.form.insertAdjacentHTML("afterBegin", messageEl);
        } else {
            messageEl.querySelector("[data-app-message-text]").textContent = message;
        }
        if (isSuccess) {
            $(messageEl).closest(".alert").removeClass("alert-danger");
            $(messageEl).closest(".alert").addClass("alert-success");
        } else {
            $(messageEl).closest(".alert").removeClass("alert-success");
            $(messageEl).closest(".alert").addClass("alert-danger");
        }
    }

    function addItemToHTML(item) {
        var dataItemHTML = '<div href="javascript:void(0)" class="list-group-item" data-app-item-id="' + item.id + '">' +
            '<h4 class="list-group-item-heading" data-app-item-name>' + item.name + '</h4>' +
            '<p class="list-group-item-text" data-app-item-author>' + item.author + '</p>' +
            '<a href="javascript:void(0)" class="label label-primary" data-app-action="editItem">Изменить</a>' +
            '<a href="javascript:void(0)" class="label label-danger" data-app-action="deleteItem">Удалить</a></div>';
        self.list.insertAdjacentHTML("afterBegin", dataItemHTML);
    }

    function deleteItemEventHandler(event) {
        if (event.detail.status == "success")
            $('[data-app-item-id=' + event.detail.dataId + ']').remove();
    }
};
