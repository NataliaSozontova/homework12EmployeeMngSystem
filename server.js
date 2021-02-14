const mysql = require('mysql');
const inquirer = require("inquirer");
const cTable = require('console.table');


// console.table([
//   {
//     name: 'foo',
//     age: 10
//   }, {
//     name: 'bar',
//     age: 20
//   }
// ]);

// // prints
// name  age
// ----  ---
// foo   10
// bar   20

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
        name: 'postOrBid',
        type: 'list',
        message: 'Would you like to [POST] an auction or [BID] on an auction?',
        choices: ['POST', 'BID', 'EXIT'],
      })
      .then((answer) => {
        // based on their answer, either call the bid or the post functions
        if (answer.postOrBid === 'POST') {
          postAuction();
        } else if (answer.postOrBid === 'BID') {
          bidAuction();
        } else {
          connection.end();
        }
      });
  };

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    updateRole();
});