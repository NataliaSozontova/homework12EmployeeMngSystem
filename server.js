const mysql = require('mysql');
const inquirer = require("inquirer");
const cTable = require('console.table');

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: 'root',
    // Your password
    password: 'password',
    database: 'employees_db',
});

const viewDepartment = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        startApp();
    });
};

const viewRoles = () => {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        startApp();
    });
};

const viewEmployees = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        startApp();
    });
};

const viewEmployeesByDepartment = () => {
    let query = 'SELECT first_name, last_name, name ';
    query += 'FROM employee INNER JOIN department ON employee.id = department.id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

const viewEmployeesByRole = () => {
    let query = 'SELECT first_name, last_name, title ';
    query += 'FROM employee INNER JOIN role ON employee.role_id = role.id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

const addDepartment = () => {
    console.log('Inserting a new department...\n');

    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is new department name?',
        },
    ]).then(answers => {
        const query = connection.query(
            'INSERT INTO department SET ?',
            {
                name: answers.name
            },
            (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} department inserted!\n`);
                startApp();
            }
        );
    }
    );
};

const addNewRole = () => {
    console.log('Inserting a new role...\n');
    let departmentId;

    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'What is new role would you like to add?',
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'What is the salary amount for this new role?',
            },
            {
                type: "list",
                name: 'roleDepartment',
                message: 'Which department you would like to add a new role?',
                choices() {
                    const choiceArray = [];
                    res.forEach(({ id, name }) => {
                        choiceArray.push(name);
                    });

                    return choiceArray;
                },
            },
        ]).then(answers => {
            res.forEach((departmentName) => {
                if (departmentName.name === answers.roleDepartment) {
                    departmentId = departmentName.id;
                }
            });
            const query = connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answers.roleTitle,
                    salary: answers.roleSalary,
                    department_id: departmentId
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} role inserted!\n`);
                    startApp();
                }
            );
        }
        );
    });
}

const addNewEmployee = () => {
    console.log('Inserting a new employee...\n');
    let roleId;

    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is a new employee first name?',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is a new employee last name?',
            },
            {
                type: "list",
                name: 'role',
                message: 'What is a new employee role?',
                choices() {
                    const choiceArray = [];
                    res.forEach(({ title }) => {
                        choiceArray.push(title);
                    });

                    return choiceArray;
                },
            },
        ]).then(answers => {
            res.forEach((role) => {
                if (role.title === answers.role) {
                    roleId = role.id;
                }
            });
            const query = connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answers.firstName,
                    last_name: answers.lastName,
                   role_id: roleId
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} employee inserted!\n`);
                    startApp();
                }
            );
        }
        );
    });
}

const updateRole = () => {
    let employeeID;
    let roleID;

    connection.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "list",
                name: "choice",
                choices() {
                    const choiceArray = [];
                    res.forEach(({ first_name, last_name }) => {
                        choiceArray.push(first_name + " " + last_name);
                    });
                    return choiceArray;
                },
                message: 'Which employee role would you like to change?',
            },
        ]).then(answer => {
            res.forEach((employee) => {
                if (employee.last_name === answer.choice.split(" ")[1]) {
                    employeeID = employee.id;
                }
            });

            connection.query('SELECT id, title FROM role', (err, res) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        type: "list",
                        name: "choiceRole",
                        choices() {
                            const choiceArray = [];
                            res.forEach(({ title }) => {
                                choiceArray.push(title);
                            });
                            return choiceArray;
                        },
                        message: 'What is new role you would like to assign to the employee?',
                    },
                ])
                    .then((answer) => {
                        res.forEach((role) => {
                            if (role.title === answer.choiceRole) {
                                roleID = role.id;
                            }
                        });

                        connection.query('UPDATE employee SET ? WHERE ?',
                            [{ role_id: roleID },
                            { id: employeeID }],
                            (err) => {
                                if (err) throw err;
                                startApp();
                            }
                        );
                    });
            });
        });
    });
};

const startApp = () => {
    inquirer
        .prompt({
            name: 'option',
            type: 'list',
            message: 'What Would you like to do?',
            choices: ['View all employees', 'View all departments', 'View all roles',
                'View employees by departments', 'View employees by roles',
                'Add new employee', 'Add new department', 'Add new role',
                'Update employee role',
                'EXIT'],
        })
        .then((answer) => {
            // based on their answer call matching functions

            switch (answer.option) {
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'View all departments':
                    viewDepartment();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View employees by departments':
                    viewEmployeesByDepartment();
                    break;
                case 'View employees by roles':
                    viewEmployeesByRole();
                    break;
                case 'Add new employee':
                    addNewEmployee();
                    break;
                case 'Add new department':
                    addDepartment();
                    break;
                case 'Add new role':
                    addNewRole();
                    break;
                case 'Update employee role':
                    updateRole();
                    break;
                default:
                    connection.end();
                    break;
            }
        });
};

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    startApp();
});