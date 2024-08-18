const table = document.querySelector('table');

export function createForm(globalData) {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  globalData.fields.forEach((item) => {
    const label = createLabel(item);

    form.append(label);
  });

  function createLabel(item) {
    const label = document.createElement('label');

    label.textContent = item.label;

    if (item.type !== 'select') {
      const input = document.createElement('input');

      input.name = item.name;
      input.type = item.type;
      input.required = true;
      input.setAttribute('data-qa', item.dataQa);
      label.append(input);
    } else if (item.type === 'select') {
      const select = document.createElement('select');

      select.setAttribute('data-qa', item.dataQa);
      select.name = item.name;

      item.options.forEach((option) => {
        const createOption = document.createElement('option');

        createOption.value = option;
        createOption.append(option);
        select.append(createOption);
      });
      label.append(select);
    }

    return label;
  }

  const button = document.createElement('button');

  button.textContent = 'Save to table';
  form.append(button);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  table.after(form);
}
