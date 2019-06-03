//Alias
var Animation=Burst;
Animation.getAllAnimations=function(){
    var allAnimes=[];
    for (var attr in Animation){
        if (Animation[attr].super===Animation) allAnimes.push(Animation[attr]);
    }
    return allAnimes;
};
Animation.getName=function(anime){
    for (var attr in Animation){
        //Should be animation constructor firstly
        if (Animation[attr].super===Animation && (anime instanceof Animation[attr])) return attr;
    }
};

Animation.RightClickCursor=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"Burst",
        imgPos:{
            burst:{
                left:[0, 44, 88, 132],
                top:[1087,1087,1087,1087]
            }
        },
        width:44,
        height:28,
        frame:{
            burst:4
        }
    }
});
Animation.Consume=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"Magic",
        imgPos:{
            burst:{
                left:[752, 826, 900, 974, 1048, 1122, 1196, 1270, 1344, 752, 826, 900, 974, 1048, 1122, 1196, 1270, 1344],
                top:[126, 126, 126, 126, 126, 126, 126, 126, 126, 196, 196, 196, 196, 196, 196, 196, 196, 196]
            }
        },
        width:74,
        height:70,
        above:true,
        autoSize:true,
        frame:{
            burst:18
        }
    }
});
Animation.Lockdown=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"Magic",
        imgPos:{
            burst:{
                left:[330, 0, 110, 220, 330, 0, 0, 0, 110, 220, 330, 0, 110, 220],
                top:[723, 834, 834, 834, 834, 945, 0, 612, 612, 612, 612, 723, 723, 723]
            }
        },
        width:110,
        height:111,
        above:true,
        autoSize:'MAX',
        duration:60000,
        frame:{
            burst:6
        }
    }
});

Animation.PurpleEffect=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"Magic",
        imgPos:{
            burst:{
                left:[440, 499, 558, 617],
                top:[902,902,902,902]
            }
        },
        width:59,
        height:60,
        above:true,
        autoSize:'MIN',
        duration:30000,
        frame:{
            burst:4
        }
    }
});
Animation.RedEffect=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"Magic",
        imgPos:{
            burst:{
                left:[1006, 1068, 1130, 1192],
                top:[836,836,836,836]
            }
        },
        width:62,
        height:50,
        above:true,
        autoSize:'MIN',
        duration:30000,
        frame:{
            burst:4
        }
    }
});
Animation.GreenEffect=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"Magic",
        imgPos:{
            burst:{
                left:[1256, 1313, 1370, 1427],
                top:[836,836,836,836]
            }
        },
        width:57,
        height:46,
        above:true,
        autoSize:'MIN',
        duration:30000,
        frame:{
            burst:4
        }
    }
});
Animation.Feedback=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"Magic",
        imgPos:{
            burst:{
                left:[632, 702, 772, 842, 912, 982, 1052, 1122, 1192, 1262, 1332, 1402],
                top:[2872, 2872, 2872, 2872, 2872, 2872, 2872, 2872, 2872, 2872, 2872, 2872]
            }
        },
        width:70,
        height:70,
        above:true,
        autoSize:true,
        frame:{
            burst:12
        }
    }
});
Animation.HellFire=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"Magic",
        imgPos:{
            burst:{
                left:[655, 730, 805, 880, 955, 1030, 1105, 1180, 1255, 1330],
                top:[1284, 1284, 1284, 1284, 1284, 1284, 1284, 1284, 1284, 1284]
            }
        },
        width:75,
        height:75,
        above:true,
        autoSize:true,
        frame:{
            burst:10
        }
    }
});
Animation.MindControl=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"Magic",
        imgPos:{
            burst:{
                left:[658, 720, 782, 844, 906, 968, 1030, 1092, 1154, 1216, 1278, 1340],
                top:[1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378]
            }
        },
        width:62,
        height:40,
        above:true,
        autoSize:true,
        frame:{
            burst:12
        }
    }
});

/*
Animation.RedShield=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"Magic",
        imgPos:{
            burst:{
                left:[650, 780, 910, 1040, 1170, 650, 780, 910, 1040, 1170],
                top:[1560, 1560, 1560, 1560, 1560, 1690, 1690, 1690, 1690, 1690]
            }
        },
        width:130,
        height:130,
        above:true,
        autoSize:true,
        duration:18000,//Normal 12 sec
        frame:{
            burst:10
        }
    }
});
Animation.BurningCircle=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"Magic",
        imgPos:{
            burst:{
                left:[0, 112, 224, 336, 448, 560],
                top:[1820, 1820, 1820, 1820, 1820, 1820]
            }
        },
        width:112,
        height:126,
        above:true,
        autoSize:true,
        duration:18000,
        frame:{
            burst:6
        }
    }
});
Animation.Irradiate=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"Magic",
        imgPos:{
            burst:{
                left:[668, 792, 916, 1042, 1172],
                top:[1820,1820,1820,1820,1820]
            }
        },
        width:126,
        height:110,
        above:true,
        autoSize:true,
        duration:30000,
        frame:{
            burst:5
        }
    }
});
Animation.Recall=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"Magic",
        imgPos:{
            burst:{
                left:[0, 86, 188, 282, 386, 488, 588, 688, 788, 894],
                top:[1938, 1938, 1938, 1938, 1938, 1938, 1938, 1938, 1938, 1938]
            }
        },
        width:98,
        height:98,
        frame:{
            burst:10
        }
    }
});
Animation.Ice=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"Magic",
        imgPos:{
            burst:{
                left:[1024, 1164, 1304, 1444],
                top:[1942,1942,1942,1942]
            }
        },
        width:78,
        height:88,
        above:true,
        autoSize:true,
        duration:30000,
        frame:{
            burst:4
        }
    }
});

//Damaged related
Animation.redFireL=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"TerranBuilding",
        imgPos:{
            burst:{
                left: [14, 78, 142, 206, 270, 334, 398, 462, 526, 590, 654, 718],
                top: [546, 546, 546, 546, 546, 546, 546, 546, 546, 546, 546, 546]
            }
        },
        width:40,//64N+14
        height:70,
        //above:true,
        //Keep playing until killed
        forever:true,
        frame:{
            burst:12
        }
    }
});
Animation.redFireM=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"TerranBuilding",
        imgPos:{
            burst:{
                left: [14, 78, 142, 206, 270, 334, 398, 462, 526, 590, 654, 718],
                top: [632, 632, 632, 632, 632, 632, 632, 632, 632, 632, 632, 632]
            }
        },
        width:40,//64N+14
        height:70,
        //above:true,
        forever:true,
        frame:{
            burst:12
        }
    }
});
Animation.redFireR=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"TerranBuilding",
        imgPos:{
            burst:{
                left: [10, 74, 138, 202, 266, 330, 394, 458, 522, 586, 650, 714],
                top: [722, 722, 722, 722, 722, 722, 722, 722, 722, 722, 722, 722]
            }
        },
        width:48,//64N+10
        height:60,
        //above:true,
        forever:true,
        frame:{
            burst:12
        }
    }
});
Animation.blueFireL=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"ProtossBuilding",
        imgPos:{
            burst:{
                left: [14, 78, 142, 206, 270, 334, 398, 462, 526, 590, 654, 718],
                top: [424, 424, 424, 424, 424, 424, 424, 424, 424, 424, 424, 424]
            }
        },
        width:40,//64N+14
        height:70,
        //above:true,
        forever:true,
        frame:{
            burst:12
        }
    }
});
Animation.blueFireM=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"ProtossBuilding",
        imgPos:{
            burst:{
                left: [14, 78, 142, 206, 270, 334, 398, 462, 526, 590, 654, 718],
                top: [506, 506, 506, 506, 506, 506, 506, 506, 506, 506, 506, 506]
            }
        },
        width:40,//64N+14
        height:70,
        //above:true,
        forever:true,
        frame:{
            burst:12
        }
    }
});
Animation.blueFireR=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"ProtossBuilding",
        imgPos:{
            burst:{
                left: [10, 74, 138, 202, 266, 330, 394, 458, 522, 586, 650, 714],
                top: [588, 588, 588, 588, 588, 588, 588, 588, 588, 588, 588, 588]
            }
        },
        width:48,//64N+10
        height:60,
        //above:true,
        forever:true,
        frame:{
            burst:12
        }
    }
});
Animation.bloodA=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"ZergBuilding",
        imgPos:{
            burst:{
                left: [768, 832, 896, 960, 1024, 1088, 1152, 1216, 1280, 1344, 1408, 1472],
                top: [1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320]
            }
        },
        width:64,
        height:50,
        //above:true,
        forever:true,
        frame:{
            burst:12
        }
    }
});
Animation.bloodB=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"ZergBuilding",
        imgPos:{
            burst:{
                left: [768, 832, 896, 960, 1024, 1088, 1152, 1216, 1280, 1344, 1408, 1472],
                top: [1376,1376,1376,1376,1376,1376,1376,1376,1376,1376,1376,1376]
            }
        },
        width:64,
        height:50,
        //above:true,
        forever:true,
        frame:{
            burst:12
        }
    }
});
Animation.bloodC=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"ZergBuilding",
        imgPos:{
            burst:{
                left: [0, 64, 128, 192, 256, 320, 384, 448, 512, 576, 640, 704],
                top: [1376,1376,1376,1376,1376,1376,1376,1376,1376,1376,1376,1376]
            }
        },
        width:64,
        height:50,
        //above:true,
        forever:true,
        frame:{
            burst:12
        }
    }
});
Animation.bloodD=Animation.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus:{
        //Add basic unit info
        name:"ZergBuilding",
        imgPos:{
            burst:{
                left: [0, 64, 128, 192, 256, 320, 384, 448, 512, 576, 640, 704],
                top: [1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320,1320]
            }
        },
        width:64,
        height:50,
        //above:true,
        forever:true,
        frame:{
            burst:12
        }
    }
});*/
