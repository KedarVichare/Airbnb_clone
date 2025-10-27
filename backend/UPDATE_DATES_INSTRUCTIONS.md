# Update Database Dates - Instructions

I've created a SQL script to update all property availability dates to current realistic dates.

## What This Does

The script (`update_dates_realistic.sql`) will:
1. Update all property `available_from` dates to today or near-future dates
2. Set `available_to` dates to 6-12 months in the future
3. Delete completed bookings (past dates)
4. Update any remaining bookings to have realistic future dates

## How to Run

### Option 1: Using MySQL Command Line
```bash
cd backend
mysql -u root -p airbnb_db < update_dates_realistic.sql
```

### Option 2: Using MySQL Workbench or phpMyAdmin
1. Open MySQL Workbench or phpMyAdmin
2. Connect to your `airbnb_db` database
3. Open the file `backend/update_dates_realistic.sql`
4. Execute the SQL script

### Option 3: Copy and paste in MySQL client
Open the `update_dates_realistic.sql` file and copy-paste the contents into your MySQL client.

## Expected Results

After running this script:
- All properties will have availability dates starting from today or later
- No properties will have past dates
- The booking modal will correctly show dates starting from tomorrow
- The search functionality will work with current dates

## Verify Changes

After running the script, you can verify the changes:

```sql
-- Check properties with dates
SELECT id, title, available_from, available_to 
FROM properties 
ORDER BY available_from 
LIMIT 10;

-- Check all dates are in the future
SELECT COUNT(*) as properties_with_past_dates
FROM properties 
WHERE available_from < CURDATE();
-- This should return 0
```

