var Game = {	
	//Global variables
	HBOUND: innerWidth,//$('body')[0].scrollWidth
	VBOUND: innerHeight,//$('body')[0].scrollHeight
	infoBox: {
		x: 145,
		y: innerHeight - 110,
		width: innerWidth - 295,

		height: 110
	},



	inGame: false,
	/*
	trainingDuration:  300000,
	sessionDuration: 300000,
	*/

	trainingDuration:  300000,
	sessionDuration: 300000,


	leaveEarly: false,
	volumenGlobal: 0,
	capacidadCarga: 3,// parametro para controlar cuanto cargan los terranos.
	resources: 0,//collected
	totalResources: 0, //ideal
	surveyData: "",
	competitorResources: 0,
	team: 0,
	playerNum: 2,//By default0
	teams: {},
	multiplayer: false,//By default
	cxt: $('#middleCanvas')[0].getContext('2d'),
	frontCxt: $('#frontCanvas')[0].getContext('2d'),
	backCxt: $('#backCanvas')[0].getContext('2d'),
	fogCxt: $('#fogCanvas')[0].getContext('2d'),
	_timer: -1,
	_frameInterval: 100,
	mainTick: 0,
	serverTick: 0,
	commands: {},
	replay: {},
	randomSeed: 0,//For later use
	selectedUnit: {},
	allSelected: [],
	_oldAllSelected: [],
	hackMode: false,
	isApp: false,
	offline: false,
	toggleClock: true,
	CDN: '',
	historialResources: {},
	modoTutorial: true,
	//cosas que van a DB
	idParticipant: -1,
	conditionExperiment: -1,
	sessionID:-1,
	prolificID:-1,
	refreshIntervalId:undefined,
	//
	startClock: function () {


		$('div.warning_Box').show();
		if (Game.toggleClock) {
			var timer = 0;
			if (Game.modoTutorial) {
				timer = Game.trainingDuration;
			} else {
				timer = Game.sessionDuration;
			}
			//	console.log( " starting clock with " + timer )

			timer = timer/1000;
			var minutes = 0
			var seconds = 0;

			
			Game.refreshIntervalId   = 	setInterval(function () {
					minutes = parseInt(timer / 60, 10)
				seconds = parseInt(timer % 60, 10);

				minutes = minutes < 10 ? "0" + minutes : minutes;
				seconds = seconds < 10 ? "0" + seconds : seconds;

				$('div.warning_Box').html(minutes + ":" + seconds);

				if (--timer < 0) {
					console.log(" Negative timer " + timer);

				//	$('div.warning_Box').hide();
				}
			}, 1000);
		

		} else {
			$('div.warning_Box').hide();

		}



	},
	addIntoAllSelected: function (chara, override) {
		if (chara instanceof Gobj) {
			//Add into allSelected if not included
			if (Game.allSelected.indexOf(chara) == -1) {
				if (override) Game.allSelected = chara;
				else Game.allSelected.push(chara);
				chara.selected = true;
			}
		}
		//Override directly
		if (chara instanceof Array) {
			if (override) Game.allSelected = chara;
			else chara.forEach(function (char) {
				//Add into allSelected if not included
				if (Game.allSelected.indexOf(char) == -1) Game.allSelected.push(char);
			});
			chara.forEach(function (char) {
				char.selected = true;
			});
		}
		//Sort allSelected by its name order
		Game.allSelected.sort(function (chara1, chara2) {
			//Need sort building icon together
			var name1 = (chara1 instanceof Building) ? (chara1.inherited.name + '.' + chara1.name) : chara1.name;
			var name2 = (chara2 instanceof Building) ? (chara2.inherited.name + '.' + chara2.name) : chara2.name;
			return ([name1, name2].sort()[0] != name1) ? 1 : -1;
		});
		//Notify referee to redraw
		Referee.alterSelectionMode();
	},
	//To replace setTimeout
	commandTimeout: function (func, delay) {
		var dueTick = Game.mainTick + (delay / 100 >> 0);
		if (!Game.commands[dueTick]) Game.commands[dueTick] = [];
		Game.commands[dueTick].push(func);
	},
	//To replace setInterval
	commandInterval: function (func, interval) {
		var funcAdjust = function () {
			func();
			Game.commandTimeout(funcAdjust, interval);
		};
		Game.commandTimeout(funcAdjust, interval);
	},
	race: {
		selected: 'Human',//Human race by default
		choose: function (race) {
			this.selected = race;
			$('div#GamePlay').attr('race', race);
		}
	},
	layerSwitchTo: function (layerName) {
		$('div.GameLayer').hide();
		$('#' + layerName).show(); //show('slow')
	},
	init: function () {

		//get condition

		Game.getCondition();

		console.log("condition obtained " + Game.conditionExperiment )
		//Prevent full select
		$('div.GameLayer').on("selectstart", function (event) {
			//console.log("select start")
			event.preventDefault();
		});
		//Bind resize canvas handler
		window.onresize = Game.resizeWindow;
		/*window.requestAnimationFrame=requestAnimationFrame || webkitRequestAnimationFrame
		 || mozRequestAnimationFrame || msRequestAnimationFrame || oRequestAnimationFrame;//Old browser compatible*/
		//Online mode
		if (!Game.offline) {

			Game.CDN = ""

		}
		//Start loading
		Game.layerSwitchTo("GameLoading");
		//Predator
		sourceLoader.load("img", Game.CDN + "img/Charas/Alien.png", "Alien");
		sourceLoader.load("img", Game.CDN + "img/Charas/CivilianGrey.png", "Civilian");
		sourceLoader.load("img", Game.CDN + "img/Charas/CompetitorA.png", "CompetitorA");

		//Building
		sourceLoader.load("img", Game.CDN + "img/Charas/TerranBuilding.png", "TerranBuilding");
		//sourceLoader.load("img", Game.CDN + "img/Charas/ControlBase.png", "ControlBase");
		//sourceLoader.load("img", Game.CDN + "img/Charas/ProtossBuilding.png", "ProtossBuilding");

		//Map

		sourceLoader.load("img", Game.CDN + "img/Maps/Map_Grass.jpg", "Map_Grass");
		//Extra
		//sourceLoader.load("img", Game.CDN + "img/Charas/BuildingBurst.png", "BuildingBurst");
		sourceLoader.load("img", Game.CDN + "img/Charas/Portrait.png", "Portrait");
		sourceLoader.load("img", Game.CDN + "img/Menu/ControlPanel.png", "ControlPanel");


		sourceLoader.load("img", Game.CDN + "img/Bg/qmul-logo.png", "GameWin");
		sourceLoader.load("img", Game.CDN + "img/Bg/qmul-logo.png", "GameLose");

		//mi sprite
		sourceLoader.load("img", Game.CDN + "img/qmul/prop-coin.png", "mineral");

		sourceLoader.allOnLoad(function () {
			//$('#GameStart').prepend(sourceLoader.sources['GameStart']);
			$('#GameWin').prepend(sourceLoader.sources['GameWin']);
			$('#GameLose').prepend(sourceLoader.sources['GameLose']);
			/*
			$('#GameWin').prepend(sourceLoader.sources['TaskEnded']);
			 $('#GameLose').prepend(sourceLoader.sources['TaskEnded']);
 */
			$('#GamePlay>canvas').attr('width', Game.HBOUND);//Canvas width adjust
			$('#GamePlay>canvas').attr('height', Game.VBOUND - Game.infoBox.height + 5);//Canvas height adjust
			/*for (var N=1;N<=3;N++){
					$('div.panel_Control').append("<button num='"+N+"'></button>");
				}*/

			Game.start();
		})
	},



	start: function () {
		//Game start



		Game.layerSwitchTo("GameStart");


		var level = Game.conditionExperiment;


		if (Game.modoTutorial) {
			console.log("Modo tutorial")

			$('.levelSelectionBg').append("<div class='levelItem'><p>Online Mini gaming task (Training)</p><input type='button'  class='sv_next_btn' value='Start Task' name='levelSelect'></input></div>");
		}

		else {

			console.log(" modo Real")
			$('.levelSelectionBg').append("<div class='levelItem'><p>Online Mini gaming task (Real)</p><input type='button'  class='sv_next_btn' value='Start Task' name='levelSelect'></input></div>");


		}

		//Wait for user select level and play game
		$('input[name="levelSelect"]').click(function () {
			//Prevent vibration
			if (Game.level != null) return;
			//Game.level=parseInt(this.value);
			Game.level = Game.conditionExperiment;
			Game.play();
		});
	},


	play: function () {
		//Load level to initial when no error occurs
		if (!(Levels[Game.level - 1].load())) {
			//Need Game.playerNum before expansion
			
			if (Game.modoTutorial) {
				Game.expandUnitProps();
				//Resource.init();
			}
			Resource.init();
			//Game background
			Game.layerSwitchTo("GamePlay");
			Game.resizeWindow();
			//Collect login user info
			//	if (Game.hackMode) Multiplayer.sendUserInfo();
			//Bind controller
			mouseController.toControlAll();//Can control all units
			keyController.start();//Start monitor
			//Game.pauseWhenHide();//Hew H5 feature:Page Visibility
			//Game.initIndexDB();//Hew H5 feature:Indexed DB
			HeatMap.init();
			/*	if (!Game.modoTutorial){
					console.log( "lmpiando datos de heatmap")
				//	HeatMap.cleanData();
				}*/
			Game.inGame = true;
			Game.animation();
		}
	},
	getPropArray: function (prop) {
		var result = [];
		for (var N = 0; N < Game.playerNum; N++) {
			result.push(typeof (prop) == 'object' ? (_$.clone(prop)) : prop);
		}
		return result;
	},
	//Do we need this because we only support Predator vs Human vs Competitor?
	expandUnitProps: function () {
		//Post-operation for all unit types, prepare basic properties for different team numbers, init in level.js
		_$.traverse([Predator, Human, Competitor], function (unitType) {
			['HP', 'SP', 'MP', 'damage', 'armor', 'speed', 'attackRange', 'attackInterval', 'plasma', 'sight'].forEach(function (prop) {
				//Prop array, first one for us, second for enemy
				if (unitType.prototype[prop] != undefined) {

					//	console.log("traversion "+ prop + " unittype " + Game.getPropArray(unitType.prototype[prop]) )
					unitType.prototype[prop] = Game.getPropArray(unitType.prototype[prop]);
				}
			});
			if (unitType.prototype.isInvisible) {
				for (var N = 0; N < Game.playerNum; N++) {
					unitType.prototype['isInvisible' + N] = unitType.prototype.isInvisible;
				}
			}
			delete unitType.prototype.isInvisible;//No need anymore
			if (unitType.prototype.attackMode) {
				['damage', 'attackRange', 'attackInterval'].forEach(function (prop) {
					//Prop array, first one for us, second for enemy
					unitType.prototype.attackMode.flying[prop] = Game.getPropArray(unitType.prototype.attackMode.flying[prop]);
					unitType.prototype.attackMode.ground[prop] = Game.getPropArray(unitType.prototype.attackMode.ground[prop]);
				});
			}
			unitType.upgrade = function (prop, value, team) {
				switch (team) {
					case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
						eval('unitType.prototype.' + prop)[team] = value;
						break;
					default:
						unitType.prototype[prop] = value;
						break;
				}
			};
		});
		Referee.underArbiterUnits = Game.getPropArray([]);
		Referee.detectedUnits = Game.getPropArray([]);
		for (var N = 0; N < Game.playerNum; N++) {
			//Initial detector buffer
			var buffer = {};
			buffer['isInvisible' + N] = false;
			Gobj.detectorBuffer.push(buffer);


		}

	},
	addSelectedIntoTeam: function (teamNum) {
		//Build a new team
		Game.teams[teamNum] = _$.mixin([], Game.allSelected);
	},
	callTeam: function (teamNum) {
		var team = _$.mixin([], Game.teams[teamNum]);
		//When team already exist
		if (team instanceof Array) {
			Game.unselectAll();
			//GC
			$.extend([], team).forEach(function (chara) {
				if (chara.status == 'dead') team.splice(team.indexOf(chara), 1);
			});
			Game.addIntoAllSelected(team, true);
			if (team[0] instanceof Gobj) {
				Game.changeSelectedTo(team[0]);
				//Sound effect
				team[0].sound.selected.play();
				//Relocate map center
				Map.relocateAt(team[0].posX(), team[0].posY());
			}
		}
	},
	unselectAll: function () {
		//Unselect all
		var units = Unit.allUnits.concat(Building.allBuildings);
		units.forEach(function (chara) { chara.selected = false });
		Game.addIntoAllSelected([], true);
	},
	multiSelectInRect: function () {
		Game.unselectAll();
		//Multi select in rect
		var startPoint = {
			x: Map.offsetX + Math.min(mouseController.startPoint.x, mouseController.endPoint.x),
			y: Map.offsetY + Math.min(mouseController.startPoint.y, mouseController.endPoint.y)
		};
		var endPoint = {
			x: Map.offsetX + Math.max(mouseController.startPoint.x, mouseController.endPoint.x),
			y: Map.offsetY + Math.max(mouseController.startPoint.y, mouseController.endPoint.y)
		};
		var inRectUnits = Unit.allOurUnits().filter(function (chara) {
			return chara.insideRect({ start: (startPoint), end: (endPoint) })
		});
		if (inRectUnits.length > 0)
		{
			 Game.changeSelectedTo(inRectUnits[0]);
			 Multiplayer.cmds.push(JSON.stringify({
                
                type: 'multipleSelect',
                pos1: startPoint,
				pos2: endPoint,
            }));

		}else Game.changeSelectedTo({});
		Game.addIntoAllSelected(inRectUnits, true);
	},
	getSelectedOne: function (clickX, clickY, isEnemyFilter, unitBuildingFilter, isFlyingFilter, customFilter) {
		var distance = function (chara) {
			return (clickX - chara.posX()) * (clickX - chara.posX()) + (clickY - chara.posY()) * (clickY - chara.posY());//Math.pow2
		};
		//Initial

		//    console.log("usando esta")
		var selectedOne = {}, charas = [];
		switch (unitBuildingFilter) {
			case true:
				charas = Unit.allUnits;
				break;
			case false:
				charas = Building.allBuildings;
				break;
			default:
				charas = Unit.allUnits.concat(Building.allBuildings);
		}
		switch (isEnemyFilter) {
			case true: case false:
				charas = charas.filter(function (chara) {
					return chara.isEnemy() == isEnemyFilter;
				});
				break;
			case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
				charas = charas.filter(function (chara) {
					return chara.team == isEnemyFilter;
				});
				break;
			case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7':
				charas = charas.filter(function (chara) {
					return chara.team != isEnemyFilter;
				});
		}
		if (isFlyingFilter != null) {
			charas = charas.filter(function (chara) {
				return chara.isFlying == isFlyingFilter;
			});
		}
		//customFilter is filter function
		if (customFilter != null) {
			charas = charas.filter(customFilter);
		}
		//Find nearest one
		selectedOne = charas.filter(function (chara) {
			return chara.status != 'dead' && chara.includePoint(clickX, clickY);
		}).sort(function (chara1, chara2) {
			return distance(chara1) - distance(chara2);
		})[0];
		if (!selectedOne) selectedOne = {};

		/*	if (  selectedOne.name!= undefined)
			console.log("selected " + selectedOne.name );*/
		return selectedOne;
	},
	getInRangeOnes: function (clickX, clickY, range, isEnemyFilter, unitBuildingFilter, isFlyingFilter, customFilter) {
		//Initial
		var selectedOnes = [], charas = [];
		switch (unitBuildingFilter) {
			case true:
				charas = Unit.allUnits;
				break;
			case false:
				charas = Building.allBuildings;
				break;
			default:
				charas = Unit.allUnits.concat(Building.allBuildings);
		}
		switch (isEnemyFilter) {
			case true: case false:
				charas = charas.filter(function (chara) {
					return chara.isEnemy() == isEnemyFilter;
				});
				break;
			case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
				charas = charas.filter(function (chara) {
					return chara.team == isEnemyFilter;
				});
				break;
			case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7':
				charas = charas.filter(function (chara) {
					return chara.team != isEnemyFilter;
				});
		}
		if (isFlyingFilter != null) {
			charas = charas.filter(function (chara) {
				return chara.isFlying == isFlyingFilter;
			});
		}
		//customFilter is filter function
		if (customFilter != null) {
			charas = charas.filter(customFilter);
		}
		//Find in range ones
		selectedOnes = charas.filter(function (chara) {
			return chara.status != 'dead' && chara.insideSquare({ centerX: clickX, centerY: clickY, radius: range });
		});
		return selectedOnes;
	},
	//For test use
	getSelected: function () {
		return Unit.allUnits.concat(Building.allBuildings).filter(function (chara) {
			return chara.selected;
		});
	},
	showInfoFor: function (chara) {
		//Show selected living unit info
		if (Game.selectedUnit instanceof Gobj && Game.selectedUnit.status != "dead") {
			//Display info
			$('div.panel_Info>div[class*="info"]').show();
			$('div.infoCenter p.kill').hide();
			$('div.infoCenter p.damage').hide();
			//Draw selected unit portrait
			if (chara.portrait) $('div.infoLeft div[name="portrait"]')[0].className = chara.portrait;//Override portrait
			else {


				if (Game.selectedUnit instanceof Unit)
					$('div.infoLeft div[name="portrait"]')[0].className = Game.selectedUnit.name;
				if (Game.selectedUnit instanceof Building)
					$('div.infoLeft div[name="portrait"]')[0].className =
						Game.selectedUnit.attack ? Game.selectedUnit.inherited.inherited.name : Game.selectedUnit.inherited.name;

			}


				if (chara.name == "Civilian") {
                  //  console.log(chara.name)

                    //	console.log(" chara id " + chara.id + "life/hp "+chara.life+ "/" + chara.get('HP')  )

                    $('div.infoLeft span._Health')[0].style.color = "" + Game.selectedUnit.id + Game.selectedUnit.lifeStatus();
                    $('div.infoLeft span.life')[0].innerHTML = Game.selectedUnit.life >> 0;
                    $('div.infoLeft span.HP')[0].innerHTML = "/ " +Game.selectedUnit.get('HP');


                }else{
					  //$('div.infoLeft span._Health')[0].style.color =  yellow ;

                    $('div.infoLeft span.life')[0].innerHTML = "";
                    $('div.infoLeft span.HP')[0].innerHTML = "";

				}
		}
		else {
			//Hide info
			$('div.panel_Info>div').hide();
		}
	},
	refreshInfo: function () {
		Game.showInfoFor(Game.selectedUnit);
	},
	changeSelectedTo: function (chara) {
		Game.selectedUnit = chara;

		//console.log( chara.name )
		Button.equipButtonsFor(chara);
		if (chara instanceof Gobj) {
			chara.selected = true;
		}
		Game.showInfoFor(chara);
	},
	draw: function (chara) {
		//Can draw units and no-rotate bullets
		if (!(chara instanceof Gobj)) return;//Will only show Gobj
		if (chara.status == "dead") return;//Will not show dead
		//Won't draw units outside screen
		if (!chara.insideScreen()) return;
		//Choose context
		var cxt = ((chara instanceof Unit) || (chara instanceof Building)) ? Game.cxt : Game.frontCxt;
		//Draw shadow
		cxt.save();
		//cxt.shadowBlur=50;//Different blur level on Firefox and Chrome, bad performance
		cxt.shadowOffsetX = (chara.isFlying) ? 5 : 3;
		cxt.shadowOffsetY = (chara.isFlying) ? 20 : 8;
		cxt.shadowColor = "rgba(0,0,0,0.4)";
		//Close shadow for burrowed
		if (chara.buffer.Burrow) cxt.shadowOffsetX = cxt.shadowOffsetY = 0;
		//Draw invisible
		if (chara['isInvisible' + Game.team] != null) {
			cxt.globalAlpha = (chara.isEnemy() && chara['isInvisible' + Game.team]) ? 0 : 0.5;
			if (chara.burrowBuffer) {
				if (chara.isEnemy()) {
					if (!chara['isInvisible' + Game.team]) cxt.globalAlpha = 1;
				}
				else cxt.globalAlpha = 1;
			}
		}
		//Draw unit or building
		var imgSrc;
		if (chara instanceof Building) {
			if (chara.source) imgSrc = sourceLoader.sources[chara.source];
			else {
				imgSrc = sourceLoader.sources[chara.attack ? chara.inherited.inherited.name : chara.inherited.name];
			}
		}


		//Unit, not building
		else imgSrc = sourceLoader.sources[chara.source ? chara.source : chara.name];

		if (chara.isMineral) {
			imgSrc = sourceLoader.sources['mineral'];
			//console.log("cargando un mineral");
		}
		//Convert position
		var charaX = (chara.x - Map.offsetX) >> 0;
		var charaY = (chara.y - Map.offsetY) >> 0;
		//Same image in different directions
		if (chara.direction == undefined) {
			var _left = chara.imgPos[chara.status].left;
			var _top = chara.imgPos[chara.status].top;
			//Multiple actions status
			if (_left instanceof Array || _top instanceof Array) {
				cxt.drawImage(imgSrc,
					_left[chara.action], _top[chara.action], chara.width, chara.height,
					charaX, charaY, chara.width, chara.height);
			}
			//One action status
			else {
				cxt.drawImage(imgSrc,
					_left, _top, chara.width, chara.height,
					charaX, charaY, chara.width, chara.height);
			}
		}
		//Different image in different directions
		else {
			var _left = chara.imgPos[chara.status].left[chara.direction];
			var _top = chara.imgPos[chara.status].top[chara.direction];
			//Multiple actions status
			if (_left instanceof Array || _top instanceof Array) {
				cxt.drawImage(imgSrc,
					_left[chara.action], _top[chara.action], chara.width, chara.height,
					charaX, charaY, chara.width, chara.height);

				if (chara.isMineral) {
					console.log("cargando un mineral 1");
				}
			}
			//One action status
			else {
				//console.log(imgSrc);
				if (chara.isMineral) {
					//console.log(imgSrc );
					cxt.drawImage(imgSrc,
						_left, _top, 500, 500,
						charaX, charaY, 96, 96);
					//console.log("cargando un mineral1 "+ _left +" " + _top + " " + charaX + " " + charaY );
				} else {
					cxt.drawImage(imgSrc,
						_left, _top, chara.width, chara.height,
						charaX, charaY, chara.width, chara.height);
				}
			}
		}
		//Remove shadow
		cxt.restore();
		//Draw HP if has selected and is true
		if (chara.selected == true) {
			cxt = Game.frontCxt;
			//Draw selected circle
			cxt.strokeStyle = (chara.isEnemy()) ? "red" : "green";//Distinguish enemy

			if (chara.carryingResources) {
				cxt.strokeStyle = 'blue'; //poner halo azul en el trabajador que carga...en teorio
			}

			if (chara.isMineral) { //poner halo azul en el mineral
				cxt.strokeStyle = 'blue';
			}
			///cxt.strokeStyle=(chara.isEnemy())?"red":"green";//Distinguish enemy
			cxt.lineWidth = 2;//Cannot see 1px width circle clearly
			cxt.beginPath();
			cxt.arc(chara.posX() - Map.offsetX, chara.posY() - Map.offsetY, chara.radius(), 0, 2 * Math.PI);
			cxt.stroke();
			//Draw HP bar and SP bar and magic bar
			cxt.globalAlpha = 1;
			cxt.lineWidth = 1;
			var offsetY = -6 - (chara.MP ? 5 : 0) - (chara.SP ? 5 : 0);

			cxt.strokeStyle = "black";

			if (!chara.isMineral) { //poner halo azul en el mineral
				var lifeRatio = chara.life / chara.get('HP');
				cxt.fillStyle = (lifeRatio > 0.7) ? "green" : (lifeRatio > 0.3) ? "yellow" : "red";//Distinguish life
				cxt.fillRect(chara.x - Map.offsetX, chara.y - Map.offsetY + offsetY, chara.width * lifeRatio, 5);
				cxt.strokeRect(chara.x - Map.offsetX, chara.y - Map.offsetY + offsetY, chara.width, 5);

				if (chara.carryingResources) {
					var offsetY = -10;
					cxt.fillStyle = "darkviolet";
					cxt.fillRect(chara.x - Map.offsetX, chara.y - Map.offsetY + offsetY, chara.width * lifeRatio, 5);
					cxt.strokeRect(chara.x - Map.offsetX, chara.y - Map.offsetY + offsetY, chara.width, 5);
				}
			}/* else {
				var lifeRatio = chara.resources / chara.HP;
				cxt.fillStyle = (lifeRatio > 0.7) ? "blue" : (lifeRatio > 0.3) ? "cyan" : "white";//Distinguish life
				cxt.fillRect(chara.x - Map.offsetX, chara.y - Map.offsetY + offsetY, chara.width * lifeRatio, 5);
				cxt.strokeRect(chara.x - Map.offsetX, chara.y - Map.offsetY + offsetY, chara.width, 5);
			}*/

		}
	},
	drawEffect: function (chara) {
		//Can draw units and no-rotate bullets
		if (!(chara instanceof Burst)) return;//Will only show Burst
		if (chara.status == "dead") return;//Will not show dead
		//Won't draw units outside screen
		if (!chara.insideScreen()) return;
		//Choose context
		var cxt = Game.frontCxt;
		//Draw shadow
		cxt.save();
		//cxt.shadowBlur=50;//Different blur level on Firefox and Chrome, bad performance
		cxt.shadowOffsetX = (chara.isFlying) ? 5 : 3;
		cxt.shadowOffsetY = (chara.isFlying) ? 20 : 8;
		cxt.shadowColor = "rgba(0,0,0,0.4)";
		var imgSrc = sourceLoader.sources[chara.name];
		//Convert position
		var charaX = (chara.x - Map.offsetX) >> 0;
		var charaY = (chara.y - Map.offsetY) >> 0;
		var _left = chara.imgPos[chara.status].left;
		var _top = chara.imgPos[chara.status].top;
		//Will stretch effect if scale
		var times = chara.scale ? chara.scale : 1;
		//Multiple actions status
		if (_left instanceof Array || _top instanceof Array) {
			//	console.log(" fuente " + imgSrc )
			if (imgSrc)//checar bug
				cxt.drawImage(imgSrc,
					_left[chara.action], _top[chara.action], chara.width, chara.height,
					charaX, charaY, chara.width * times >> 0, chara.height * times >> 0);
		}
		//One action status
		else {
			if (imgSrc)//checar bug
				cxt.drawImage(imgSrc,
					_left, _top, chara.width, chara.height,
					charaX, charaY, chara.width * times >> 0, chara.height * times >> 0);
		}
		//Remove shadow
		cxt.restore();
	},
	drawBullet: function (chara) {
		//Can draw bullets need rotate
		if (!(chara instanceof Bullets)) return;//Will only show bullet
		if (chara.status == "dead") return;//Will not show dead
		//Won't draw bullets outside screen
		if (!chara.insideScreen()) return;
		//Draw unit
		var imgSrc = sourceLoader.sources[chara.name];
		var _left = chara.imgPos[chara.status].left;
		var _top = chara.imgPos[chara.status].top;
		//Convert position
		var centerX = (chara.posX() - Map.offsetX) >> 0;
		var centerY = (chara.posY() - Map.offsetY) >> 0;
		//Rotate canvas
		Game.frontCxt.save();
		//Rotate to draw bullet
		Game.frontCxt.translate(centerX, centerY);
		Game.frontCxt.rotate(-chara.angle);
		//Draw shadow
		//Game.frontCxt.shadowBlur=50;//Different blur level on Firefox and Chrome, bad performance
		Game.frontCxt.shadowOffsetX = (chara.owner.isFlying) ? 5 : 3;
		Game.frontCxt.shadowOffsetY = (chara.owner.isFlying) ? 20 : 5;
		Game.frontCxt.shadowColor = "rgba(0,0,0,0.4)";
		//Game.frontCxt.shadowColor="rgba(255,0,0,1)";
		//Multiple actions status
		if (_left instanceof Array || _top instanceof Array) {
			Game.frontCxt.drawImage(imgSrc,
				_left[chara.action], _top[chara.action], chara.width, chara.height,
				-chara.width / 2 >> 0, -chara.height / 2 >> 0, chara.width, chara.height);
		}
		//One action status
		else {
			Game.frontCxt.drawImage(imgSrc,
				_left, _top, chara.width, chara.height,
				-chara.width / 2 >> 0, -chara.height / 2 >> 0, chara.width, chara.height);
		}
		//Rotate canvas back and remove shadow
		Game.frontCxt.restore();
		//Below 2 separated steps might cause mess
		//Game.frontCxt.translate(-centerX,-centerY);
		//Game.frontCxt.rotate(chara.angle);
	},
	drawInfoBox: function () {
		//Update selected unit active info which need refresh
		if (Game.selectedUnit instanceof Gobj && Game.selectedUnit.status != "dead") {
			//Update selected unit life,shield and magic
			var lifeRatio = Game.selectedUnit.life / Game.selectedUnit.get('HP');
			$('div.infoLeft span._Health')[0].style.color = ((lifeRatio > 0.7) ? "green" : (lifeRatio > 0.3) ? "yellow" : "red");
			$('div.infoLeft span.life')[0].innerHTML = Game.selectedUnit.life >> 0;
			/* if (Game.selectedUnit.SP) {
				 $('div.infoLeft span.shield')[0].innerHTML=Game.selectedUnit.shield>>0;
			 }
			 if (Game.selectedUnit.MP) {
				 $('div.infoLeft span.magic')[0].innerHTML=Game.selectedUnit.magic>>0;
			 }*/
			//Update selected unit kill
			//  if (Game.selectedUnit.carryingResources!=null){
			//      $('div.infoCenter p.carrying span')[0].innerHTML=Game.selectedUnit.carryingResources? "carrying":"empty";
			// }
		}
	},
	drawSourceBox: function () {
		//Update min, gas, curMan and totalMan
		// $('div.resource_Box span.mineNum')[0].innerHTML=Resource[Game.team].mine;

		$('div.resource_Box span.mineNum')[0].innerHTML = Game.resources;
		//$('div.resource_Box span.gasNum')[0].innerHTML=Resource[Game.team].gas;
		//  $('div.resource_Box span.gasNum')[0].innerHTML=20000;

		$('div.resource_Box span.manNum>span')[0].innerHTML = Resource[Game.team].curMan;

		// $('div.resource_Box span.manNum>span')[0].innerHTML=203;
		$('div.resource_Box span.manNum>span')[1].innerHTML = Resource[Game.team].totalMan;
		//Check if man overflow
		$('div.resource_Box span.manNum')[0].style.color = (Resource[Game.team].curMan > Resource[Game.team].totalMan) ? "red" : "#00ff00";
	},
	drawProcessingBox: function () {
		//Show processing box if it's processing
		var processing = Game.selectedUnit.processing;
		//Can disable this filter for testing
		if (processing && Game.selectedUnit.team == Game.team) {
			$('div.upgrading div[name="icon"]')[0].className = processing.name;
			//var percent=((new Date().getTime()-processing.startTime)/(processing.time)+0.5)>>0;
			var percent = ((Game.mainTick - processing.startTime) * 100 / (processing.time) + 0.5) >> 0;
			$('div.upgrading div[name="processing"] span')[0].innerHTML = percent;
			$('div.upgrading div[name="processing"] div.processedBar')[0].style.width = percent + '%';
			$('div.upgrading').attr('title', processing.name).show();
		}
		else {
			//Select nothing, show replay progress
			if (Game.replayFlag && Game.endTick > 0) {
				$('div.upgrading div[name="icon"]')[0].className = 'Replay';
				var percent = (Game.mainTick * 100 / (Game.endTick) + 0.5) >> 0;
				$('div.upgrading div[name="processing"] span')[0].innerHTML = percent;
				$('div.upgrading div[name="processing"] div.processedBar')[0].style.width = percent + '%';
				$('div.upgrading').attr('title', 'Replay Progress').show();
				if (!(Game.selectedUnit instanceof Gobj)) {
					$('div.infoRight').show();
					$('div.upgraded').hide();
				}
			}
			else $('div.upgrading').removeAttr('title').hide();
		}
	},
	refreshMultiSelectBox: function () {
		var divs = $('div.override div.multiSelection div');
		//Only refresh border color on current multiSelect box
		for (var n = 0; n < divs.length; n++) {
			divs[n].style.borderColor = Game.allSelected[n].lifeStatus();
			if (Game.allSelected[n].carryingResources) divs[n].style.borderColor = 'darkviolet';
		}
	},
	drawMultiSelectBox: function () {
		//Clear old icons
		$('div.override div.multiSelection')[0].innerHTML = '';
		//Redraw all icons

		Game.allSelected.forEach(function (chara, N) {
			//	console.log("carryinng")
			var node = document.createElement('div');
			node.setAttribute('name', 'portrait');
			//Override portrait
			if (chara.portrait) node.className = chara.portrait;
			else node.className = (chara instanceof Building) ? (chara.attack ? chara.inherited.inherited.name : chara.inherited.name) : chara.name;
			node.title = chara.name;
			//node.style.borderColor=chara.lifeStatus();
			if (chara.carryingResources) {
				node.style.borderColor = 'darkviolet';

			}


			node.onclick = function () {
				//Selection execute

				if (!(chara.isEnemy())) {
					// chara.sound.selected.play();
				}
				Game.unselectAll();
				Game.changeSelectedTo(chara);
				Game.selectedUnit = chara;
				Game.allSelected = [chara];
				//console.log("cambiando seleccion a "+chara.id) ;
				//Single selection mode
				$('div.override').hide();
				$('div.override div.multiSelection').hide();
			};


			//node.style.borderColor= 'yellow';
			$('div.override div.multiSelection')[0].appendChild(node);
		});
		var iconNum = $('div.override div.multiSelection div').length;
		//Adjust width if unit icon space overflow
		$('div.override div.multiSelection').css('width', (iconNum > 12 ? Math.ceil(iconNum / 2) * 55 : 330) + 'px');
		//Adjust background position after added into DOM, nth starts from 1st(no 0th)
		for (var n = 1; n <= iconNum; n++) {
			var bgPosition = $('div.override div.multiSelection div:nth-child(' + n + ')').css('background-position');
			bgPosition = bgPosition.split(' ').map(function (pos) {
				return parseInt(pos) * 0.75 + 'px';
			}).join(' ');
			$('div.override div.multiSelection div:nth-child(' + n + ')').css('background-position', bgPosition);
		}
	},
	animation: function () {
		Game.animation.loop = function () {
			//Process due commands for current frame before drawing
			var commands = Game.commands[Game.mainTick];
			if (commands instanceof Array) {
				for (var N = 0; N < commands.length; N++) {
					//console.log("ejecutando "  + commands[N]);
					commands[N]();
				}
				delete Game.commands[Game.mainTick];
			}
			/************ Draw part *************/
			//Clear all canvas
			Game.cxt.clearRect(0, 0, Game.HBOUND, Game.VBOUND);
			Game.frontCxt.clearRect(0, 0, Game.HBOUND, Game.VBOUND);
			//DrawLayer0: Refresh map if needed
			if (mouseController.mouseX < Map.triggerMargin) Map.needRefresh = "LEFT";
			if (mouseController.mouseX > (Game.HBOUND - Map.triggerMargin)) Map.needRefresh = "RIGHT";
			if (mouseController.mouseY < Map.triggerMargin) Map.needRefresh = "TOP";
			if (mouseController.mouseY > (Game.VBOUND - Map.triggerMargin)) Map.needRefresh = "BOTTOM";
			if (Map.needRefresh) {
				Map.refresh(Map.needRefresh);
				Map.needRefresh = false;
			}


			if ((Game.mainTick) % 10 == 0) {
				//record heatmap each 2 seconds
				HeatMap.update(Game.mainTick);
			}

			if ((Game.mainTick) % 50 == 0) {
				//record heatmap each 5 seconds
				Game.recordSnapshot();
			}


			//DrawLayer1: Show all buildings
			for (var N = 0; N < Building.allBuildings.length; N++) {
				var build = Building.allBuildings[N];
				//GC
				if (build.status == "dead") {
					Building.allBuildings.splice(N, 1);
					N--;//Next unit come to this position
					continue;
				}
				//Draw
				Game.draw(build);
			}
			//DrawLayer2: Show all existed units
			for (var N = 0; N < Unit.allUnits.length; N++) {
				var chara = Unit.allUnits[N];
				//GC
				if (chara.status == "dead") {
					Unit.allUnits.splice(N, 1);
					N--;
					continue;
				}
				//Draw
				Game.draw(chara);
			}
			//DrawLayer3: Draw all bullets
			for (var N = 0; N < Bullets.allBullets.length; N++) {
				var bullet = Bullets.allBullets[N];
				//GC
				if (bullet.status == "dead" && bullet.used) {
					Bullets.allBullets.splice(N, 1);
					N--;
					continue;
				}
				Game.drawBullet(bullet);
			}
			//DrawLayer4: Draw effects above units
			for (var N = 0; N < Burst.allEffects.length; N++) {
				var effect = Burst.allEffects[N];
				//GC
				if (effect.status == "dead" || (effect.target && effect.target.status == "dead")) {
					Burst.allEffects.splice(N, 1);
					N--;
					continue;
				}
				Game.drawEffect(effect);
			}
			//DrawLayer5: Draw drag rect
			if (mouseController.drag) {
				Game.cxt.lineWidth = 3;
				Game.cxt.strokeStyle = "green";
				Game.cxt.strokeRect(mouseController.startPoint.x, mouseController.startPoint.y,
					mouseController.endPoint.x - mouseController.startPoint.x,
					mouseController.endPoint.y - mouseController.startPoint.y);
			}
			//DrawLayerBottom: Draw info box and resource box
			//Game.drawInfoBox();
			Game.drawSourceBox();
			Game.drawProcessingBox();
			/************ Calculate for next frame *************/
			//Clock ticking

			if (Game.inGame)
				Game.mainTick++;
			//For network mode
			if (Multiplayer.ON) {

				console.log("tick multiplayer on")
				//Send current tick to server
				Multiplayer.webSocket.send(JSON.stringify({
					type: 'tick',
					tick: Game.mainTick,
					cmds: (Multiplayer.cmds.length ? Multiplayer.cmds : null)
				}));
			}
			else {
				//Record user moves and execute if have
				if (Multiplayer.cmds.length > 0) {
					//	console.log("comando" +Multiplayer.cmds)
					//MainTick++ just before this code piece
					Game.replay[Game.mainTick] = $.extend([], Multiplayer.cmds);
					//Execute command
					Multiplayer.parseTickCmd({
						tick: Game.mainTick,
						cmds: Multiplayer.cmds
					});
				}
			}
			//Clear commands
			if (Multiplayer.cmds.length > 0) {
				Multiplayer.cmds = [];
			}
			//Postpone play frames and AI after drawing (consume time)
			Building.allBuildings.concat(Unit.allUnits).concat(Bullets.allBullets).concat(Burst.allEffects).forEach(function (chara) {
				//Add this makes chara intelligent for attack
				if (chara.AI) {


					if (chara.name !== 'Mineral') {
						//console.log("ciclo ai  " + chara.name );
						if (chara.name === 'CompetitorA') {
							chara.AIForager();
							//	console.log("ciclo ai22");
						} else {

							//console.log("ciclo ai3333");
							chara.AI();
						}
					}
				}
				//Judge reach destination
				if (chara instanceof Unit) Referee.judgeReachDestination(chara);
				//Join timers together
				chara.playFrames();
			});
			//Will invite Mr.Referee to make some judgments
			Referee.tasks.forEach(function (task) {
				Referee[task]();
			});
			//Release selected unit when unit died or is invisible enemy
			if (Game.selectedUnit instanceof Gobj) {
				if (Game.selectedUnit.status == "dead" || (Game.selectedUnit['isInvisible' + Game.team] && Game.selectedUnit.isEnemy())) {
					Game.selectedUnit.selected = false;
					Game.changeSelectedTo({});
				}
			}
		};
		if (Multiplayer.ON) {
			Game._timer = setInterval(function () {
				if (Game.mainTick < Game.serverTick) Game.animation.loop();
			}, Game._frameInterval);
		}
		else Game.startAnimation();
	},
	stopAnimation: function () {
		if (Game._timer != -1) clearInterval(Game._timer);
		Game._timer = -1;
	},
	startAnimation: function () {
		if (Game._timer == -1) Game._timer = setInterval(Game.animation.loop, Game._frameInterval);
	},
	stop: function (charas) {
		charas.forEach(function (chara) {
			chara.stop();
		});
		Game.stopAnimation();
	},
	win: function () {
		this.leaveEarly = true;
		Game.stop(Unit.allUnits);


		if (Multiplayer.ON) {
			Multiplayer.webSocket.send(JSON.stringify({
				type: 'getReplay'
			}));
		}
		else {
			Game.saveReplayIntoDB();
		}



	},
	lose: function () {
		Game.stop(Unit.allUnits);
		//console.log("lose function")
		if (Multiplayer.ON) {
			Multiplayer.webSocket.send(JSON.stringify({
				type: 'getReplay'
			}));
		}
		else {
			//Game.saveReplay();
			//console.log("Save replay lose")
			Game.saveReplayIntoDB();
		}


		//Self destruction to prevent duplicate fadeout
		//	Game.lose=function(){};
	},

	limpiaNiebla: function () {

		Map.inicio = false;

	},

	recordSnapshot: function () {

		HeatMap.recordInfo(Game.mainTick);

	//	console.log("guardando gametik: " + Game.mainTick + " -> participant " + Game.resources, "competitor:" + Game.competitorResources);

		var statusOurunits = "";

		//console.log("unidades " + Unit.allUnits.length)

		for (var N = 0; N < Unit.allUnits.length; N++) {
			var selectedOne = Unit.allUnits[N];
			     
			var pos = { x: selectedOne.posX(), y:selectedOne.posY() };
			Multiplayer.cmds.push(
				JSON.stringify(
					{

						type: 'snapshot',
				uids: { name: selectedOne.name , id : selectedOne.id,life : selectedOne.life , foraging:selectedOne.foraging, carryingResources : selectedOne.carryingResources , resources:selectedOne.resources  },
           
				pos: pos	}
			));
			
		}

		Multiplayer.cmds.push(
			JSON.stringify(
				{

					type: 'Map',
			uids: { mapOffsetX: Map.offsetX , mapOffsetY: Map.offsetY },
	   	}
		));

		//console.log("comando" +Multiplayer.cmds)
		Game.historialResources[Game.mainTick] = {
			"participant": Game.resources, "competitor": Game.competitorResources
		}

	}
	
	,
	showWarning: function (msg, interval) {
		//Default interval

		if (!interval) interval = 10000;
		//Show message for a period
		$('div.warning_Box').html(msg).show();
		//Hide message after a period
		setTimeout(function () {
			$('div.warning_Box').html('').hide();
		}, interval);

	},
	showMessage: function () {
		//Clossure timer
		var _timer = 0;
		return function (msg, interval) {
			//Default interval
			if (!interval) interval = 3000;
			//Show message for a period
			$('div.message_Box').append('<p>' + msg + '</p>').show();
			//Can show multiple lines together
			if (_timer) clearTimeout(_timer);
			//Hide message after a period
			_timer = setTimeout(function () {
				$('div.message_Box').html('').hide();
			}, interval);
		};
	}(),
	//Return from 0 to 0.99
	getNextRandom: (function () {
		//Clossure variable and function
		var rands = [];
		var getRands = function () {
			//Use current tick as seed
			var seed = Game.mainTick + Game.randomSeed;
			var rands = [];
			for (var N = 0; N < 100; N++) {
				//Seed grows up in range 100
				seed = (seed * 21 + 3) % 100;
				rands.push(seed);
			}
			return rands;
		};
		return function () {
			//If all rands used, generate new ones
			if (rands.length == 0) rands = getRands();
			return rands.shift() / 100;
		};
	})(),
	resizeWindow: function () {
		//Update parameters
		Game.HBOUND = innerWidth;//$('body')[0].scrollWidth
		Game.VBOUND = innerHeight;//$('body')[0].scrollHeight
		Game.infoBox.width = Game.HBOUND - 295;
		Game.infoBox.y = Game.VBOUND - 110;
		//Resize canvas
		$('#GamePlay>canvas').attr('width', Game.HBOUND);//Canvas width adjust
		$('#GamePlay>canvas').attr('height', Game.VBOUND - Game.infoBox.height + 5);//Canvas height adjust
		//Resize panel_Info
		//$('div.panel_Info')[0].style.width=((Game.HBOUND-295)+'px');
		$('div.panel_Info')[0].style.width = ((Game.HBOUND - 295) + 'px');
		if (Map.ready) {
			//Update map inside-stroke size
			Map.insideStroke.width = (130 * Game.HBOUND / Map.getCurrentMap().width) >> 0;
			Map.insideStroke.height = (130 * Game.VBOUND / Map.getCurrentMap().height) >> 0;
			//Redraw background
			Map.drawBg();
			//Need re-calculate fog immediately


			Map.drawFogAndMinimap();
		}
	},
	getCurrentTs: function () {
		var now = new Date();
		var formatNum = function (num) {
			if (num < 10) return ('0' + num);
			else return num.toString();
		};
		var timestamp = now.getFullYear() + '-' + formatNum(now.getMonth() + 1) + '-' + formatNum(now.getDate()) + ' '
			+ formatNum(now.getHours()) + ':' + formatNum(now.getMinutes()) + ':' + formatNum(now.getSeconds());
		return timestamp;
	},
	//New H5 features demo
	pauseWhenHide: function () {
		//Add pause when hide window
		$(document).on('visibilitychange', function () {
			if ($(document).attr('hidden') != null) {
				if ($(document).attr('hidden')) {
					Button.pauseHandler();
					$('title').html('Experiment Paused...');
				}
				else {
					Button.playHandler();
					$('title').html('Experiment running');
				}
			}
		});
	},

	saveReplayIntoDB: function () {


		//	console.log("****** " + Game.modoTutorial )
		//	console.log ( JSON.stringify ( HeatMap.historialPredator));
		//	console.log(" replay " +  JSON.stringify (  Game.replay ));
		//console.log(" survey " +   Game.surveyData );

		if (Game.modoTutorial) {

			Game.modoTutorial = false;

			$.ajax({
				type: "POST",
				url: 'php/submissionParticipantStarted.php',
				data: {
					replay2: JSON.stringify(Game.replay),
					participantId: Game.idParticipant,
					historial: JSON.stringify(HeatMap.historial),
					historialPredator: JSON.stringify(HeatMap.historialPredator),
					idealTutorial: Game.totalResources,

					historialResources: JSON.stringify(Game.historialResources),
					survey: Game.surveyData
				},
				success: function (data) {
					console.log(" Success. saveReplayIntoDB grabado termno tutorial" + data);

				$('#textoBye').innerHTML = 'Dear participant, thank you very much for your participation in this online study If after completion of this study you have any questions or concerns regarding this experiment,<br/>	you might contact at all times the test leader by email to:<br/><br/><br/>d.o.verdugapalencia@qmul.ac.uk<br/><button type="button" onclick="Game.finish()">	Click here to complete your participation!</button><br/>';
					Game.layerSwitchTo("GameStart");


					/**Hack puerco *
					 */
					var json = {
						title: "Online Mini Gaming Tasks",
						showProgressBar: "top",

						pages:

							[

								{
									title: "Tutorial Finished",
									questions:
										[
											{



												type: "html",
												name: "finishTutorial",
												html: " <h3>You finished the tutorial!!!</h3>After the previous practice session, now you are ready to take part in the main session.<br/><br>The main task will last 5 minutes</br>. The game controls are identical to the previous controls in the practice session."
											}
										]
								}


							]
					};


					Survey
						.StylesManager
						.applyTheme("winterstone");
					var survey = new Survey.Model(json);

					survey.onComplete.add(function (result) {
						console.log(" enviando a session real");
						$('.sv_body.sv_completed_page').hide();
						//   document.querySelector('#surveyResult').innerHTML = "result: " + JSON.stringify(result.data);
						$(function () {






							Game.teams = {};
							Game.mainTick = 0;
							Game.commands = {};

							Game._frameInterval = 100;
							Game.replay = {};
							Game.resources = 0;
							Game.selectedUnit = {};
							Game.totalResources = 0;
							Game.competitorResources = 0;
							Game.historialResources = {};

							Game.leaveEarly = false;

							Burst.allEffects = [];
							clearInterval(Game.refreshIntervalId);
							console.log("***********************valores reseteados")


							Game.play();

						});
					});

					survey.render("surveyElement");

				}
			});

		} else {


			console.log("update participant performance session")

			$.ajax({
				type: "POST",
				url: 'php/updateParticipant.php',
				data: {
					commandsPerformance: JSON.stringify(Game.replay),
					participantId: Game.idParticipant,
					occupancy: JSON.stringify(HeatMap.historial),
					historialPredator: JSON.stringify(HeatMap.historialPredator),
					ideal: Game.totalResources,
					historialResources: JSON.stringify(Game.historialResources),
					survey: Game.surveyData
				},
				success: function (data) {
					//alert("grabado");
					console.log("grabado " + data);


					$('#textoBye').innerHTML = 'Dear participant, thank you very much for your participation in this online study If after completion of this study you have any questions or concerns regarding this experiment,<br/>	you might contact at all times the test leader by email to:<br/><br/><br/>d.o.verdugapalencia@qmul.ac.uk<br/><button type="button" onclick="Game.finish()">	Click here to complete your participation!</button><br/>';


					console.log(" termino performance")
					Game.layerSwitchTo("GameStart");


					/**Hack puerco *
					 */
					var json = {
						title: "Online Mini Gaming Tasks",
						showProgressBar: "top",

						pages:

							[

								{
									title: "Main Session Finished",
									questions:
										[
											{



												type: "html",
												name: "Summary",
												html: " <h2>Summary of Objectives of the Study.</h2>" +
													"You have just participated in a study that is designed to examine the way in which people approach a situation that is unfamiliar to them. Some people like to spend a lot of time gathering information and scouting things out before making a decision as to what to do, where others spend less time doing that the scouting, and more time on making decisions and taking action. The former is referred as explorative behaviour and the later is referred to as exploitative behaviour. This information could not be given to you before starting the study, as this could have severely altered your answers.								"
											}
										]
								}


							]
					};


					Survey
						.StylesManager
						.applyTheme("winterstone");
					var survey = new Survey.Model(json);

					survey.onComplete.add(function (result) {
						console.log("OnCompleteSegundo survey");
						$('.sv_body.sv_completed_page').hide();
						//   document.querySelector('#surveyResult').innerHTML = "result: " + JSON.stringify(result.data);
						$(function () {
							Game.finish();//fake, esto no jala
							console.log("END")
							//	window.location.reload();//conexion a prolific
						});
					});

					survey.render("surveyElement");

				}
			});






			Game.layerSwitchTo("Farewell");
			/**Hack puerco *
		 */



			Survey
				.StylesManager
				.applyTheme("winterstone");
			var survey = new Survey.Model(json);

			survey.onComplete.add(function (result) {
				console.log("initSreal");
				$('.sv_body.sv_completed_page').hide();
				//   document.querySelector('#surveyResult').innerHTML = "result: " + JSON.stringify(result.data);
				$(function () {
					//	Game.finish();//fake, esto no jala
				});
			});

			survey.render("surveyElement");



		}



	},
	//cosas de logica

	ExperimentCompleted: function () {

		window.location.href = "/caller/complete.php?cc=12345";

	}


	,
	getCondition: function () {

		/*
		$.ajax({
			type: "POST",
			url: 'php/getcondition.php',
			success: function (data) {

				console.log(data);
				var obj = jQuery.parseJSON(data);

				//Game.conditionExperiment = (parseInt(obj) % 4) + 1;
				Game.conditionExperiment = 2; //
				console.log( "Condition" + Game.conditionExperiment )//hay 5 condiciones
				//console.log("grabado");
				Game.createParticipant();
			}
		});

		*/

			Game.conditionExperiment = 5; //
			console.log( "Condition" + Game.conditionExperiment )//hay 5 condiciones
			Game.createParticipant();
			//}
	},


	reload: function () {
		console.log("reloading");
		/* TO DO */



	}
	,

	createParticipant: function () {
		console.log("se usara la condicion " + Game.conditionExperiment +" prolid" + Game.prolificID + " sessid "+ Game.sessionID );
		$.ajax({
			type: "POST",
			url: 'php/createparticipant.php',
			data: {
				conditionExp: Game.conditionExperiment,
				prolific_id : Game.prolificID,
				session_id : Game.sessionID
			},
			success: function (data) {

				console.log(" id Participant : " + data )
				var obj = jQuery.parseJSON(data);

				Game.idParticipant = parseInt(obj);

				//	console.log("se usara la condicion " + Game.conditionExperiment + " id " +  Game.idParticipant  );
			}
		});


	},

	finish: function () {

		console.log("Entrando a finish, llamnado ajax ph experimentCompleted")
		$.ajax({
			type: "POST",
			url: 'php/experimentCompleted.php',
			data: { id_participant: Game.idParticipant, conditionexp: Game.conditionExperiment },
			success: function (data2) {
				//alert("algodon" + data2)
				var obj = jQuery.parseJSON(data2);
				// window.location.reload()//aqui va regreso a Prolific
				console.log("returning to prolific " + Game.idParticipant + " " + Game.conditionExperiment)
				//alert("aqui mando a completar el estudio, sello la bd y ya" + Game.idParticipant + " " + Game.conditionExperiment );
				alert("Experiment completed. Going back to prolific")
				window.location.href ='https://app.prolific.ac/submissions/complete?cc=5XT0ZE8O';//experimento 2



			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert(xhr.status);
				alert(thrownError);
			}
		});

		//window.location.href = "/caller/complete.php?cc=12345";

		//location.reload();
	},

};
