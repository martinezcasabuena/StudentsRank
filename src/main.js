'use strict';

import {context} from './context.js';


/** Once the page is loaded we get a context app object an generate students rank view. */
window.onload = function() {
  context.getTemplateRanking();

  location.hash='';
  
  window.onhashchange = hashChange;     
  
  /**Function to execute the functions depending on the location.hash content*/
  function hashChange(){
    switch(location.hash){
      case '#addStudent':
        context.addPerson();
        break;
      case '#addGradedTask':
        context.addGradedTask();
        break;
      case '#detailStudent':
        //context.getDetails();
        break;
    }
  }
};