export const clearField = () => {
  const inputs = document.querySelectorAll('input');

  inputs.forEach((input) => (input.value = ''));
};
