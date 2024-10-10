export const sorArrayOfObjecsByNumber = (arr, key, type = 'asc') =>
  type === 'asc'
    ? [...arr].sort((a, b) => a[key] - b[key])
    : [...arr].sort((a, b) => b[key] - a[key]);

export const sorArrayOfObjectsByString = (arr, key, type = 'asc') =>
  type === 'asc'
    ? [...arr].sort((a, b) => a[key].localeCompare(b[key]))
    : [...arr].sort((a, b) => b[key].localeCompare(a[key]));
