var Building=Gobj.extends({
    constructorPlus:function(props){
        //Add id for building
        this.id=Unit.currentID++;
        this.life=this.get('HP');
        if (this.SP) this.shield=this.get('SP');
        if (this.MP) this.magic=50;
        this.selected=false;
        this.isFlying=false;
        this.injuryAnimations=[];
        // Finish below after fully constructed, postpone
        var myself=this;
        Game.commandTimeout(function(){
            //Add this unit into Game
            Building.allBuildings.push(myself);
            //Show unit
            myself.dock();
        },0);
    },
    prototypePlus:{
        name:"Building",
        armor:0,
        sight:385,
        //Override to support multiple hidden frames
        animeFrame:function(){
            //Animation play
            this.action++;
            //Override Gobj here, building doesn't have direction
            var arrLimit=(this.imgPos[this.status].left instanceof Array)?(this.imgPos[this.status].left.length):1;
            if (this.action==this.frame[this.status] || this.action>=arrLimit) this.action=0;
            //Multiple hidden frames support
            if (this.imgPos[this.status].left[this.action]==-1) this.action=0;
        },
        //Dock means stop moving but keep animation
        dock:function(){
            //Clear old timer
            this.stop();
            //Launch new dock timer
            this.status="dock";
            var myself=this;
            var animateFrame=function(){
                //Only play animation, will not move
                myself.animeFrame();
            };
            this.allFrames['animate']=animateFrame;
        },
        //Cannot move
        moving:function(){
            //Nothing
        },
        //Override for sound effect
        die:function(){
            //Old behavior
            Gobj.prototype.die.call(this);
            this.life=0;
            //Clear all injury animations
            this.injuryAnimations.forEach(function(anime){
                anime.die();
            });
            //If has sound effect
            if (this.sound.death && this.insideScreen()) {
                this.sound.death.play();
            }
        },
        reactionWhenAttackedBy:function(enemy){
            //Cannot fight back or escape
            //Resign and give reward to enemy if has no life before dead
            if (this.life<=0) {
                //If multiple target, only die once and give reward
                if (this.status!="dead") {
                    //Killed by enemy
                    this.die();
                    //Give enemy reward
                    enemy.kill++;
                }
            }
        },
        //Fix bug, for consistent, cause 100% damage on building
        calculateDamageBy:function(enemyObj){
            return (enemyObj instanceof Gobj)?enemyObj.get('damage'):enemyObj;
        },
        //Calculate damage, for consistence
        getDamageBy:function(enemy,percent){
            if (percent==undefined) percent=1;//100% by default
            var damage=0;
            //If has SP and shield remain
            if (this.shield>0) {
                damage=((this.calculateDamageBy(enemy)-this.get('plasma'))*percent)>>0;
                if (damage<1) damage=1;
                this.shield-=damage;
                if (this.shield<0) {
                    //Inherit damage
                    this.life+=(this.shield);
                    this.shield=0;
                }
            }
            else {
                damage=((enemy.get('damage')-this.get('armor'))*percent)>>0;
                if (damage<1) damage=1;
                this.life-=damage;
            }
        },
        //Life status
        lifeStatus:function(){
            var lifeRatio=this.life/this.get('HP');
            return ((lifeRatio>0.7)?"green":(lifeRatio>0.3)?"yellow":"red");
        }
    }
});
//Store all buildings
Building.allBuildings=[];
Building.ourBuildings=function(){
    return Building.allBuildings.filter(function(chara){
        return !(chara.isEnemy());
    });
};
Building.enemyBuildings=function(){
    return Building.allBuildings.filter(function(chara){
        return chara.isEnemy();
    });
};

//Human buildings
Building.TerranBuilding=Building.extends({
    constructorPlus:function(props){
        this.sound={
            normal:new Audio(Game.CDN+'bgm/sonido1.wav'),
        };
        this.sound.selected=this.sound.normal;
    },
    prototypePlus: {
        //Add basic unit info
          name: "TerranBuilding",
        //  name: "ControlBase",
        dieEffect:Burst.TerranBuildingBurst,
        injuryNames:['redFireL','redFireM','redFireR'],
        recover:function(){
            if (this.life<(this.get('HP')/4) && (this instanceof Building)) this.life--;
            if (this.magic!=null && this.magic<this.get('MP')) this.magic+=0.5;
        }
    }
});
//Competitor buildings
Building.ProtossBuilding=Building.extends({
    constructorPlus:function(props){
        this.sound={
            normal:new Audio(Game.CDN+'bgm/sonido1.wav'),
        };
        this.sound.selected=this.sound.normal;
    },
    prototypePlus: {
        //Add basic unit info
        name: "TerranBuilding",
        plasma:0,
        dieEffect:Burst.ProtossBuildingBurst,
        injuryNames:['blueFireL','blueFireM','blueFireR'],
        recover:function(){
            if (this.shield<this.get('SP')) this.shield+=0.5;
            if (this.magic!=null && this.magic<this.get('MP')) this.magic+=0.5;
        }
    }
});
//Attackable interface
Building.Attackable={
    constructorPlus:function(props){
        this.bullet={};
        this.kill=0;
        this.target={};
        //Idle by default
        this.targetLock=false;
        //Can fire by default
        this.coolDown=true;
    },
    prototypePlus: {
        //Add basic unit info
        name:"AttackableBuilding",
        isInAttackRange:AttackableUnit.prototype.isInAttackRange,
        matchAttackLimit:AttackableUnit.prototype.matchAttackLimit,
        attack:function(enemy){
            //Cannot attack invisible unit or unit who mismatch your attack type
            if (enemy['isInvisible'+this.team] || !(this.matchAttackLimit(enemy))) {
                Referee.voice('pError').play();
                this.stopAttack();
                return;
            }
            if (enemy instanceof Gobj && enemy.status!="dead") {
                //Stop old attack and moving
                this.stopAttack();
                this.dock();
                //New attack
                this.target=enemy;
                var myself=this;
                var attackFrame=function(){
                    //If enemy already dead or becomes invisible or we just miss enemy
                    if (enemy.status=="dead" || enemy['isInvisible'+myself.team] || (myself.isMissingTarget && myself.isMissingTarget())) {
                        myself.stopAttack();
                        myself.dock();
                    }
                    else {
                        //Cannot come in until reload cool down, only dock down can finish attack animation
                        if (myself.isReloaded && myself.isReloaded()) {
                            //Load bullet
                            myself.coolDown=false;
                            //Cool down after attack interval
                            Game.commandTimeout(function(){
                                myself.coolDown=true;
                            },myself.get('attackInterval'));
                            //If AOE, init enemies
                            var enemies;
                            if (myself.AOE) {
                                //Get possible targets
                                switch(myself.attackLimit){
                                    case "flying":
                                        enemies=Unit.allUnits.filter(function(chara){
                                            return chara.team!=myself.team && chara.isFlying;
                                        });
                                        break;
                                    case "ground":
                                        var enemyUnits=Unit.allUnits.filter(function(chara){
                                            return chara.team!=myself.team && !(chara.isFlying);
                                        });
                                        var enemyBuildings=Building.allBuildings.filter(function(chara){
                                            return chara.team!=myself.team;
                                        });
                                        enemies=enemyUnits.concat(enemyBuildings);
                                        break;
                                    default:
                                        enemies=(Unit.allUnits.concat(Building.allBuildings)).filter(function(chara){
                                            return chara.team!=myself.team;
                                        });
                                        break;
                                }
                                //Range filter
                                switch (myself.AOE.type) {
                                    case "LINE":
                                        //Calculate inter-points between enemy
                                        var N=Math.ceil(myself.distanceFrom(enemy)/(myself.AOE.radius));
                                        enemies=enemies.filter(function(chara){
                                            for (var n=1;n<=N;n++){
                                                var X=myself.posX()+n*(enemy.posX()-myself.posX())/N;
                                                var Y=myself.posY()+n*(enemy.posY()-myself.posY())/N;
                                                if (chara.insideCircle({centerX:X>>0,centerY:Y>>0,radius:myself.AOE.radius})
                                                    && !chara['isInvisible'+myself.team]) {
                                                    return true;
                                                }
                                            }
                                            return false;
                                        });
                                        break;
                                    case "MULTIPLE":
                                    case "CIRCLE":
                                    //Default type is CIRCLE
                                    default:
                                        enemies=enemies.filter(function(chara){
                                            return chara.insideCircle(
                                                {centerX:enemy.posX(),centerY:enemy.posY(),radius:myself.AOE.radius})
                                                && !chara['isInvisible'+myself.team];
                                        })
                                }
                            }
                            //Show attack animation if has
                            if (myself.imgPos.attack) {
                                myself.action=0;
                                //Change status to show attack frame
                                myself.status="attack";
                                //Will return to dock after attack
                                Game.commandTimeout(function(){
                                    //If still show attack
                                    if (myself.status=="attack") {
                                        myself.status="dock";
                                        myself.action=0;
                                    }
                                },myself.frame.attack*100);//attackAnimation < attackInterval
                            }
                            //If has bullet
                            if (myself.Bullet) {
                                var fireBullet=function(){
                                    //Will shoot multiple bullets in one time
                                    if (myself.continuousAttack) {
                                        myself.bullet=[];
                                        for (var N=0;N<myself.continuousAttack.count;N++){
                                            var bullet=new myself.Bullet({
                                                from:myself,
                                                to:enemy
                                            });
                                            //Reassign bullets location
                                            if (myself.continuousAttack.layout) myself.continuousAttack.layout(bullet,N);
                                            if (myself.continuousAttack.onlyOnce && N!=(myself.continuousAttack.count/2>>0)) {
                                                bullet.noDamage=true;
                                            }
                                            bullet.fire();
                                            myself.bullet.push(bullet);
                                        }
                                    }
                                    else {
                                        if (myself.AOE && myself.AOE.type=="MULTIPLE"){
                                            for (var N=0;N<Math.min(myself.AOE.count,enemies.length);N++){
                                                new myself.Bullet({
                                                    from:myself,
                                                    to:enemies[N]
                                                }).fire();
                                            }
                                        }
                                        else {
                                            //Reload one new bullet
                                            myself.bullet=new myself.Bullet({
                                                from:myself,
                                                to:enemy
                                            });
                                            myself.bullet.fire();
                                        }
                                    }
                                };
                                if (myself.fireDelay) Game.commandTimeout(function(){
                                    fireBullet();
                                },myself.fireDelay);
                                else fireBullet();
                            }
                            //Else will cause damage immediately (melee attack)
                            else {
                                //Cause damage when burst appear, after finish whole melee attack action
                                if (myself.AOE) {
                                    enemies.forEach(function(chara){
                                        chara.getDamageBy(myself);
                                        chara.reactionWhenAttackedBy(myself);
                                    })
                                }
                                else {
                                    //Cause damage after finish whole melee attack action
                                    Game.commandTimeout(function(){
                                        enemy.getDamageBy(myself);
                                        enemy.reactionWhenAttackedBy(myself);
                                    },myself.frame.attack*100);
                                }
                            }
                            //If has attack effect (burst)
                            if (myself.attackEffect) {
                                if (myself.AOE && myself.AOE.hasEffect) {
                                    enemies.forEach(function(chara){
                                        new myself.attackEffect({x:chara.posX(),y:chara.posY()});
                                    })
                                }
                                else {
                                    new myself.attackEffect({x:enemy.posX(),y:enemy.posY()});
                                }
                            }
                            //Sound effect, missile attack unit will play sound when bullet fire
                            if (!myself.Bullet && myself.insideScreen()) myself.sound.attack.play();
                        }
                    }
                };
                this.allFrames['attack']=attackFrame;
            }
        },
        stopAttack:AttackableUnit.prototype.stopAttack,
        findNearbyTargets:function(){
            //Initial
            var myself=this;
            var units=Unit.allUnits.filter(function(chara){
                return chara.team!=myself.team;
            });
            var buildings=Building.allBuildings.filter(function(chara){
                return chara.team!=myself.team;
            });
            var results=[];
            var myX=myself.posX();
            var myY=myself.posY();
            [units,buildings].forEach(function(charas){
                charas=charas.filter(function(chara){
                    return !chara['isInvisible'+myself.team] && myself.isInAttackRange(chara) && myself.matchAttackLimit(chara);
                }).sort(function(chara1,chara2){
                    var X1=chara1.posX(),Y1=chara1.posY(),X2=chara2.posX(),Y2=chara1.posY();
                    return (X1-myX)*(X1-myX)+(Y1-myY)*(Y1-myY)-(X2-myX)*(X2-myX)-(Y2-myY)*(Y2-myY);
                });
                results=results.concat(charas);
            });
            //Only attack nearest one, unit prior to building
            return results;
        },
        highestPriorityTarget:AttackableUnit.prototype.highestPriorityTarget,
        AI:function(){
            //Dead unit doesn't have following AI
            if (this.status=='dead') return;
            //AI:Attack insight enemy automatically when alive
            if (this.isAttacking()) {
                // target ran out of attack range
                if (this.cannotReachTarget()) {
                    //Forgive target and find other target
                    this.stopAttack();
                    this.targetLock=false;
                }
            }
            else {
                //Find another in-range enemy
                var enemy=this.highestPriorityTarget();
                //Change target if has one
                if (enemy) this.attack(enemy);
            }
        },
        isAttacking:AttackableUnit.prototype.isAttacking,
        cannotReachTarget:function(){
            return !(this.isInAttackRange(this.target));
        },
        isMissingTarget:AttackableUnit.prototype.isMissingTarget,
        isReloaded:AttackableUnit.prototype.isReloaded,
        //Override for attackable unit
        die:function(){
            //Old behavior
            Building.prototype.die.call(this);
            //Clear new timer for unit
            this.stopAttack();
            this.selected=false;
        }
    }
};
//Define all buildings
Building.TerranBuilding.CommandCenter=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "CommandCenter",
        imgPos: {
            dock: {
                left: 0,
                top: 0
            }
        },
        width: 149,
        height: 126,
        frame: {
            dock: 1
        },
        HP: 10000,
        manPlus: 5,
        cost:{
            mine:400,
            time:1200
        },
        items: {
            '1':{name:'SCV'},
            '6':{name:'SetRallyPoint'},
            '7':{name:'ComstatStation',condition:function(){
                return (!Game.selectedUnit.attachment || Game.selectedUnit.attachment.status=='dead') && Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='Academy';
                })
            }},
            '8':{name:'NuclearSilo',condition:function(){
                return (!Game.selectedUnit.attachment || Game.selectedUnit.attachment.status=='dead') && Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='ConvertOps';
                })
            }},
            '9':{name:'LiftOff'}
        },
        injuryOffsets:[{x:-35,y:-30},{x:-2,y:-15},{x:35,y:-15}],
        evolves: [
            {step:'TerranBuilding.ConstructionL',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ],
        buildTerranBuilding:function(){
            var target=Building.TerranBuilding[this.buildName];
            var construction=new (eval('Building.'+target.prototype.evolves[0].step))
                ({x:this.x+this.width,y:this.y+this.height-target.prototype.height,team:this.team});
            construction.buildName=this.buildName;
            this.attachment=construction;
            Button.reset();
            //Calculate duration
            var duration=Resource.getCost(this.buildName).time;

            //Processing flag on transfer
            construction.processing={
                name:construction.buildName,
                startTime:Game.mainTick,//new Date().getTime()
                time:duration
            };
            var myself=this;
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
                                myself.attachment=construction;
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
                    myself.attachment=construction.evolveTo({
                        type:Building.TerranBuilding[construction.buildName]
                    });
                }
            },duration*100);
        }
    }
});
Building.ProtossBuilding.Nexus=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Nexus",
        imgPos: {
            dock: {
                left: 0,
                top: 0
            }
        },



         width: 149,
        height: 126,
        frame: {
            dock: 1
        },





        HP: 750,
        SP: 750,
        manPlus: 10,
        cost:{
            mine:400,
            time:1200
        },
        items: {
            '1':{name:'Probe'},
            '6':{name:'SetRallyPoint'}
        },
        injuryOffsets:[{x:-10,y:-30},{x:0,y:36},{x:38,y:30}]
    }
});
