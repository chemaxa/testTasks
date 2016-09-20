export default class Collection{
  constructor(){
    this.elems={};
  }

  addItem(item){
    this.elems[item.login]=item;
  }

  updateItem(newItem){
    let oldItem = this.elems[newItem.login];
    for (let key in oldItem){
      if(oldItem.hasOwnProperty(key))
        oldItem[key]=newItem[key];
    }
  }
  
  deleteItem(item){
    delete this.elems[item.login];
  }

/*  forEach — простой обход сохранённых в коллекцию моделей
2. map — обход с возвратом обработанных значений
3. sort — сортировка моделей передаваемой функцией или по полю
login, если функция не задана*/

  forEach(){
    return Array.prototype.forEach.bind(this.elems);
  }

  map(func){
    return Array.prototype.map.bind(this.elems,func);
  }

  sort(func){
    if(typeof func === 'function'){
      return Array.prototype.sort.bind(this.elems,func);
    }
  }

  setToStorage(data) {
    storage.setItem(appName, JSON.stringify(data));
  }

  getFromStorage() {
    return JSON.parse(storage.getItem(appName));
  }
}