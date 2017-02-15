
/**
 *@selector {string}  
 * 
 * @export
 * @class Form
 */
export default class Form{
  constructor(selector){
    this.formEl = document.querySelector(selector);
    if (!this.formEl) throw new Error("Incorrect selector for FORM element!");
    this.setDataToHtml=this.setDataToHtml.bind(this);
  }
  getDataFromHtml(cb){

    this.form.formEl.addEventListener('submit', formHandler, false);

    let self = this,
        dataItem={};

    function formHandler(event) {
        event.preventDefault();
        console.log(this);
        let inputsArr = self.form.formEl.querySelectorAll('input,select');
        for (let i = inputsArr.length - 1; i >= 0; i--) {
            switch(inputsArr[i].type){
              case 'radio':
                if(inputsArr[i].checked==true)
                  dataItem[inputsArr[i].name] = inputsArr[i].value;
                break;
              case 'checkbox':
                dataItem[inputsArr[i].name] = inputsArr[i].checked;
                break;
              default:
                  dataItem[inputsArr[i].name] = inputsArr[i].value;
                break;
            }
            // Only for debugg!!!! Remove comments
            //inputsArr[i].value = '';
        }
        cb(dataItem);
    }
  }

  setDataToHtml(dataItem){
    for(let key in dataItem){
      if(dataItem.hasOwnProperty(key) && this.formEl.elements[key] && this.formEl.elements[key].value){
          this.formEl.elements[key].value=dataItem[key];
          this.formEl.elements[key].checked=dataItem[key];
      }
    }
  }
}