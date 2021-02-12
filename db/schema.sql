-- Drops the employees_db if it already exists --
DROP DATABASE IF EXISTS employees_db;

-- Created the DB "employees_db" (only works on local connections)
CREATE DATABASE employees_db;

-- Use the employees_db for all the rest of the script
USE employees_db;

-- Created the table "department"
CREATE TABLE department (
  id int AUTO_INCREMENT NOT NULL,
  name varchar(30) NOT NULL,
  PRIMARY KEY(id)
);

-- Created the table "role"
CREATE TABLE role (
  id int AUTO_INCREMENT NOT NULL,
  title varchar(30) NOT NULL,
  salary decimal NOT NULL,
  department_id int NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(department_id) references department(id)
);

-- Created the table "employee"
CREATE TABLE employee (
  id int AUTO_INCREMENT NOT NULL,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id int NOT NULL,
  manager_id int, 
  PRIMARY KEY(id),
  FOREIGN KEY(manager_id) references employee(id),
  FOREIGN KEY(role_id) references role(id)
);




