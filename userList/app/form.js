/**
 *@selector {string}  
 * 
 * @export
 * @class Form
 */
export default class Form {
  constructor(selector) {
    this.formEl = document.querySelector(selector);
    if (!this.formEl) throw new Error("Incorrect selector for FORM element!");
    this.setDataToHtml = this.setDataToHtml.bind(this);
  }

  getDataFromHtml(cb) {
    this.form.formEl.addEventListener('submit', formHandler, false);
    let dataItem = {
      first_name: '',
      last_name: '',
      active: '',
      age: '',
      login: '',
      password: '',
      role: ''
    };
    function formHandler(event) {
      event.preventDefault();
      for (let key in this.elements) {
        if (this.elements.hasOwnProperty(key) && dataItem.hasOwnProperty(key)) {
          switch (this.elements[key].type) {
            case 'radio':
              if (inputsArr[i].checked == true)
                dataItem[key] = this.elements[key].value;
              break;
            case 'checkbox':
              dataItem[key] = this.elements[key].checked;
              break;
            default:
              dataItem[key] = this.elements[key].value;
              break;
          }
        }
      }
      cb(Object.assign({}, dataItem));
    }
  }

  reset() {
     for (let key in this.formEl.elements) {
       if(this.formEl.elements.hasOwnProperty(key))
        this.formEl.elements[key].value='';
     }
  }

  setDataToHtml(dataItem) {
    for (let key in dataItem) {
      if (dataItem.hasOwnProperty(key) && this.formEl.elements.hasOwnProperty(key)) {
        this.formEl.elements[key].checked = this.formEl.elements[key].value = dataItem[key];
      }
    }
  }
}