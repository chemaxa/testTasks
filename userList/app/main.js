import Collection from './collection';
import Form from './form';
import Table from './table';
import User from './user';
import Validator from './validator';

class Mediator{
  init(){
    console.log('Im Init from App',this);
    let user = new User();
    let collection = new Collection();
    let validator = new Validator();
    let table = new Table();
    let form = new Form();
  }
}
new Main().init();

