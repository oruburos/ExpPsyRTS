

<?php



require "config.php";
require "common.php";


try 
	{

$connection = new PDO($dsn, $username, $password, $options);
		
		
		$sql = "UPDATE jsonxparticipant SET 
			 commandsPerformance = :commands ,
             occupancyPerformance = :occupancy,
			 ideal= :ideal,
			 historialResources= :historialResources,
			 predators= :predators 
             WHERE id = :id_participant";

			
			$stmt = $connection->prepare($sql);                                  
  
			$stmt->bindParam(':id_participant', $_POST['participantId'], PDO::PARAM_INT);  
			$stmt->bindParam(':occupancy', $_POST['occupancy'],  PDO::PARAM_LOB ); 	
			$stmt->bindParam(':commands', $_POST['commandsPerformance'],  PDO::PARAM_LOB );
			 	
			$stmt->bindParam(':ideal', $_POST['ideal'], PDO::PARAM_INT); 	
			
			$stmt->bindParam(':historialResources', $_POST['historialResources'],  PDO::PARAM_LOB ); 
			
			$stmt->bindParam(':predators', $_POST['historialPredator'],  PDO::PARAM_LOB ); 
			
			$stmt->execute(); 
		
		echo json_encode($_POST['participantId']);

	}

	catch(PDOException $error) 
	{
		echo $sql . "<br>" . $error->getMessage();
	}
	

?>