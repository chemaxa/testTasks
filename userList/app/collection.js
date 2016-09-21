export default class Collection {
  constructor() {
    this.elems = {};
  }

  addItem(item) {
    this.elems[item.login] = item;
  }

  updateItem(newItem) {
    let oldItem = this.elems[newItem.login];
    for (let key in oldItem) {
      if (oldItem.hasOwnProperty(key))
        oldItem[key] = newItem[key];
    }
  }

  deleteItem(item) {
    delete this.elems[item.login];
  }

  /*  forEach — простой обход сохранённых в коллекцию моделей
  2. map — обход с возвратом обработанных значений
  3. sort — сортировка моделей передаваемой функцией или по полю
  login, если функция не задана*/

  forEach(func, thisArg) {
    thisArg = thisArg || this;
    for (let key in thisArg) {
      if (thisArg.hasOwnProperty(key))
        func.call(thisArg, thisArg[key], key, thisArg);
    }
  }

  map(func, thisArg) {
    thisArg = thisArg || this;
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
      let param1=item1['login'].toLowerCase();
      let param2=item2['login'].toLowerCase();
      return param1 < param2 ? -1 : (param1 > param2? 1 : 0);
    }
    
    for (let key in this) {
      if (this.hasOwnProperty(key)) {
        tmpArr.push(this[key]);
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

  setToStorage(data) {
    storage.setItem(appName, JSON.stringify(data));
  }

  getFromStorage() {
    return JSON.parse(storage.getItem(appName));
  }
}