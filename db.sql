CREATE TABLE students(s_name VARCHAR(100), cookies INT, last_login DATETIME, PRIMARY KEY(s_name), FOREIGN KEY (s_name) REFERENCES buildings(s_name));
CREATE TABLE buildings(s_name VARCHAR(100), grandmas INT, tractors INT, planets INT);

INSERT INTO students(s_name, cookies) VALUE ('2020mkhan', '0');
INSERT INTO buildings(s_name, grandmas, tractors, planets) VALUE ('2020mkhan', 0, 0, 0);