export default class Notificator {
  constructor(form, notifications) {
    let defaultNotifications = {
      "update": "User $login was updated",
      "add": "User $login was added"
    };
    this.notifications = Object.assign(defaultNotifications, notifications || {});
    this.showNotification = this.showNotification.bind(this);
    this.showCustomNotification = this.showCustomNotification.bind(this);
    this.form = form;

  }

  showCustomNotification(text, theme = 'warning') {
    let messageEl = `
      <div class="alert alert-${theme} alert-dismissible" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <strong>${theme == 'danger' ? 'Error!' : ''}</strong> text
      </div>`;
    this.insertHtml(messageEl);
  }

  showNotification(event, item, theme = 'warning') {
    let messageEl = `
      <div class="alert alert-${theme} alert-dismissible" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <strong>${theme == 'danger' ? 'Error!' : ''}</strong> ${this.notifications[event].replace('$login',item.login)}
      </div>`;
    this.insertHtml(messageEl);
  }
  insertHtml (html){
    this.form.formEl.insertAdjacentHTML("afterBegin", html);
  }
}