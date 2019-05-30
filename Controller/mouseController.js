var mouseController = {
    down: false,
    drag: false,
    clickmap:new Audio(Game.CDN+'bgm/sonido4.wav')
        ,
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 0, y: 0 },
    isMultiSelect: function () {
        return keyController.shift;
    },
    isJoinTeam: function () {
        return keyController.ctrl;
    },
    leftClick: function (event) {
        //Mouse at (clickX,clickY)
        var offset = $('#fogCanvas').offset();
        var clickX = event.pageX - offset.left;
        var clickY = event.pageY - offset.top;
        //Intercept event inside infoBox


        if (clickY > Game.infoBox.y) return;
        //Selection mode
        if (Button.callback == null) {
            //Find selected one, convert position
            var selectedOne = Game.getSelectedOne(clickX + Map.offsetX, clickY + Map.offsetY);
            //Cannot select enemy invisible unit
            if ((selectedOne instanceof Gobj) && selectedOne['isInvisible' + Game.team] && selectedOne.isEnemy()) return;
            //Single select will unselect all units and only choose selected one
            //Multi select will keep selected status and do nothing
            if (!mouseController.isMultiSelect())
                Game.unselectAll();
            //If has selected one


            if (selectedOne instanceof Gobj) {

                /**/
                var pos = { x: (clickX + Map.offsetX), y: (clickY + Map.offsetY) };
                 //Handle user right click
                Multiplayer.cmds.push(JSON.stringify({
                    type: 'leftClickUnitSelected',
                    uids: {id : selectedOne.id,life : selectedOne.life , foraging:selectedOne.foraging, carryingResources : selectedOne.carryingResources , resources:selectedOne.resources  },
                   // uids: temporalCycle, 
                    
                    pos: pos

                }));
            /***/


            //Sound effect
            if (!(selectedOne.isEnemy()))
            {
                selectedOne.sound.selected.play();
            
            }    //Cannot multiSelect with enemy
            if (selectedOne.isEnemy() || (Game.selectedUnit.isEnemy && Game.selectedUnit.isEnemy())) {
                Game.unselectAll();
            }
            //Only selected one to show portrait
              Game.changeSelectedTo(selectedOne);
             selectedOne.sound.selected.play();
            //Add into allSelected if not included
            Game.addIntoAllSelected(selectedOne);

        }
        else {
            //Click null

            /**/

                this.clickmap.play();
            var pos = { x: (clickX + Map.offsetX), y: (clickY + Map.offsetY) };

          //  console.log("left click en " + pos.x + " ,  " + pos.y)
            //Handle user right click
            Multiplayer.cmds.push(JSON.stringify({
                
                type: 'leftClickMap',
                pos: pos

            }));
            /***/


            //console.log("unselect all")
            Game.changeSelectedTo({});
            Game.unselectAll();
        }


    }
        //Button mode
        else {
        //Callback

        console.log("ejecutando boton");
        Button.execute(event);
    }
        //Hide tooltip when click
        $('div.tooltip_Box').hide();
        //Login user statistic
        if(Multiplayer.statistic != null) Multiplayer.statistic.left++;
    },
rightClick: function (event, unlock, btn) {
    //	console.log("rightClick " + unlock + " btn " + btn );
    //Mouse at (clickX,clickY)
    var offset = $('#fogCanvas').offset();
    var clickX = event.pageX - offset.left;
    var clickY = event.pageY - offset.top;
    //Intercept event inside infoBox
    if (clickY > Game.infoBox.y) {
        //	console.log("return");
        return;
    }
    //Show right click cursor
    var pos = { x: (clickX + Map.offsetX), y: (clickY + Map.offsetY) };

          //  console.log("right click en " + pos.x + " ,  " + pos.y)

    //fin extra

                this.clickmap.play();
    new Burst.RightClickCursor(pos);
    //console.log("burst en posicion " +pos.x + " - " + pos.y + " chara " + chara.id )
    var charas = Game.allSelected.filter(function (chara) {
        //Can only control our alive unit
        //	console.log("rightClick2");
        return chara.team == Game.team && chara.status != "dead";
    });
    //Handle user right click

    //console.log("rightClick3");
    Multiplayer.cmds.push(JSON.stringify({

        type: 'rightClick',
        uids: Multiplayer.getUIDs(charas),
        
        pos: pos,
        unlock: Boolean(unlock),
        btn: btn
    }));
    //console.log("rightClick4");
    //Login user statistic
    if (Multiplayer.statistic != null) Multiplayer.statistic.right++;
},
rightClickHandler: function (charas, pos, unlock, btn) {
    //Find selected one or nothing
    //	console.log("rightClickHandler");
    var selectedEnemy = (charas.length > 0) ? Game.getSelectedOne(pos.x, pos.y, charas[0].team.toString()) : null;


    /**Logica para seleccionar minerales*/
    var selectedOne = Game.getSelectedOne(pos.x, pos.y);///extra
    if (selectedOne instanceof Gobj) {
        //Sound effect
        if (selectedOne.isMineral) {
            selectedOne.sound.selected.play();
            //Only selected one to show portrait


            //console.log("llendo al mineral")
            Game.changeSelectedTo(selectedOne);
        }



        else if (selectedOne instanceof Building.TerranBuilding.CommandCenter) {


            selectedOne.sound.selected.play();

            //Only selected one to show portrait
            Game.changeSelectedTo(selectedOne);

        }

    }



    /* fin logica para seleccionar minerales*/
    charas.forEach(function (chara) {
        //Sound effect
        if (!chara.isEnemy() && chara.sound.moving) {
            chara.sound.moving.play();

       }//Interrupt old destination routing
        if (selectedOne.isMineral) {
            //console.log("right click ssasobre mineral")
        }
        if (chara.destination) {
            //console.log("  charea desteination " + chara.destination );
            //Break possible dead lock
            if (chara.destination.next) chara.destination.next = null;
            delete chara.destination;
        }
        //Cancel possible hold
        if (chara.hold) {
            console.log("chara holdo");
            delete chara.AI;
            delete chara.findNearbyTargets;
            delete chara.hold;
            Button.refreshButtons();
        }
        //Unit cannot attack will always choose move mode
        var attackOrMove = (chara.attack) ? (selectedEnemy instanceof Gobj) : false;
        //aqui va el minar
        //Attack mode
        if (attackOrMove) {


            //console.log("otra cosa")

            if (chara.cannotMove() && !(chara.isInAttackRange(selectedEnemy))) return;
            //Intercept invisible enemy
            if (selectedEnemy['isInvisible' + Game.team]) {
                if (!chara.isEnemy()) Referee.voice('pError').play();
                return;
            }
            chara.targetLock = true;
            chara.attack(selectedEnemy);
        }
        //Move mode
        else {


           // console.log("move mode")


            if (selectedOne.isMineral && !chara.cannotMove()) {

                chara.foraging = true;
                chara.foragingPosition = selectedOne.pos;
                chara.forageLocation(selectedOne, pos)
                //console.log("seleccionado click derecho es el edificio ");

            } else
                if (selectedOne instanceof Building.TerranBuilding.CommandCenter && !chara.cannotMove()) {

                    //   console.log("seleccionado click derecho es el edificio "  + selectedOne.name);
                    /*				
                                            if( chara.carryingResources){
                                                console.log("si esta accareando" + chara.id );
                                            }
                                            else{
                                                console.log("no esta accareando" + chara.id );
                                            }
                    */
                    if (!chara.isMineral) {
                        chara.saveMinerals(pos)
                    }
                }


                else {
                    if (chara.cannotMove()) return;
                    //Only attackable units can stop attack
                    if (chara.attack) chara.stopAttack();
                    //Lock destination by default
                    chara.targetLock = !unlock;

                    /// console.log("move to " + pos.x + " , " + pos.y)
                    chara.moveTo(pos.x, pos.y);


                }



            //Record destination
        }
    });
},
dblClick: function () {
    //Multi select same type units
    if (!(Game.selectedUnit.isEnemy && Game.selectedUnit.isEnemy())) {
        var charas = Unit.allUnits.filter(function (chara) {
            return !(chara.isEnemy()) && chara.insideScreen() && (chara.name == Game.selectedUnit.name);
        });
        Game.addIntoAllSelected(charas);
    }
},
//Can control all units
toControlAll: function () {
    //For desktop
    if (!Game.isApp) {
        //Mouse left click
        $('#fogCanvas')[0].onclick = function (event) {
            event.preventDefault();
            if (mouseController.drag) {
                //End drag, onclick triggered after onmouseup, don't do default left click action
                mouseController.drag = false;
            }
            else {
                mouseController.leftClick(event);
            }
        };
        //Mouse right click
        $('#fogCanvas')[0].oncontextmenu = function (event) {
            //Prevent context menu show
            event.preventDefault();
            //Should not control units during replay
            if (Game.replayFlag) return;
            mouseController.rightClick(event);
            //Cancel pointer
            $('div.GameLayer').removeAttr('status');
            //Cancel callback
            Button.callback = null;
        };
        //Double click
        $('#fogCanvas')[0].ondblclick = function (event) {
            //Prevent screen select
            event.preventDefault();
            mouseController.dblClick();
        };
        //Mouse click start
        $('#fogCanvas')[0].onmousedown = function (event) {
            event.preventDefault();
            //Do not allow rectangular-multi-select with right click, only left clicks
            if (event.which === 3) {
                return;
            }
            if (!mouseController.down) {
                //Mouse at (clickX,clickY)
                var clickX = event.pageX - $('#fogCanvas').offset().left;
                var clickY = event.pageY - $('#fogCanvas').offset().top;
                mouseController.startPoint = { x: clickX, y: clickY };
                mouseController.down = true;
            }
        };
        //Mouse drag
        $('#fogCanvas')[0].onmousemove = function (event) {
            event.preventDefault();
            if (mouseController.down) {
                //Mouse at (clickX,clickY)
                var clickX = event.pageX - $('#fogCanvas').offset().left;
                var clickY = event.pageY - $('#fogCanvas').offset().top;
                mouseController.endPoint = { x: clickX, y: clickY };
                if (Math.abs(clickX - mouseController.startPoint.x) > 5 &&
                    Math.abs(clickY - mouseController.startPoint.y) > 5) {
                    mouseController.drag = true;
                }
            }
        };
        //Global client refresh map
        window.onmousemove = function (event) {
            event.preventDefault();
            //Mouse at (clickX,clickY)
            mouseController.mouseX = event.clientX;
            mouseController.mouseY = event.clientY;
        };
        //Mouse click end
        $('#fogCanvas')[0].onmouseup = function (event) {
            event.preventDefault();
            mouseController.down = false;
            if (mouseController.drag) {
                //Multi select inside rect
                Game.multiSelectInRect();
            }
        };
    }
    //Both sides
    $('div#GamePlay div').on('contextmenu', function (event) {
        event.preventDefault();
    });
    $('canvas[name="mini_map"]').on('click', function (event) {
        event.preventDefault();
        Map.clickHandler(event);
    });
    $('canvas[name="mini_map"]').on('contextmenu', function (event) {
        event.preventDefault();
        Map.dblClickHandler(event);
    });
}
};
