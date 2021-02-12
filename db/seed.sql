
INSERT INTO department (name)
VALUES ("IT"), ("HR"), ("Engineering"), ("QA");

INSERT INTO role (title, salary, department_id)
VALUES ('manager', 150000.00, 1),('system manager', 180000.00, 2),
('data base', 200000.00, 3),('SDET', 120000.00, 4);

INSERT INTO employee (first_name, last_name,role_id, manager_id)
VALUES ('Kate', 'Austen', 1 , NULL), ('John', 'Brown', 2, 1),
('Arthur', 'King', 3, NULL), ('Mike', 'Smith', 4, 2);







