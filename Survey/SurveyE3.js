var json = {
    title: "Online Mini Gaming Tasks",
    showProgressBar: "top",
    pages:

        [
            /*
                        {
                            title: "Consent Form",
                            questions:
                                [
                                    {

                                        type: "html",
                                        name: "Information sheet",
                                        html: "<div id='consentForm' align='left'><img src='img/qmul/qmulHeader.png' class='centerQMUL' /><br/><h3 align='center'>Research study “Competitive Online Minigaming Tasks” information for participants</h3>"
                                            + "<br/>We would like to invite you to be part of this research project, if you would like to.  You should only agree to take part if you want to, it is entirely up to you.<br/>If you choose not to take part there won’t be any disadvantages for you and you will hear no more about it.  [If appropriate: Choosing not to take part will not affect your access to treatment or services in any way "


                                            + "In this study you will be presented with a few questions, and then you will be playing a game that will be presented to you online.<br/>The aim of the study is to look at the ways in which people learn to interact with a simple competitive gaming scenario <b>against another participants</b>. "
                                            + "The study will be divided into three phases, first you will be presented with a short series of questions, then you are given a brief period of time (5 minutes) to familiarise yourself with the game, and then you will play the game for approximately 5 minutes. At the end of the study you will be presented with a brief summary of the aims of the study, and if you want further details the contact details of the lead researcher included.  "
                                            + "The whole study should take no more than between <b>12-15 minutes</b> in total.  "

                                            + "<br/>This study has been approved by Queen Mary University of London Research Ethics Committee <b>QMREC1761.</b> "

                                            + "All information given in the study will be completely confidential and anonymous, in accordance to the Data Protection Act 1998. To ensure full anonymity, you will not be asked your name. You have the right to request your data be destroyed after the completion of the study. "
                                            + "<br/>If you have any queries about the study or any concerns regarding the ethical conduct of this study, <b>please email   d.o.verdugapalencia at qmul.ac.uk </b>"
                                            + "If you have any questions or concerns about the manner in which the study was conducted please, in the first instance, contact the researcher responsible for the study. <br/> If this is unsuccessful, or not appropriate, please contact the Secretary at the Queen Mary Ethics of Research Committee, Room W104, Queen’s Building, Mile End Campus, Mile End Road, London or research-ethics@qmul.ac.uk"
                                            + "</div>"
                                    }, {
                                        "type": "boolean",
                                        "name": "bool",
                                        "title": "Do you want to take part?",
                                        "label": "Are you 18 or older?",
                                        "isRequired": true
                                    }
                                ]
                        }


                        ,

                        {
                            title: "Demographics and  RTS expertise",
                            questions: [
                                {
                                    "type": "panel",
                                    "innerIndent": 1,
                                    "name": "panel1",
                                    "title": "Demographics",

                                    "elements": [
                                        {
                                            type: "radiogroup",
                                            name: "gender",
                                            isRequired: true,
                                            title: "What is your gender?",
                                            choices: ["Male", "Female", "Other", "Prefer not to say"]
                                        },
                                        {
                                            type: "text",
                                            name: "age",
                                            title: "What is your age?",
                                             isRequired: true,
                                            validators: [
                                                {
                                                    type: "numeric",
                                                    minValue: 16,
                                                    maxValue: 100
                                                }
                                            ]
                                        },
                                        {
                                            type: "dropdown",
                                            name: "education",
                                            isRequired: true,
                                            title: "What is the highest level of education you have completed?",
                                            choices: ["Other",
                                                "some high school",
                                                "high school graduate",
                                                "some college",
                                                "trade/technical/vocational training",
                                                "college graduate",
                                                "some posgraduate work",
                                                "post graduate degree"]
                                        }
                                    ]
                                },
                                {
                                    "type": "panel",
                                    "innerIndent": 1,
                                    "name": "panel2",
                                    "title": "Real Time Strategy expertise",

                                    "elements": [
                                        {
                                            type: "dropdown",
                                            name: "expertise",
                                            isRequired: true,
                                            title: "In case that you have you played Real Time Strategy Games (Games like StarCraft, Age of Empires, Halo Wars), which is your level of expertise? If you have not played any RTS Game, select novice.",
                                            choices: ["No, I’m novice.",
                                                "Yes, I consider myself a casual player.",
                                                "Yes, I consider myself a proficient player",
                                                "Yes, I consider myself an expert player"
                                            ]
                                        }
                                    ]
                                }

                            ]
                        }
                        ,

                        {
                            title: "Attitudes towards risk",
                            questions: [
                                {
                                    "type": "panel",
                                    "innerIndent": 1,
                                    "name": "panel1",
                                    "title": "Risk",

                                    "elements": [
                                        {
                                            type: "matrix",
                                            name: "AttRisk",
                                            title: "Please indicate if you agree or disagree with the following statements",

                                            isAllRowRequired: true,
                                            columns: [{
                                                value: 1,
                                                text: "I am risk averse"
                                            }, {
                                                value: 2,
                                                text: "I am moderately risk averse"
                                            }, {
                                                value: 3,
                                                text: "I am neither risk averse or risk seeking"
                                            }, {
                                                value: 4,
                                                text: "I am moderately risk seeking"
                                            }, {
                                                value: 5,
                                                text: "I am risk seeking"
                                            }],
                                            rows: [{
                                                value: "risklife", isRequired: true,
                                                text: "Which from the following options would you consider best characterises you overall as a attitude you have towards taking risks in life?"
                                            }, {
                                                value: "riskgames", isRequired: true,
                                                text: "Which from the following options would you consider best characterises your approach to taking risks when you are playing games online?"
                                            }, {
                                                value: "risksports", isRequired: true,
                                                text: "Which from the following options would you consider best characterises your approach to taking risks when you are playing sports?"
                                            }]
                                        }
                                    ]
                                }
                                ,
                                {
                                    type: "matrix",
                                    name: "AttRisk2",
                                    title: "Please indicate if you agree or disagree with the following statements",
                                    isAllRowRequired: true,
                                    columns: [{
                                        value: 1,
                                        text: "Strongly Disagree"
                                    }, {
                                        value: 2,
                                        text: "Disagree"
                                    }, {
                                        value: 3,
                                        text: "Neutral"
                                    }, {
                                        value: 4,
                                        text: "Agree"
                                    }, {
                                        value: 5,
                                        text: "Strongly Agree"
                                    }],
                                    rows: [{
                                        value: "risk1",
                                        text: "Compared to the average person, I would say I take more risks"
                                    }, {
                                        value: "risk2",
                                        text: "Before making a decision, I try to anticipate the factors that can influence the outcome."
                                    }, {
                                        value: "risk3",
                                        text: "I'm willing to take a risk in order to get the desired outcome."
                                    }, {
                                        value: "risk4",
                                        text: "I feel confident when I have to make a decision with an uncertain outcome."
                                    }, {
                                        value: "risk5",
                                        text: "I feel confident when I have to make a decision with limited information."
                                    }, {
                                        value: "risk6",
                                        text: "I can minimize the consequences of risk-taking by planning and preparing for each outcome."
                                    }]
                                }

                            ]
                        }
                        ,
            */

/**/
            {
                title: "",
                questions: [
                    {
                        "type": "panel",
                        "innerIndent": 1,
                        "name": "panel1",
                        "title": "Task Description",

                        "elements": [

                        {

                            type: "html",
                            name: "Description",
                            html:
                                "Now you have completed the first part of the study, you will now be presented with some instructions as to how to complete the main part.<br>You will have<b> 5 minutes </b>to familiarise yourself with what you have to do before the main task begins. The main task will last <b> 5 minutes </b>.<br> The game controls are the same in both practice session and main session of the study."+
                                " <h4>Instructions</h4>" +
                                "You will see an environment located in an alien planet, which might have useful resources that could be brought back to your control base." +
                                "<b>You will have a variable amount of explorer units under your command ( 1, 3 or 5)</b>. You will have an opportunity to direct them to particular locations in the scene, and their job is to collect resources and take them back to the base. <br>" +
                             "        <h4>Objective</h4>" +"The aim of the game is to <b>collect as many resources as possible</b>, and each resource that you bring back to base camp will be converted to money; this only applies to the main, and not the practice session.<br>" +
                                    "The resources are in the form of <b>big yellow boulders</b>, and the explorers can only carry <b>3 resources at a time</b>, each time you direct them to a boulder, even if there are more than 3 in that location, each explorer will only be able to pick 3 up at a time, they are automatically programmed to do this. Once they have done this, you follow the same instructions as before: You <b>right-click</b> over the unit you want to direct and then <b>left-click</b> the location you want them to go to (in this case the base camp). They will then go to that location and unload the resources they have collected. \n" +
                                    "Keep in mind that the alien planet is large, and there will be other resources that could be collected elsewhere. \n"
+
                                    "<h4>Controls</h4><b>Left-Click:</b> To direct your worker(s), all you need to do is move the mouse over the explorer (you can select more than one at a time, if you have several explorers) and left-click. <br/>You can also drag the mouse pointer over an area and all the explorers included in that area will be selected.<br/>" +
                                    "<b>Right Click:</b> Once you have done this, select the location in the scene that you want them to move to with a right-click.<br/>" +
                                    "<b>Directional Arrows:</b> You will be able to move the camera over the map, using the directional arrows in your keyboard.<br/" +
                                    "<b><b>Minimap:</b> The alien planet is large, so there are lots of places where there are potential resources for the explorers to collect.<br/>" +
                                    "You can use a minimap located in the bottom-left corner of the screen to help yourself in the navigation, clicking on a point in the map will relocate the camera over that location.<br/>" +

                                    " These are the only buttons you need to press while you are playing the online game. <br/><br/> <b>Please do not to switch between browser tabs or you will spend more time completing the experiment.<b>"



                        }
                        ]
                    }


                ]
            }




        ]
};

console.log(" experiment 1 , condition " + Game.conditionExperiment);
Survey
    .StylesManager
    .applyTheme("winterstone");
var survey = new Survey.Model(json);

survey.onComplete.add(function (result) {
    $('.sv_body.sv_completed_page').hide();
    $("body").css("overflow-y", "hidden");
     $(function () {
        Game.init();
        Game.surveyData = JSON.stringify(result.data);
         console.log("sending " + JSON.stringify(result.data ) );
    });
});

survey.render("surveyElement");
