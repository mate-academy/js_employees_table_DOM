form.addEventListener('submit', function (e) {
    if (!this.checkValidity()) {
      e.preventDefault();

      const elements = this.elements;
      const invalidFields = [...this.querySelectorAll(':invalid')];
      console.log(invalidFields[0].name);

      document.body.prepend(notification);
      notification.classList.add('succes');

      setTimeout(() => {
        notification.style.display = 'none';
      }, 2000);

        {if (!elements['name'].validity.valid) {
          elements['name'].setCustomValidity(
            'Text must be less than 4 characters long (you entered 3 characters)',
          );
        }

        if (!elements['position'].validity.valid) {
          elements['position'].setCustomValidity(
            'Text must be less than 4 characters long (you entered 3 characters)',
          );
        }

        if (!elements['age'].validity.valid) {
          elements['age'].setCustomValidity(
            'Text must be less than 4 characters long (you entered 3 characters)',
          );
        }

        if (!elements['salary'].validity.valid) {
          elements['salary'].setCustomValidity(
            'Text must be less than 4 characters long (you entered 3 characters)',
          );
        }

        notification.innerText = elements['name'].validationMessage;
        notification.innerText = elements['position'].validationMessage;
        notification.innerText = elements['age'].validationMessage;
        notification.innerText = elements['salary'].validationMessage;}

        const invalidFields = [...this.querySelectorAll(':invalid')];

        console.log(invalidFields);

        invalidFields.forEach((field) => console.log(field.validationMessage, field.name));
    }
  });