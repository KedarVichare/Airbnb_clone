-- Update property dates to current dates
-- Set available_from to today and available_to to 1 year from today

UPDATE properties 
SET available_from = CURDATE(),
    available_to = DATE_ADD(CURDATE(), INTERVAL 1 YEAR);

-- Update bookings to future dates (starting tomorrow)
-- Clear old bookings that are in the past
DELETE FROM bookings WHERE end_date < CURDATE();

-- Update any remaining bookings to have realistic future dates
UPDATE bookings 
SET start_date = DATE_ADD(CURDATE(), INTERVAL 7 DAY),
    end_date = DATE_ADD(CURDATE(), INTERVAL 10 DAY)
WHERE start_date < CURDATE();

