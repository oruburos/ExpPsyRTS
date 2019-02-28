<?php

require "common.php";

//error_reporting(E_ALL ^ E_NOTICE);
try 
	{
		
		echo $_GET['prolific']
	}

	catch(Exception $error) 
	{
		echo "Error random" ;
	}
	

?>