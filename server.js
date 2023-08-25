const express = require("express");
const app = express();
const ejs = require("ejs");
const database = require("./database.js");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/add_student", (req, res) => {
  res.render("add_student");
});

app.get("/add_elective", (req, res) => {
  res.render("add_elective");
});

app.get("/get_departments", async (req, res) => {
  let rows = await database.getDepartments();
  return res.json(rows);
});

app.post("/get_electives", async (req, res) => {
  let deptname = req.body.deptName;
  let rows = await database.getElectives(deptname);
  return res.json(rows);
});

app.post("/add_elective", (req, res) => {
  let deptname = req.body.deptName;
  let electives = req.body.electives;
  try {
    for (let i = 0; i < electives.length; i++) {
      let { subject, min, max } = electives[i];
      database.addElectives(deptname, subject, min, max);
    }
    database.addDepartment(deptname);
    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    return res.json({ success: false });
  }
});

app.post("/add_student", async (req, res) => {
  let { name, id, cgpa, department, preference0, preference1, preference2 } =
    req.body;
  try {
    let result = await database.addStudent(
      name,
      id,
      cgpa,
      department,
      preference0,
      preference1,
      preference2
    );
    return res.json({ success: result });
  } catch (error) {
    console.log(error);
    return res.json({ success: false });
  }
});

app.get("/get_students", async (req, res) => {
  let rows = await database.getStudents();
  return res.json(rows);
});

app.get("/get_students/:department", async (req, res) => {
  let department = req.params.department;
  // console.log(department);
  let rows = await database.getStudentsDepartmentWise(department);
  // console.log(rows);
  return res.json(rows);
});
app.post("/drop_student_table", (req, res) => {
  try {
    database.dropStudentTable();
    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    return res.json({ success: false });
  }
});

app.get("/generate_report", (req, res) => {
  res.render("generate_report");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
