//One animation period which only play for a while and die
var Burst=Gobj.extends({
    constructorPlus:function(props){
        //Override if has props.scale
        if (props.scale) this.scale=props.scale;
        //Resize drawing by scale
        var times=this.scale?(this.scale):1;
        //Behavior like effect on target
        if (props.target) {
            this.target=props.target;
            //Ahead of owner
            if (props.above) this.above=true;
            //Animation duration
            //Match owner size
            if (props.autoSize) this.autoSize=true;
            if (this.autoSize!=null) {
                //Can mix autoSize with scale
                switch(this.autoSize){
                    case 'MAX':
                        this.scale=Math.max(this.target.width,this.target.height)*2*times/(this.width+this.height);
                        break;
                    case 'MIN':
                        this.scale=Math.min(this.target.width,this.target.height)*2*times/(this.width+this.height);
                        break;
                    default:
                        this.scale=(this.target.width+this.target.height)*times/(this.width+this.height);
                }
                times=this.scale;
            }
            //Location
            this.x=(this.target.posX()-this.width*times/2)>>0;
            this.y=(this.target.posY()-this.height*times/2)>>0;
            //Onfire or bleed will have offset
            if (props.offset){
                this.x+=props.offset.x;
                this.y+=props.offset.y;
            }
        }
        //Independent burst
        else {
            //Target location, from centerP to top-left
            this.x=props.x-this.width*times/2;
            this.y=props.y-this.height*times/2;
        }
        //Play duration
        if (this.forever) this.duration=-1;//Keep playing until killed
        if (props.duration!=null) this.duration=props.duration;//Override duration
        //Restore callback after burst finish
        if (props.callback) this.callback=props.callback;
        //By default it will burst
        this.burst();
        //Will show after constructed
        Burst.allEffects.push(this);
    },
    prototypePlus:{
        //Override Gobj method
        animeFrame:function(){
            //Animation play
            this.action++;
            //Override Gobj here, can have hidden frames
            var arrLimit=(this.imgPos[this.status].left instanceof Array)?(this.imgPos[this.status].left.length):1;
            if (this.action==this.frame[this.status] || this.action==arrLimit) {
                this.action=0;
            }
            //Update location here
            if (this.above && this.target) {
                //Update location: copied from constructor
                var times=this.scale?(this.scale):1;
                this.x=(this.target.posX()-this.width*times/2)>>0;
                this.y=(this.target.posY()-this.height*times/2)>>0;
            }
        },
        burst:function(){
            this.status="burst";
            //Start play burst animation
            var myself=this;
            var animateFrame=function(){
                //Only play animation, will not move
                myself.animeFrame();
            };
            this.allFrames['animate']=animateFrame;
            //Will die(stop playing) after time limit arrive
            var duration=this.duration?this.duration:(this.frame['burst']*100);
            //Last forever if duration<0 (-1)
            if (duration>0){
                Game.commandTimeout(function(){
                    myself.die();
                },duration);
            }
        },
        die:function(){
            //Run callback when burst die
            if (this.callback) this.callback();
            Gobj.prototype.die.call(this);
        }
    }
});
//All burst effects here for show
Burst.allEffects=[];
//Define different bursts
Burst.GreenFog=Burst.extends({
    constructorPlus:function(props){
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/GreenFog.burst.wav').play();
    },
    prototypePlus:{
        //Add basic unit info
        name:"Mutalisk",//Source img inside Mutalisk.png
        imgPos:{
            burst:{
                left:[8,68,134,198,263,8,68,134,198,263],
                top:[468,468,468,468,468,532,532,532,532,532]
            }
        },
        width:52,
        height:57,
        frame:{
            burst:10
        }
    }
});
Burst.Parasite=Burst.extends({
    constructorPlus:function(props){
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/Magic.Parasite.wav').play();
    },
    prototypePlus:{
        //Add basic unit info
        name:"Mutalisk",
        imgPos:{
            burst:{
                left:[8,68,134,198,263,8,68,134,198,263],
                top:[468,468,468,468,468,532,532,532,532,532]
            }
        },
        width:52,
        height:57,
        frame:{
            burst:10
        }
    }
});
Burst.Spore=Burst.extends({
    constructorPlus:function(props){
        //No sound
    },
    prototypePlus:{
        //Add basic unit info
        name:"Mutalisk",
        imgPos:{
            burst:{
                left:[8,68,134,198,263,8,68,134,198,263],
                top:[468,468,468,468,468,532,532,532,532,532]
            }
        },
        width:52,
        height:57,
        frame:{
            burst:10
        }
    }
});
Burst.GreenBallBroken=Burst.extends({
    constructorPlus:function(props){
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/Greenball.burst.wav').play();
    },
    prototypePlus:{
        //Add basic unit info
        name:"Guardian",
        imgPos:{
            burst:{
                left:[0,56,119,182,252,322,396,470],
                top:[556,556,556,556,556,556,556,556]
            }
        },
        width:60,
        height:60,
        frame:{
            burst:8
        }
    }
});
Burst.PurpleCloudSpread=Burst.extends({
    constructorPlus:function(props){
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/PurpleCloud.burst.wav').play();
    },
    prototypePlus:{
        //Add basic unit info
        name:"Devourer",
        imgPos:{
            burst:{
                left:[17,70,122,174,230,280,335,390,452],
                top:[1022,1022,1022,1022,1022,1022,1022,1022,1022]
            }
        },
        width:50,
        height:60,
        callback:function(){
            var chara=this.target;
            //Fix all spored issue
            if (chara.status=='dead' || chara.status==null) return;
            //Effect:PurpleBuffer when cloud spread on target chara
            //Buffer flag, can add up
            if (chara.buffer.PurpleCloud==9) return;//9 at max
            if (chara.buffer.PurpleCloud>0) chara.buffer.PurpleCloud++;
            else chara.buffer.PurpleCloud=1;
            //Decrease defense and slow down attack rate
            var bufferObj={
                armor:chara.get('armor')-1
            };
            if (chara.plasma!=null) bufferObj.plasma=chara.get('plasma')-1;
            if (chara.attackInterval) bufferObj.attackInterval=Math.round(chara.get('attackInterval')*1.1);
            //Apply buffer
            chara.addBuffer(bufferObj);
            if (!chara.purpleBuffer) chara.purpleBuffer=[];
            chara.purpleBuffer.push(bufferObj);
            //Purple effect
            new Animation.PurpleEffect({team:this.team,target:chara,callback:function(){
                //Restore in 30 seconds, Last In First Out
                if (chara.purpleBuffer && chara.removeBuffer(chara.purpleBuffer.pop())) {
                    chara.buffer.PurpleCloud--;
                }
                //Full restore
                if (chara.buffer.PurpleCloud==0) {
                    delete chara.buffer.PurpleCloud;
                    delete chara.purpleBuffer;
                }
            }});
        },
        frame:{
            burst:9
        }
    }
});



Burst.SmallFireSpark=Burst.extends({
    constructorPlus:function(props){
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/FireSpark.burst.wav').play();
    },
    prototypePlus:{
        //Add basic unit info
        name:"Wraith",
        imgPos:{
            burst:{
                left:[64,106,64],
                top:[132,132,132]
            }
        },
        width:32,
        height:30,
        frame:{
            burst:3
        }
    }
});

Burst.FireSpark=Burst.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"Ghost",
        imgPos:{
            burst:{
                left:[0, 38, 76, 114, 152, 190, 228, 266, 304, 342],
                top:[596,596,596,596,596,596,596,596,596,596]
            }
        },
        width:38,
        height:36,
        frame:{
            burst:10
        }
    }
});



Burst.MineralSound=Burst.FireSpark.extends({
    constructorPlus:function(props){
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/Mineral.death.wav').play();
    },
     prototypePlus:{
        //Nothing
    }
});


Burst.FireSparkSound=Burst.FireSpark.extends({
    constructorPlus:function(props){
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/FireSpark.burst.wav').play();
    },
    prototypePlus:{
        //Nothing
    }
});



Burst.PurpleFog=Burst.extends({
    constructorPlus:function(props){
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/ReaverBomb.burst.wav').play();
    },
    prototypePlus:{
        //Add basic unit info
        name:"Mutalisk",
        imgPos:{
            burst:{
                left:[338,398,464,528,593,338,398,464,528,593],
                top:[468,468,468,468,468,532,532,532,532,532]
            }
        },
        width:52,
        height:57,
        frame:{
            burst:10
        }
    }
});

Burst.SmallExplode=Burst.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"BuildingBurst",
        imgPos:{
            burst:{
                left:[56,156,256,360],
                top:[1686,1686,1686,1686]
            }
        },
        width:80,
        height:60,
        frame:{
            burst:4
        }
    }
});
Burst.MiddleExplode=Burst.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"BuildingBurst",
        imgPos:{
            burst:{
                left:[44,192,342,498],
                top:[1754,1754,1754,1754]
            }
        },
        width:120,
        height:90,
        frame:{
            burst:4
        }
    }
});
Burst.BigExplode=Burst.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"BuildingBurst",
        imgPos:{
            burst:{
                left:[26,226,424,632],
                top:[1846,1846,1846,1846]
            }
        },
        width:160,
        height:120,
        frame:{
            burst:4
        }
    }
});
Burst.SmallBlueExplode=Burst.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"BuildingBurst",
        imgPos:{
            burst:{
                left:[50,150,250,356],
                top:[1424,1424,1424,1424]
            }
        },
        width:80,
        height:60,
        frame:{
            burst:4
        }
    }
});
Burst.MiddleBlueExplode=Burst.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"BuildingBurst",
        imgPos:{
            burst:{
                left:[36,184,338,494],
                top:[1484,1484,1484,1484]
            }
        },
        width:120,
        height:90,
        frame:{
            burst:4
        }
    }
});
Burst.BigBlueExplode=Burst.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"BuildingBurst",
        imgPos:{
            burst:{
                left:[22,222,420,632],
                top:[1566,1566,1566,1566]
            }
        },
        width:160,
        height:120,
        frame:{
            burst:4
        }
    }
});
Burst.ZergBuildingBurst=Burst.extends({
    constructorPlus:function(props){
        //Need clear mud when ZergBuildingBurst finished
        this.callback=function(){
            Map.needRefresh="MAP";
        };
    },
    prototypePlus:{
        //Add basic unit info
        name:"BuildingBurst",
        imgPos:{
            burst:{
                left:[0,200,400,600,800,0,200,400,600,800,0,200,400,400,600,600,800,800],
                top:[0,0,0,0,0,200,200,200,200,200,400,400,400,400,400,400,400,400]
            }
        },
        width:200,
        height:200,
        frame:{
            burst:18
        }
    }
});
Burst.TerranBuildingBurst=Burst.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"BuildingBurst",
        imgPos:{
            burst:{
                left:[0,0,200,200,400,400,600,600,800,800,0,0,200,200,400,400,600,600],
                top:[600,600,600,600,600,600,600,600,600,600,800,800,800,800,800,800,800,800]
            }
        },
        width:200,
        height:200,
        frame:{
            burst:18
        }
    }
});
Burst.ProtossBuildingBurst=Burst.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"BuildingBurst",
        imgPos:{
            burst:{
                left:[0,0,200,200,400,400,600,600,800,800,0,0,200,200,400,400,600,600],
                top:[1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1200,1200,1200,1200,1200,1200,1200,1200]
            }
        },
        width:200,
        height:200,
        frame:{
            burst:18
        }
    }
});
Burst.HumanDeath=Burst.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"Civilian",
        imgPos:{
            burst:{
                left:[6,58,106,158,6,54,102,152],
                top:[286,286,286,286,320,320,320,320]
            }
        },
        width:42,
        height:30,
        frame:{
            burst:8
        }
    }
});