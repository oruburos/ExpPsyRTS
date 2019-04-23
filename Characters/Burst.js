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
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/sonido4.wav').play();
    },
    prototypePlus:{
        //Nothing
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
Burst.CompetitionDeath=Burst.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"CompetitorA",
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