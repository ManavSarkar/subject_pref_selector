const subjectsByDepartment = new Map();

const departments = [];
function fetchElectives() {
  departments.forEach((department) => {
    fetch("/get_electives", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deptName: department }),
    }).then((res) => {
      res.json().then((data) => {
        console.log(data);
        let electives = [];
        for (let i = 0; i < data.length; i++) {
          electives.push(data[i].elective);
        }
        subjectsByDepartment.set(department, electives);
      });
    });
  });
}

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
    fetchElectives();
  });
});
const departmentSelect = document.getElementById("department");
