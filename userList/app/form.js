export default class Form {
  /**
   * Creates an instance of Form.
   * 
   * @param {string} selector for DOM element with form
   * 
   * @memberOf Form
   */
  constructor(selector) {
    this.formEl = document.querySelector(selector);
    if (!this.formEl) throw new Error("Incorrect selector for FORM element!");
    this.setDataToHtml = this.setDataToHtml.bind(this);
  }

  /**
   * Calling callback function after form submit
   * 
   * @param {Function} Callback function 
   * 
   * @memberOf Form
   */
  getDataFromHtml(cb) {
    this.form.formEl.addEventListener('submit', formHandler, false);
    let user = {
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
        if (this.elements.hasOwnProperty(key) && user.hasOwnProperty(key)) {
          switch (this.elements[key].type) {
            case 'radio':
              if (inputsArr[i].checked == true)
                user[key] = this.elements[key].value;
              break;
            case 'checkbox':
              user[key] = this.elements[key].checked;
              break;
            default:
              user[key] = this.elements[key].value;
              break;
          }
        }
      }
      cb(Object.assign({}, user));
    }
  }

  /**
   * Reset form fields
   * 
   * 
   * @memberOf Form
   */
  reset() {
     for (let key in this.formEl.elements) {
       if(this.formEl.elements.hasOwnProperty(key))
        this.formEl.elements[key].value='';
     }
  }

  /**
   * Fill form fields with data from Object
   * 
   * @param {Object} User
   * 
   * @memberOf Form
   */
  setDataToHtml(user) {
    for (let key in user) {
      if (user.hasOwnProperty(key) && this.formEl.elements.hasOwnProperty(key)) {
        this.formEl.elements[key].checked = this.formEl.elements[key].value = user[key];
      }
    }
  }
}