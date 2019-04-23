var CellHistory={
    occupancy:[],
	inicio:true,
    width:1600,
	height:1200,
	cell: 50,
    //Init map
	
	
    init:function(  ){
        
		width = Map.getCurrentMap().width/this.cell  ;
		height = Map.getCurrentMap().height /this.cell;
		
		
		//console.log("tamano mapa calor " + width + " , "  + height );
		
		occupancy = new Array(2);
		occupancy[0] = new Array(height  );
		for( var i = 0 ; i < height  ; i ++ )
		{
			
			occupancy[0][i] = new Array(width);
			for ( var j = 0 ; j <width; j++)
			{
				occupancy[0][i][j] = 0;
				
			}
			
		}
		occupancy[1] = new Array(height  );
		for( var i = 0 ; i < height  ; i ++ )
		{
			
			occupancy[1][i] = new Array(width);
			for ( var j = 0 ; j <width; j++)
			{
				occupancy[1][i][j] = 0;
				
			}
			
		}
		
		//console.log("mapa de calor iniciado");
	}
	,
	
	update: function ( tick ){
		//console.log("u" + Unit.allUnits.length)
		myself = this
		Unit.allUnits.forEach(function(chara){
           
	      //console.log( "actualizando " + chara.posX() +" " + chara.posY())
		   i = Math.floor(chara.posX()/50);
		   //console.log (i);
		   j = Math.floor(chara.posY()/50);
			//console.log( "actualizando " + i +" " + j)
			if( chara.name==="Civilian") //CHECAR NOMBRE
		     
			
			occupancy[0][j][i] ++;
			else if (chara.name==="CompetitorA") //CHECAR NOMBRE
				occupancy[1][j][i] ++;
			
        });
		
	},
	
	showInfo: function (){
		//automatizar este proceso	
			console.log( JSON.stringify(occupancy));
	},
	
	recordInfo: function (){
		
		//aqui conectar a DB
		
		/* Map.allUnits.forEach(function(chara){
           

			if( chara.isMineral) return;// no hacer gran cosa
		     
			
			occupancy[Math.floor(chara.posX())][Math.floor(chara.posY())] ++;
			
			
        });*/
		
		
		//console.table(occupancy ) ;
		console.log(JSON.stringify(occupancy));
	}
	
	
}
		
		