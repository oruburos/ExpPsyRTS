<?php

require "config.php";
require "common.php";


try 
	{
		$connection = new PDO($dsn, $username, $password, $options);
	
		$sql = "SELECT count(*) as total FROM `usersprolific` WHERE completed<> 0";
		
	
		
		
		 foreach ($connection->query($sql) as $row) {
      //  echo $row['total'] . "\t";
			echo json_encode($row['total']);
		 }
		
	}

	catch(PDOException $error) 
	{
		echo $sql . "<br>" . $error->getMessage();
	}
	

?>