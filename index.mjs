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

    // view tables
    async function viewDepartments() {
        let viewDepartments = `SELECT name, id FROM department;`
    
        db.query(viewDepartments, function (err, data) {
            if (err) {
                console.log(err)
            } else {
                console.table(data);
            }
        })
    }

    async function viewRoles() {
        let viewRoles = `SELECT title as JobTitle, role.id as RoleID, department.name as DepartmentName, salary FROM role INNER JOIN department ON role.department_id = department.id;`
    
        db.query(viewRoles, function (err, data) {
            if (err) {
                console.log(err)
            } else {
                console.table(data);
            }
        });
    }

    async function viewEmployees() {
        let viewEmployees = `SELECT employee.id AS EmployeeID, employee.first_name, employee.last_name, role.title AS JobTitle, department.name AS Department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`
    
        db.query(viewEmployees, function (err, data) {
            if (err) {
                console.log(err)
            } else {
                console.table(data);
            }
        })
    }

    if (answers.menuChoice === 'View all departments') {
        viewDepartments()
    }

    if (answers.menuChoice === 'View all roles') {
        viewRoles()
    }

    if (answers.menuChoice === 'View all employees') {
        viewEmployees()
    }

    if (answers.menuChoice === 'Add a department') {
        async function addDepartment() {
            try {
                let departmentInfo = await inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: 'Enter the name of the department:',
                    }
                ])

                db.query(`INSERT INTO department (name) VALUES (?);`, [departmentInfo.name], function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Department '${departmentInfo.name}' has been added.`);
                    }
                })

            }
            catch (err) {
                console.log(err)
            }
        }

        addDepartment()
    }

    if (answers.menuChoice === 'Add a role') {
        async function addRole() {
            try {
                let roleInfo = await inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: 'Enter the tile of the role:',
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Enter the salary of this role:',
                    },
                    {
                        type: 'input',
                        name: 'department_id',
                        message: 'Enter the department ID that this role belongs to:',
                    }
                ])

                db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`, [roleInfo.title, roleInfo.salary, roleInfo.department_id], function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Role '${roleInfo.title}' has been added.`);
                    }
                })

            }
            catch (err) {
                console.log(err)
            }
        }

        addRole()
    }

    if (answers.menuChoice === 'Add an employee') {
        async function addEmployee() {
            try {
                let employeeInfo = await inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: 'Enter the First Name of the employee:',
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: 'Enter the Last Name of the employee:',
                    },
                    {
                        type: 'input',
                        name: 'role_id',
                        message: 'Enter the Role ID of this employee:',
                    },
                    {
                        type: 'input',
                        name: 'manager_id',
                        message: 'Enter the Manager ID of this employee (leave blank if this person is the manager):',
                    }
                ])

                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, [employeeInfo.first_name, employeeInfo.last_name, employeeInfo.role_id, employeeInfo.manager_id], function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Employee '${employeeInfo.first_name}' has been added.`);
                    }
                })

            }
            catch (err) {
                console.log(err)
            }
        }

        addEmployee()
    }

    if (answers.menuChoice === 'Update an employee role') {

    }

} catch (err) {
    console.log(err)
}
