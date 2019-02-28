<!doctype html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title>Database test connection</title>

	<link rel="stylesheet" href="css/style.css">
</head>

<body>
<?php

/**
 * Open a connection via PDO to create a
 * new database and table with structure.
 *
 */

require "config.php";

try 
{
	
	$connection = new PDO("mysql:host=$host", $username, $password, $options);
	
	$sql = file_get_contents("init.sql");
	$connection->exec($sql);
	
	echo "Database and table users created successfully.";
}

catch(PDOException $error)
{
	echo $sql . "<br>" . $error->getMessage();
}?>

</body>
</html>
