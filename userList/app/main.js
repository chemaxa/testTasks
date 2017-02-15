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
  constructor() {
    this.tableHandler=this.tableHandler.bind(this);
    this.validate = this.validate.bind(this);
    this.editUser=this.editUser.bind(this);

    this.collection = new Collection(),
    this.validator = new Validator(),
    this.table = new Table('[data-app-list]', this.collection, this.tableHandler),
    this.form = new Form('[data-app-form]'),
    this.notificator = new Notificator(this.form);
  }

  init() {
    this.form.getDataFromHtml.call(this, this.validate);
    this.table.sort('active', 'ASC');
  }

  validate(data) {
    this.validator.validate(data);
    if (this.validator.hasErrors(data)) {
      console.error(this.validator.messages.join('\n'));
      this.validator.messages.forEach((msg) => {
        this.notificator.showCustomNotification(msg, 'danger');
      });
      return false;
    }
    data.isValid = true;
    this.addToCollection(data);
    this.form.reset();
  }

  addToCollection(item) {
    if (!item.isValid) return false;
    let result;
    if (this.collection.isExist(item.login)) {
      result = this.collection.updateItem(item);
      this.notificator.showNotification('update', item, 'success');
      this.table.update(result);
    } else {
      result = this.collection.addItem(item);
      this.notificator.showNotification('add', item, 'success');
      this.table.add(result);
    }
    return result;
  }

  deleteFromCollection(login) {
    if (this.collection.isExist(login)) {
      this.collection.deleteItem(login);
    }
    return false;
  }

  editUser(login){
    let item = this.collection.getItem(login);
    this.form.setDataToHtml(item);
  }

  tableHandler(event) {
    if (event.target.dataset.appSort) {
      let sortField = event.target.dataset.appSort;
      this.table.sort(sortField, this.table.sortOrder);
      this.table.sortOrder = this.table.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    }
    if (event.target.dataset.appDelete) {
      this.deleteFromCollection(event.target.dataset.appDelete);
      this.table.delete(event.target.dataset.appDelete);
    }
    if (event.target.dataset.appEdit) {
      this.editUser(event.target.dataset.appEdit);
    }
  }
}

(function Main() {
  let mediator = new Mediator();
  mediator.init();
})();

// if (module.hot) {
//   module.hot.accept();
// }
//For testing
export default Mediator;