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
        db.query('SELECT * FROM department', function (err, results) {
            console.log(results);
        });
    }

    if (answers.menuChoice === 'View all roles') {
        db.query('SELECT * FROM role', function (err, results) {
            console.log(results);
        });
    }

    if (answers.menuChoice === 'View all employees') {
        db.query('SELECT * FROM employee', function (err, results) {
            console.log(results);
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
