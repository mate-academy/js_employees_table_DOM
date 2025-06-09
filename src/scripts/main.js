'use strict';

// write code here
document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('table');
    const headers = table.querySelectorAll('th');
    const tbody = table.querySelector('tbody');
    const body = document.querySelector('body');

    let sortDirection = {};

    headers.forEach((header, index) => {
        header.addEventListener('click', () => {
            const isNumeric = ['Age', 'Salary'].includes(header.textContent.trim());
            const rows = Array.from(tbody.querySelectorAll('tr'));

            if (sortDirection[index] === 'asc') {
                sortDirection[index] = 'desc';
            } else {
                sortDirection = {};
                sortDirection[index] = 'asc';
            }

            rows.sort((rowA, rowB) => {
                let cellA = rowA.children[index].textContent.trim();
                let cellB = rowB.children[index].textContent.trim();

                if (header.textContent.trim() === 'Salary') {
                    cellA = parseFloat(cellA.replace('$', '').replace(/,/g, ''));
                    cellB = parseFloat(cellB.replace('$', '').replace(/,/g, ''));
                } else if (isNumeric) {
                    cellA = parseFloat(cellA);
                    cellB = parseFloat(cellB);
                }

                if (sortDirection[index] === 'asc') {
                    return cellA > cellB ? 1 : -1;
                } else {
                    return cellA < cellB ? 1 : -1;
                }
            });

            rows.forEach(row => tbody.appendChild(row));
        });
    });

    tbody.addEventListener('click', (event) => {
        let targetRow = event.target.closest('tr');

        if (targetRow && tbody.contains(targetRow)) {
            tbody.querySelectorAll('tr').forEach(row => {
                row.classList.remove('active');
            });

            targetRow.classList.add('active');
        }
    });


    const form = document.createElement('form');
    form.classList.add('new-employee-form');

    form.innerHTML = `
        <label>Ім'я: <input name="name" type="text" data-qa="name" required></label>
        <label>Посада: <input name="position" type="text" data-qa="position" required></label>
        <label>Офіс:
            <select name="office" data-qa="office" required>
                <option value="">-- Виберіть офіс --</option>
                <option value="Tokyo">Tokyo</option>
                <option value="Singapore">Singapore</option>
                <option value="London">London</option>
                <option value="New York">New York</option>
                <option value="Edinburgh">Edinburgh</option>
                <option value="San Francisco">San Francisco</option>
            </select>
        </label>
        <label>Вік: <input name="age" type="number" data-qa="age" required></label>
        <label>Зарплата: <input name="salary" type="number" data-qa="salary" required></label>
        <button type="submit">Зберегти до таблиці</button>
    `;

    table.parentNode.insertBefore(form, table.nextSibling);

    function showNotification(type, title, description) {
        let notification = document.querySelector('[data-qa="notification"]');
        if (notification) {
            notification.remove();
        }

        notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.setAttribute('data-qa', 'notification');
        notification.innerHTML = `<span class="title">${title}</span><p>${description}</p>`;
        body.appendChild(notification);

        setTimeout(() => {
            if (notification) {
                notification.remove();
            }
        }, 3000);
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const position = formData.get('position').trim();
        const office = formData.get('office');
        const age = parseInt(formData.get('age'), 10);
        const salary = parseFloat(formData.get('salary'));

        if (!name || !position || !office || !age || !salary || office === "") {
            showNotification('error', 'Помилка валідації', 'Усі поля є обов\'язковими.');
            return;
        }
        if (name.length < 4) {
            showNotification('error', 'Помилка валідації', 'Ім\'я повинно містити щонайменше 4 літери.');
            return;
        }
        if (age < 18 || age > 90) {
            showNotification('error', 'Помилка валідації', 'Вік повинен бути від 18 до 90 років.');
            return;
        }

        const newRow = tbody.insertRow();
        newRow.insertCell().textContent = name;
        newRow.insertCell().textContent = position;
        newRow.insertCell().textContent = office;
        newRow.insertCell().textContent = age;
        newRow.insertCell().textContent = `$${salary.toLocaleString('en-US')}`;

        showNotification('success', 'Успіх', 'Новий співробітник успішно доданий!');
        form.reset();
    });

    let currentEditCell = null;

    tbody.addEventListener('dblclick', (event) => {
        const targetCell = event.target.closest('td');

        if (targetCell && !currentEditCell) {
            const originalText = targetCell.textContent;
            targetCell.textContent = '';

            const input = document.createElement('input');
            input.classList.add('cell-input');
            input.value = originalText;
            targetCell.appendChild(input);
            input.focus();
            currentEditCell = targetCell;

            const saveChanges = () => {
                const newValue = input.value.trim();
                targetCell.textContent = newValue === '' ? originalText : newValue;
                input.remove();
                currentEditCell = null;
            };

            input.addEventListener('blur', saveChanges);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveChanges();
                }
            });
        }
    });
});