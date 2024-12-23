export function createElement(elementTag, elementText) {
  const element = document.createElement(elementTag);

  element.textContent = elementText;

  return element;
}
