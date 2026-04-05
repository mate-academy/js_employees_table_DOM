export const normalizeNumberString = (v) => {
  let s = String(v ?? '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/['\u2019]/g, '');

  if (s === '') {
    return s;
  }

  const sign = s[0] === '-' ? '-' : '';

  if (sign) {
    s = s.slice(1);
  }

  const hasComma = s.includes(',');
  const hasDot = s.includes('.');

  s = hasComma ? s.split(',').filter(Boolean).join(',') : s;
  s = hasDot ? s.split('.').filter(Boolean).join('.') : s;

  if (hasComma && hasDot) {
    // last character is a fractional  separator
    const lastComma = s.lastIndexOf(',');
    const lastDot = s.lastIndexOf('.');

    if (lastComma > lastDot) {
      // fractional comma
      s = s.replace(/\./g, '').replace(/,/g, '.');
    } else {
      // fractional point
      s = s.replace(/,/g, '');
    }

    return sign + s;
  }

  if (hasComma && !hasDot) {
    const parts = s.split(',');
    const lastPart = parts[parts.length - 1];

    if (lastPart.length === 3) {
      s = s.replace(/,/g, '');
    } else {
      s = s.replace(/,/g, '.');
    }

    return sign + s;
  }

  if (hasDot && !hasComma) {
    const parts = s.split('.');

    if (parts.length > 1) {
      const last = parts.pop();

      if (last.length === 3) {
        // all points are thousands
        s = parts.join('') + last;
      } else {
        // the last one is fractional
        s = parts.join('') + '.' + last;
      }
    }

    return sign + s;
  }

  return sign + s;
};
