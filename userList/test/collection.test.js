import Collection from '../app/collection';
import {assert} from 'chai';
import {getLogger} from 'log4js';
let log = getLogger();

let collection = new Collection();
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
let mockUpdatedUser = {
  first_name: "Update",
  last_name: "Update",
  active: false,
  age: 18,
  login: "login",
  password: "password_update",
  role: 4,
  registered_on: new Date()
};


describe('Collection', () => {
  describe('Add item to collection', () => {
    it('Success must return added object', () => {
      assert.deepEqual(collection.addItem(mockValidUser), mockValidUser, 'the objects is not equals');
    });
    it('fail add item to collection, must return string with error', () => {
      assert.isString(collection.addItem(mockValidUser), 'the returned value is not string');
    });
  });

  describe('Get item from collection', () => {
    it('Success must return object by login', () => {
      assert.deepEqual(collection.getItem(mockValidUser['login']), mockValidUser, 'the objects is not equals');
    });

    it('fail get item from collection, must return String with error', () => {
      assert.isString(collection.getItem('test'), 'the returned value is not string');
    });
  });

  describe('Update item in collection', () => {
    it('Success must return added object', () => {
      assert.deepEqual(collection.updateItem(mockUpdatedUser), mockUpdatedUser, 'the objects is not equals');
    });

    it('fail update item in collection, must return String with error', () => {
      mockUpdatedUser.login = 'test';
      assert.isString(collection.updateItem(mockUpdatedUser), 'the returned value is not string');
    });
  });

  describe('Delete item in collection', () => {
    it('Success must return True', () => {
      assert.isTrue(collection.deleteItem(mockUpdatedUser.login), 'the returned value is not true');
    });
  });
});

describe('Collection methods forEach, sort(default by login), map.', () => {
  before(() => {
    // runs before all tests in this block
    collection.addItem(mockUpdatedUser);
  });
  
  it('ForEach collections method, receive Function and must call it for each collection item', () => {
    let i=0;
    collection.forEach(() => i++);
    assert.equal(i,Object.keys(collection._elems).length, 'the sum of calls callback function is not sum of elems');      
  });

  it('Map collections method, receive Function and must call it for each collection item, must return new collection', () => {
    let i=0;
    collection.map((item) => {
      item['first_name']='tested';
      i++;
      return item;
    });
    assert.equal(i,Object.keys(collection._elems).length, 'the sum of calls callback function is not sum of elems');
    for(let key in collection._elems){
      assert.equal(collection._elems[key]['first_name'],'tested', 'the name of items is not a "tested"');
    }
  });
  
});
