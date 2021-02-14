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
    connection.query('SELECT name FROM department', (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        // connection.end();
    });
};

const viewRoles = () => {
    connection.query('SELECT title FROM role', (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        // connection.end();
    });
};

const viewEmployees = () => {
    connection.query('SELECT first_name, last_name FROM employee', (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        // connection.end();
    });
};

const viewEmployeesByDepartment = () => {
    let query = 'SELECT first_name, last_name, name ';
    query += 'FROM employee INNER JOIN department ON employee.id = department.id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res)
    });
}

const viewEmployeesByRole = () => {
    let query = 'SELECT first_name, last_name, title ';
    query += 'FROM employee INNER JOIN role ON employee.role_id = role.id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res)
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
            }
        );
    }
    );
};

const updateRole = () => {

    let employeeID;
    let roleID;
    const employeesArray = [];

    connection.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
        if (err) throw err;
        employeesArray.push(res);

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

            switch (answer) {
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

                    break;
                case 'Add new department':
                    addDepartment();
                    break;
                case 'Add new role':

                    break;
                case 'Update employee role':
                    updateRole();
                    break;
                default:
                    break;
            }
        });
};

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    viewEmployeesByRole();
});