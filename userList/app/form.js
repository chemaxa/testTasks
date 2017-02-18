export default class Form {
  /**
   * Creates an instance of Form.
   * 
   * @param {string} selector for DOM element with form
   * 
   * @memberOf Form
   */
  constructor(selector,handler) {
    this.formEl = document.querySelector(selector);
    if (!this.formEl) throw new Error("Incorrect selector for FORM element!");
    this.setDataToHtml = this.setDataToHtml.bind(this);
    this.formEl.addEventListener('submit', handler, false);
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