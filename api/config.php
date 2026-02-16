<?php
/**
 * Database Configuration
 * Connection settings for registration database
 */

// Local development database (students, etc.)
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'temp_data');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Production registration database credentials
define('REG_DB_HOST', 'srv1423.hstgr.io');
define('REG_DB_NAME', 'u515444634_elfadilaSQL');
define('REG_DB_USER', 'u515444634_elfadilaSQL');
define('REG_DB_PASS', 'nsm0002007@Elfadila');
define('REG_DB_CHARSET', 'utf8mb4');

/**
 * Get PDO Database Connection (for local development)
 */
function getDBConnection()
{
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        throw new Exception("Database connection failed: " . $e->getMessage());
    }
}

/**
 * Get MySQLi Connection for Registration Database
 */
$conn = new mysqli(REG_DB_HOST, REG_DB_USER, REG_DB_PASS, REG_DB_NAME);

if ($conn->connect_error) {
    die(json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $conn->connect_error
    ]));
}

$conn->set_charset(REG_DB_CHARSET);
