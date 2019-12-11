const fs = require('fs');
const mysql = require('mysql');
const inquirer = require('inquirer');
const ctable = require('console.table');
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
  empTrack();
}); 
// ridiculous amount of code for an app title that under uses use an npm package, which has a sole purpose to display txt art goes here
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
 function empTrack(){
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
      name:"choice"
    }
  ]).then(function(res) {
    console.log(
      res.choice
      );
      switch (res.choice) {
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

        case "Quit":
          connection.end();
          break;
      }
  })
};
// menu function for later development
// function menu(){
//   inquirer
//   .prompt([
//     {
//     type: "list",
//     name: "options",
//     message: "--------------------------------------",
//     choices: [
//       "Main Menu",
//       "         ",
//       "Exit"
//     ],
//     name:"menuResponse"
//    }
//   ]).then({function(res){
//     switch(res.menuResponse) {      
//       case "Main Menu":
//         empTrack();
//         break;
        
//       case "         ":
//         console.log("");
//         break;

//       case "Exit":
//       connection.end();
//       console.log("Thanks for using Employee Tracker, Have a nice day!");
//     }
//   }
//   })
// }

const employeeView = (inputs = []) => {
  inquirer
    .prompt({
      name: "employeeView",
      type: "input",
      message: "Enter Employee last name to begin search"
    })
    .then(function(choice) {
      let query = "SELECT first_name, last_name, id FROM employee WHERE ?";
      connection.query(query, { last_name: choice.employeeView }, function(err,res
      ){
        if(err) throw err;

        for (var i = 0; i < res.length; i++) {
          console.log(
            " | First Name: " + res[i].first_name +
            " | Last name: " + res[i].last_name +
            " | Id: " + res[i].id
          );
        }
      });
      empTrack()
    });
}
const departmentView = (res) => {
  let query = "SELECT dept_name FROM department";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].name);
    }
  });
}
const managerView = (res) => {
  let query = "SELECT mgr_id, first_name, last_name FROM employee WHERE mgr_id IN (SELECT mgr_id FROM employee WHERE mgr_id IS NOT NULL)";
  connection.query(query, function(err, res) {
    
    if(err) throw err;

    for (var i = 0; i < res.length; i++) {
      console.log(
        res[i].first_name + " " + 
        res[i].last_name + " || Id: " + 
        res[i].id
      );
    }
  })
  menu();
}
const employeeAdd = () => {
  inquirer
    .prompt({
      name: "employeeAdd",
      type: "input",
      message: "Enter Employee First then Last Name"
    })

    .then(function(answer) {
      console.log(answer);
      let name = answer.employeeAdd;
      let firstAndLastName = name.split(" ");
      console.log(firstAndLastName);
      let query = "INSERT INTO employee (first_name, last_name) VALUES ?";
      connection.query(query, [[firstAndLastName]], function(err, res) {
        if (err) throw err;
        console.log(err);
      });
      empTrack();
    });
}
const employeeRemove = () => {
  inquirer
    .prompt({
      name: "employeeRemove",
      type: "input",
      message: "What employee would you like to remove?",
    })
    .then(function() {
      console.log(choice)
      let query = "DELETE FROM employee WHERE ?";
      let delId = Number(choice.employeeRemove);
      console.log(delId);
      connection.query(query, { id: delId}, function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
          console.log(res[i].employeeRemove);
        }
        empTrack();
      });
    });
}
const employeeUpdate = () => {
  inquirer
  .prompt({
    name: "employeeUpdate",
    type: "input",
    message: "Enter employee id",
  })
  .then(function (choice) {
    let id = choice.id;

    inquirer
      .prompt({
        name: "roleId",
        type: "input",
        message: "Enter role id",
      })
      .then(function (choice) {
        let empId = choice.empId;

        let query = "UPDATE employee SET role_id=? WHERE id=?";
        connection.query(query, [empId, id], function (err, res) {
          if (err) {
            console.log(err);
          }
          empTrack();
        });
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
    .then(function() {
      let query = "SELECT manager_id FROM employee WHERE ?";
      connection.query(query, function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
          console.log(res[i].employee);
        }
        empTrack();
      });
    });
}