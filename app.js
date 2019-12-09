const fs = require('fs');
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const echo = require('node-echo');

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
echo ("                                                                                                                                                                             ");
echo ("                                                                                                                                                                             ");
echo (":::::::::: ::::    ::::  :::::::::  :::        ::::::::  :::   ::: :::::::::: ::::::::::      ::::::::::: :::::::::      :::      ::::::::  :::    ::: :::::::::: :::::::::  ");
echo (":+:        +:+:+: :+:+:+ :+:    :+: :+:       :+:    :+: :+:   :+: :+:        :+:                 :+:     :+:    :+:   :+: :+:   :+:    :+: :+:   :+:  :+:        :+:    :+: ");
echo ("+:+        +:+ +:+:+ +:+ +:+    +:+ +:+       +:+    +:+  +:+ +:+  +:+        +:+                 +:+     +:+    +:+  +:+   +:+  +:+        +:+  +:+   +:+        +:+    +:+ ");
echo ("+#++:++#   +#+  +:+  +#+ +#++:++#+  +#+       +#+    +:+   +#++:   +#++:++#   +#++:++#            +#+     +#++:++#:  +#++:++#++: +#+        +#++:++    +#++:++#   +#++:++#:  ");
echo ("+#+        +#+       +#+ +#+        +#+       +#+    +#+    +#+    +#+        +#+                 +#+     +#+    +#+ +#+     +#+ +#+        +#+  +#+   +#+        +#+    +#+ ");
echo ("#+#        #+#       #+# #+#        #+#       #+#    #+#    #+#    #+#        #+#                 #+#     #+#    #+# #+#     #+# #+#    #+# #+#   #+#  #+#        #+#    #+# ");
echo ("########## ###       ### ###        ########## ########     ###    ########## ##########          ###     ###    ### ###     ###  ########  ###    ### ########## ###    ### ");
echo ("                                                                                                                                                                             ");
echo ("                                                                                                                                                                     ver 1.0 ");
const runSearch = () => {
  inquirer
    .prompt([
    {
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
      ],
      name:"answer"
    }
  ]).then(function(action) {
      switch (action.answer) {
        case "View all employees":
          employeeView();
          break;

        case "View all employees by department":
          departmentView();
          break;

        case "View all employees by Manager":
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

        case "Update Manager":
          employeeManager();
          break;

        case "exit":
          connection.end();
          break;
      }
    });
};

const menu = () => {
  inquirer
  .prompt([
    {
    type: "list",
    name: "options",
    message: "--------------------------------------",
    choices: [
      "Run Again?",
      "         ",
      "Main Menu",
      "Exit"
    ],
    name:"menuResponse"
   }
  ]).then({function(action){
    switch(action.menuResponse) {
      // is this what callback hell is?
      case "Run Again?":
        runSearch(answer);
        break;

      case "         ":
        console.log("");
        break;  
      
      case "Main Menu":
        runSearch();
        break;

      case "Exit":
      connection.end();
      console.log("Thanks for using Employee Tracker, Have a nice day!");
      break;
    }
  }
  })
}

const employeeView = (inputs = []) => {
  inquirer
    .prompt({
      name: "employeeView",
      type: "input",
      message: "Enter Employee last name to begin search"
    })
    .then(function(answer) {
      let query = "SELECT first_name, last_name, id FROM employee WHERE ?";
      connection.query(query, { last_name: answer.employeeView }, function(err,res
      ){
        if(err) throw err;

        for (var i = 0; i < res.length; i++) {
          console.table(
            "First Name: " +
              res[i].first_name +
              " || Last name: " +
              res[i].last_name +
              " || Id: " +
              res[i].id
          );
        }
        menu();
      });
    });
}
const departmentView = () => {
  let query = "SELECT dept_name FROM department";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].name);
    }
    runSearch();
  });
}
const managerView = () => {
  let query =
    "SELECT id, first_name, last_name FROM employee WHERE id IN (SELECT mgr_id FROM employee WHERE mgr_id IS NOT NULL)";
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