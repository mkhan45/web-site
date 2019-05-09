DROP PROCEDURE IF EXISTS load_cookies;
DELIMITER $$
CREATE PROCEDURE load_cookies (user VARCHAR(100), newdate DATETIME)
BEGIN
DECLARE prev_date DATETIME;
DECLARE date_diff INT;
DECLARE cookie_num INT;
SELECT last_login INTO prev_date FROM students WHERE s_name = user;
UPDATE students SET last_login = newdate WHERE s_name = user;
SELECT TIMEDIFF(newdate, prev_date) INTO date_diff; 
SELECT TIME_TO_SEC(date_diff) INTO date_diff;
SELECT cookies FROM students WHERE s_name=user INTO cookie_num;
SELECT user, cookie_num, date_diff;
END$$
DELIMITER ;