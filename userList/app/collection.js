import config from './config';

let {
  appName,
  storage
} = config;

export default class Collection {
  /**
   * Creates an instance of Collection.
   * 
   * 
   * @memberOf Collection
   */
  constructor() {
    this._elems = this._getFromStorage();
    let
      obj = this,
      prop = '_elems',
      oldValue = this._getFromStorage(),
      newValue = oldValue,
      getter = function () {
        return newValue;
      },
      setter = function (value) {
        oldValue = newValue;
        newValue = value;
        this._setToStorage(value);
      };
    Object.defineProperty(obj, prop, {
      get: getter,
      set: setter,
      configurable: true
    });
  }

  /**
   * 
   * 
   * @returns {Object} List of Users
   * 
   * @memberOf Collection
   */
  _getFromStorage() {
    return JSON.parse(storage.getItem(appName)) || {};
  }

  /**
   * Save user in Localstorage
   * 
   * @param {Object} User 
   * 
   * @memberOf Collection
   */
  _setToStorage(user) {
    storage.setItem(appName, JSON.stringify(user));
  }

  /**
   * Check for user exist in List
   * 
   * @param {any} login
   * @returns
   * 
   * @memberOf Collection
   */
  isExist(login) {
    return !!this['_elems'][login];
  }

  /**
   * Add User to List
   * 
   * @param {Object} User
   * @returns
   * 
   * @memberOf Collection
   */
  addItem(item) {
    let login = item['login'];
    item.registered_on=Date.now();
    item.age = Number(item.age);
    item.role = Number(item.role);
    this['_elems'] = Object.assign(this['_elems'], {
      [login]: Object.assign({},item)
    });
    return item;
  }

  /**
   * Read user from List
   * 
   * @param {string} User login
   * @returns {Object} User
   * 
   * @memberOf Collection
   */
  getItem(login) {
    return this._elems[login] ? this._elems[login] : 'Item not found!';
  }

  /**
   * Update existing user with new data
   * 
   * @param {Object} newItem - User
   * @returns
   * 
   * @memberOf Collection
   */
  updateItem(newItem) {
    let oldItem = this['_elems'][newItem['login']];
    newItem.age = Number(newItem.age);
    newItem.role = Number(newItem.role);
    newItem.registered_on=oldItem.registered_on;
    for (let key in oldItem) {
      if (oldItem.hasOwnProperty(key))
        oldItem[key] = newItem[key];
    }
    this['_elems'] = Object.assign(this['_elems'], this['_elems']);
    return this['_elems'][newItem['login']];
  }

  /**
   * Delete user from List
   * 
   * @param {any} param - string with user login or  user object
   * @returns
   * 
   * @memberOf Collection
   */
  deleteItem(param) {
    let login = (typeof param === "string") ? param : param['login'];
    let result = delete this['_elems'][login];
    this['_elems'] = Object.assign(this['_elems'], this['_elems']);
    return result;
  }

  /**
   * Same as Array.forEach
   * 
   * @param {Function} func - callback Function
   * @param {Object} Context for callback Function
   * 
   * @memberOf Collection
   */
  forEach(func, thisArg=this['_elems']) {
    for (let key in thisArg) {
      if (thisArg.hasOwnProperty(key))
        func.call(thisArg,  thisArg[key], key, thisArg);
    }
  }

  /**
   * Sane as Array.map
   * 
   * @param {function} func -  function
   * @param {Object} thisArg - Context for provided function
   * @returns {Object} result of calling of provided function
   * 
   * @memberOf Collection
   */
  map(func, thisArg=this['_elems']) {
    let result = {};
    for (let key in thisArg) {
      if (thisArg.hasOwnProperty(key))
        result[key] = func.call(thisArg, thisArg[key], key, thisArg);
    }
    return result;
  }

  /**
   * Sane as Array.sort
   * 
   * @param {Function} func - comparator function
   * @returns {Object} sorted list of Users 
   * 
   * @memberOf Collection
   */
  sort(func) {
    let result = {};
    let tmpArr = [];
    func = func || defaultSort;
    function defaultSort(item1, item2) {
      let param1 = item1['login'].toLowerCase();
      let param2 = item2['login'].toLowerCase();
      return param1 < param2 ? -1 : (param1 > param2 ? 1 : 0);
    }
    for (let key in this['_elems']) {
      if (this['_elems'].hasOwnProperty(key)) {
        tmpArr.push(this['_elems'][key]);
      }
    }
    tmpArr.sort(func);
    tmpArr.forEach(
      (item) => {
        result[item['login']] = item;
      }
    );
    return result;
  }
}