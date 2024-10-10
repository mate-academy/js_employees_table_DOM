export const sorArrayOfObjecsByNumber = (arr, key, type = 'ASC') =>
  type === 'ASC'
    ? [...arr].sort((a, b) => a[key] - b[key])
    : [...arr].sort((a, b) => b[key] - a[key]);

export const sorArrayOfObjectsByString = (arr, key, type = 'ASC') =>
  type === 'ASC'
    ? [...arr].sort((a, b) => a[key].localeCompare(b[key]))
    : [...arr].sort((a, b) => b[key].localeCompare(a[key]));
