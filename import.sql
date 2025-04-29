-- SQL script to import vgchartz-2024.csv into MySQL database
-- Created on April 29, 2025

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS video_games_db;
USE video_games_db;

-- Drop the old table
DROP TABLE IF EXISTS video_games_sales;

-- Drop new table if it exists
DROP TABLE IF EXISTS vgchartz_2024;

-- Create the new table with the structure matching vgchartz-2024.csv
CREATE TABLE vgchartz_2024 (
    `img` VARCHAR(255),
    `title` VARCHAR(255),
    `console` VARCHAR(50),
    `genre` VARCHAR(50),
    `publisher` VARCHAR(100),
    `developer` VARCHAR(100),
    `critic_score` DECIMAL(3,1),
    `total_sales` DECIMAL(10,2),
    `na_sales` DECIMAL(10,2),
    `jp_sales` DECIMAL(10,2),
    `pal_sales` DECIMAL(10,2),
    `other_sales` DECIMAL(10,2),
    `release_date` DATE,
    `last_update` DATE
);

-- Set up local infile loading
SET GLOBAL local_infile = 1;

-- Load data from CSV file
LOAD DATA LOCAL INFILE '/home/kim/code/sql/project/archive/vgchartz-2024.csv'
INTO TABLE vgchartz_2024
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(img, title, console, genre, publisher, developer, critic_score, 
total_sales, na_sales, jp_sales, pal_sales, other_sales, 
@release_date, @last_update)
SET 
release_date = CASE WHEN @release_date = '' THEN NULL ELSE STR_TO_DATE(@release_date, '%Y-%m-%d') END,
last_update = CASE WHEN @last_update = '' THEN NULL ELSE STR_TO_DATE(@last_update, '%Y-%m-%d') END;

-- Show the first 10 records to verify the import was successful
SELECT * FROM vgchartz_2024 LIMIT 10;

-- Create useful indices for better query performance
CREATE INDEX idx_title ON vgchartz_2024(`title`);
CREATE INDEX idx_console ON vgchartz_2024(`console`);
CREATE INDEX idx_genre ON vgchartz_2024(`genre`);
CREATE INDEX idx_publisher ON vgchartz_2024(`publisher`);
CREATE INDEX idx_developer ON vgchartz_2024(`developer`);
CREATE INDEX idx_release_date ON vgchartz_2024(`release_date`);