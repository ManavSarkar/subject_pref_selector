let departments = [];
let departmentSelect = document.getElementById("department");
function fetchDepartments() {
  fetch("/get_departments").then((res) => {
    res.json().then((data) => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        departments.push(data[i].name);
      }
      for (const department of departments) {
        const option = document.createElement("option");
        option.value = department;
        option.textContent = department;
        departmentSelect.appendChild(option);
      }
    });
  });
}

fetchDepartments();
