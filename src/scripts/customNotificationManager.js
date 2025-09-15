'use strict';

export class CustomNotificationManager {
  static NOTIFICATION_TYPE_SUCCESS = 'success';
  static NOTIFICATION_TYPE_ERROR = 'error';

  static NOTIFICATION_POS_RIGHT = '10px';
  static NOTIFICATION_POS_TOP = 10;
  static NOTIFICATION_POS_Y_DELTA = 10;

  /**
   * Push notification
   * @param {string} title - Notification title.
   * @param {string} description - Notification description.
   * @param {'success'|'error'} type - Notification type.
   * @param {number} [timeout=2000] - Auto-dismiss timeout in ms.
   * @returns {HTMLElement}
   */
  pushNotification(title, description, type, timeout = 2000) {
    const customNotificationBuilder = new CustomNotificationBuilder(type);
    /**
     * Creates notification element
     * @type {HTMLElement} notificationEl
     */
    const notificationEl = customNotificationBuilder.createNotification(
      CustomNotificationManager.NOTIFICATION_POS_RIGHT,
      title,
      description,
    );

    // add timeout to hide and remove notification
    setTimeout(() => {
      // remove outdated notification
      notificationEl.remove();
    }, timeout);

    return notificationEl;
  }
}

class CustomNotificationBuilder {
  static baseClass = 'notification';

  static notificationTypes = [
    CustomNotificationManager.NOTIFICATION_TYPE_SUCCESS,
    CustomNotificationManager.NOTIFICATION_TYPE_ERROR,
  ];

  /**
   * Container element for notification placement (body by default)
   *
   * @private {HTMLElement}
   */
  _container;

  /**
   * Constructor
   *
   * @param {string} type
   * @param {string|HTMLElement} parentElement
   */
  constructor(type = 'success', parentElement = 'body') {
    if (typeof parentElement === 'string') {
      this._container = document.querySelector(parentElement);
    }

    if (CustomNotificationBuilder.notificationTypes.indexOf(type) === -1) {
      throw new Error(`Notification type ${type} is not supported`);
    }

    this.className = type;
    this.parentElement = parentElement;
  }

  /**
   * Push notification of class type
   *
   * @param {number} posRight
   * @param {string} title
   * @param {string} description
   *
   * @return HTMLElement
   */
  createNotification(posRight, title, description) {
    const container = document.querySelector(this.parentElement);

    if (!container) {
      throw new Error('Notification container is not found');
    }

    // create notification element
    const notificationEl = document.createElement('div');

    notificationEl.classList.add(CustomNotificationBuilder.baseClass);
    notificationEl.classList.add(this.className);

    notificationEl.setAttribute('data-qa', 'notification');

    // create title element
    const titleEl = document.createElement('h2');

    titleEl.classList.add('title');
    titleEl.textContent = title;

    // create description element
    const descriptionEl = document.createElement('p');

    descriptionEl.textContent = description;

    // append all children to notification element
    notificationEl.appendChild(titleEl);
    notificationEl.appendChild(descriptionEl);

    // add positioning to notification element
    const notifications = container.querySelectorAll(
      '.' + CustomNotificationBuilder.baseClass,
    );
    const lastNotification = notifications[notifications.length - 1];

    notificationEl.style.top =
      (lastNotification
        ? lastNotification.offsetTop + lastNotification.offsetHeight
        : CustomNotificationManager.NOTIFICATION_POS_TOP) +
      CustomNotificationManager.NOTIFICATION_POS_Y_DELTA +
      'px';
    notificationEl.style.right = posRight;

    // position notification inside container
    container.append(notificationEl);

    return notificationEl;
  }
}
