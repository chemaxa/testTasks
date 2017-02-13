import Collection from './collection';
import Form from './form';
import Table from './table';
import Notificator from './notificator';
import Validator from './validator';

// let mockUser = {
//   first_name: "FirstName", //-
//   last_name: "LastName",  // -
//   active: true, //-
//   age: 55, //-
//   login: "login", //-
//   password: "password", //-
//   role: 1, //+
//   registered_on: new Date() //-
// };

class Mediator {
  constructor(collection, table, form, validator,notificator) {
    this.collection = collection;
    this.validator = validator;
    this.table = table;
    this.form = form;
    this.notificator = notificator;
    this.validate = this.validate.bind(this);
    this.validateUserModel = this.validateUserModel.bind(this);
  }

  init() {
    this.form.getDataFromHtml.call(this, this.validate);
  }

  validate(data) {
    if (!this.validateUserModel(data)) return false;
    this.addToCollection(data);
  }

  validateUserModel(data) {
    this.validator.validate(data);
    if (this.validator.hasErrors(data)) {
      console.error(this.validator.messages.join('\n'));
      for (let i = 0; i < this.validator.messages.length; i++) {
        this.notificator.showNotifications(this.validator.messages[i], item, 'danger');
      }
      return false;
    }
    return data;
  }

  addToCollection(item) {
    if (!this.validateUserModel(item)) return false;
    console.log('Item is validated: ', item);
    let result;
    if (this.collection.isExist(item.login)) {
      result = this.collection.updateItem(item);
      this.notificator.showNotifications('update', item, 'success');
    } else {
      result = this.collection.addItem(item);
      this.notificator.showNotifications('add', item, 'success');
    }
    this.table.add(item);
    return result;
  }

  deleteFromCollection(item) {
    //TODO: create realisation ...
    if (this.collection.isExist(item.login)) {
      console.log('Deleted: ',item);
    }
    return false;
  }
}

!(function Main(global) {
  let collection = new Collection(),
    validator = new Validator(),
    table = new Table('[data-app-list]',collection),
    form = new Form('[data-app-form]'),
    notificator = new Notificator(form);
  let mediator = new Mediator(collection, table, form, validator,notificator);
  mediator.init();
})(window);



if (module.hot) {
  module.hot.accept();
}
//For testing
export default Mediator;