import Collection from './collection';
import Form from './form';
import Table from './table';
import Notificator from './notificator';
import Validator from './validator';

class Mediator {
  /**
   * Creates an instance of Mediator.
   * Main class in app
   * 
   * @memberOf Mediator
   */
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

  /**
   * Init 
   * 
   * 
   * @memberOf Mediator
   */
  init() {
    this.form.getDataFromHtml.call(this, this.validate);
    this.table.sort('active', 'ASC');
  }

  /**
   * 
   * 
   * @param {Object} Object with User data
   * @returns {boolean} false if user input data not valid
   * 
   * @memberOf Mediator
   */
  validate(user) {
    this.validator.validate(user);
    if (this.validator.hasErrors(user)) {
      console.error(this.validator.messages.join('\n'));
      this.validator.messages.forEach((msg) => {
        this.notificator.showCustomNotification(msg, 'danger');
      });
      return false;
    }
    user.isValid = true;
    this.addToCollection(user);
    this.form.reset();
  }

  /**
   * Manipulate with Collection for add new user
   * 
   * @param {Object} user
   * @returns {Object} user
   * 
   * @memberOf Mediator
   */
  addToCollection(user) {
    if (!user.isValid) return false;
    let result;
    if (this.collection.isExist(user.login)) {
      result = this.collection.updateItem(user);
      this.notificator.showNotification('update', user, 'success');
      this.table.update(result);
    } else {
      result = this.collection.addItem(user);
      this.notificator.showNotification('add', user, 'success');
      this.table.add(result);
    }
    return result;
  }

  /**
   * Delet user from Collection
   * 
   * @param {string} login
   * @returns {boolean} false if user not exist
   * 
   * @memberOf Mediator
   */
  deleteFromCollection(login) {
    if (this.collection.isExist(login)) {
      this.collection.deleteItem(login);
    }
    return false;
  }

  /**
   * Fill form element with user data
   * 
   * @param {string} login
   * 
   * @memberOf Mediator
   */
  editUser(login){
    let item = this.collection.getItem(login);
    this.form.setDataToHtml(item);
  }

  /**
   * Callback for table events
   * 
   * @param {Object} event
   * 
   * @memberOf Mediator
   */
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

;(function Main() {
  let mediator = new Mediator();
  mediator.init();
})();

// if (module.hot) {
//   module.hot.accept();
// }
//For testing
export default Mediator;