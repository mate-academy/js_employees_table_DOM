const ROOT = document.querySelector('body');

const createDomNode = (type, classes) => {
  const domNode = document.createElement(type);

  domNode.classList.add(...classes);

  return domNode;
};

const notification = (type, title) => {
  const container = createDomNode('div', ['notification', type]);

  container.dataset.qa = 'notification';

  container.innerHTML = `<h2 class="title">${title}</h2>`;

  ROOT.append(container);

  setTimeout(() => {
    container.style.display = 'none';
  }, 2000);
};

export default notification;
