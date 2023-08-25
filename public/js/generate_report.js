let students = [];
let electiveSujects = new Map();
let studentElectivesPreferenceWise = [];

// sort students cgpa wise
function sortStudents() {
  students.sort((a, b) => {
    return b.cgpa - a.cgpa;
  });
}

// fill the table
function fillTable() {
  let table = document.getElementById("report-table-body");
  // table.innerHTML = "";
  for (let i = 0; i < studentElectivesPreferenceWise.length; i++) {
    let row = table.insertRow(i);
    let rollNoCell = row.insertCell(0);
    let studentCell = row.insertCell(1);
    let electiveCell = row.insertCell(2);
    let cgpaCell = row.insertCell(3);
    studentCell.innerHTML = studentElectivesPreferenceWise[i].student;
    studentCell.className = "border border-blue-600 px-4 py-2";
    electiveCell.innerHTML = studentElectivesPreferenceWise[i].elective;
    electiveCell.className = "border border-blue-600 px-4 py-2";
    rollNoCell.innerHTML = studentElectivesPreferenceWise[i].rollNo;
    rollNoCell.className = "border border-blue-600 px-4 py-2";
    cgpaCell.innerHTML = studentElectivesPreferenceWise[i].cgpa;
    cgpaCell.className = "border border-blue-600 px-4 py-2";
  }
}

// assign electives to students
function assignElectives() {
  for (let student of students) {
    for (let preference of [student.pref1, student.pref2, student.pref3]) {
      let electiveSubject = electiveSujects.get(preference);
      if (electiveSubject && electiveSubject.capacityMax > 0) {
        // Assign the elective to the student
        studentElectivesPreferenceWise.push({
          student: student.name,
          elective: preference,
          rollNo: student.roll,
          cgpa: student.cgpa,
        });

        // Decrease the capacity of the elective subject
        electiveSubject.capacityMax--;

        // Break the preference loop for the student
        break;
      }
    }
  }
  console.log(studentElectivesPreferenceWise);
  fillTable();
}

// fetch elective subjects
async function fetchElectives(department) {
  let url = "/get_electives";
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deptName: department }),
  }).then((res) => res.json());

  let electives = response;
  for (let i = 0; i < electives.length; i++) {
    let { elective, capacityMin, capacityMax } = electives[i];
    electiveSujects.set(elective, { capacityMin, capacityMax });
  }
  console.log(electiveSujects);
  assignElectives();
}

// fetch students according to department
async function fetchStudents(department) {
  students = [];
  let url = "/get_students/" + department;
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  students = response;
  sortStudents();
  console.log(students);
  fetchElectives(department);
}

document
  .getElementById("generate-report")
  .addEventListener("click", async () => {
    console.log("clicked");
    const department = document.getElementById("department").value;
    if (department === "") {
      alert("Please select a department");
      return;
    }
    console.log(department);
    fetchStudents(department);
  });
