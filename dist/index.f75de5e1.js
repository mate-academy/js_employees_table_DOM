"use strict";
const th = document.querySelectorAll("th");
let curentSortIndex;
let curentSortDirection;
th.forEach((element)=>{
    element.addEventListener("click", (e)=>{
        const index = element.cellIndex;
        const tr = Array.from(document.querySelectorAll("tbody tr"));
        const tbody = document.querySelector("tbody");
        if (curentSortIndex === index) {
            if (curentSortDirection === "desc") tr.sort((a, b)=>{
                const aItem = a.children[index].textContent.trim();
                const bItem = b.children[index].textContent.trim();
                const aNan = Number(aItem);
                const bNan = Number(bItem);
                if (!isNaN(aNan) && !isNaN(bNan)) return bNan - aNan;
                else return bItem.localeCompare(aItem);
            });
            else if (curentSortDirection === "asc") tr.sort((a, b)=>{
                const aItem = a.children[index].textContent.trim();
                const bItem = b.children[index].textContent.trim();
                const aNan = Number(aItem);
                const bNan = Number(bItem);
                if (!isNaN(aNan) && !isNaN(bNan)) return aNan - bNan;
                else return aItem.localeCompare(bItem);
            });
            curentSortDirection = curentSortDirection === "asc" ? "desc" : "asc";
        } else {
            curentSortIndex = index;
            curentSortDirection = "asc";
            tr.sort((a, b)=>{
                const aItem = a.children[index].textContent.trim();
                const bItem = b.children[index].textContent.trim();
                const aNan = Number(aItem);
                const bNan = Number(bItem);
                if (!isNaN(aNan) && !isNaN(bNan)) return aNan - bNan;
                else return aItem.localeCompare(bItem);
            });
        }
        tbody.innerHTML = "";
        tbody.append(...tr);
    });
});
const trs = document.querySelectorAll("tbody tr");
trs.forEach((tr)=>{
    tr.addEventListener("click", (e)=>{
        trs.forEach((t)=>{
            t.classList.remove("active");
        });
        tr.classList.add("active");
    });
});
const form = document.createElement("form");
form.classList.add("new-employee-form");
const inputsData = [
    {
        labelText: "Name",
        name: "name",
        type: "text",
        "data-qa": "name"
    },
    {
        labelText: "Position",
        name: "position",
        type: "text",
        "data-qa": "position"
    },
    {
        labelText: "Age",
        name: "age",
        type: "text",
        "data-qa": "age"
    },
    {
        labelText: "Salary",
        name: "salary",
        type: "text",
        "data-qa": "salary"
    }
];
inputsData.forEach((inputData)=>{
    const labelNew = document.createElement("label");
    labelNew.textContent = inputData.labelText;
    const input = document.createElement("input");
    for(const i in inputData)if (i !== "labelText") input.setAttribute(i, inputData[i]);
    labelNew.appendChild(input);
    form.appendChild(labelNew);
});
const select = document.createElement("select");
const label = document.createElement("label");
label.textContent = "Office";
const citys = [
    "Tokyo",
    "Singapore",
    "London",
    "New York",
    "Edinburgh",
    "San Francisco"
];
citys.forEach((city)=>{
    const option = document.createElement("option");
    option.value = city.toLowerCase();
    option.textContent = city;
    select.appendChild(option);
});
select.setAttribute("name", "select");
label.appendChild(select);
form.appendChild(label);
const button = document.createElement("button");
button.textContent = "Save to table";
button.setAttribute("type", "submit");
form.appendChild(button);
document.body.appendChild(form);
form.addEventListener("submit", (s)=>{
    s.preventDefault();
    const table = document.querySelector("table");
    const nameForm = form.querySelector('[name ="name"]').value;
    const position = form.querySelector('[name = "position"]').value;
    const age = form.querySelector('[name = "age"]').value;
    const salary = form.querySelector('[name = "salary"]').value;
    const selectForm = form.querySelector('[name="select"]');
    const selectText = selectForm.options[select.selectedIndex].textContent;
    if (!nameForm || !position || !age || !salary || !select) {
        showNotification("\u0423\u0441\u0456 \u043F\u043E\u043B\u044F \u043F\u043E\u0432\u0438\u043D\u043D\u0456 \u0431\u0443\u0442\u0438 \u0437\u0430\u043F\u043E\u0432\u043D\u0435\u043D\u043D\u0456", "error");
        return;
    }
    if (nameForm.length < 4) {
        showNotification("\u0406\u043C'\u044F \u043F\u043E\u0432\u0438\u043D\u043D\u043E \u043C\u0456\u0441\u0442\u0438\u0442\u0438 \u0431\u0456\u043B\u044C\u0448\u0435 4 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432", "error");
        return;
    }
    if (Number(age) < 18 || Number(age) > 90 || isNaN(Number(age))) {
        showNotification("\u041D\u0435\u043A\u043E\u0440\u0435\u043A\u0442\u043D\u0438\u0439 \u0432\u0456\u043A", "error");
        return;
    }
    if (isNaN(Number(salary)) || Number(salary) < 0) {
        showNotification("\u041D\u0435\u043A\u043E\u0440\u0435\u043A\u0442\u043D\u043E \u0432\u0432\u0435\u0434\u0435\u043D\u043E \u0437\u0430\u0440\u043F\u043B\u0430\u0442\u0443", "error");
        return;
    }
    const newTr = document.createElement("tr");
    const newName = document.createElement("td");
    newName.textContent = nameForm;
    const newPosition = document.createElement("td");
    newPosition.textContent = position;
    const newAge = document.createElement("td");
    newAge.textContent = age;
    const newSalary = document.createElement("td");
    newSalary.textContent = `$${Number(salary).toLocaleString("en-US")}`;
    const newSelect = document.createElement("td");
    newSelect.textContent = selectText;
    newTr.append(newName, newPosition, newSelect, newAge, newSalary);
    const tbody = table.querySelector("tbody");
    tbody.appendChild(newTr);
    showNotification("\u0421\u043F\u0456\u0432\u0440\u043E\u0431\u0456\u0442\u043D\u0438\u043A\u0430 \u0434\u043E\u0434\u0430\u043D\u043E", "success");
});
function showNotification(text, type) {
    const div = document.createElement("div");
    div.classList.add("notification");
    div.classList.add(type);
    div.setAttribute("data-qa", "notification");
    div.innerHTML = `
    <p>${text}</p>
  `;
    document.body.appendChild(div);
    setTimeout(()=>{
        div.remove();
    }, 2000);
}

//# sourceMappingURL=index.f75de5e1.js.map
