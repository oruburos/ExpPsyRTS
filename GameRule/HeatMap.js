var HeatMap = {
	occupancy: [],
	occupancyPredators: [],
	inicio: true,
	width: 2000,
	height: 2000,
	cell: 100,
	//Init map
	historial: {},
	historialXunit: {},
	historialPredator: {},
	recordPredator: false,


	init: function () {
		this.occupancy = [];
		width = Map.getCurrentMap().width / this.cell;
		height = Map.getCurrentMap().height / this.cell;
		if (Levels[Game.level - 1].has_predator) {//logic when the level has a predator inside

			this.recordPredator = true;


			occupancyPredators = new Array(height);
			for (var i = 0; i < height; i++) {
				occupancyPredators[i] = new Array(width);
				for (var j = 0; j < width; j++) {
					occupancyPredators[i][j] = 0;
					//	console.log("Iniciando tabla depredadores");
				}

			}
		}





		//	console.log("INIT tamano mapa calor WH " + Map.getCurrentMap().width + " , "  +  Map.getCurrentMap().height );
		//	console.log("tamano mapa calor " + width + " , "  + height );


		occupancy = new Array(2);
		occupancy[0] = new Array(height);
		for (var i = 0; i < height; i++) {

			occupancy[0][i] = new Array(width);
			for (var j = 0; j < width; j++) {
				occupancy[0][i][j] = 0;
			//	console.log("generando mis posiciones")
			}

		}
		occupancy[1] = new Array(height);
		for (var i = 0; i < height; i++) {

			occupancy[1][i] = new Array(width);
			for (var j = 0; j < width; j++) {
				occupancy[1][i][j] = 0;
			//console.log("generando competidor")
			}

		}





	}
	,

	update: function (tick) {
		myself = this;
		unitsXTick = [];



		Unit.allUnits.forEach(function (chara) {


			//console.log("chara id " + chara.id + " x " + chara.posX() + " w " + chara.width + " name   " + chara.name)

			//   console.log( "actualizando " + chara.posX() +" " + chara.posY()  + " id:" + chara.id)
			i = Math.floor(chara.posX() / myself.cell);
			//console.log (i);
			j = Math.floor(chara.posY() / myself.cell);
		//	console.log( "actualizando " + i +" " + j)
			if (chara.name === "Civilian") //CHECAR NOMBRE
			{

				//	console.log(" j " + j + " i " + i)
				occupancy[0][j][i]++;


				if ((tick) % 50 == 0) {


					var statusUnit = new Object();
					statusUnit.id = chara.id;
					statusUnit.carryngResources = chara.carryingResources;
					statusUnit.resources = chara.resources;
					statusUnit.position = { x: i, y: j };
					statusUnit.life = chara.life;
					statusUnit.selected = chara.selected;
					statusUnit.idle = chara.isIdle();

					unitsXTick.push(statusUnit);

				}

			}
			else
				if (chara.name === "CompetitorA") //CHECAR NOMBRE
				{


					if ((tick) % 50 == 0) {
				/*		console.log (i);
						console.log (j);
						console.log(" Competitor current tick "+ tick)*/
                        occupancy[1][j][i]++;
                    }
				}
				else if (chara.name === "Alien" && myself.recordPredator) {
					//console.log(" Predator current tick "+ tick)



					occupancyPredators[j][i]++;
					//console.log(	occupancyPredators[j][i] 		);
				}


			//	console.log("resources " +Game.resources);
		});


		if ((tick) % 50 == 0) {//tiene que coincidir con el numero en Game.record
			var clave = tick.toString()
			//var unidadesPorTick = JSON.stringify(unitsXTick);

			this.historialXunit[clave] = unitsXTick;

		}

	},

	showInfo: function () {
		//automatizar este proceso	
		//	console.log( JSON.stringify(occupancy));
	},

	recordInfo: function (tick) {

		//aqui conectar a DB
		//console.log("recibiendo " + tick)
		/* Map.allUnits.forEach(function(chara){
           

			if( chara.isMineral) return;// no hacer gran cosa
		     
			
			occupancy[Math.floor(chara.posX())][Math.floor(chara.posY())] ++;
			
			
        });*/

		//console.table(occupancy ) ;
		var momentaneo = JSON.stringify(occupancy);  //quitar el stringify y eso me facilita las cosas en Python
		//console.log( momentaneo );
		//	console.log(clave + '->'+tick.toString());
		var clave = tick.toString()
		this.historial[clave] = momentaneo;

		var unidadesPorTick = JSON.stringify();

		if (this.recordPredator) {

		//	console.log(" guardando depredadores");
		//	console.log("****" + JSON.stringify(occupancyPredators));
			var frecuenciaPredators = JSON.stringify(occupancyPredators);

			this.historialPredator[clave] = frecuenciaPredators;
		}
	}


}

