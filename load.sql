DROP PROCEDURE IF EXISTS load_cookies;
DELIMITER $$
CREATE PROCEDURE load_cookies (user VARCHAR(100), newdate DATETIME)
BEGIN
DECLARE prev_date DATETIME;
SELECT last_login INTO prev_date FROM students WHERE s_name = user;
SELECT prev_date;
END$$
DELIMITER ;