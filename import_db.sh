#!/bin/bash

# Script to import database schema and data
echo "Importing database schema and data..."

# Set MySQL credentials - these should match your SQL_LOGIN and SQL_PASSWORD environment variables
MYSQL_USER="admin"
MYSQL_PASSWORD="Teny123!"  # Replace with your actual MySQL password

# Run the import.sql script
mysql -u $MYSQL_USER -p$MYSQL_PASSWORD --local-infile=1 < import.sql

echo "Database import completed."