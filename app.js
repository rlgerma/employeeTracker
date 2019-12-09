const fs = require('fs');
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "emptrack_db"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

console.log("-----------EMPLOYEE TRACKER-------------");
const runSearch = () => {
  inquirer
    .prompt({
      type: "list",
      name: "options",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View all employees by department",
        "View all employees by manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View all employees":
          employeeView();
          break;

        case "View all employees by department":
          departmentView();
          break;

        case "View all employees by manager":
          managerView();
          break;

        case "Add Employee":
          employeeAdd();
          break;

        case "Remove Employee":
          employeeRemove();
          break;

        case "Update Employee Role":
          employeeUpdate();
          break;

        case "Update Employee Manager":
          employeeManager();
          break;

        case "exit":
          connection.end();
          break;
      }
    });
};
const employeeView = () => {
  inquirer
    .prompt({
      name: "employeeView",
      type: "input",
      message: "Enter Employee last name to begin search"
    })
    .then(function(answer) {
      let query = "SELECT * first_name, last_name, id FROM employee WHERE ?";
      connection.query(query, { last_name: answer.employeeView }, function(err,res
      ) {
        for (var i = 0; i < res.length; i++) {
          console.log(
            "First Name: " +
              res[i].first_name +
              " || Last name: " +
              res[i].last_name +
              " || Id: " +
              res[i].id
          );
        }
        runSearch();
      });
    });
}
const departmentView = () => {
  let query = "SELECT name FROM department";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].name);
    }
    runSearch();
  });
}
const managerView = () => {
  let query =
    "SELECT id, first_name, last_name FROM Employee WHERE id IN (SELECT manager_id FROM employee WHERE manager_id IS NOT NULL)";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(
        res[i].first_name + " " + res[i].last_name + " || Id: " + res[i].id
      );
    }
    runSearch();
  });
}
const employeeAdd = () => {
  inquirer
    .prompt({
      name: "employeeAdd",
      type: "input",
      message: ["Enter Employee First then Last Name"]
    })

    .then(function(answer) {
      console.log(answer);
      let str = answer.employeeAdd;
      let firstAndLastName = str.split(" ");
      console.log(firstAndLastName);
      let query = "INSERT INTO employee (first_name, last_name) VALUES ?";
      connection.query(query, [[firstAndLastName]], function(err, res) {
        console.log(err);
      });
    });
}
const employeeRemove = () => {
  inquirer
    .prompt({
      name: "employeeRemove",
      type: "input",
      message: "What employee would you like to remove?",
      choices: ["first_name", "last_name"]
    })
    .then(function(answer) {
      let query = "SELECT first_name FROM employee WHERE ?";
      connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log(res[i].employeeAdd);
        }
        runSearch();
      });
    });
}
const employeeUpdate = () => {
  inquirer
    .prompt({
      name: "employeeUpdate",
      type: "input",
      message: "What would you like to update?",
      choices: ["first_name", "last_name", "role_id", "manager_id"]
    })
    .then(function(answer) {
      let query = "SELECT name FROM employee WHERE ?";
      connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log(res[i].department);
        }
        runSearch();
      });
    });
}
const employeeManager = () => {
  inquirer
    .prompt({
      name: "employeeManager",
      type: "input",
      message: "What employee would you like to update the manager for?"
    })
    .then(function(answer) {
      var query = "SELECT manager_id FROM employee WHERE ?";
      connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log(res[i].employee);
        }
        runSearch();
      });
    });
}