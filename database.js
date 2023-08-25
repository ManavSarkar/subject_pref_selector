const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydatabase.db");

// create a database for storing students data
const createStudentTable = () => {
  let sql =
    "CREATE  TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, roll TEXT UNIQUE, cgpa TEXT, dept TEXT, pref1 TEXT, pref2 TEXT, pref3 TEXT)";
  db.run(sql, (err) => {
    if (err) {
      throw err;
    }
    console.log("students table created");
  });
};

// create a database for storing elective data
const departmentsTable = () => {
  let sql =
    "CREATE  TABLE IF NOT EXISTS departments (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)";
  db.run(sql, (err) => {
    if (err) {
      throw err;
    }
    console.log("departments table created");
  });
};

// create a database for storing elective data
const createElectiveTable = (deptname) => {
  let sql =
    "CREATE  TABLE IF NOT EXISTS " +
    deptname +
    " (id INTEGER PRIMARY KEY AUTOINCREMENT, elective TEXT, capacityMin INTEGER, capacityMax INTEGER)";
  db.run(sql, (err) => {
    if (err) {
      throw err;
    }
    console.log("elective table created");
  });
  return true;
};

const addDepartment = (deptname) => {
  let sql = "INSERT INTO departments(name) VALUES(?)";
  db.run(sql, [deptname], (err) => {
    if (err) {
      throw err;
    }
    console.log("department added");
  });
};

const addElectives = (deptname, elective, capacityMin, capacityMax) => {
  db.serialize(() => {
    let sql1 =
      "CREATE  TABLE IF NOT EXISTS " +
      deptname +
      " (id INTEGER PRIMARY KEY AUTOINCREMENT, elective TEXT, capacityMin INTEGER, capacityMax INTEGER)";
    db.run(sql1, (err) => {
      if (err) {
        throw err;
      }
      console.log("elective table created");
    });
    let sql =
      "INSERT INTO " +
      deptname +
      "(elective, capacityMin, capacityMax) VALUES(?,?,?)";
    db.run(sql, [elective, capacityMin, capacityMax], (err) => {
      if (err) {
        throw err;
      }
      console.log("elective added");
    });
  });
};

const addStudent = async (name, roll, cgpa, dept, pref1, pref2, pref3) => {
  return await new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO students(name, roll, cgpa, dept, pref1, pref2, pref3) VALUES(?,?,?,?,?,?,?)";
    db.run(sql, [name, roll, cgpa, dept, pref1, pref2, pref3], (err) => {
      if (err) {
        resolve(false);
      }
      resolve(true);
    });
  });
};

const getDepartments = async () => {
  return await new Promise((resolve, reject) => {
    let sql = "SELECT * FROM departments";
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      resolve(rows);
    });
  });
};

const getElectives = async (deptname) => {
  return await new Promise((resolve, reject) => {
    let sql = "SELECT * FROM " + deptname;
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      resolve(rows);
    });
  });
};

const getStudents = async () => {
  return await new Promise((resolve, reject) => {
    let sql = "SELECT * FROM students";
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      resolve(rows);
    });
  });
};

const getStudentsDepartmentWise = async (department) => {
  return await new Promise((resolve, reject) => {
    let sql = "SELECT * FROM students WHERE dept = ?";
    db.all(sql, [department], (err, rows) => {
      if (err) {
        throw err;
      }
      resolve(rows);
    });
  });
};

const dropStudentTable = () => {
  let sql = "DROP TABLE IF EXISTS students";
  db.run(sql, (err) => {
    if (err) {
      throw err;
    }
    console.log("students table dropped");
  });
};

createStudentTable();
departmentsTable();

module.exports = {
  createStudentTable,
  createElectiveTable,
  addStudent,
  addElectives,
  addDepartment,
  getDepartments,
  getElectives,
  getStudents,
  dropStudentTable,
  departmentsTable,
  getStudentsDepartmentWise,
};
