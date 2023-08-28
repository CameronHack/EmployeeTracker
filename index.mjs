import inquirer from 'inquirer';
import mysql from "mysql2";

// Connect to employee_db database
const db = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'employee_db'
})

// starts the program
runProgram()
async function runProgram() {
    try {
        // initial prompt to navigate this program
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

        // user friendly option to press enter after every path ends returns user to the initial prompt
        async function pressEnterToContinue() {
            await inquirer.prompt([
                {
                type: 'input',
                name: 'continue',
                message: '\x1b[35mPress Enter to continue\x1b[0m',
                },
            ])

            runProgram()
        }
        
        // database table selections used often
        const viewDepartmentTable = `SELECT name, id FROM department;`
        const viewRoleTable = `SELECT title as JobTitle, role.id as RoleID, department.name as DepartmentName, salary FROM role INNER JOIN department ON role.department_id = department.id;`
        const viewEmployeeTable = `SELECT employee.id AS EmployeeID, employee.first_name, employee.last_name, role.title AS JobTitle, department.name AS Department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`

        async function viewDepartments() {
            db.query(viewDepartmentTable, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    console.table(data);
                    pressEnterToContinue()
                }
            })
        }

        async function viewRoles() {
            db.query(viewRoleTable, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    console.table(data);
                    pressEnterToContinue()
                }
            })
        }

        async function viewEmployees() {        
            db.query(viewEmployeeTable, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    console.table(data);
                    pressEnterToContinue()
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

                    // adds a new department based on above inquirer input
                    db.query(`INSERT INTO department (name) VALUES (?);`, [departmentInfo.name], (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            // confirmation that department was added
                            console.log(`\x1b[34mDepartment \x1b[33m'${departmentInfo.name}'\x1b[34m has been added.\x1b[0m`)
                            pressEnterToContinue()
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
                    const departmentChoices = await new Promise((res) => {
                        // grabs list of departments from the department table
                        db.query(viewDepartmentTable, (err, data) => {
                            // converts department data from the above query into a format accepted by inquirer choices
                            res(data.map((data) => ({name: data.name, value: data.id})))
                        })
                    })

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
                            type: 'list',
                            name: 'department_id',
                            message: 'Choose the department for this role:',
                            choices: departmentChoices,
                        }
                    ])

                    // adds a new role based on above inquirer input
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`, [roleInfo.title, roleInfo.salary, roleInfo.department_id], (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            // confirmation that the new role was added
                            console.log(`\x1b[34mRole \x1b[33m'${roleInfo.title}'\x1b[34m has been added.\x1b[0m`)
                            pressEnterToContinue()
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
                    const roleChoices = await new Promise((res) => {
                        // grabs list of roles from the role table
                        db.query(viewRoleTable, (err, data) => {
                            // converts role data from the above query into a format accepted by inquirer choices
                            res(data.map((data) => ({name: data.JobTitle, value: data.RoleID})))
                        })
                    })

                    const managerChoices = await new Promise((res) => {
                        // grabs list of employees from the employee table
                        db.query(viewEmployeeTable, (err, data) => {
                            // converts employee data from the above query into a format accepted by inquirer choices
                            res(data.map((data) => ({name: `${data.first_name} ${data.last_name}`, value: data.EmployeeID})))
                        })
                    })

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
                            type: 'list',
                            name: 'role_id',
                            message: 'Choose the Role for this employee:',
                            choices: roleChoices,
                        },
                        {
                            type: 'list',
                            name: 'manager_id',
                            message: 'Choose the Manager of this employee:',
                            // Create a new option called "None" before all employees to choose to be managers
                            choices: [{name: "None", value: null}, ...managerChoices],
                        }
                    ])

                    // adds a new employee based on above inquirer input
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, [employeeInfo.first_name, employeeInfo.last_name, employeeInfo.role_id, employeeInfo.manager_id], (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            // confirmation that the new employee was added
                            console.log(`\x1b[34mEmployee \x1b[33m'${employeeInfo.first_name}'\x1b[34m has been added.\x1b[0m`)
                            pressEnterToContinue()
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
            async function updateEmployeeRole() {
                try {
                    const employeeChoices = await new Promise((res) => {
                        // grabs list of employees from the employee table
                        db.query(viewEmployeeTable, (err, data) => {
                            // converts employee data from the above query into a format accepted by inquirer choices
                            res(data.map((data) => ({name: `${data.first_name} ${data.last_name}`, value: data.EmployeeID})))
                        })
                    })
                    const roleChoices = await new Promise((res) => {
                        // grabs list of roles from the role table
                        db.query(viewRoleTable, (err, data) => {
                            // converts role data from the above query into a format accepted by inquirer choices
                            res(data.map((data) => ({name: data.JobTitle, value: data.RoleID})))
                        })
                    })

                    let updateRole = await inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'employee_id',
                            message: 'Enter the Employee ID of the person whose Role you want to update:',
                            choices: employeeChoices,
                        },
                        {
                            type: 'list',
                            name: 'role_id',
                            message: 'Enter the new Role ID for this employee:',
                            choices: roleChoices,
                        }
                    ])

                    // updates employees role based on above inquirer input
                    db.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, [updateRole.role_id, updateRole.employee_id], (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            // confirmation that employee has been updated a new role
                            console.log(`\x1b[34mEmployee role has been updated.\x1b[0m`)
                            pressEnterToContinue()
                        }
                    })

                }
                catch (err) {
                    console.log(err)
                }
            }

            updateEmployeeRole()
        }
    } catch (err) {
        console.log(err)
    }
}