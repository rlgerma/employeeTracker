DROP DATABASE IF EXISTS `emptrack_db`;

CREATE DATABASE emptrack_db;
USE emptrack_db;

CREATE TABLE employee
(
	id int NOT NULL AUTO_INCREMENT,
	first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
	mgr_id INT (30) NULL,
	PRIMARY KEY (id)
);

CREATE TABLE role
( 
    role_id int NOT NULL AUTO_INCREMENT,
	title varchar(255) NOT NULL,
    salary decimal(10, 2) NOT NULL,
    dept_id integer(10) NOT NULL,
    PRIMARY KEY (role_id)
);

CREATE TABLE department
(
	dept_id INTEGER AUTO_INCREMENT NOT NULL,
	dept_name varchar(30) NOT NULL,
    PRIMARY KEY (dept_id)
);