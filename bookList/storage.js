var config = {
    form: "editForm",
    list: "bookList",
    app: "app"
};

var app = new App(config);

function App(config) {

    if (config) {
        for (var key in config) {
            if (!key) throw new Error("Не задано поле: " + key);
            if (!config[key]) throw new Error("Пустое значение поля: " + key);
        }
        this.form = document.querySelector('[data-app-form=' + config.form + ']');
        this.list = document.querySelector('[data-app-list=' + config.list + ']');
        this.container = document.querySelector('[data-app-container=' + config.app + ']');
    } else {
        this.service("Не задана конфигурация приложения");
    }
};



App.prototype.service = {
    appError: function(msg) {
        throw new Error(msg);
    },
    hash: function(str) {
        if (!str) return false;
        var hash = 5381;
        for (i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
        }
        return hash;
    },
    eventEmmitter: function(name, data) {
        var appEvent = new CustomEvent("App:" + name, {
            bubbles: true,
            detail: data
        });
        this.container.dispatchEvent(appEvent);
    }
};

App.prototype.Controller = function(app, global) {
    app.form.addEventListener('submit', formHandler, false);
    app.list.addEventListener('click', listHandler, false);

    function listHandler(event) {

        if (!event.target.dataset.appAction) return;
        var action = event.target.dataset.appAction,
            id = event.target.closest('[data-app-item-id]').dataset.appItemId;
        // Создаем свое событие о том что у нас есть запрос на изменение/удаление
        app.service.eventEmmitter.call(app, action, {
            nativeEvent: event,
            id: id
        });
        event.preventDefault();
    }

    function formHandler(event) {
        var appItem = {
            author: event.target.querySelector('[data-app-input=author]').value,
            pubyear: event.target.querySelector('[data-app-input=pubyear]').value,
            name: event.target.querySelector('[data-app-input=name]').value,
            pagenum: event.target.querySelector('[data-app-input=pagenum]').value,
        };
        // Создаем свое событие о том что у нас есть новые данные 
        app.service.eventEmmitter.call(app, "create", {
            nativeEvent: event,
            appItem: appItem
        });
        event.preventDefault();
    }
};



App.prototype.Model = function(app, global) {
    var dataList = [{
        id: 1,
        author: "Булгаков М.А.",
        pubyear: 1966,
        name: "Мастер и Маргарита",
        pagenum: 451
    }];

    function getAllItems(argument) {
        return dataList;
    }

    function getItem(argument) {
        return dataList[argument];
    }

    function setItem(argument) {
        var hash = app.service.hash(argument.name);

        for (var i = dataList.length - 1; i >= 0; i--) {
            if (dataList[i].id == hash) {
                // Кинуть сообщение что такой элемент уже есть 
            }
        }
        dataList.push(argument);
    }
    //Подписываемся на событие CREATE
    app.container.addEventListener('App:create', function(event) {
        console.log(event);
    });

    return {
        getItem: getItem,
        setItem: setItem,
        getAllItems: getAllItems
    }
};

App.prototype.View = function() {};
