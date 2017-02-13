/*
first_name — тип string, от 3 до 15 символов
last_name — тип string, от 3 до 25 символов
active — тип boolean, по умолчанию true
age — тип number, целые числа в диапазоне от 18 до 55
login — тип string, разрешённые символы — a-z, 0-9, _ и -
password — тип string, минимум 8 символов
role — тип number, один из {1: ‘Administrator’, 2: ‘Technician’, 3:
‘Manager’, 4: ‘Supervisor’}
registered_on — тип number, таймстемп времени создания юзера
*/

export default class Validator {
  constructor(config) {
    let defaultConfig = {
      first_name: {
        type: "isString3to15",
        instruction: "The string should contain from 3 to 15 symbols"
      },
      last_name: {
        type: "isString3to25",
        instruction: "The string should contain from 3 to 25 symbols"
      },
      active: {
        type:"isBool",
        instruction: "The value must be a Boolean type"
      },
      age: {
        type: "isAgeInRange",
        instructions: "The age is not included in the range from 18 to 55"
      },
      login: {
        type:"isAlphaNumFrom3",
        instruction: "The string should contain minimum 3 symbols"
      },
      password: {
        type: "isStringFrom8",
        instruction: "The string should contain minimum 8 symbols"
      },
      role: {
        type:"isRole",
        instruction: "The value should be in range from 1 to 4"
      }
    };
    
    this.messages = [];
    this.config = Object.assign(defaultConfig, config || {});
    this.types = this.types.call(this);
  }

  validate(data) {
    let i, msg, type, checker, success;
    this.messages = [];
    for (i in data) {
      if (data.hasOwnProperty(i) && this.config.hasOwnProperty(i)) {
        type = this.config[i]['type'];
        checker = this.types[type];
        if (!type) {
          continue;
        }

        if (!checker) {
          throw {
            name: "ValidationError",
            message: `No handler to validate type ${type}`
          };
        }

        success = checker.validate(data[i]);
        
        if (!success) {
          msg = `Invalid value for * ${i} *, ${this.config[i]['instruction']}`;
          
          this.messages.push(msg);
        }
      }
    }
  }

  hasErrors() {
    return this.messages.length !== 0;
  }

  types() {
    let isBool = {
      validate: (value) => typeof value === 'boolean'
    };
    let isExist={
      validate: (value) => {
        return !!value;
      },
      instructions: "The value should not be null"
    };
    let isAgeInRange = {
      validate: (age) => {
        return (17 < age && age < 56);
      }
    };
    let isString3to15 = {
      validate: (value) => {
        return (typeof value == "string") && (3 < value.length && value.length < 15);
      }
    };
    let isString3to25 = {
      validate: (value) => {
        return (typeof value == "string") && (3 < value.length && value.length < 25);
      },
      
    };
    let isAlphaNumFrom3 = {
      validate: (value) => {
        return /^[a-z0-9_-]{3,}$/g.test(value);
      }
    };
    let isStringFrom8 = {
      validate: (value) => {
        return (typeof value == 'string') && (value.length > 7);
      }
    };
    let isRole = {
      validate: (value) => {
        return (0 < value) && (value < 5);
      }
    };
    let isDate = {
      validate: (value) => {
        let toString = Object.prototype.toString;
        return toString.call(value) == '[object Date]';
      }
    };
    return {
      isString3to15,
      isString3to25,
      isBool,
      isAgeInRange,
      isAlphaNumFrom3,
      isStringFrom8,
      isRole,
      isDate,
      isExist
    };
  }

}