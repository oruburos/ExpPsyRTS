/******* Define Competitor units *******/
//Competitor={};
CompetitorA=AttackableUnit.extends({
    constructorPlus:function(props){
        //Nothing

    },
    prototypePlus: {
        //Add basic unit info
        name: "CompetitorA",
                descriptionUI:"Competitor",

        imgPos: {
            moving: {
                left: [
                    [30,30,30,30],[158,158,158,158],
                    [286,286,286,286],[414,414,414,414],
                    [542,542,542,542],[670,670,670,670],
                    [798,798,798,798],[926,926,926,926],
                    [1054,1054,1054,1054],[1310,1310,1310,1310],
                    [1438,1438,1438,1438],[1566,1566,1566,1566],
                    [1694,1694,1694,1694],[1822,1822,1822,1822],
                    [1950,1950,1950,1950],[2078,2078,2078,2078]
                ],
                top: [
                    [1694,1822,1950,670],[1694,1822,1950,670],
                    [1694,1822,1950,670],[1694,1822,1950,670],
                    [1694,1822,1950,670],[1694,1822,1950,670],
                    [1694,1822,1950,670],[1694,1822,1950,670],
                    [1694,1822,1950,670],[1694,1822,1950,670],
                    [1694,1822,1950,670],[1694,1822,1950,670],
                    [1694,1822,1950,670],[1694,1822,1950,670],
                    [1694,1822,1950,670],[1694,1822,1950,670]
                ]
            },
            dock: {
                left: [
                    [30,30,30,30,30,30,30],[158,158,158,158,158,158,158],
                    [286,286,286,286,286,286,286],[414,414,414,414,414,414,414],
                    [542,542,542,542,542,542,542],[670,670,670,670,670,670,670],
                    [798,798,798,798,798,798,798],[926,926,926,926,926,926,926],
                    [1054,1054,1054,1054,1054,1054,1054],[1310,1310,1310,1310,1310,1310,1310],
                    [1438,1438,1438,1438,1438,1438,1438],[1566,1566,1566,1566,1566,1566,1566],
                    [1694,1694,1694,1694,1694,1694,1694],[1822,1822,1822,1822,1822,1822,1822],
                    [1950,1950,1950,1950,1950,1950,1950],[2078,2078,2078,2078,2078,2078,2078]
                ],
                top: [
                    [798,926,1054,1182,1310,1438,1566],[798,926,1054,1182,1310,1438,1566],
                    [798,926,1054,1182,1310,1438,1566],[798,926,1054,1182,1310,1438,1566],
                    [798,926,1054,1182,1310,1438,1566],[798,926,1054,1182,1310,1438,1566],
                    [798,926,1054,1182,1310,1438,1566],[798,926,1054,1182,1310,1438,1566],
                    [798,926,1054,1182,1310,1438,1566],[798,926,1054,1182,1310,1438,1566],
                    [798,926,1054,1182,1310,1438,1566],[798,926,1054,1182,1310,1438,1566],
                    [798,926,1054,1182,1310,1438,1566],[798,926,1054,1182,1310,1438,1566],
                    [798,926,1054,1182,1310,1438,1566],[798,926,1054,1182,1310,1438,1566]
                ]
            },
            attack: {
                left: [
                    [30,30,30,30,30],[158,158,158,158,158],
                    [286,286,286,286,286],[414,414,414,414,414],
                    [542,542,542,542,542],[670,670,670,670,670],
                    [798,798,798,798,798],[926,926,926,926,926],
                    [1054,1054,1054,1054,1054],[1310,1310,1310,1310,1310],
                    [1438,1438,1438,1438,1438],[1566,1566,1566,1566,1566],
                    [1694,1694,1694,1694,1694],[1822,1822,1822,1822,1822],
                    [1950,1950,1950,1950,1950],[2078,2078,2078,2078,2078]
                ],
                top: [
                    [30,158,286,414,542],[30,158,286,414,542],
                    [30,158,286,414,542],[30,158,286,414,542],
                    [30,158,286,414,542],[30,158,286,414,542],
                    [30,158,286,414,542],[30,158,286,414,542],
                    [30,158,286,414,542],[30,158,286,414,542],
                    [30,158,286,414,542],[30,158,286,414,542],
                    [30,158,286,414,542],[30,158,286,414,542],
                    [30,158,286,414,542],[30,158,286,414,542]
                ]
            }
        },
        width: 68,//128N+30
        height: 68,//128N+30
        frame: {
            moving: 4,//3 or 4
            dock: 7,//7 or 8
            attack: 5
        },



		speed:5,//default
        HP: 10,
        damage: 0,
        armor:0,
		carryingResources:false,
        sight:245,
        meleeAttack: true,
        attackInterval: 52000,
        dieEffect:Burst.CompetitionDeath,
        isFlying:false,
        attackLimit:"ground",
        unitType:Unit.SMALL,
        attackType:AttackableUnit.NORMAL_ATTACK,
		depot: null,

        cost:{
            mine:50,
        //    gas:150,
            man:2,
            time:500
        },
    }
});
