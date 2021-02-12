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

    const roles = [];
    const employees = [];
    //create arary - put roles
    //create aray - put employees info
    //selct name/value
    //name => name
    //value => id 

    connection.query('SELECT id, title FROM role', (err, res) => {
        if (err) throw err;
        roles.push(res);
        // Log all results of the SELECT statement
        console.table(res);
        console.log(roles);
        // connection.end();
    });

    connection.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
        if (err) throw err;
        employees.push(res);
        // Log all results of the SELECT statement
        console.table(res);
        console.log(employees);
        // connection.end();


    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            choices() {
                const choiceArray = [];
                res.forEach(({ last_name }) => {
                  choiceArray.push(last_name);
                });
                return choiceArray;
              },
              message: 'Which employee role would you like to change?',
            },
        //  {
        //      type: 'list',
        //      name: 'role',
        //      message: 'What role would u like update?',
        //      choices?
        //         //  arrayRoles
        //  },
    ]).then(answers => {
        const query = connection.query(
            'UPDATE employee SET role_id=? WHERE id=?',
            [
                answers.role,
                answers.employee
            ]

            ,
            (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} employee been updated!\n`);
            }
        );
    }

    );
});
}





connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    updateRole();
});