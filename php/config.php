<?php

/**
 * Configuration for database connection
 *
 */
/*Test*/
$host       = "localhost";
$username   = "root";
$password   = "";

/*PRODUCTION *
$host       = "localhost";
$username   = "root";
$password   = "MolE2XWh3rSS";

*/


$dbname     = "experiment3";
$dsn        = "mysql:host=$host;dbname=$dbname";
$options    = array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
              );

              