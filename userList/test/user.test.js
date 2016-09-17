import User from '../app/user';
import {assert} from 'chai';
let user = new User(); 
console.log(user,User);
describe('User ', () => {
  it('is object',  () =>{
    assert.isObject(user, 'user is object');
  });
  it('and should have log method',  () =>{
    assert.property(user,'log');
  });
});

