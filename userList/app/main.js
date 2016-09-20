import Collection from './collection';
import Form from './form';
import Table from './table';
import User from './user';
import Validator from './validator';
let mockUser = {
  first_name: "FirstName", //-
  last_name: "LastName",  // -
  active: true, //-
  age: 55, //-
  login: "login", //-
  password: "password", //-
  role: 1, //+
  registered_on: new Date() //-
};

class Mediator {
  constructor(user, collection, table, form, validator) {
    this.user = user;
    this.collection = collection;
    this.validator = validator;
    this.table = table;
    this.form = form;
    this.validate=this.validate.bind(this);
    this.showNotifications=this.showNotifications.bind(this);
  }

  main() {
    let {formEl, getDataFromHtml} = this.form;
    getDataFromHtml.call(this,this.validate);
  }

  validate(data){
    this.validator.validate(data);
    if(this.validator.hasErrors(data)){
      console.error(this.validator.messages.join('\n'));
      this.validator.messages.forEach(this.showNotifications);
    }
  }

  showNotifications(notification){
    console.log(this);
    let messageEl=`
      <div class="alert alert-danger alert-dismissible" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <strong>Error!</strong> ${notification}
      </div>`;
    let {formEl}=this.form;
    formEl.insertAdjacentHTML("afterBegin", messageEl);
  }
}

!(function Main(global) {
  function init() {
    let user = new User(),
      collection = new Collection(),
      validator = new Validator(),
      table = new Table(),
      form = new Form('[data-app-form]');
    let mediator = new Mediator(user, collection, table, form, validator);
    mediator.main();
  }
  init();
})(window);



if (module.hot) {
  module.hot.accept();
}
//For testing
export default Mediator;