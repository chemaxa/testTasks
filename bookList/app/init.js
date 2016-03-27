/**
 * Application config
 * @type {String} form  - name of form element, same as data-app attribute in HTML
 * @type {String} list  - name of list element, same as data-app attribute in HTML
 * @type {String} app  - name of app element, same as data-app attribute in HTML
 * @type {Object} - configuration of App
 */
var config = {
    form: "editForm",
    list: "bookList",
    app: "app",
    inputs: {
        author: "author",
        pubyear: "pubyear",
        name: "name",
        pagenum: "pagenum"
    }
};

/**
 * Application instance
 * @type {App}
 */
var app = new App(config);
