Mineral=AttackableUnit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        this.sound={
            normal:new Audio(Game.CDN+'bgm/sonido1.wav'),
        };
        this.sound.selected=this.sound.normal;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Mineral",
        descriptionUI:"Resources",
		source:"Mineral",
		isMineral:true,
        imgPos: {
            moving: {
                left: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                top: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            },
            attack: {
                left: [
                    [0, 0 , 0 , 0 ,0 ],[0, 0 , 0 , 0 ,0 ],
                    [0, 0 , 0 , 0 ,0 ],[0, 0 , 0 , 0 ,0 ],
                    [0, 0 , 0 , 0 ,0 ],[0, 0 , 0 , 0 ,0 ],
                    [0, 0 , 0 , 0 ,0 ],[0, 0 , 0 , 0 ,0 ],
                    [0, 0 , 0 , 0 ,0 ],[0, 0 , 0 , 0 ,0 ],
                   [0, 0 , 0 , 0 ,0 ],[0, 0 , 0 , 0 ,0 ],
                    [0, 0 , 0 , 0 ,0 ],[0, 0 , 0 , 0 ,0 ],
                    [0, 0 , 0 , 0 ,0 ],[0, 0 , 0 , 0 ,0 ]
                ],
                top: [
                      [0, 0 , 0 , 0 ,0 ],[0, 0 , 0 , 0 ,0 ],
                    [0, 0 , 0 , 0 ,0 ],[0, 0 , 0 , 0 ,0 ],
                    [0, 0 , 0 , 0 ,0 ],[0, 0 , 0 , 0 ,0 ],
                    [0, 0 , 0 , 0 ,0 ],[0, 0 , 0 , 0 ,0 ],
                    [0, 0 , 0 , 0 ,0 ],[0, 0 , 0 , 0 ,0 ],
                   [0, 0 , 0 , 0 ,0 ],[0, 0 , 0 , 0 ,0 ],
                    [0, 0 , 0 , 0 ,0 ],[0, 0 , 0 , 0 ,0 ],
                    [0, 0 , 0 , 0 ,0 ],[0, 0 , 0 , 0 ,0 ]
                ]
            }
        },
        width: 48,//72N+5
        height: 48,//72N+5
        frame: {
            moving: 1,
            attack:1
        },
        //Only for moving status, override
        speed:0,

        resources:  Math.floor((Math.random() * 10) + 1),
        HP: this.resources,
        armor:0,
        sight:0,
        meleeAttack: false,
        attackInterval: 222200,
        dieEffect:Burst.FireSparkSound,
        isFlying:false,
		isForaging:false,
        attackLimit:"ground",
        unitType:Unit.SMALL,
        attackType:AttackableUnit.NORMAL_ATTACK,
        recover:Building.TerranBuilding.prototype.recover,
        cost:{
            mine:50,
            man:1,
            time:200
        },


		forageLocation:function( location ){

			if ( location ){
			 //Move toward target to fire Ensnare
                this.targetLock=true;
                var myself=this;
                this.moveTo(location.x,location.y,40,function(){
                    if (Resource.payCreditBill.call(myself)){
                        var target=Building.TerranBuilding[myself.buildName];
                        var construction=new (eval('Building.'+target.prototype.evolves[0].step))
                            ({x:location.x-target.prototype.width/2,y:location.y-target.prototype.height/2,team:myself.team});
                        construction.buildName=myself.buildName;
                        //Calculate duration
                        var duration=Resource.getCost(myself.buildName).time;

                        //Processing flag on transfer
                        construction.processing={
                            name:construction.buildName,
                            startTime:Game.mainTick,//new Date().getTime()
                            time:duration
                        };
                        //Evolve chain
                        for (var N=1;N<target.prototype.evolves.length;N++){
                            (function(n){
                                var evolveInfo=target.prototype.evolves[n];
                                Game.commandTimeout(function(){
                                    if (construction.status!='dead'){
                                        //Evolve
                                        var evolveTarget=(eval('Building.'+evolveInfo.step));
                                        //Step is constructor function
                                        if (evolveTarget){
                                            var old=construction;
                                            construction=construction.evolveTo({
                                                type:evolveTarget,
                                                mixin:(evolveTarget.prototype.name=='ConstructionSkeleton')?{type:construction.buildName}:null,
                                                chain:true
                                            });
                                            construction.processing=old.processing;
                                            construction.buildName=old.buildName;
                                        }
                                        //Step is status string
                                        else {
                                            construction.status=evolveInfo.step;
                                        }
                                    }
                                },duration*100*evolveInfo.percent);
                            })(N);
                        }

                    }
                });
            }
		},

        buildTerranBuilding:function(location){
            //Has location callback info or nothing
            if (location){
                //Move toward target to fire Ensnare
                this.targetLock=true;
                var myself=this;
                this.moveTo(location.x,location.y,40,function(){
                    if (Resource.payCreditBill.call(myself)){
                        var target=Building.TerranBuilding[myself.buildName];
                        var construction=new (eval('Building.'+target.prototype.evolves[0].step))
                            ({x:location.x-target.prototype.width/2,y:location.y-target.prototype.height/2,team:myself.team});
                        construction.buildName=myself.buildName;
                        //Calculate duration
                        var duration=Resource.getCost(myself.buildName).time;
                        //Cheat: Operation cwal
                        if (Cheat.cwal) duration=40;
                        //Processing flag on transfer
                        construction.processing={
                            name:construction.buildName,
                            startTime:Game.mainTick,//new Date().getTime()
                            time:duration
                        };
                        //Evolve chain
                        for (var N=1;N<target.prototype.evolves.length;N++){
                            (function(n){
                                var evolveInfo=target.prototype.evolves[n];
                                Game.commandTimeout(function(){
                                    if (construction.status!='dead'){
                                        //Evolve
                                        var evolveTarget=(eval('Building.'+evolveInfo.step));
                                        //Step is constructor function
                                        if (evolveTarget){
                                            var old=construction;
                                            construction=construction.evolveTo({
                                                type:evolveTarget,
                                                mixin:(evolveTarget.prototype.name=='ConstructionSkeleton')?{type:construction.buildName}:null,
                                                chain:true
                                            });
                                            construction.processing=old.processing;
                                            construction.buildName=old.buildName;
                                        }
                                        //Step is status string
                                        else {
                                            construction.status=evolveInfo.step;
                                        }
                                    }
                                },duration*100*evolveInfo.percent);
                            })(N);
                        }
                        //Final evolve
                        Game.commandTimeout(function(){
                            if (construction.status!='dead'){
                                //Evolve
                                construction.evolveTo({type:Building.TerranBuilding[construction.buildName]});
                            }
                        },duration*100);
                    }
                });
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=arguments.callee;
                Button.callback.farmer=this;
                Button.callback.buildType='TerranBuilding';
                $('div.GameLayer').attr('status','button');
            }
        }
    }
});
