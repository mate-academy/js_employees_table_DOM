class BaseFieldFormatter {
  /**
   * Format value
   * @param {*} value
   * @return {*}
   */
  static format(value) {
    return value;
  }
}

export class MoneyAmountFormatter extends BaseFieldFormatter {
  /**
   * Defaults used for formatting
   * @type {string}
   */
  static defaultLocale = 'en-US';

  /**
   * @type {Intl.NumberFormatOptions}
   */
  static defaultConfig = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  /**
   * Locale used for formatting
   * @type {string}
   */
  static locale = MoneyAmountFormatter.defaultLocale;

  /**
   * Config used for formatting
   * @type Intl.NumberFormatOptions
   */
  static config = { ...MoneyAmountFormatter.defaultConfig };

  // Cached formatter to avoid recreating Intl.NumberFormat each call
  static _formatter = null;
  static _cacheKey = '';

  static _getFormatter() {
    const key = `${this.locale}|${JSON.stringify(this.config)}`;

    if (this._cacheKey !== key) {
      this._formatter = new Intl.NumberFormat(this.locale, this.config);
      this._cacheKey = key;
    }

    return this._formatter;
  }

  /**
   * Format value as currency
   * @param {number|string} value
   * @return {string}
   */
  static format(value) {
    // Treat null/undefined/empty string as empty output
    // instead of formatting as 0
    if (value == null || value === '') {
      return '';
    }

    const number =
      typeof value === 'string'
        ? Number(value.replace(/[^0-9,.-]/g, ''))
        : value;

    if (!Number.isFinite(number)) {
      // Fallback returns non-numeric values as is
      return String(value);
    }

    return this._getFormatter().format(number);
  }

  /**
   * Set locale
   * @param {string} locale
   * @return {MoneyAmountFormatter}
   */
  static setLocale(locale) {
    MoneyAmountFormatter.locale = locale;
    // Invalidate cache
    MoneyAmountFormatter._cacheKey = '';

    return this;
  }

  /**
   * Set config (currency or full Intl.NumberFormatOptions)
   * @param {string|Intl.NumberFormatOptions} configOrCurrency
   * @return {typeof MoneyAmountFormatter}
   */
  static setConfig(configOrCurrency) {
    if (typeof configOrCurrency === 'string') {
      // Backward-compatible: set only currency
      MoneyAmountFormatter.config = {
        ...MoneyAmountFormatter.config,
        currency: configOrCurrency,
      };
    } else if (configOrCurrency && typeof configOrCurrency === 'object') {
      // Merge partial options
      MoneyAmountFormatter.config = {
        ...MoneyAmountFormatter.config,
        ...configOrCurrency,
      };
    }

    // Ensure style stays 'currency' unless explicitly overridden
    if (!MoneyAmountFormatter.config.style) {
      MoneyAmountFormatter.config.style = 'currency';
    }

    // Invalidate cache
    MoneyAmountFormatter._cacheKey = '';

    return this;
  }
}
