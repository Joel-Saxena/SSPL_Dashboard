-- Employee Base Table
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    middlename VARCHAR(50), -- Optional
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('M', 'F', 'O') NOT NULL,
    aadhaar VARCHAR(12) UNIQUE NOT NULL, -- Now mandatory
    education_qualification VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    date_of_joining DATE NOT NULL,
    
    -- Validations
    CONSTRAINT chk_email_format CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_dob CHECK (dob <= CURDATE()),
    CONSTRAINT chk_aadhaar_format CHECK (aadhaar REGEXP '^[0-9]{12}$')
);

-- Phone Numbers
CREATE TABLE phone_number (
    emp_id INT NOT NULL,
    phone_no VARCHAR(15) NOT NULL,
    PRIMARY KEY (emp_id, phone_no),
    FOREIGN KEY (emp_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT chk_phone_format CHECK (phone_no REGEXP '^[0-9]{10,15}$')
);

-- Address Table (Now all fields required)
CREATE TABLE address (
    emp_id INT PRIMARY KEY,
    street VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    FOREIGN KEY (emp_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT chk_pincode_format CHECK (pincode REGEXP '^[0-9]{5,10}$')
);

-- Administrator Table
CREATE TABLE administrator (
    id INT PRIMARY KEY,
    supervisor_id INT,
    FOREIGN KEY (id) REFERENCES employee(id) ON DELETE CASCADE,
    FOREIGN KEY (supervisor_id) REFERENCES administrator(id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- Scientist Table
CREATE TABLE scientist (
    emp_id INT PRIMARY KEY,
    category ENUM('A', 'B', 'C', 'D') NOT NULL,
    research_area VARCHAR(100) NOT NULL,
    administrator_id INT,
    FOREIGN KEY (emp_id) REFERENCES employee(id) ON DELETE CASCADE,
    FOREIGN KEY (administrator_id) REFERENCES administrator(id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- Salary Records
CREATE TABLE salary (
    emp_id INT NOT NULL,
    effective_from DATE NOT NULL,
    pay_grade VARCHAR(20) NOT NULL,
    basic_salary DECIMAL(10,2) NOT NULL CHECK (basic_salary >= 0),
    allowances DECIMAL(10,2) DEFAULT 0 CHECK (allowances >= 0),
    deductions DECIMAL(10,2) DEFAULT 0 CHECK (deductions >= 0),
    PRIMARY KEY (emp_id, effective_from),
    FOREIGN KEY (emp_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Leave Records
CREATE TABLE leave_record (
    leave_id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT NOT NULL,
    leave_type ENUM('Sick', 'Casual', 'Earned', 'Maternity', 'Paternity', 'Other') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    remarks TEXT,
    FOREIGN KEY (emp_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT chk_leave_date CHECK (end_date >= start_date)
);

-- Document Repository
CREATE TABLE document (
    doc_id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT NOT NULL,
    doc_type VARCHAR(50) NOT NULL,
    upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
    file_path VARCHAR(255) NOT NULL,
    FOREIGN KEY (emp_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Users Table
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    emp_id INT NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'scientist') NOT NULL,
    FOREIGN KEY (emp_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT chk_username_format CHECK (username REGEXP '^[A-Za-z0-9_]{5,}$')
);
