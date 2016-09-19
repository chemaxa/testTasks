import Validator from '../app/validator';
import {assert} from 'chai';
let validator = new Validator(); 

let mockUser = {
  first_name: "FirstName",
  last_name: "LastName",  
  active: true,
  age: 55,
  login: "login",
  password: "password",
  role: 1,
  registered_on: new Date() 
};
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
describe('Validator ', () => {
  it('has no errors',  () =>{
    validator.validate(mockUser);
    if(validator.hasErrors()){
      console.error(validator.messages.join("\n"));
    }
    assert.isFalse(validator.hasErrors(), 'validation should has not errors');
    
  });
});
