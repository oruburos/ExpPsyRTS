var Resource={
    init:function(){
        for (var N=0;N<Game.playerNum;N++){
            Resource[N]={
                mine:50,
                gas:0,
                curMan:0,
                totalMan:0
            };

           // console.log("Resource init")
        }

    },
};