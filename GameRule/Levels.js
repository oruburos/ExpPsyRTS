var Levels = [
	{
		level: 1,
		label: "Experiment 1 Condition 3 : Predators, partial visibility",
		has_predator: false,
		load: function () {

			//Load map
			Map.setCurrentMap('Grass');
			Map.offsetX = 120;
			Map.offsetY = 50;
			Unit.allUnits = [];
			//Choose side and apply race style
			//var races = ['Human', 'CompetitorA'];
			var startPoint = [{ x: 330, y: 20 }, { x: 200, y: 50 }];
			//if (!Game.replayFlag) Game.team=Math.random()*2>>0;
			Game.race.choose('Human');
			Map.offsetX = startPoint[Game.team].x;
			Map.offsetY = startPoint[Game.team].y;

			Map.fogFlag = true;//visibilidad partial

			Game.showMessage('Gather resources. ');


			//new Human.Civilian({ x: 900, y: 400, team: 0 });
			//new Human.Civilian({ x: 950, y: 400, team: 0 });
			//new Human.Civilian({ x: 1100, y: 400, team: 0 });
			//new Human.Civilian({ x: 1050, y: 400, team: 0 });
			new Human.Civilian({ x: 1000, y: 400, team: 0 });

			new Building.TerranBuilding.CommandCenter({ x: 1000, y: 200 });


			//pellet 1
			min = new Mineral({ x: 400, y: 150 });
			randomValue = Math.floor((Math.random() * 10) + 1);
			min.resources = randomValue;
			min.HP = randomValue;
			Game.totalResources = min.resources;

			//pellet 2
			min = new Mineral({ x: 1600, y: 150 });
			randomValue = Math.floor((Math.random() * 10) + 1);
			min.resources = randomValue;
			min.HP = randomValue;
			Game.totalResources = Game.totalResources + min.resources;

			//pellet 3
			min = new Mineral({ x: 400, y: 1850 });
			randomValue = Math.floor((Math.random() * 10) + 1);
			min.resources = randomValue;
			min.HP = randomValue;
			Game.totalResources = Game.totalResources + min.resources;

			//pellet 4
			min = new Mineral({ x: 1600, y: 1850 });
			randomValue = Math.floor((Math.random() * 10) + 1);
			min.resources = randomValue;
			min.HP = randomValue;
			Game.totalResources = Game.totalResources + min.resources;

			//pellet 5
			min = new Mineral({ x: 300, y: 1000 });
			randomValue = Math.floor((Math.random() * 10) + 1);
			min.resources = randomValue;
			min.HP = randomValue;
			Game.totalResources = Game.totalResources + min.resources;

			//pellet 6
			min = new Mineral({ x: 1700, y: 1000 });
			randomValue = Math.floor((Math.random() * 10) + 1);
			min.resources = randomValue;
			min.HP = randomValue;
			Game.totalResources = Game.totalResources + min.resources;

			//pellet 7
			min = new Mineral({ x: 1000, y: 1000 });
			randomValue = Math.floor((Math.random() * 10) + 1);
			min.resources = randomValue;
			min.HP = randomValue;
			Game.totalResources = Game.totalResources + min.resources;

			new Predator.Alien({ x: 300, y: 1000, team: 1 });
			new Predator.Alien({ x: 1000, y: 1000, team: 1 });
			new Predator.Alien({ x: 1700, y: 1000, team: 1 });


/*

			m = new CompetitorA({ x: 950, y: 1600, team: 1, });
			m.sight = 250;
			m.speed = 5;
			m.HP = 10;
			m.carryingResources = false;
			m.moveRange = 40;
			m.attackRange = 240;
			m.attackInterval = 3000000
			m.id = 98;*/

/*
			m = new Competitor.CompetitorA({ x: 1000, y: 1600, team: 2, });
			m.sight = 250;
			m.speed = 5;
			m.HP = 10;
			m.carryingResources = false;
			m.attackRange = 240;
			m.attackInterval = 3000000
			m.id = 95;

			m = new Competitor.CompetitorA({ x: 1050, y: 1600, team: 2, });
			m.sight = 250;
			m.speed = 5;
			m.HP = 10;
			m.carryingResources = false;
			m.attackRange = 240;
			m.attackInterval = 3000000
			m.id = 97;

			m = new Competitor.CompetitorA({ x: 1100, y: 1600, team: 2, });
			m.sight = 250;
			m.speed = 5;
			m.HP = 10;
			m.carryingResources = false;
			m.attackRange = 240;
			m.attackInterval = 3000000
			m.id = 96;
*/
			new Building.ProtossBuilding.Nexus({ x: 1000, y: 1800, team: 2 });





			if (Game.modoTutorial) {
				Game.commandTimeout(function () {
					Game.showMessage("Task Finished"),

						//console.log("tiempo terminad" +Game.trainingDuration),
						Game.lose();
				}, Game.trainingDuration);//60 segundos

			}
			else {
				Game.commandTimeout(
					function () {
						Game.showMessage("Task Finished"),
							Game.inGame = false,
							console.log("tiempo terminado condicion 2" + Game.sessionDuration),
							Game.lose();
					}, Game.sessionDuration);//60 segundos}

			}


			Game.startClock();
		}





	},


];
