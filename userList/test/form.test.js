import Form from '../app/form';
import {assert,expect} from 'chai';
import jsdom from 'jsdom-global';
let cleanup = jsdom();

let html = `<form data-app-form="editForm">
              <input type="text" value="aaa" class="form-control" name="first_name" placeholder="Имя" required pattern="[A-Za-zА-Яа-яЁё]{3,15}">
            </form>`;
            document.body.insertAdjacentHTML("afterBegin",html);

let form = new Form('[data-app-form]');
 
describe('Form ', () => {
  it('is exist',  () =>{
    let formEl = document.body.querySelector('[data-app-form]');
    expect(formEl.nodeName).eql('FORM','form is HTML element');
  });
});

after(()=>{
  cleanup();
});