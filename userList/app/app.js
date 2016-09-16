'use strict';
/**
 * App constructor
 */

var App = function () {
    var key,
        instance;

    document.addEventListener("DOMContentLoaded", init);

    /**
     * Init function 
     */
    function init() {
        if (!instance) {
            console.warn("App is not runnig yet");
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
} ();

/**
 * Service function for Application
 * @return {object}
 */
App.prototype.service = function () {
    var self = this;
    /**
     * @param  {String} - String with describe of error 
     */
    var appError = function (msg) {
        throw new Error(msg);
    };
    /**
     * @param  {string} - string that require unique id
     * @return {string} - unique id for input string
     */
    var createId = function (str) {

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


    var messages = {
        createItemSuccess: "Элемент успешно создан",
        createItemFailure: "Элемент c указанными данными уже существует",
        updateItemSuccess: "Элемент успешно обновлен",
        updateItemFailure: "Элемент c указанными данными уже существует",
    };
    return {
        createId: createId,
        appError: appError,
        messages: messages
    };
};


App.prototype.Controller = function () {
    var self = this,
        initiator = "controller";

    this.form.addEventListener('submit', formHandler, false);
    this.list.addEventListener('click', listHandler, false);
    /**
     * @param {object} - browser event object
    */
    function listHandler(event) {
        if (!event.target.dataset.appAction) return;
        var action = event.target.dataset.appAction,
            id = event.target.closest('[data-app-item-id]').dataset.appItemId;

        self.service.eventEmmitter(initiator, action, {
            nativeEvent: event,
            id: id
        });
        event.preventDefault();
    }
    /**
     * @param {object} - browser event object
    */
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


App.prototype.Model = function () {
    var self = this,
        initiator = "model",
        publisher = "controller",
        storage = localStorage,
        dataList;
    
    /**
     * @param {object} - object with data that should be stored in localStorage
    */
    function setToStorage(data) {
        storage.setItem(self.constructor.name, JSON.stringify(data));
    }
    /**
     * @return {object} - Object with data from localStorage
    */
    function getFromStorage() {
        return JSON.parse(storage.getItem(self.constructor.name));
    }
    /**
     * @return {object} - Object with data from localStorage
    */
    function getAllItems() {
        dataList = getFromStorage() || {};
        return dataList;
    }
    /**
     * @param {string} - id of needed item
     * @return {object} - Item object from list of storage objects
    */
    function getItem(id) {
        return dataList[id];
    }
    /**
     * @param {Object} - Object with Item data
     * @return {object|false} - Item object with id OR false if item with same id is exist
    */
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
    /**
     * @param {Object} - Object with Item data
     * @return {object|false} - Item object with new id OR false if item with same id is exist
    */
    function updateItem(dataItem) {
        var previousItemId = dataItem.id;
        var dataItem = createItem(dataItem);
        if (!dataItem) return false;
        deleteItem(previousItemId);
        return dataItem;
    }
    /**
     * @param {string} - Id of item 
     */
    function deleteItem(id) {
        delete dataList[id];
        setToStorage(dataList);
    }

    function create (event) {
        var dataItem, message, status, id, previousItemId;
        if (event.detail.dataItem.id) {
            previousItemId = event.detail.dataItem.id;
            dataItem = updateItem(event.detail.dataItem);
            message = (dataItem.id) ? self.service.messages.updateItemSuccess : self.service.messages.updateItemFailure;
            status = (dataItem.id) ? "success" : "failure";
            //View Update Item
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
            // View Create Item
            self.service.eventEmmitter(initiator, "createItem", {
                message: message,
                dataItem: dataItem,
                status: status
            });
        }
    };

    this.container.addEventListener(this.constructor.name + ':' + publisher + ':readItem', function (event) {
        var id = event.detail.id;
        // View read Item
        self.service.eventEmmitter(initiator, "readItem", {
            dataItem: dataList[id],
            status: "success"
        });
    });

    this.container.addEventListener(this.constructor.name + ':' + publisher + ':editItem', function (event) {
        var id = event.detail.id;
        // View edit Item
        self.service.eventEmmitter(initiator, "editItem", {
            dataItem: dataList[id],
            status: "success"
        });
    });
    this.container.addEventListener(this.constructor.name + ':' + publisher + ':deleteItem', function (event) {
        var id = event.detail.id;
        deleteItem(id);
        // View delete Item
        self.service.eventEmmitter(initiator, "deleteItem", {
            dataId: event.detail.id,
            status: "success"
        });
    });
    return{
        create: create
    }
};

/**
 * 
 */
/**
 * 
 */
App.prototype.View = function () {
    var self = this,
        publisher = "model";
    this.container.addEventListener(this.constructor.name + ':' + publisher + ':createItem', createItemEventHandler);
    this.container.addEventListener(this.constructor.name + ':' + publisher + ':deleteItem', deleteItemEventHandler);
    this.container.addEventListener(this.constructor.name + ':' + publisher + ':editItem', editItemEventHandler);
    this.container.addEventListener(this.constructor.name + ':' + publisher + ':updateItem', updateItemEventHandler);
    this.container.addEventListener(this.constructor.name + ':' + publisher + ':readAllItems', readAllItemsEventHandler);
    /**
     * Set form inputs value from event object
     * @param {Object} - Object with Event data
    */
    /**
     * 
     * 
     * @param {any} event
     */
    function editItemEventHandler(event) {
        var dataItem = event.detail.dataItem,
            inputsArr = self.form.querySelectorAll('input'),
            i;
        for (i = inputsArr.length - 1; i >= 0; i--) {
            inputsArr[i].value = dataItem[inputsArr[i].name];
        }
    }
    /**
     * Update information in HTML of current editing item, set class of message HTML element, set message to message HTML element
     * @param {Object} - Object with Event data
    */
    /**
     * 
     * 
     * @param {any} event
     * @returns
     */
    function updateItemEventHandler(event) {
        var dataItem = event.detail.dataItem;
        var isSuccess = (event.detail.status == "success") ? true : false;
        addMessageToHTML(event.detail.message, isSuccess);
        if (!isSuccess) return;
        updateItem(event.detail, isSuccess);
    }
    /**
     * Update information in HTML element of item by Id
     * @param {Object} - Object with Item data
    */
    /**
     * 
     * 
     * @param {any} data
     */
    function updateItem(data) {
        var itemEl = self.list.querySelector('[data-app-item-id="' + data.previousItemId + '"]');
        itemEl.querySelector('[data-app-item-name]').textContent = data.dataItem.name;
        itemEl.querySelector('[data-app-item-author]').textContent = data.dataItem.author;
        itemEl.dataset.appItemId = data.dataItem.id;
    }
    /**
     * Set all items to list
     * @param {Object} - Object with Event data
    */
    /**
     * 
     * 
     * @param {any} event
     */
    function readAllItemsEventHandler(event) {
        var dataList = event.detail.dataList,
            key;
        for (key in dataList) {
            addItemToHTML(dataList[key]);
        }
    }
    /**
     * Create new item in items list, set text of message HTML element, set class of message HTML element
     * @param {Object} - Object with Event data
    */
    /**
     * 
     * 
     * @param {any} event
     */
    function createItemEventHandler(event) {
        var isSuccess = (event.detail.status == "success") ? true : false;
        addMessageToHTML(event.detail.message, isSuccess);
        if (isSuccess) addItemToHTML(event.detail.dataItem);
    }
    /**
     * Create new message element(if needed), set text of message HTML element, set class of message HTML element
     * @param message {string} - String with text
     * @param isSuccess {bool} - status (success or failure)
    */
    /**
     * 
     * 
     * @param {any} message
     * @param {any} isSuccess
     */
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
    /**
     * Create new item element in HTML
     * @param {object} - Object with data of item
    */
    /**
     * 
     * 
     * @param {any} item
     */
    function addItemToHTML(item) {
        var dataItemHTML = '<div href="javascript:void(0)" class="list-group-item" data-app-item-id="' + item.id + '">' +
            '<h4 class="list-group-item-heading" data-app-item-name>' + item.name + '</h4>' +
            '<p class="list-group-item-text" data-app-item-author>' + item.author + '</p>' +
            '<a href="javascript:void(0)" class="label label-primary" data-app-action="editItem">Изменить</a>' +
            '<a href="javascript:void(0)" class="label label-danger" data-app-action="deleteItem">Удалить</a></div>';
        self.list.insertAdjacentHTML("afterBegin", dataItemHTML);
    }
    /**
     * Delete item element from HTML
     * @param {object} - Object with Event data 
    */
    /**
     * 
     * 
     * @param {any} event
     */
    function deleteItemEventHandler(event) {
        if (event.detail.status == "success")
            $('[data-app-item-id=' + event.detail.dataId + ']').remove();
    }
};
