
-- SQL script to create the DRDO prototype database schema
-- Target: MySQL

CREATE TABLE employee (
    id INT PRIMARY KEY,
    firstname VARCHAR(50),
    middlename VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(100),
    gender CHAR(1),
    salary DECIMAL(12,2),
    aadhaar VARCHAR(12) UNIQUE,
    education_qualification VARCHAR(100)
);

CREATE TABLE phone_number (
    emp_id INT,
    phone_no VARCHAR(15),
    PRIMARY KEY (emp_id, phone_no),
    FOREIGN KEY (emp_id) REFERENCES employee(id)
);

CREATE TABLE administrator (
    id INT PRIMARY KEY,
    supervisor_id INT,
    FOREIGN KEY (id) REFERENCES employee(id),
    FOREIGN KEY (supervisor_id) REFERENCES administrator(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE scientist (
    emp_id INT PRIMARY KEY,
    category VARCHAR(50),
    research_area VARCHAR(100),
    administrator_id INT,
    FOREIGN KEY (emp_id) REFERENCES employee(id),
    FOREIGN KEY (administrator_id) REFERENCES administrator(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
