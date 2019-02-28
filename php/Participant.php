<?php

  class Participant
  {
    var $participantId;
	var $sessionId;
	var $condition;
	var $dbId;
   
   function Participant ()
   {
    $this->participantId = 'initial value for $foo';
	$this->sessionId = 'initial value for $bar'; 
	$this->condition	  = -1;
   }
   
   
   function Participant ( $pid, $sid, $cond )
   {
	$this->participantId = $pid;
	$this->sessionId = $sid; 
	$this->condition =  $cond ;   
	   
   }
   
   function setDBID( $id)
   {
	  $this->dbId = $id; 
	   
   }
   
  }
?>