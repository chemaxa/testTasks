import Validator from '../app/validator';
import {assert} from 'chai';
let validator = new Validator();

/*
first_name — тип string, от 3 до 15 символов
last_name — тип string, от 3 до 25 символов
active — тип boolean, по умолчанию true
age — тип number, целые числа в диапазоне от 18 до 55
login — тип string, разрешённые символы — a-z, 0-9, _ и - и больше 3
password — тип string, минимум 8 символов
role — тип number, один из {1: ‘Administrator’, 2: ‘Technician’, 3:
‘Manager’, 4: ‘Supervisor’}
registered_on — тип number, таймстемп времени создания юзера
*/
let mockValidUser = {
  first_name: "FirstName",
  last_name: "LastName",
  active: true,
  age: 55,
  login: "login",
  password: "password",
  role: 1,
  registered_on: new Date()
};
let mockInvalidUser = {
  first_name: 23,
  last_name: 1,
  active: "true",
  age: function () { },
  login: "Rrue",
  password: 123,
  role: "123",
  registered_on: 0
};

describe('Validator', () => {
  it('validate Valid User, has not errors', () => {
    validator.validate(mockValidUser);
    if (validator.hasErrors()) {
      console.error(validator.messages.join("\n"));
    }
    assert.isFalse(validator.hasErrors(), 'validation should has not errors');

  });

  let patterns = [
    { name:"first_name",
      message: "The string should contain from 3 to 15 symbols"},
    { name:"last_name",
      message: "The string should contain from 3 to 25 symbols"},
    { name: "active",
      message: "The value must be a Boolean type"},
    { name: "age",
      message: "The age is not included in the range from 18 to 55"},
    { name: "login",
      message:"The string should contain minimum 3 symbols"},
    { name:"password",
      message:"The string should contain minimum 8 symbols"},
    { name:"role",
      message: "The value should be in range from 1 to 4"},
    { name:"registered_on",
      message:"The value should be a date"},
  ];


  validator.validate(mockInvalidUser);
  
  let msg = validator.messages.slice();
  patterns.forEach(checker);
  
  function checker(pattern){
    it(`validate ${pattern.name}, has error `, () =>{
        
        let check= (item)=>{
          return !!~item.indexOf(pattern.message);
        };
        
        assert.isTrue(msg.some(check),`validation should has instruction @${pattern.message}@ '\n' However exist '\n' ${msg.join('\n')}`);
         
    });
  }

});
