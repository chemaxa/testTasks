import Model from './model';
import Controller from './controller';
import View from './view';

class Main{
  init(){
    console.log('Im Init from App',this);
    let model = new Model();
    let controller = new Controller();
    let view = new View(); 
  }
}
new Main().init();

