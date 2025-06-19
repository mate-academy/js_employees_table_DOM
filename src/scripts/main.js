'use strict';

const table = document.querySelector("table");
const tbody = table.querySelector("tbody");
const headers = table.querySelectorAll("th");
let sortState = {};

headers.forEach((header, index) => {
  header.addEventListener("click", () => {
    const key = header.textContent;
    const rows = Array.from(tbody.rows);
    const currentDirection = sortState[key] === "asc" ? "desc" : "asc";
    sortState = { [key]: currentDirection };

    rows.sort((a, b) => {
      const valA = a.cells[index].textContent.trim();
      const valB = b.cells[index].textContent.trim();

      const parsedA = parseFloat(valA.replace(/[$,]/g, "")) || valA.toLowerCase();
      const parsedB = parseFloat(valB.replace(/[$,]/g, "")) || valB.toLowerCase();

      if (parsedA < parsedB) return currentDirection === "asc" ? -1 : 1;
      if (parsedA > parsedB) return currentDirection === "asc" ? 1 : -1;
      return 0;
    });

    tbody.append(...rows);
  });
});

tbody.addEventListener("click", (e) => {
  if (e.target.tagName === "TD") {
    Array.from(tbody.rows).forEach(row => row.classList.remove("active"));
    e.target.parentElement.classList.add("active");
  }
});

const form = document.createElement("form");
form.className = "new-employee-form";
form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
  <label>Office:
    <select name="office" data-qa="office">
      <option value="">Select</option>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
  <button type="submit">Save to table</button>
`;
document.body.prepend(form);

const notify = (text, success = false) => {
  let notif = document.querySelector("[data-qa='notification']");
  if (!notif) {
    notif = document.createElement("div");
    notif.setAttribute("data-qa", "notification");
    document.body.prepend(notif);
  }
  notif.textContent = text;
  notif.className = success ? "success" : "error";
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const position = form.position.value.trim();
  const office = form.office.value;
  const age = Number(form.age.value);
  const salary = Number(form.salary.value);

  if (name.length < 4) return notify("Name must be at least 4 characters");
  if (!position || !office || !age || !salary) return notify("All fields are required");
  if (age < 18 || age > 90) return notify("Age must be between 18 and 90");

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${name}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString()}</td>
  `;
  tbody.appendChild(row);
  notify("Employee successfully added!", true);
  form.reset();
});

tbody.addEventListener("dblclick", (e) => {
  const td = e.target;
  if (td.tagName !== "TD" || td.querySelector("input")) return;

  const oldText = td.textContent;
  const input = document.createElement("input");
  input.value = oldText.replace(/[$,]/g, "");
  input.className = "cell-input";
  td.textContent = "";
  td.appendChild(input);
  input.focus();

  const finishEdit = () => {
    const value = input.value.trim();
    td.textContent = value || oldText;
  };

  input.addEventListener("blur", finishEdit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
  });
});
