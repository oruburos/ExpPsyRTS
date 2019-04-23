var Button={
    callback:null,
    /***************Functions***************/
    reset:function(){
        Game.changeSelectedTo(Game.selectedUnit);
    },
    refreshButtons:function(){
        Button.equipButtonsFor(Game.selectedUnit);
    },
    //Equip all buttons for unit
    equipButtonsFor:function(chara){
        //Clear all buttons
        $('div.panel_Control button').removeAttr('class').removeAttr('disabled').removeAttr('style').off('click').off('mouseover').off('mouseout').html('').hide();
        //Filter out enemy
        if (chara=={} || (chara.isEnemy && chara.isEnemy())) return;
        //Add button press sound
        $('div.panel_Control button').on('click',function(){
            Referee.voice('button').play();
        });
        //Show buttons
        if (chara instanceof Unit){
            $('button[num="1"]').attr('class','move').show();
            $('button[num="2"]').attr('class','stop').show();
            $('button[num="4"]').attr('class','patrol').show();
            $('button[num="5"]').attr('class','hold').show();
            if (Game.selectedUnit.hold) $('button.hold').css('border-color','red');//Add for hold tag
            //Bind callbacks
            $('button.move').on('click',Button.moveHandler);
            $('button.patrol').on('click',Button.patrolHandler);
            $('button.stop').on('click',function(){
                Button.stopHandler();
            });
            $('button.hold').on('click',function(){
                Button.holdHandler();
            });
        }
      /*  if (chara.attack){
            $('button[num="3"]').attr('class','attack').show();
            $('button.attack').on('click',Button.attackHandler);
        }*/
        //Add items


        /*Borrar*
        if (chara.items){
            for (var N in chara.items){
                if (chara.items[N]!=null) {
                    $('button[num="'+N+'"]').off('click').attr('class',chara.items[N].name).show();
                    if (chara.items[N].condition && !(chara.items[N].condition()))
                        $('button[num="'+N+'"]').attr('disabled',true);
                    else $('button[num="'+N+'"]').removeAttr('disabled');
                    console.log(chara.items[N].name)

                    //Exceptions: need mark numbers on button
                    switch (chara.items[N].name){
                        case 'SpiderMines':
                            $('button[num="'+N+'"]')[0].innerHTML=chara.spiderMines;
                            break;
                        case 'Scarab':
                            $('button[num="'+N+'"]')[0].innerHTML=chara.scarabNum;
                            break;
                        case 'Interceptor':
                            $('button[num="'+N+'"]')[0].innerHTML=chara.continuousAttack.count;
                            break;
                    }
                }
                else {
                    $('button[num="'+N+'"]').removeAttr('class').hide();
                }
            }
            //Bind basic callbacks
            $('button.Cancel').on('click',function(){
                //Reset menu
                Button.refreshButtons();
            });


            //For Human and Competitor units, add InfestedTerran
            [Human,Competitor,{InfestedTerran:Predator.InfestedTerran}].forEach(function(Race){
                var unitTypes=[];
                for (var unitType in Race){
                    unitTypes.push(unitType);
                }//Cannot use for-in bind together
                var exceptions=['Archon','DarkArchon'];
                unitTypes.forEach(function(unitType){
                    //Unit type isn't in exceptions
                    if (exceptions.indexOf(unitType)==-1) {
                        $('button.'+unitType).on('click',function(){
                            //Filter out when occupied
                            if (Game.selectedUnit.processing) return;
                            //Need time
                            if (Resource.getCost(unitType) && Resource.getCost(unitType).time){
                                var owner=Game.selectedUnit;
                                var duration=Resource.getCost(unitType).time;
                                Multiplayer.cmds.push(JSON.stringify({
                                    uids:[owner.id],
                                    type:'unit',
                                    name:unitType,
                                    duration:duration
                                }));
                            }
                        });
                    }
                    //Exception units
                    else {
                        $('button.'+unitType).on('click',function(){
                            //Calculate duration
                            var duration=Resource.getCost(unitType).time;
                            Unit.allUnits.filter(function(chara){
                                return (chara.team==Game.team && chara.selected && chara.name==Game.selectedUnit.name);
                            }).forEach(function(chara){
                                //Filter out when occupied
                                if (chara.processing) return;
                                Multiplayer.cmds.push(JSON.stringify({
                                    uids:[chara.id],
                                    type:'unit',
                                    name:unitType,
                                    duration:duration,
                                    evolve:'archon'
                                }));
                            });
                        });
                    }
                });
            });

            //Building callbacks
            var evolvedBuildings=['Lair','Hive','SunkenColony','SporeColony','GreaterSpire',
                'ComstatStation','NuclearSilo','MachineShop','ControlTower','PhysicsLab','ConvertOps'];
            ['ZergBuilding','TerranBuilding','ProtossBuilding'].forEach(function(BuildType){
                var Build=Building[BuildType];
                var buildNames=[];
                for (var buildName in Build){
                    //Filter out noise
                    if (buildName!='inherited' && buildName!='super' && buildName!='extends'){
                        buildNames.push(buildName);
                    }
                }
                buildNames.forEach(function(buildName){
                    $('button.'+buildName).on('click',function(){
                        //Pay by credit card if not evolved building
                        if (evolvedBuildings.indexOf(buildName)==-1) {
                            Game.selectedUnit.creditBill=Resource.getCost(buildName);
                            //Payment: chara paypal cost
                            if (Resource.paypal.call(Game.selectedUnit,Resource.getCost(buildName))){
                                Game.selectedUnit.buildName=buildName;
                                Game.selectedUnit['build'+BuildType]();
                            }
                        }
                        else {
                            Multiplayer.cmds.push(JSON.stringify({
                                uids:[Game.selectedUnit.id],
                                type:'build',
                                name:buildName,
                                buildType:BuildType
                            }));
                        }
                    });
                });
            });
        }

        *Borrar*/

        //Bind tooltip callbacks
        $('div.panel_Control button').on('mouseover',function(event){
            var _name=this.className;
            $('div.tooltip_Box').css('right',innerWidth-event.clientX).css('bottom',innerHeight-event.clientY).show();
            $('div.tooltip_Box div.itemName')[0].innerHTML=_name;
            var cost=Resource.getCost(_name);
            if (cost) {
                $('div.cost').show();
                ['mine','gas','man','magic'].forEach(function(res){
                    if(cost[res]) {
                        $('div.cost *[class*='+res+']').show();
                        $('div.cost span.'+res+'Num')[0].innerHTML=cost[res];
                    }
                    else $('div.cost *[class*='+res+']').hide();
                });
            }
        });
        $('div.panel_Control button').on('mouseout',function(){
            $('div.tooltip_Box').hide();
            $('div.tooltip_Box div.cost').hide();
            $('div.tooltip_Box div.itemName')[0].innerHTML='';
            ['mine','gas','man','magic'].forEach(function(res){
                $('div.cost span.'+res+'Num')[0].innerHTML='';
            });
        });
    },
    equipButtonsForReplay:function(){
        $('button[num="1"]').attr('class','Play').attr('disabled',true).show();
        $('button[num="2"]').attr('class','Pause').show();
        $('button[num="4"]').attr('class','SpeedUp').show();
        $('button[num="5"]').attr('class','SlowDown').show();
        //Bind callback for replay buttons
        $('button.Play').on('click',Button.playHandler);
        $('button.Pause').on('click',Button.pauseHandler);
        $('button.SpeedUp').on('click',Button.speedUpHandler);
        $('button.SlowDown').on('click',Button.slowDownHandler);
        //Bind tooltip callbacks
        $('div.panel_Control button').on('mouseover',function(event){
            $('div.tooltip_Box').css('right',innerWidth-event.clientX).css('bottom',innerHeight-event.clientY).show();
            $('div.tooltip_Box div.itemName')[0].innerHTML=this.className;
        });
        $('div.panel_Control button').on('mouseout',function(){
            $('div.tooltip_Box').hide();
            $('div.tooltip_Box div.itemName')[0].innerHTML='';
        });
    },


    /***************Handlers***************/
    //Move button
    moveHandler:function(){
        if (Button.callback==null) {
            Button.callback='move';
            $('div.GameLayer').attr('status','button');
        }
        else {
            //Cancel handler
            $('div.GameLayer').removeAttr('status');
            Button.callback=null;
        }
    },
    //Stop button
    stopHandler:function(charas){
        if (charas==null){
            var charas=Unit.allUnits.filter(function(chara){
                return chara.selected && chara.team==Game.team;
            });
            //Buffer pool
            Multiplayer.cmds.push(JSON.stringify({
                uids:Multiplayer.getUIDs(charas),
                type:'stop'
            }));
        }
        else {
            charas.forEach(function(chara){
                if (chara.attack) chara.stopAttack();
                chara.dock();
                //Interrupt old destination routing
                if (chara.destination) {
                    //Break possible dead lock
                    if (chara.destination.next) chara.destination.next=undefined;
                    delete chara.destination;
                }
            });
        }
    },
    //Attack button
    attackHandler:function(){
        if (Button.callback==null) {
            Button.callback='attack';
            $('div.GameLayer').attr('status','button');
        }
        else {
            //Cancel handler
            $('div.GameLayer').removeAttr('status');
            Button.callback=null;
        }
    },
    //Patrol button
    patrolHandler:function(){
        if (Button.callback==null) {
            Button.callback='patrol';
            $('div.GameLayer').attr('status','button');
        }
        else {
            //Cancel handler
            $('div.GameLayer').removeAttr('status');
            Button.callback=null;
        }
    },
    //Hold button
    holdHandler:function(charas){
        //Part A: Before get charas
        if (charas==null){
            var charas=Unit.allUnits.filter(function(chara){
                return chara.selected && chara.team==Game.team;
            });
            //Buffer pool
            Multiplayer.cmds.push(JSON.stringify({
                uids:Multiplayer.getUIDs(charas),
                type:'hold'
            }));
        }
        //Part B: After get charas callback
        else {
            Button.stopHandler(charas);
            //Freeze all units
            charas.forEach(function(chara){
                if (chara.hold){
                    delete chara.AI;
                    delete chara.findNearbyTargets;
                    delete chara.hold;
                    Button.refreshButtons();
                }
                else {
                    if (chara.attack){
                        //Use the same AI as attackable building
                        chara.AI=Building.Attackable.prototypePlus.AI;
                        //Can only find target inside attack range instead of in sight
                        chara.findNearbyTargets=Building.Attackable.prototypePlus.findNearbyTargets;
                    }
                    chara.dock();
                    chara.hold=true;
                    Button.refreshButtons();
                }
            });
        }
    },
    //Replay relative
    playHandler:function(){
        Game.startAnimation();
        $('button.Play').attr('disabled',true);
        $('button.Pause').attr('disabled',false);
    },
    pauseHandler:function(){
        Game.stopAnimation();
        $('button.Pause').attr('disabled',true);
        $('button.Play').attr('disabled',false);
    },
    speedUpHandler:function(){
        if (Game.replayFlag){
            //Can speed up
            if (Game._frameInterval>25) {
                Game._frameInterval/=2;
                //Cannot speed up any more
                if (Game._frameInterval<=25) $('button.SpeedUp').attr('disabled',true);
                //Need play speed refresh after speed up
                Game.stopAnimation();
                Button.playHandler();
            }
            //Enable SlowDown button
            $('button.SlowDown').attr('disabled',false);
        }
    },
    slowDownHandler:function(){
        if (Game.replayFlag){
            //Can slow down
            if (Game._frameInterval<400)  {
                Game._frameInterval*=2;
                //Cannot slow down any more
                if (Game._frameInterval>=400) $('button.SlowDown').attr('disabled',true);
                //Need play speed refresh after slow down
                Game.stopAnimation();
                Button.playHandler();
            }
            //Enable SpeedUp button
            $('button.SpeedUp').attr('disabled',false);
        }
    },
    //Execute callback
    execute:function(event){
        //Finish part II
        switch (Button.callback){
            case 'move':
                mouseController.rightClick(event);
                break;
            case 'attack':
                mouseController.rightClick(event,true,'attack');
                break;
            case 'patrol':
                mouseController.rightClick(event,true,'patrol');
                break;
            default:
                if (typeof(Button.callback)=='function'){
                    //Mouse at (clickX,clickY)
                    var offset=$('#fogCanvas').offset();
                    var clickX=event.pageX-offset.left;
                    var clickY=event.pageY-offset.top;
                    var location={x:clickX+Map.offsetX,y:clickY+Map.offsetY};
                    //Show right click cursor
                    new Burst.RightClickCursor(location);
                    //Call back with location info
                    //Farmer build buildings
                    if (Button.callback.farmer){
                        Multiplayer.cmds.push(JSON.stringify({
                            uids:[Button.callback.farmer.id],
                            type:'build',
                            name:Button.callback.farmer.buildName,
                            buildType:Button.callback.buildType,
                            pos:location
                        }));
                    }
                    //Spell magic
                    else {
                        var magicName='';
                        for (var magic in Magic){
                            if (Magic[magic].spell==Button.callback) magicName=magic;
                        }
                        Multiplayer.cmds.push(JSON.stringify({
                            uids:[Button.callback.owner.id],
                            type:'magic',
                            name:magicName,
                            pos:location,
                            creditBill:Button.callback.owner.creditBill
                        }));
                    }
                }
        }
        $('div.GameLayer').removeAttr('status');
        Button.callback=null;
    }
};