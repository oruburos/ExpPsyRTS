/******* Define Human units *******/
var Human={};


Human.Civilian=Unit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;


         this.sound={
            normal:new Audio(Game.CDN+'bgm/sonido3.wav'),
             death:new Audio(Game.CDN+'bgm/sonido4.wav'),
        };
        this.sound.selected=this.sound.normal;
        this.sound.death = this.sound.death;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Civilian",
        imgPos: {
            moving: {
                left: [
                    [11,11,11,11,11,11,11,11],[35,35,35,35,35,35,35,35],
                    [60,60,60,60,60,60,60,60],[84,84,84,84,84,84,84,84],
                    [108,108,108,108,108,108,108,108],[131,131,131,131,131,131,131,131],
                    [154,154,154,154,154,154,154,154],[177,177,177,177,177,177,177,177],
                    [200,200,200,200,200,200,200,200],[224,224,224,224,224,224,224,224],
                    [248,248,248,248,248,248,248,248],[272,272,272,272,272,272,272,272],
                    [293,293,293,293,293,293,293,293],[317,317,317,317,317,317,317,317],
                    [342,342,342,342,342,342,342,342],[366,366,366,366,366,366,366,366]
                ],
                top: [
                    [246,0,37,70,105,142,176,211],[246,0,37,70,105,142,176,211],
                    [246,0,37,70,105,142,176,211],[246,0,37,70,105,142,176,211],
                    [246,0,37,70,105,142,176,211],[246,0,37,70,105,142,176,211],
                    [246,0,37,70,105,142,176,211],[246,0,37,70,105,142,176,211],
                    [246,0,37,70,105,142,176,211],[246,0,37,70,105,142,176,211],
                    [246,0,37,70,105,142,176,211],[246,0,37,70,105,142,176,211],
                    [246,0,37,70,105,142,176,211],[246,0,37,70,105,142,176,211],
                    [246,0,37,70,105,142,176,211],[246,0,37,70,105,142,176,211]
                ]
            }
        },
        width: 21,
        height: 31,
		
		cost:{
            mine:50,
            man:1,
            time:200
        },
		
        frame: {
            moving: 8,
            dock: 1
        },
        //Only for moving status, override
        speed:15,
        HP: 10,
        armor:0,
		
		foraging:false,
		carryingResources: false,
		lockResources:false,
		
		
        sight:240,
        dieEffect:Burst.HumanDeath,
        isFlying:false,
        unitType:Unit.SMALL,
        recover:Building.TerranBuilding.prototype.recover,
        upgrade:['UpgradeInfantryArmors'],
        //Override
        dock:function(){
            //Use the same behavior
            Unit.turnAround.call(this);
        }
		,
		
		
		
		forageLocation:function( mineral , location ){
		
			if(!mineral){
				console.log("Lo destruyeron antes");
				return;
			}
		
		
			if ( location ){
				
				//console.log("forage Location " + location.x + " id chingadera " + this.id )

			 
                this.targetLock=true;
                var myself=this;
			
                this.moveTo(location.x,location.y,40,function(){
              //          console.log("llegue");
						
							
			if (!myself.carryingResources ){//terranos
				if(!mineral.lockResources){
					mineral.lockResources = true;
                if ( mineral.resources > 0 ){
				//	console.log("es mineral con recursos "+ mineral.resources ) ;
				
					myself.carryingResources = true;
					
					if (mineral.resources > Game.capacidadCarga){
						myself.resources = Game.capacidadCarga;
						mineral.resources = mineral.resources - Game.capacidadCarga;
					}else{
						
						myself.resources = mineral.resources;
						mineral.die();
						mineral = {};
						
					}
											
                }
					mineral.lockResources = false;
                }else{// console.log("alguien llego priemro")
                ;}
			}else{
				
				//console.log("sigo acarreando cosas, no puedo acarrear")
			}
						
                });
            
			}else{
				
				console.log(" que pedo");
			}
		},
		
		saveMinerals:function(  location ){
		
			if ( location ){
				 var myself=this;
             //   console.log("command center  Location " + location.x + " " + location.y + " trabajador  " + id );
                this.moveTo(location.x,location.y,60,function(){
                       							
			if (myself.carryingResources ){
					//console.log("deposito  con recursos "+ Game.resources ) ;
                    Game.resources = Game.resources + myself.resources;
                    
			//console.log("resources " +Game.resources);
					myself.carryingResources = false;
			}else {
				//console.log("no traigo cosas" + myself.id)
			}
						
                });
            
			}
		}
		
		
		
		
		
		
    }
});