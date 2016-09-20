export default class Collection{
  setToStorage(data) {
    storage.setItem(appName, JSON.stringify(data));
  }

  getFromStorage() {
    return JSON.parse(storage.getItem(appName));
  }
}