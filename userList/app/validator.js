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
      first_name: "isString3to15",
      last_name: "isString3to25",
      active: "isBool",
      age: "isAgeInRange",
      login: "isAlphaNumFrom3",
      password: "isStringFrom8",
      role: "isRole",
      registered_on: "isDate"
    };
    this.messages = [];
    this.config = Object.assign(defaultConfig, config || {});
    this.types = this.types.call(this);
  }

  validate(data) {
    let i, msg, type, checker, success;
    this.messages = [];
    for (i in data) {
      if (data.hasOwnProperty(i)) {
        type = this.config[i];
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
          msg = `Invalid value for * ${i} *, ${checker.instructions}`;
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
      validate: (value) => typeof value === 'boolean',
      instructions: "The value must be a Boolean type!"
    };
    let isAgeInRange = {
      validate: (age) => {
        return (18 < age && age < 56);
      },
      instructions: "The age is not included in the range from 18 to 55"
    };
    let isString3to15 = {
      validate: (value) => {
        return (typeof value == "string") && (3 < value.length && value.length < 15);
      },
      instructions: "The string should contain from 3 to 15 symbols"
    };
    let isString3to25 = {
      validate: (value) => {
        return (typeof value == "string") && (3 < value.length && value.length < 25);
      },
      instructions: "The string should contain from 3 to 15 symbols"
    };
    let isAlphaNumFrom3 = {
      validate: (value) => {
        return /^[a-z0-9_-]{3,}$/g.test(value);
      },
      instructions: "The string should contain from 3 to 15 symbols"
    };
    let isStringFrom8 = {
      validate: (value) => {
        return (typeof value == 'string') && (value.length > 7);
      },
      instructions: "The string should contain minimum 8 sumbols"
    };
    let isRole = {
      validate: (value) => {
        return (0 < value) && (value < 5);
      },
      instructions: "The value should be in range from 1 to 4"
    };
    let isDate = {
      validate: (value) => {
        let toString = Object.prototype.toString;
        return toString.call(value) == '[object Date]';
      },
      instructions: "The value should be a date"
    };
    return {
      isString3to15,
      isString3to25,
      isBool,
      isAgeInRange,
      isAlphaNumFrom3,
      isStringFrom8,
      isRole,
      isDate
    };
  }

}