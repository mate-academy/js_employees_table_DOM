'use strict';

import { CustomNotificationManager } from './customNotificationManager';

/**
 * Component that provide functionality for inline edible cells
 */
export class InlineEditor {
  static HIDDEN = 'hidden';
  static EDITOR_CLASS = 'cell-input';
  static EDITOR_CONTAINER_CLASS = 'container--cell-input';
  static CONTAINER_ELEMENT = 'td';
  static EMPLOYEE_FIELDS_SEL = 'input, select, textarea';
  static SELECTED_LINE_ELEMENT = 'tr';

  /**
   * Origin element
   *
   * @type {HTMLElement}
   */
  originElement;

  /**
   * Target element
   *
   * @type {HTMLElement}
   */
  targetElement;

  /**
   * @type {Function}
   */
  onComplete;

  /**
   * @type {Function}
   */
  validator;

  /**
   * Custom notification manager
   *
   * @type CustomNotificationManager
   * @private
   */
  _customNotificationManager;

  /**
   * Constructor
   *
   * @param {HTMLTableCellElement} originElement - target td element for editor
   * @param {Array} fields - fields configuration
   *  for validation current state of edible employee
   * @param {Function} onComplete - external call back on complete editable
   */
  constructor(originElement, fields, onComplete = null) {
    this._customNotificationManager = new CustomNotificationManager();

    if (originElement) {
      if (typeof fields[originElement.cellIndex] === 'undefined') {
        // misconfiguration between defined cell data and DOM data
        return;
      }

      /**
       * @Object fieldConfiguration configuration of field
       */
      const fieldConfiguration = fields[originElement.cellIndex];

      /**
       * @HTMLElement inlineElement
       */
      // build editable cell
      this.targetElement = this.buildTargetElement(fieldConfiguration);

      // identify input of editable cell
      const targetInput = this.targetElement.firstChild;

      // initialize editable element with value from original
      targetInput.value = originElement.textContent;

      // store origin element for later use
      /* eslint-disable */
      this.originElement = originElement;

      // preserve width to avoid twitches
      this.targetElement.style.width = `${this.originElement.clientWidth}px`;
      targetInput.style.width = '100%';

      // hide origin element
      this.originElement.classList.add(InlineEditor.HIDDEN);

      // add editable element to DOM after original element
      this.originElement.after(this.targetElement);

      // focus on input/select
      this.targetElement.firstChild.focus();

      // keep validator if any
      this.validator = fieldConfiguration.validator;

      // add validator to element
      if (this.validator) {
        this.targetElement.firstChild.validator = this.validator.bindField(
          this.targetElement.firstChild,
        );
      }

      // cb
      this.onComplete = onComplete;
    }
  }

  /**
   * Build editable target element based on cell configuration
   *
   * @param {Object} fieldConfiguration
   * @returns {HTMLElement}
   */
  buildTargetElement(fieldConfiguration) {
    /**
     * @type HTMLElement container
     */
    const container = document.createElement(InlineEditor.CONTAINER_ELEMENT);

    const fieldInstance = new fieldConfiguration.GeneratorClass();
    const element = fieldInstance.generateElement(
      false,
      ...fieldConfiguration.args,
    );

    element.classList.add(InlineEditor.EDITOR_CLASS);

    container.appendChild(element);

    container.classList.add(InlineEditor.EDITOR_CONTAINER_CLASS);

    // We bind this.complete so we can remove the listener later
    const completeHandler = this.complete.bind(this);

    // add event handler processing (click outside element, press enter)
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        // prevent loosing focus automatically
        e.preventDefault();
        /**
         * Remove the focusout listener to avoid double-calling complete()
         * we can do this, because the process of edit is complete,
         * so we do not need it
         */
        element.removeEventListener('focusout', completeHandler);

        this.complete();

        /**
         *  Loose focus on element,
         *  to prevent editing
         */
        element.blur();
      }
    });

    element.addEventListener('focusout', completeHandler);

    if (element.tagName === InlineEditor.SELECTED_LINE_ELEMENT) {
      element.addEventListener('change', () => {
        this.complete();
      });
    }

    return container;
  }

  /**
   * Remove target element for inline edit, show origin element
   */
  complete() {
    // eslint-disable-next-line *
    let success = true;

    try {
      if (this.targetElement.firstChild.validator) {
        const validationResult =
          this.targetElement.firstChild.validator.validate();

        success = validationResult.success;

        if (!success) {
          this._customNotificationManager.pushNotification(
            'Validation failed',
            validationResult.message,
            CustomNotificationManager.NOTIFICATION_TYPE_ERROR,
          );
        }
      }
    } catch (e) {
      success = false;

      this._customNotificationManager.pushNotification(
        'Error',
        e.message,
        CustomNotificationManager.NOTIFICATION_TYPE_ERROR,
      );
    }

    if (success) {
      this._customNotificationManager.pushNotification(
        'Success',
        'New row was successfully added.',
        CustomNotificationManager.NOTIFICATION_TYPE_SUCCESS,
      );
    } else {
      return;
    }

    // extract value from wrapper -> input and assign to base td
    this.originElement.textContent = this.targetElement.firstChild.value;

    if (this.targetElement.parentNode) {
      this.targetElement.parentNode.removeChild(this.targetElement);
    }
    this.originElement.classList.remove(InlineEditor.HIDDEN);
    this.onComplete?.();
  }
}
