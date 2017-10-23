/**
 * Person class. We store personal information and points that reflect daily classroom job
 *
 * @constructor
 * @param {string} name - Person name
 * @param {string} surname - Person surname
 * @param {number} points - Person total points 
 * @param {array} gradedTasks - Person graded tasks
 * @tutorial pointing-criteria
 */ 
 
 import {hashcode,getElementTd} from './utils.js';
 import {context} from './context.js';

class Person {
  constructor(name,surname,points,gradedTasks) {
    this.name = name;
    this.surname = surname;
    this.points = points;
    this.gradedTasks = gradedTasks;    
  }    
  
  /** Add points to persons we should carefully use it. */
  addPoints(points) {
        this.points += points;
        localStorage.setItem("students", JSON.stringify(context.students));                
  }
  /** Add a gradded task linked to person with its own mark. */
  addGradedTask(taskInstance) {
        this.gradedTasks.push({"task":taskInstance,"points":0});
        context.getRanking();
  }
  /** Renders HTML person view Create a table row (tr) with all name, points , add button and one input for every gradded task binded for that person. */
  getHTMLView() {
    var liEl = document.createElement("tr");

    liEl.appendChild(getElementTd(this.surname + ", " + this.name));

    liEl.appendChild(getElementTd(this.points));    
    
    var addPointsEl = document.createElement("button");
    addPointsEl.className='button_attitude';
    var tb = document.createTextNode("+20");
    addPointsEl.appendChild(tb);

    liEl.appendChild(getElementTd(addPointsEl));

    addPointsEl.addEventListener("click", () => {
          this.addPoints(20);
          setTimeout(function(){
            context.getRanking()}.bind(this),1000);
    });

    let that = this;
    //this.calculatedPoints = 0;
    this.gradedTasks.forEach(function(taskItem) {
        let inputEl = document.createElement("input");    
        inputEl.type = "number";inputEl.min=0;inputEl.max = 100;  
        inputEl.value = taskItem["points"];

        inputEl.addEventListener("change", function(event) {
          that.addPoints(parseInt(taskItem["points"])*(-1));
          taskItem["points"] = inputEl.value;
          that.addPoints(parseInt(taskItem["points"]));
          localStorage.setItem("students", JSON.stringify(context.students));        
          context.getRanking();
      });
      liEl.appendChild(getElementTd(inputEl));
    });
    return liEl;
  }
}

export default Person;