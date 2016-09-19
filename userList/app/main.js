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
class Mediator{
  constructor(){
    this.user = new User();
    this.collection = new Collection();
    this.validator = new Validator();
    this.table = new Table();
    this.form = new Form(); 
  }
  
  main(){

  }
}

if (module.hot) {
  module.hot.accept();
}