/******* Define Zerg units *******/
var Zerg={};
Zerg.Drone=AttackableUnit.extends({
    constructorPlus:function(props){
        this.sound.burrow=new Audio(Game.CDN+'bgm/Zerg.burrow.wav');
        this.sound.unburrow=new Audio(Game.CDN+'bgm/Zerg.unburrow.wav');
        this.direction=7;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Drone",
        imgPos: {
            moving: {
                left: [
                    [36,36,36],[164,164,164],
                    [292,292,292],[420,420,420],
                    [548,548,548],[676,676,676],
                    [804,804,804],[932,932,932],
                    [1060,1060,1060],[1316,1316,1316],
                    [1444,1444,1444],[1572,1572,1572],
                    [1700,1700,1700],[1828,1828,1828],
                    [1956,1956,1956],[2084,2084,2084]
                ],
                top: [
                    [36,164,292],[36,164,292],
                    [36,164,292],[36,164,292],
                    [36,164,292],[36,164,292],
                    [36,164,292],[36,164,292],
                    [36,164,292],[36,164,292],
                    [36,164,292],[36,164,292],
                    [36,164,292],[36,164,292],
                    [36,164,292],[36,164,292]
                ]
            },
            attack: {
                left: [
                    [36,36,36,36,36,36,36],[164,164,164,164,164,164,164],
                    [292,292,292,292,292,292,292],[420,420,420,420,420,420,420],
                    [548,548,548,548,548,548,548],[676,676,676,676,676,676,676],
                    [804,804,804,804,804,804,804],[932,932,932,932,932,932,932],
                    [1060,1060,1060,1060,1060,1060,1060],[1316,1316,1316,1316,1316,1316,1316],
                    [1444,1444,1444,1444,1444,1444,1444],[1572,1572,1572,1572,1572,1572,1572],
                    [1700,1700,1700,1700,1700,1700,1700],[1828,1828,1828,1828,1828,1828,1828],
                    [1956,1956,1956,1956,1956,1956,1956],[2084,2084,2084,2084,2084,2084,2084]
                ],
                top: [
                    [420,548,676,804,932,1060,1188],[420,548,676,804,932,1060,1188],
                    [420,548,676,804,932,1060,1188],[420,548,676,804,932,1060,1188],
                    [420,548,676,804,932,1060,1188],[420,548,676,804,932,1060,1188],
                    [420,548,676,804,932,1060,1188],[420,548,676,804,932,1060,1188],
                    [420,548,676,804,932,1060,1188],[420,548,676,804,932,1060,1188],
                    [420,548,676,804,932,1060,1188],[420,548,676,804,932,1060,1188],
                    [420,548,676,804,932,1060,1188],[420,548,676,804,932,1060,1188],
                    [420,548,676,804,932,1060,1188],[420,548,676,804,932,1060,1188]
                ]
            },
            dock: {
                left: [36,164,292,420,548,676,804,932,1060,1316,1444,1572,1700,1828,1956,2084],
                top: [36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36]
            },
            burrow: {
                left: [
                    [1700,-1,1188,1316,1444,1572],[1700,-1,1188,1316,1444,1572],
                    [1700,-1,1188,1316,1444,1572],[1700,-1,1188,1316,1444,1572],
                    [1700,-1,1188,1316,1444,1572],[1700,-1,1188,1316,1444,1572],
                    [1700,-1,1188,1316,1444,1572],[1700,-1,1188,1316,1444,1572],
                    [1700,-1,1188,1316,1444,1572],[1700,-1,1188,1316,1444,1572],
                    [1700,-1,1188,1316,1444,1572],[1700,-1,1188,1316,1444,1572],
                    [1700,-1,1188,1316,1444,1572],[1700,-1,1188,1316,1444,1572],
                    [1700,-1,1188,1316,1444,1572],[1700,-1,1188,1316,1444,1572]
                ],
                top: [
                    [1316,-1,1316,1316,1316,1316],[1316,-1,1316,1316,1316,1316],
                    [1316,-1,1316,1316,1316,1316],[1316,-1,1316,1316,1316,1316],
                    [1316,-1,1316,1316,1316,1316],[1316,-1,1316,1316,1316,1316],
                    [1316,-1,1316,1316,1316,1316],[1316,-1,1316,1316,1316,1316],
                    [1316,-1,1316,1316,1316,1316],[1316,-1,1316,1316,1316,1316],
                    [1316,-1,1316,1316,1316,1316],[1316,-1,1316,1316,1316,1316],
                    [1316,-1,1316,1316,1316,1316],[1316,-1,1316,1316,1316,1316],
                    [1316,-1,1316,1316,1316,1316],[1316,-1,1316,1316,1316,1316]
                ]
            },
            unburrow: {
                left: [
                    [1572,1444,1316,1188,1188,1188],[1572,1444,1316,1188,1188,1188],
                    [1572,1444,1316,1188,1188,1188],[1572,1444,1316,1188,1188,1188],
                    [1572,1444,1316,1188,1188,1188],[1572,1444,1316,1188,1188,1188],
                    [1572,1444,1316,1188,1188,1188],[1572,1444,1316,1188,1188,1188],
                    [1572,1444,1316,1188,1188,1188],[1572,1444,1316,1188,1188,1188],
                    [1572,1444,1316,1188,1188,1188],[1572,1444,1316,1188,1188,1188],
                    [1572,1444,1316,1188,1188,1188],[1572,1444,1316,1188,1188,1188],
                    [1572,1444,1316,1188,1188,1188],[1572,1444,1316,1188,1188,1188]
                ],
                top: [
                    [1316,1316,1316,1316,1316,1316],[1316,1316,1316,1316,1316,1316],
                    [1316,1316,1316,1316,1316,1316],[1316,1316,1316,1316,1316,1316],
                    [1316,1316,1316,1316,1316,1316],[1316,1316,1316,1316,1316,1316],
                    [1316,1316,1316,1316,1316,1316],[1316,1316,1316,1316,1316,1316],
                    [1316,1316,1316,1316,1316,1316],[1316,1316,1316,1316,1316,1316],
                    [1316,1316,1316,1316,1316,1316],[1316,1316,1316,1316,1316,1316],
                    [1316,1316,1316,1316,1316,1316],[1316,1316,1316,1316,1316,1316],
                    [1316,1316,1316,1316,1316,1316],[1316,1316,1316,1316,1316,1316]
                ]
            }
        },
        width: 56,//128N+36
        height: 56,
        frame: {
            moving: 3,
            dock: 1,
            attack:7,
            burrow: 1,
            unburrow: 6
        },
        //Only for moving status, override
        speed:5,
        HP: 40,
        damage: 5,
        armor:0,
        sight:360,
        meleeAttack: true,
        attackInterval: 2200,
        dieEffect:Burst.DroneDeath,
        isFlying:false,
        attackLimit:"ground",
        unitType:Unit.SMALL,
        attackType:AttackableUnit.NORMAL_ATTACK,
        cost:{
            mine:50,
            man:1,
            time:200
        },
        upgrade:['EvolveCarapace'],
        items:{'4':undefined,
            '5':{name:'gather'},
            '7':{name:'BasicMutation'},
            '8':{name:'AdvancedMutation'},
            '9':{name:'Burrow',condition:function(){
                return Magic.Burrow.enabled
            }}
        },
        buildZergBuilding:function(location){
            //Has location callback info or nothing
            if (location){
                //Move toward target to fire Ensnare
                this.targetLock=true;
                var myself=this;
                this.moveTo(location.x,location.y,20,function(){
                    if (Resource.payCreditBill.call(myself)){
                        var target=Building.ZergBuilding[myself.buildName];
                        //Adjust location
                        myself.x=(location.x-myself.width/2)>>0;
                        myself.y=(location.y-myself.height/2)>>0;
                        var mutation=myself.evolveTo({
                            type:eval('Building.'+target.prototype.evolves[0].step),
                            chain:true
                        });
                        mutation.buildName=myself.buildName;
                        //Calculate duration
                        var duration=Resource.getCost(myself.buildName).time;
                        //Cheat: Operation cwal
                        if (Cheat.cwal) duration=40;
                        //Processing flag on transfer
                        mutation.processing={
                            name:mutation.buildName,
                            startTime:Game.mainTick,//new Date().getTime()
                            time:duration
                        };
                        //Evolve chain
                        for (var N=1;N<target.prototype.evolves.length;N++){
                            (function(n){
                                var evolveInfo=target.prototype.evolves[n];
                                Game.commandTimeout(function(){
                                    if (mutation.status!='dead'){
                                        //Evolve
                                        var evolveTarget=(eval('Building.'+evolveInfo.step));
                                        //Step is constructor function
                                        if (evolveTarget){
                                            var old=mutation;
                                            mutation=mutation.evolveTo({
                                                type:evolveTarget,
                                                chain:true
                                            });
                                            mutation.processing=old.processing;
                                            mutation.buildName=old.buildName;
                                        }
                                        //Step is status string
                                        else {
                                            mutation.status=evolveInfo.step;
                                        }
                                    }
                                },duration*100*evolveInfo.percent);
                            })(N);
                        }
                        //Final evolve
                        Game.commandTimeout(function(){
                            if (mutation.status!='dead'){
                                //Evolve
                                mutation.evolveTo({
                                    type:Building.ZergBuilding[mutation.buildName],
                                    burstArr:mutation.evolveEffect
                                });
                            }
                        },duration*100);
                    }
                });
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=arguments.callee;
                Button.callback.farmer=this;
                Button.callback.buildType='ZergBuilding';
                $('div.GameLayer').attr('status','button');
            }
        }
    }
});