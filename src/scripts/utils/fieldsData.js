export function fieldsData() {
  const labels = document.querySelectorAll('label');
  const dataObject = {};

  labels.forEach((label) => {
    const input = label.querySelector('input');
    const select = label.querySelector('select');

    if (input) {
      const trimmedValue = input.value.trimStart();
      if (input.name === 'salary') {
        const number = +trimmedValue;
        const converted = `$${number.toLocaleString()}`;
        dataObject[input.name] = converted;
      } else {
        dataObject[input.name] = trimmedValue;
      }
    } else if (select) {
      dataObject[select.name] = select.value;
    }
  });

  return dataObject;
}
