var Referee={
    ourDetectedUnits:[],//Detected enemies
    enemyDetectedUnits:[],//Detected ours
    timerExperiment:0,
    _pos:[[-1,0],[1,0],[0,-1],[0,1]],//Collision avoid

   tasks:['judgeArbiter','judgeDetect','judgeCollision','judgeRecover','judgeDying','judgeMan',
        ,'coverFog','alterSelectionMode','judgeWinLose','saveReplaySnapshot'],
    voice:(function(){
        var voice;
        return function(name){
            //Single instance pattern
            if (!voice) voice={
                pError:new Audio(Game.CDN+'bgm/PointError.wav'),
                button:new Audio(Game.CDN+'bgm/Button.wav'),
                resource:{
                    Zerg:{
                        mine:new Audio(Game.CDN+'bgm/mine.Zerg.wav'),
                        gas:new Audio(Game.CDN+'bgm/gas.Zerg.wav'),
                        man:new Audio(Game.CDN+'bgm/man.Zerg.wav'),
                        magic:new Audio(Game.CDN+'bgm/magic.Zerg.wav')
                    },
                    Terran:{
                        mine:new Audio(Game.CDN+'bgm/mine.Terran.wav'),
                        gas:new Audio(Game.CDN+'bgm/gas.Terran.wav'),
                        man:new Audio(Game.CDN+'bgm/man.Terran.wav'),
                        magic:new Audio(Game.CDN+'bgm/magic.Terran.wav')
                    },
                    Protoss:{
                        mine:new Audio(Game.CDN+'bgm/mine.Protoss.wav'),
                        gas:new Audio(Game.CDN+'bgm/gas.Protoss.wav'),
                        man:new Audio(Game.CDN+'bgm/man.Protoss.wav'),
                        magic:new Audio(Game.CDN+'bgm/magic.Protoss.wav')
                    }
                },
                upgrade:{
                    Zerg:new Audio(Game.CDN+'bgm/upgrade.Zerg.wav'),
                    Terran:new Audio(Game.CDN+'bgm/upgrade.Terran.wav'),
                    Protoss:new Audio(Game.CDN+'bgm/upgrade.Protoss.wav')
                }
            };
            return voice[name];
        }
    })(),
    winCondition:function(){
        //is not a win condition per se, just to finish the experiment faster if there is no resource left in the level
        //By default: All our units and buildings are killed
       // return (Unit.allEnemyUnits().length==0 && Building.enemyBuildings().length==0);


      // console.log("Game ideal: " + Game.totalResources + " Res Participant " + Game.resources + " Res Competitor " + Game.competitorResources );

       return (Game.resources + Game.competitorResources  == Game.totalResources );
    },
    loseCondition:function(){
        //By default: All enemies and buildings are killed
       // return (Unit.allOurUnits().length==0 && Building.ourBuildings().length==0);
		unidadesVivas = Unit.allOurUnits().length ;
		//console.log("unidades vivas" + unidadesVivas );

        tiempoNegativo  = Game.timerExperiment < 0 ;
//        console.log(" tiempo experimento" + Game.timerExperiment);
        if( tiempoNegativo){ console.log("TIME OVER")}

        return (unidadesVivas==0 || tiempoNegativo);
    },
    judgeArbiter:function(){
        //Every 0.4 sec
        if (Game.mainTick%4==0){
            //Special skill: make nearby units invisible
          //  var arbiterBuffer=Competitor.Arbiter.prototype.bufferObj;
            var allArbiters=Game.getPropArray([]);
            Unit.allUnits.forEach(function(chara){
                if (chara.name=='Arbiter') allArbiters[chara.team].push(chara);
            });
            //Clear old units' Arbiter buffer
            Referee.underArbiterUnits.forEach(function(charas){
                charas.forEach(function(chara){
                    chara.removeBuffer(arbiterBuffer);
                });
            });
            Referee.underArbiterUnits=Game.getPropArray([]);
            allArbiters.forEach(function(arbiters,N){
                //Find new under arbiter units
                arbiters.forEach(function(arbiter){
                    //Find targets: same team units inside Arbiter sight, exclude Arbiter
                    var targets=Game.getInRangeOnes(arbiter.posX(),arbiter.posY(),arbiter.get('sight'),N,true,null,function(chara){
                        return arbiters.indexOf(chara)==-1;
                    });
                    Referee.underArbiterUnits[N]=Referee.underArbiterUnits[N].concat(targets);
                });
                $.unique(Referee.underArbiterUnits[N]);
            });
            //Arbiter buffer effect on these units
            Referee.underArbiterUnits.forEach(function(charas){
                charas.forEach(function(chara){
                    chara.addBuffer(arbiterBuffer);
                });
            });
        }
    },
    //detectorBuffer are reverse of arbiterBuffer
    judgeDetect:function(){
        //Every 0.4 sec
        if (Game.mainTick%4==0){
            //Same detector buffer reference
            var detectorBuffer=Gobj.detectorBuffer;
            var allDetectors=Game.getPropArray([]);
            Unit.allUnits.forEach(function(chara){
                if (chara.detector) allDetectors[chara.team].push(chara);
            });
            //Clear old units detected buffer
            Referee.detectedUnits.forEach(function(charas,team){
                //For each team
                charas.forEach(function(chara){
                    chara.removeBuffer(detectorBuffer[team]);
                });
            });
            Referee.detectedUnits=Game.getPropArray([]);
            allDetectors.forEach(function(detectors,N){
                //Find new under detector units
                detectors.forEach(function(detector){
                    //Find targets: enemy invisible units inside detector sight
                    var targets=Game.getInRangeOnes(detector.posX(),detector.posY(),detector.get('sight'),N+'',true,null,function(chara){
                        return chara['isInvisible'+Game.team];
                    });
                    Referee.detectedUnits[N]=Referee.detectedUnits[N].concat(targets);
                });
                $.unique(Referee.detectedUnits[N]);
            });
            //Detector buffer effect on these units
            Referee.detectedUnits.forEach(function(charas,team){
                //For each team
                charas.forEach(function(chara){
                    chara.addBuffer(detectorBuffer[team]);
                });
            });
            //PurpleEffect, RedEffect and GreenEffect are also detector, override invisible
            Animation.allEffects.filter(function(effect){
                return (effect instanceof Animation.PurpleEffect) ||
                    (effect instanceof Animation.RedEffect) ||
                    (effect instanceof Animation.GreenEffect)
            }).forEach(function(effect){
                var target=effect.target;
                for (var team=0;team<Game.playerNum;team++){
                    //Make already invisible units to visible by all teams
                    if (target['isInvisible'+team]) target['isInvisible'+team]=false;
                }
            });
        }
    },
    judgeReachDestination:function(chara){
        //Idle but has destination
        if (chara.destination && chara.isIdle()) {
            //Already here
            if (chara.insideSquare({centerX:chara.destination.x,centerY:chara.destination.y,radius:Unit.moveRange})) {
                //Has next destination
                if (chara.destination.next) {
                    chara.destination=chara.destination.next;
                    chara.moveTo(chara.destination.x,chara.destination.y);
                    chara.targetLock=false;
                }
                //No more destination
                else {
                    delete chara.destination;
                }
            }
            //Continue moving
            else {
                chara.moveTo(chara.destination.x,chara.destination.y);
                chara.targetLock=false;
            }
        }
    },
    judgeRecover:function(){
        //Every 1 sec
        if (Game.mainTick%10==0){
            Unit.allUnits.concat(Building.allBuildings).forEach(function(chara){
                if (chara.recover) chara.recover();
            });
        }
    },
    judgeDying:function(){
        //Kill die survivor every 1 sec
        if (Game.mainTick%10==0){
            Unit.allUnits.concat(Building.allBuildings).filter(function(chara){
                return chara.life<=0 && chara.status!='dead';
            }).forEach(function(chara){
                chara.die();
            });
        }
    },
    //Avoid collision
    judgeCollision:function(){
        //N*N->N
        var units=Unit.allGroundUnits().concat(Building.allBuildings);
        for(var N=0;N<units.length;N++) {
            var chara1 = units[N];
            for(var M=N+1;M<units.length;M++) {
                var chara2 = units[M];
                var dist=chara1.distanceFrom(chara2);
                //Ground unit collision limit
                var distLimit;
                if (chara2 instanceof Unit){
                    distLimit=(chara1.radius()+chara2.radius())*0.5;
                    if (distLimit<Unit.meleeRange) distLimit=Unit.meleeRange;//Math.max
                }
                //Collision with Building
                else{
                    distLimit=(chara1.radius()+chara2.radius())*0.8;
                }
                //Separate override ones
                if (dist==0) {
                    var colPos=Referee._pos[Game.getNextRandom()*4>>0];
                    if (chara1 instanceof Unit){
                        chara1.x+=colPos[0];
                        chara1.y+=colPos[1];
                        dist=1;
                    }
                    else {
                        if (chara2 instanceof Unit){
                            chara2.x+=colPos[0];
                            chara2.y+=colPos[1];
                            dist=1;
                        }
                    }
                }
                if (dist<distLimit) {
                    //Collision flag
                    chara1.collision=chara2;
                    chara2.collision=chara1;
                    //Adjust ratio
                    var K=(distLimit-dist)/dist/2;
                    var adjustX=K*(chara1.x-chara2.x)>>0;
                    var adjustY=K*(chara1.y-chara2.y)>>0;
                    //Adjust location
                    var interactRatio1=0;
                    var interactRatio2=0;
                    if (chara1 instanceof Building){
                        interactRatio1=0;
                        //Building VS Unit
                        if (chara2 instanceof Unit) interactRatio2=2;
                        //Building VS Building
                        else interactRatio2=0;
                    }
                    else {
                        //Unit VS Unit
                        if (chara2 instanceof Unit) {
                            if (chara1.status=="moving"){
                                //Move VS Move
                                if (chara2.status=="moving"){
                                    interactRatio1=1;
                                    interactRatio2=1;
                                }
                                //Move VS Dock
                                else {
                                    interactRatio1=2;
                                    interactRatio2=0;
                                }
                            }
                            else {
                                //Dock VS Move
                                if (chara2.status=="moving"){
                                    interactRatio1=0;
                                    interactRatio2=2;
                                }
                                //Dock VS Dock
                                else {
                                    interactRatio1=1;
                                    interactRatio2=1;
                                }
                            }
                        }
                        //Unit VS Building
                        else {
                            interactRatio1=2;
                            interactRatio2=0;
                        }
                    }
                    chara1.x+=interactRatio1*adjustX;
                    chara1.y+=interactRatio1*adjustY;
                    chara2.x-=interactRatio2*adjustX;
                    chara2.y-=interactRatio2*adjustY;
                }
            }
        }
    },
    coverFog:function(){
        //No need to set interval as 1sec
        if (Game.mainTick%5==0) Map.drawFogAndMinimap();//original 10
    },
    alterSelectionMode:function(){
        //GC after some user changes
        $.extend([],Game.allSelected).forEach(function(chara){
            if (chara.status=='dead' || (chara['isInvisible'+Game.team] && chara.isEnemy()))
                Game.allSelected.splice(Game.allSelected.indexOf(chara),1);
        });
        //Alter info UI: Multi selection mode
        if (Game.allSelected.length>1){
            //Need minor refresh or big move
            if (_$.arrayEqual(Game.allSelected,Game._oldAllSelected)){
                //Only refresh
                Game.refreshMultiSelectBox();
            }
            else {
                //Redraw multiSelection div
                Game.drawMultiSelectBox();
                //Record this operation
                Game._oldAllSelected=_$.mixin([],Game.allSelected);
            }
            //Show multiSelection box
            $('div.override').show();
            $('div.override div.multiSelection').show();
        }
        //Alter info UI: Single selection mode
        else {
            $('div.override').hide();
            $('div.override div.multiSelection').hide();
        }
    },
    judgeMan:function(){
        //Update current man and total man for all teams
        //?We may only need to judge our team's man for client consume use
        var curMan=Game.getPropArray(0);
        var totalMan=Game.getPropArray(0);
      //  console.log( " judge man " + curMan[0] + " " + totalMan[0])
        Unit.allUnits.concat(Building.allBuildings).forEach(function(chara){


			if(!chara.isMineral ){ //para que no cuente los minerales

            if ( chara.cost && chara.cost.man) {
            //     console.log("agregandocost  " + chara.name );
                (curMan[chara.team])+=chara.cost.man;}
            if (chara.manPlus) {
           //     console.log("agregando manplus" + chara.name );
                (totalMan[chara.team])+=chara.manPlus;
            }


           /* //Transport
            if (chara.loadedUnits) {
                chara.loadedUnits.forEach(function(passenger){
                    if (passenger.cost && passenger.cost.man) (curMan[passenger.team])+=passenger.cost.man;
                });
            }*/
			}
        });
        for (var N=0;N<Game.playerNum;N++){
            Resource[N].curMan=curMan[N];
            Resource[N].totalMan=totalMan[N];
        }
      //
    },
    judgeWinLose:function(  ){
        //Every 1 sec

      //  console.log(" timer " + Game.timerExperiment + " maint tick " + Game.mainTick )

/*        if(document.hasFocus()){
            console.log("FOCO")
        }else{
            console.log("_______________")
        }
*/
        if(Game.timerExperiment <= - 1 ){
            if (Game.refreshIntervalId) {
                clearInterval(Game.refreshIntervalId);
           //     console.log("limpiando intervalo")
            }
        }
        if (Game.mainTick%10==0){
//            console.log(" Judge win lose " + Game.timerExperiment);
            if (Referee.loseCondition() && Game.leaveEarly === false ){//leaveEarly when predators kill you
             //   console.log("envando lose condition")
              //console.log("guardando gametik: " + Game.mainTick +  " -> participant "+ Game.resources,  "competitor:" + Game.competitorResources);

              Game.historialResources[Game.mainTick] = {
                "participant": Game.resources,  "competitor" : Game.competitorResources
                 }
                Game.leaveEarly = true;
                Game.lose();
            }
            if (Referee.winCondition() && Game.leaveEarly === false ){//leaveEalry when you collect all the resources
                console.log("guardando gametik: " + Game.mainTick +  " -> participant "+ Game.resources,  "competitor:" + Game.competitorResources);
                Game.historialResources[Game.mainTick] = {
                    "participant": Game.resources,  "competitor" : Game.competitorResources
                     }
                     console.log("envando win condition")
                 Game.win();

             }

        }
    },
    saveReplaySnapshot:function(){

    }
};
