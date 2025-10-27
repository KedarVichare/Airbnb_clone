-- Update property availability dates to realistic current dates
-- Sets various properties to have different start dates (today, tomorrow, next week, etc.)
-- and end dates spread over the next 6-12 months

-- Properties 1-10: Available from today for 6 months
UPDATE properties 
SET available_from = CURDATE(),
    available_to = DATE_ADD(CURDATE(), INTERVAL 6 MONTH)
WHERE id BETWEEN 1 AND 10;

-- Properties 11-20: Available from tomorrow for 9 months
UPDATE properties 
SET available_from = DATE_ADD(CURDATE(), INTERVAL 1 DAY),
    available_to = DATE_ADD(CURDATE(), INTERVAL 9 MONTH)
WHERE id BETWEEN 11 AND 20;

-- Properties 21-35: Available from next week for 12 months
UPDATE properties 
SET available_from = DATE_ADD(CURDATE(), INTERVAL 7 DAY),
    available_to = DATE_ADD(CURDATE(), INTERVAL 12 MONTH)
WHERE id BETWEEN 21 AND 35;

-- Properties 36-50: Available from next month for 10 months
UPDATE properties 
SET available_from = DATE_ADD(CURDATE(), INTERVAL 1 MONTH),
    available_to = DATE_ADD(CURDATE(), INTERVAL 10 MONTH)
WHERE id BETWEEN 36 AND 50;

-- Properties 51+ (remaining): Available from today for 8 months
UPDATE properties 
SET available_from = CURDATE(),
    available_to = DATE_ADD(CURDATE(), INTERVAL 8 MONTH)
WHERE id > 50;

-- Delete old bookings that are already completed
DELETE FROM bookings WHERE end_date < CURDATE();

-- Update any future bookings to have realistic future dates (starting 30 days from now)
UPDATE bookings 
SET start_date = DATE_ADD(CURDATE(), INTERVAL 30 DAY),
    end_date = DATE_ADD(CURDATE(), INTERVAL 33 DAY)
WHERE start_date < CURDATE() OR start_date < DATE_ADD(CURDATE(), INTERVAL 1 DAY);

