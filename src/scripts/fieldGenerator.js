'use strict';

export class BaseFieldGenerator {
  /**
   * Capitalize string
   * @param {string} str
   * @return {string}
   */
  _capitalizeStr(str = '') {
    return str ? str[0].toUpperCase() + str.slice(1) : '';
  }

  /**
   * Create base field element
   * @param {string} name
   * @param {boolean} required  - should add required attr to element
   * @param {string} type - type of input/select element
   * @param {string[]} [options=[]]
   * @returns {HTMLInputElement | HTMLSelectElement}
   */
  // eslint-disable-next-line no-shadow
  _createBaseFieldElement(name, required = false, type = 'text', options = []) {
    const inputElement = document.createElement('input');

    inputElement.setAttribute('id', 'id-' + name);
    inputElement.setAttribute('name', name);
    inputElement.setAttribute('type', type);
    inputElement.setAttribute('data-qa', name);

    if (required) {
      inputElement.setAttribute('required', 'required');
    }

    return inputElement;
  }

  /**
   * Create label element
   *
   * @param {string} name
   * @return {HTMLLabelElement}
   */
  // eslint-disable-next-line no-shadow
  _createLabelElement(name) {
    const labelElement = document.createElement('label');

    labelElement.setAttribute('for', 'id-' + name);
    labelElement.innerText = this._capitalizeStr(name) + ': ';

    return labelElement;
  }

  /**
   * Generate element
   *
   * @param {boolean} container - use label as wrapper
   * @param {boolean} required - should add required attr to element
   * @param {string} type - type of input/select element
   * @param {string} name
   * @return {HTMLLabelElement|HTMLSelectElement|HTMLInputElement}
   */
  // eslint-disable-next-line no-shadow
  generateElement(container, required, type, name) {
    const baseElement = this._createBaseFieldElement(name, required, type);

    if (!container) {
      return baseElement;
    }

    const labelElement = this._createLabelElement(name);

    labelElement.append(baseElement);

    return labelElement;
  }
}

export class InputFieldGenerator extends BaseFieldGenerator {}

export class SelectFieldGenerator extends BaseFieldGenerator {
  /**
   * Create select field element
   * @param {string} name
   * @param {boolean} required  - should add required attr to element
   * @param {[]} options
   * @return {HTMLSelectElement}
   */
  // eslint-disable-next-line no-shadow
  _createBaseFieldElement(name, required, options) {
    const selectElement = document.createElement('select');

    selectElement.setAttribute('id', 'id-' + name);
    selectElement.setAttribute('name', name);
    selectElement.setAttribute('data-qa', name);

    if (required) {
      selectElement.setAttribute('required', 'required');
    }

    options.forEach((optionData) => {
      const optionElement = document.createElement('option');

      optionElement.value = optionData;
      optionElement.textContent = optionData;
      // Append the option to the select
      selectElement.appendChild(optionElement);
    });

    return selectElement;
  }

  /**
   * Generate element
   *
   * @param {boolean} container - use label as wrapper
   * @param {boolean} required - should add required attr to element
   * @param {string} type - type of select element
   * @param {string} name
   * @param {String[]} options
   * @return {HTMLLabelElement|HTMLSelectElement}
   */
  // eslint-disable-next-line no-shadow
  generateElement(container, required, type, name, options) {
    const baseElement = this._createBaseFieldElement(name, required, options);

    if (!container) {
      return baseElement;
    }

    const labelElement = this._createLabelElement(name);

    labelElement.append(baseElement);

    return labelElement;
  }
}
