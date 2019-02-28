

<?php



require "config.php";
require "common.php";


try 
	{
		$connection = new PDO($dsn, $username, $password, $options);
		
		$new_user = array(
			"id" => $_POST['participantId'],
			"commandsTraining"  => $_POST['replay2'],
			"occupancyTraining"=> $_POST['historial'],
			"surveyJs"=>$_POST['survey'],
			"historialResourcesTraining"=>$_POST['historialResources'],
			"predatorsTraining"=>$_POST['historialPredator'],
			"idealTutorial"=>$_POST['idealTutorial'],
		);

		$sql = sprintf(
				"INSERT INTO %s (%s) values (%s)",
				"jsonxparticipant",
				implode(", ", array_keys($new_user)),
				":" . implode(", :", array_keys($new_user))
		);
		
		$statement = $connection->prepare($sql);
		
		$statement->execute($new_user);


		echo $sql ;
	}

	catch(PDOException $error) 
	{
		echo $sql . "<br>" . $error->getMessage();
	}
	

?>