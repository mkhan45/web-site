CREATE TABLE students(s_name VARCHAR(100), cookies INT, last_login DATETIME, PRIMARY KEY(s_name), FOREIGN KEY (s_name) REFERENCES buildings(s_name));
CREATE TABLE buildings(s_name VARCHAR(100), grandmas INT);

INSERT INTO students(s_name, cookies) VALUE ('2020mkhan', '1000');