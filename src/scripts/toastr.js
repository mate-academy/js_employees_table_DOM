'use strict';

export class Toastr {
  toastr = null;

  static TOASTR_TYPE_SUCCESS = 'success';
  static TOASTR_TYPE_WARNING = 'warning';
  static TOASTR_TYPE_ERROR = 'error';

  #createToastr(type = '', options) {
    const toastr = document.createElement('div');

    toastr.classList.add('notification', type);
    toastr.setAttribute('data-qa', 'notification');
    toastr.style.top = `${options.position.top}px`;
    toastr.style.right = `${options.position.right}px`;
    toastr.style.zIndex = 999;

    this.toastr = toastr;

    return this;
  }

  #createTitle(title) {
    const titleEl = document.createElement('h2');

    titleEl.classList.add('title');

    titleEl.textContent = title;

    this.toastr.append(titleEl);

    return this;
  }

  #createMessage(message) {
    const messageEl = document.createElement('p');

    messageEl.textContent = message;

    this.toastr.append(messageEl);

    return this;
  }

  #mountToastr() {
    document.body.append(this.toastr);

    return this;
  }

  #unmountToast() {
    const timeoutId = setTimeout(() => {
      this.toastr.style.display = 'none';
      clearTimeout(timeoutId);
    }, 2000);
  }

  success({ title, message, options }) {
    this.#createToastr(Toastr.TOASTR_TYPE_SUCCESS, options)
      .#createTitle(title)
      .#createMessage(message)
      .#mountToastr()
      .#unmountToast();
  }

  warning({ title, message, options }) {
    this.#createToastr(Toastr.TOASTR_TYPE_WARNING, options)
      .#createTitle(title)
      .#createMessage(message)
      .#mountToastr()
      .#unmountToast();
  }

  error({ title, message, options }) {
    this.#createToastr(Toastr.TOASTR_TYPE_ERROR, options)
      .#createTitle(title)
      .#createMessage(message)
      .#mountToastr()
      .#unmountToast();
  }
}
