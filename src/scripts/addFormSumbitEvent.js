'use strict';

import { addNewEmployee } from './addNewEmployee';
import { form } from './constants';
import { showNotification } from './showNotification';

export function addFormSubmitEvent() {
  form.onsubmit = (e) => {
    e.preventDefault();

    const nameInputValue = form.elements.name.value;
    const ageInputValue = form.elements.age.value;

    if (nameInputValue.length < 4) {
      showNotification(
        'Error',
        'Name must be at least 4 characters long',
        false,
      );

      return;
    }

    if (+ageInputValue < 18 || +ageInputValue > 90) {
      showNotification('Error', 'Age must be between 18 and 90', false);

      return;
    }

    addNewEmployee(form.elements);

    showNotification('Success', 'Employee added successfully', true);
    form.reset();
  };
}
