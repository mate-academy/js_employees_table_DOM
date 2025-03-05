export class FormNotification {
  static NOTIFICATION_CLASS_NAME = 'notification';
  notification = null;

  #createNotification(type = '') {
    const notification = document.createElement('div');

    notification.classList.add(type, FormNotification.NOTIFICATION_CLASS_NAME);
    notification.setAttribute('data-qa', 'notification');

    this.notification = notification;

    return this;
  }

  #createTitle(titleText) {
    const title = document.createElement('h2');

    title.classList.add('title');
    title.textContent = titleText;

    this.notification.append(title);

    return this;
  }

  #createMessage(messageText) {
    const message = document.createElement('p');

    message.textContent = messageText;
    this.notification.append(message);

    return this;
  }

  #mountNotification() {
    document.body.append(this.notification);

    return this;
  }

  #unmountNotification() {
    setTimeout(() => {
      document.body
        .querySelector(`.${FormNotification.NOTIFICATION_CLASS_NAME}`)
        .remove();
    }, 2000);
  }

  showNotification({ type, title, message }) {
    this.#createNotification(type)
      .#createTitle(title)
      .#createMessage(message)
      .#mountNotification()
      .#unmountNotification();
  }
}
