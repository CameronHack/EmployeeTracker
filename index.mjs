import inquirer from 'inquirer';
import mysql from "mysql2";

// Connect to database
const db = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'employee_db'
});

try {
    let answers = await inquirer
    .prompt([
        {
            type: 'list',
            name: 'menuChoice',
            message: 'What would you like to do?',
            choices: [
              'View all departments',
              'View all roles',
              'View all employees',
              'Add a department',
              'Add a role',
              'Add an employee',
              'Update an employee role',
            ]
        }
    ])
    
    if (answers.menuChoice === 'View all departments') {
        db.query(`SELECT name, id FROM department;`, function (err, results) {
            console.table(results);
        });
    }

    if (answers.menuChoice === 'View all roles') {
        db.query(`SELECT title as JobTitle, role.id as RoleID, department.name as DepartmentName, salary FROM role INNER JOIN department ON role.department_id = department.id;`, function (err, results) {
            console.table(results);
        });
    }

    if (answers.menuChoice === 'View all employees') {
        db.query(`SELECT employee.id AS EmployeeID, employee.first_name, employee.last_name, role.title AS JobTitle, department.name AS Department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`, function (err, results) {
            console.table(results);
        });
    }

    if (answers.menuChoice === 'Add a department') {

    }

    if (answers.menuChoice === 'Add a role') {

    }

    if (answers.menuChoice === 'Add an employee') {

    }

    if (answers.menuChoice === 'Update an employee role') {

    }

} catch (error) {
    console.log(error)
}
