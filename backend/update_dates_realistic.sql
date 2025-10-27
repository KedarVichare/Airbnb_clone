UPDATE properties 
SET available_from = CURDATE(),
    available_to = DATE_ADD(CURDATE(), INTERVAL 6 MONTH)
WHERE id BETWEEN 1 AND 10;

UPDATE properties 
SET available_from = DATE_ADD(CURDATE(), INTERVAL 1 DAY),
    available_to = DATE_ADD(CURDATE(), INTERVAL 9 MONTH)
WHERE id BETWEEN 11 AND 20;

UPDATE properties 
SET available_from = DATE_ADD(CURDATE(), INTERVAL 7 DAY),
    available_to = DATE_ADD(CURDATE(), INTERVAL 12 MONTH)
WHERE id BETWEEN 21 AND 35;

UPDATE properties 
SET available_from = DATE_ADD(CURDATE(), INTERVAL 1 MONTH),
    available_to = DATE_ADD(CURDATE(), INTERVAL 10 MONTH)
WHERE id BETWEEN 36 AND 50;

UPDATE properties 
SET available_from = CURDATE(),
    available_to = DATE_ADD(CURDATE(), INTERVAL 8 MONTH)
WHERE id > 50;

DELETE FROM bookings WHERE end_date < CURDATE();

UPDATE bookings 
SET start_date = DATE_ADD(CURDATE(), INTERVAL 30 DAY),
    end_date = DATE_ADD(CURDATE(), INTERVAL 33 DAY)
WHERE start_date < CURDATE() OR start_date < DATE_ADD(CURDATE(), INTERVAL 1 DAY);

