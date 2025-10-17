// tableSort/utils.js
export function convertToNumber(input) {
  let s = String(input)
    .trim()
    .replace(/[^\d,.\-\s\u00A0\u2007\u202F]/g, '')
    .replace(/[\s\u00A0\u2007\u202F]/g, '');

  s = s.replace(/,/g, '');

  s = s.replace(/-/g, '');

  if (String(input).includes('-')) {
    s = '-' + s;
  }

  if (!s || s === '-' || /^[.]+$/.test(s)) {
    return NaN;
  }

  return Number(s);
}

export function hasInvalidTD(tdA, tdB) {
  return (
    !tdA ||
    !tdB ||
    tdA.textContent == null ||
    tdB.textContent == null ||
    tdA.textContent.trim() === '' ||
    tdB.textContent.trim() === ''
  );
}

export function hasInvalidNumber(a, b) {
  return Number.isNaN(a) || Number.isNaN(b);
}

export function convertToCurrency(amount) {
  const n = Number(amount);

  if (Number.isNaN(n)) {
    return '';
  }

  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export function clearErrorNotifications() {
  const errorNotifications = document.querySelectorAll('.notification.error');

  if (errorNotifications.length === 0) {
    return;
  }

  for (const notification of errorNotifications) {
    notification.remove();
  }
}
