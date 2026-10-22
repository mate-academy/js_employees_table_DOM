export function toUpperCaseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toUsd(num) {
  return num.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

export function fromUsdToNum(str) {
  return parseFloat(str.replace(/[$,\s]/g, ''));
}
