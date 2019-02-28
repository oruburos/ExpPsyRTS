var json = {
    title: "Online Mini Gaming Tasks",
    showProgressBar: "top",
 
    pages: 
    
    [

        {
        title: "Part 2",
        questions: 
        [      
         {
            
            type: "html",
            name: "finishTutorial",
            html: " <h3>Finish tutorial</h3><b>The tutorial session has ended</b>Proceed to the real session. "       
        }
    ]
    }


]
};


Survey
.StylesManager
.applyTheme("winterstone");
var survey = new Survey.Model(json);

survey.onComplete.add(function(result) {
    console.log("initSreal");
    $('.sv_body.sv_completed_page').hide();
  //   document.querySelector('#surveyResult').innerHTML = "result: " + JSON.stringify(result.data);
     $(function(){
        Game.init();//fake, esto no jala
    });
});

survey.render("surveyElement");