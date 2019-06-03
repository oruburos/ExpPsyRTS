var keyController={
	shift:false,
    ctrl:false,
    disable:false,
    start:function(){
        //Keyboard settings
        window.onkeydown=function(event){
            //Will not switch page by Ctrl+N,cannot debug
            //event.preventDefault();
            //Sometimes need to disable shortcut key
            if (keyController.disable && event.keyCode!=13) return;
            switch (event.keyCode){

                //Move map
                case 37:
             //   console.log("left arrow");
                    Map.needRefresh="LEFT";
                    break;
                case 38:

            //    console.log("up arrow");
                    Map.needRefresh="TOP";
                    break;
                case 39:

             //       console.log("right arrow");
                    Map.needRefresh="RIGHT";
                    break;
                case 40:
                 //   console.log("down arrow");
                    Map.needRefresh="BOTTOM";
                    break;

                //Press H
                case 72:

					//HeatMap.showInfo();
                    break;

				//Press R
                case 82:
					//console.log("record");
				//	HeatMap.recordInfo();
                    break;
                //Press ENTER

				//Press C
                case 67:
				
				Game.toggleClock = !Game.toggleClock;
					
					console.log(" Toggle df clock "+ Game.toggleClock );
					
					if ( Game.toggleClock ){
						
						$('div.warning_Box').show();
					}else{
						$('div.warning_Box').hide();
					}
                    break;	
            }
        };
        window.onkeyup=function(event){
            switch (event.keyCode){
                //Press SHIFT up
                case 16:
                    keyController.shift=false;
                    break;
                //Press CTRL up
                case 17:
                    keyController.ctrl=false;
                    break;
            }
        };
    }
};