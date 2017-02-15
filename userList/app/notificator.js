export default class Notificator {
  /**
   * Creates an instance of Notificator.
   * 
   * @param {Object} Form 
   * @param {Object} Object with notifications
   * 
   * @memberOf Notificator
   */
  constructor(form, notifications) {
    let defaultNotifications = {
      "update": "User $login was updated",
      "add": "User $login was added"
    };
    this.notifications = Object.assign(defaultNotifications, notifications);
    this.showNotification = this.showNotification.bind(this);
    this.showCustomNotification = this.showCustomNotification.bind(this);
    this.form = form;
    this.timeoutId;
  }

  /**
   * Show notification with custom text
   * 
   * @param {string} text
   * @param {string} theme for notification
   * 
   * @memberOf Notificator
   */
  showCustomNotification(text, theme = 'warning') {
    let messageEl = `
      <div class="alert alert-${theme} alert-dismissible" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <strong>${theme == 'danger' ? 'Error!' : ''}</strong> ${text}
      </div>`;
    this._insertHtml(messageEl);
  }

  /**
   * Show notification
   * 
   * @param {Object} event Object
   * @param {Object} User
   * @param {string} theme for notification
   * 
   * @memberOf Notificator
   */
  showNotification(event, user, theme = 'warning') {
    let messageEl = `
      <div class="alert alert-${theme} alert-dismissible" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <strong>${theme == 'danger' ? 'Error!' : ''}</strong> ${this.notifications[event].replace('$login',user.login)}
      </div>`;
    this._insertHtml(messageEl);
  }

  /**
   * Inject HTML string into DOM
   * 
   * @param {string} html
   * 
   * @memberOf Notificator
   */
  _insertHtml(html) {
    this.form.formEl.insertAdjacentHTML("afterBegin", html);
    this._closeNotification();
  }

  /**
   * 
   * AutoClose notification after 5 sec
   * 
   * @memberOf Notificator
   */
  _closeNotification() {
    if (!this.timeoutId) {
      this.timeoutId = setTimeout(() => {
        $('.alert').alert('close');
        this.timeoutId=false;
      }, 5000);
    }
  }
}