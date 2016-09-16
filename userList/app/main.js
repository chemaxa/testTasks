import model from './model';
import controller from './controller';
import view from './view';

class Main{
  init(){
    console.log('Im Init from App',this)
  }
  model(){
    new model().log();
  }
  view(){
    new view().log();
  }
  controller(){
    new controller().log();
  }

}
let main = new Main();
main.init();
main.model();
main.controller();
main.view();
export default Main;