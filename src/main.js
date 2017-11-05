'use strict';

import {context} from './context.js';


/** Once the page is loaded we get a context app object an generate students rank view. */
window.onload = function() {
  //context.initMenu();
  context.getTemplateRanking();

  location.hash='';
  window.onhashchange = hashChange;     
  
  function hashChange(){
    switch(location.hash){
      case '#addStudent':
        context.addPerson();
        break;
      case '#addGradedTask':
        context.addGradedTask();
        break;
      case '#detailStudent':
        context.getDetails();
        break;
    }
  }
};

  //switch(window.location.hash)




/*window.onclick(function(e) {
  alert(e.target.id); // gives the element's ID 
  alert(e.target.className); // gives the elements class(es)
});*/



//2 points context.students conversion and app adaptation from array to Map
//2 points basic routing mechanism
//2 point CRUD student
//1 points CRUD gradedtasks
//1 point jsdoc3 documentacion up to date acording to changes
//1 point worthy css
//1 more visible graded tasks feature implemented. A button to show one mode gradedtasks. We are
//able to see the last one when we create ranking list

//Optional --> 2 point remove any createElement present in code (All tag generation templated bases)
//SUPER GREAT: Implement a ng-repeat attribute inside basic template system (2 points more in the
//1st term final mark)

//this.attiudeTask.reverse.forEach()


//window.onhashchange(){

//switch(window.location.hash)
//}