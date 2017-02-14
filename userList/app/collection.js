import config from './config';
//let storage=localStorage;
let {
  appName,
  storage
} = config;

/*  forEach — простой обход сохранённых в коллекцию моделей
2. map — обход с возвратом обработанных значений
3. sort — сортировка моделей передаваемой функцией или по полю
login, если функция не задана*/
export default class Collection {
  constructor() {
    this._elems = this.getFromStorage();
    let
      obj = this,
      prop = '_elems',
      oldValue = this.getFromStorage(),
      newValue = oldValue,
      getter = function () {
        return newValue;
      },
      setter = function (value) {
        oldValue = newValue;
        newValue = value;
        this.setToStorage(value);
        //console.log('SETTER WAS CALLED!', newValue);
      };

    Object.defineProperty(obj, prop, {
      get: getter,
      set: setter,
      configurable: true
    });
  }

  getFromStorage() {
    return JSON.parse(storage.getItem(appName)) || {};
  }

  setToStorage(data) {
    storage.setItem(appName, JSON.stringify(data));
  }

  isExist(login) {
    return !!this['_elems'][login];
  }

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

  getItem(login) {
    return this._elems[login] ? this._elems[login] : 'Item not found!';
  }

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

  deleteItem(item) {
    let result = delete this['_elems'][item['login']];
    this['_elems'] = Object.assign(this['_elems'], this['_elems']);
    return result;
  }

  forEach(func, thisArg) {
    thisArg = thisArg || this['_elems'];
    for (let key in thisArg) {
      if (thisArg.hasOwnProperty(key))
        func.call(thisArg,  thisArg[key], key, thisArg);
    }
  }

  map(func, thisArg) {
    thisArg = thisArg || this['_elems'];
    let result = {};
    for (let key in thisArg) {
      if (thisArg.hasOwnProperty(key))
        result[key] = func.call(thisArg, thisArg[key], key, thisArg);
    }
    return result;
  }

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