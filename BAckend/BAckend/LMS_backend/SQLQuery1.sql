CREATE DATABASE LMS_Database;

USE LMS_Database;

CREATE TABLE Member (
    Id INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(100) NOT NULL,
	   LastName NVARCHAR(100) NOT NULL,
	  Nic INT NOT NULL,
	Email  NVARCHAR(255),
	 PhoneNumber INT NOT NULL,
	 JoinDate date 
	
);