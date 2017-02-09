import Validator from '../app/validator';
import { assert } from 'chai';
let defaultValidatorConfig = {
  first_name: {
    type: "isString3to15",
    instruction: "The string should contain from 3 to 15 symbols"
  },
  last_name: {
    type: "isString3to25",
    instruction: "The string should contain from 3 to 25 symbols"
  },
  active: {
    type: "isBool",
    instruction: "The value must be a Boolean type"
  },
  age: {
    type: "isAgeInRange",
    instructions: "The age is not included in the range from 18 to 55"
  },
  login: {
    type: "isAlphaNumFrom3",
    instruction: "The string should contain minimum 3 symbols"
  },
  password: {
    type: "isStringFrom8",
    instruction: "The string should contain minimum 8 symbols"
  },
  role: {
    type: "isRole",
    instruction: "The value should be in range from 1 to 4"
  },
  registered_on: {
    type: "isDate",
    instruction: "The value should be a date"
  }
};
let validator = new Validator(defaultValidatorConfig);

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
  it('validate Valid User, should not has errors', () => {
    validator.validate(mockValidUser);
    if (validator.hasErrors()) {
      console.error(validator.messages.join("\n"));
    }
    assert.isFalse(validator.hasErrors(), 'validation should not has errors');
  });

  it('validate InValid User, should has errors', () => {
    validator.validate(mockInvalidUser);

    let msg = validator.messages.slice();

    for (let i in defaultValidatorConfig) {
      if(defaultValidatorConfig.hasOwnProperty(i)){
        it(`validate ${i}, has error `, () => {
          let check = (item) => {
            return !!~item.indexOf(i['instruction']);
          };
          assert.isTrue(msg.some(check), `validation should has instruction @${i['instruction']}@ '\n' However exist '\n' ${msg.join('\n')}`);
        });
      }
    }
  });
});
