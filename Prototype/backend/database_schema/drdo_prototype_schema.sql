-- SQL script to create the updated DRDO prototype schema (MySQL)

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    password VARCHAR(255) NOT NULL,
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

CREATE TABLE `group` (
    group_id INT PRIMARY KEY AUTO_INCREMENT,
    group_name VARCHAR(100)
);

CREATE TABLE administrator (
    id INT PRIMARY KEY,
    supervisor_id INT NOT NULL,
    group_id INT,
    FOREIGN KEY (id) REFERENCES employee(id),
    FOREIGN KEY (supervisor_id) REFERENCES administrator(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (group_id) REFERENCES `group`(group_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE scientist (
    emp_id INT PRIMARY KEY,
    category VARCHAR(50),
    research_area VARCHAR(100),
    grade CHAR(1),
    group_id INT,
    FOREIGN KEY (emp_id) REFERENCES employee(id),
    FOREIGN KEY (group_id) REFERENCES `group`(group_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE managed_scientist_grade (
    group_id INT,
    scientist_grade CHAR(1),
    PRIMARY KEY (group_id, scientist_grade),
    FOREIGN KEY (group_id) REFERENCES `group`(group_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE history (
    sci_id INT PRIMARY KEY,
    -- Add additional fields as needed for historical records
    FOREIGN KEY (sci_id) REFERENCES scientist(emp_id)
);
