'use strict';

/**
 * Validation result container
 */
export class BaseValidationResult {
  success = true;
  message = 'Validated successfully';

  /**
   * Constructor
   * @param success
   * @param message
   * @return void
   */
  constructor(success = true, message = 'Validated successfully') {
    this.success = success;
    this.message = message;
  }
}

/**
 * Base validator class
 */
class BaseValidator {
  _field = null; // HTMLInputElement или HTMLSelectElement
  _rules = [];

  /**
   * Constructor
   *
   * @param rules - set of rules for validation
   * @return void
   */
  constructor(rules = []) {
    this._rules = rules;
  }

  /**
   * Bind field to validator for further validation
   *
   * @param {Element} field
   * @return {BaseValidator}
   */
  bindField(field) {
    this._field = field;

    return this;
  }

  /**
   * Validates field value against defined rules
   *
   * @return {BaseValidationResult}
   */
  validate() {
    if (!this._field) {
      return new BaseValidationResult(false, 'Field not bound');
    }

    // trim value for validation
    const value = (this._field.value ?? '').trim();
    let success = true;
    const messages = [];

    this._rules.forEach((rule) => {
      if (typeof rule.func !== 'function') {
        success = false;
        messages.push(`Validation ${rule.name} is not defined`);

        return;
      }

      try {
        const result = rule.func(value);

        if (!result.success) {
          success = false;
          messages.push(result.message);
        }
      } catch (e) {
        success = false;
        messages.push(`Validation ${rule.name} failed: ${e.message}`);
      }
    });

    return new BaseValidationResult(success, messages.join('; '));
  }
}

/**
 * Validate against minimal string length
 */
export class MinStrLenValidator extends BaseValidator {
  /**
   * Constructor
   *
   * @param {string} fieldName - field name
   * @param {integer} minLenValue - minimal string length
   * @return void
   */
  constructor(fieldName, minLenValue) {
    const rules = [
      {
        name: 'minLen',
        func: (value) => {
          if (!value || value.length < minLenValue) {
            return {
              success: false,
              message: `Minimum ${fieldName} length is ${minLenValue}`,
            };
          }

          return { success: true };
        },
      },
    ];

    super(rules);
  }
}

/**
 * Validate if number is in range
 */
export class NumScopeValidator extends BaseValidator {
  /**
   * Constructor
   *
   * @param {string} fieldName - field name
   * @param {integer} minValue - min scope value
   * @param {integer} maxValue - max scope value
   * @return void
   */
  constructor(fieldName, minValue, maxValue) {
    const rules = [
      {
        name: 'min',
        func: (value) => {
          const num = Number(value);

          if (isNaN(num)) {
            return {
              success: false,
              message: `${fieldName} must be a number`,
            };
          }

          if (num < minValue) {
            return {
              success: false,
              message: `Minimum ${fieldName} is ${minValue}`,
            };
          }

          return {
            success: true,
          };
        },
      },
      {
        name: 'max',
        func: (value) => {
          const num = Number(value);

          if (isNaN(num)) {
            return {
              success: false,
              message: `${fieldName} must be a number`,
            };
          }

          if (num > maxValue) {
            return {
              success: false,
              message: `Maximum ${fieldName} is ${maxValue}`,
            };
          }

          return {
            success: true,
          };
        },
      },
    ];

    super(rules);
  }
}

/**
 * Validate not empty value
 */
export class NotEmptyValidator extends BaseValidator {
  /**
   * Constructor
   *
   * @param {string} fieldName - field name
   * @return void
   */
  constructor(fieldName) {
    const rules = [
      {
        name: 'notEmpty',
        func: (value) => {
          let result = true;

          if (value === null || typeof value === 'undefined') {
            // Check for null or undefined
            result = false;
          } else if (typeof value === 'string') {
            // Check for empty string or string containing only whitespace
            result = value.trim() !== '';
          } else if (Array.isArray(value)) {
            result = value.length > 0;
          } else if (typeof value === 'object' && value !== null) {
            // For a simple "not empty" for objects,
            // one might check if it has any keys.
            result = Object.keys(value).length > 0;
          } else if (typeof value === 'number') {
            // skip not empty validation for number in our case
            // return value !== 0;
            result = true;
          }

          const isValid = {
            success: result,
          };

          if (!result) {
            isValid.message = `Field ' ${fieldName} should not be empty`;
          }

          return isValid;
        },
      },
    ];

    super(rules);
  }
}
