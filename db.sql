CREATE TABLE students(id INT, s_name VARCHAR(100), home VARCHAR(100), PRIMARY KEY(id));


INSERT INTO students(id, s_name, home) VALUE (1, 'George', 'VA');
INSERT INTO students(id, s_name, home) VALUE (2, 'John', 'MA');
INSERT INTO students(id, s_name, home) VALUE (3, 'Thom', 'VA');
INSERT INTO students(id, s_name, home) VALUE (4, 'James', 'VA');


SELECT * FROM students;


INSERT INTO students(id, s_name, home ) VALUES (5, "James", "VA") ON DUPLICATE KEY UPDATE id = VALUES(id), s_name = VALUES(s_name), home = VALUES(home);


SELECT * FROM students;


INSERT INTO students(id, s_name, home ) VALUES (5, "James", "VA") ON DUPLICATE KEY UPDATE id = VALUES(id), s_name = VALUES(s_name), home = VALUES(home);


SELECT * FROM students;