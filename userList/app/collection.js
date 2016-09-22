  /*  forEach — простой обход сохранённых в коллекцию моделей
  2. map — обход с возвратом обработанных значений
  3. sort — сортировка моделей передаваемой функцией или по полю
  login, если функция не задана*/
export default class Collection {
  constructor() {
    this._elems = {};
  }

  addItem(item) {
    if(this._elems[item['login']])
      return 'Item already exist!';
    this._elems[item['login']] = item;
      return item;
  }
  
  getItem(login) {
    return this._elems[login] ? this._elems[login] : 'Item not found!'; 
  }

  updateItem(newItem) {
    
    let oldItem = this._elems[newItem['login']];
    
    if(!oldItem)
      return 'Item with this login is not exist!';

    for (let key in oldItem) {
      if (oldItem.hasOwnProperty(key))
        oldItem[key] = newItem[key];
    }

    return this._elems[newItem['login']];
  }

  deleteItem(item) {
    return delete this._elems[item['login']];
  }

  forEach(func, thisArg) {
    thisArg = thisArg || this._elems;
    for (let key in thisArg) {
      if (thisArg.hasOwnProperty(key))
        func.call(thisArg, thisArg[key], key, thisArg);
    }
  }

  map(func, thisArg) {
    thisArg = thisArg || this._elems;
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
    
    for (let key in this._elems) {
      if (this._elems.hasOwnProperty(key)) {
        tmpArr.push(this._elems[key]);
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