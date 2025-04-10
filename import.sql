-- SQL script to import video_games_sales.csv into MySQL database
-- Created on April 9, 2025

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS video_games_db;
USE video_games_db;

-- Drop table if it exists
DROP TABLE IF EXISTS video_games_sales;

-- Create the table with the same structure as the CSV file
CREATE TABLE video_games_sales (
    `Rank` INT,
    `Name` VARCHAR(255),
    `Platform` VARCHAR(50),
    `Year` INT,
    `Genre` VARCHAR(50),
    `Publisher` VARCHAR(100),
    `NA_Sales` DECIMAL(10,2),
    `EU_Sales` DECIMAL(10,2),
    `JP_Sales` DECIMAL(10,2),
    `Other_Sales` DECIMAL(10,2),
    `Global_Sales` DECIMAL(10,2)
);

-- Set up local infile loading
SET GLOBAL local_infile = 1;

-- Load data from CSV file
LOAD DATA LOCAL INFILE '/home/kim/code/sql/project/archive/video_games_sales.csv'
INTO TABLE video_games_sales
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Show the first 10 records to verify the import was successful
SELECT * FROM video_games_sales LIMIT 10;

-- Optional: Create some useful indices for better query performance
CREATE INDEX idx_name ON video_games_sales(`Name`);
CREATE INDEX idx_platform ON video_games_sales(`Platform`);
CREATE INDEX idx_year ON video_games_sales(`Year`);
CREATE INDEX idx_genre ON video_games_sales(`Genre`);
CREATE INDEX idx_publisher ON video_games_sales(`Publisher`);