/**
 * Person class. We store personal information and attitudePoints that reflect daily classroom job
 *
 * @constructor
 * @param {array} idPerson - Person id
 * @param {string} name - Person name
 * @param {string} surname - Person surname
 * @param {array} attitudeTasks - Person awarded AttitudeTasks array   
 * @param {array} gradedTasks - Person gradedTasks array
 * @tutorial pointing-criteria
 */

import {formatDate,popupwindow,hashcode,getElementTd,loadTemplate} from './utils.js';
import {context} from './context.js';
import AttitudeTask from './attitudetask.js';

const privateAddTotalPoints = Symbol('privateAddTotalPoints'); /** To accomplish private method */
const _totalPoints = Symbol('TOTAL_POINTS'); /** To acomplish private property */

class Person {
  constructor(idPerson,name,surname,attitudeTasks,gradedTasks) {
    this[_totalPoints] = 0;
    this.name = name;
    this.surname = surname;
    this.idPerson = idPerson;
    this.attitudeTasks = attitudeTasks;
    this.gradedTasks = gradedTasks;

    this.attitudeTasks.forEach(function (itemAT) {
      this[_totalPoints] += parseInt(itemAT['task'].points);
    }.bind(this));
    this.gradedTasks.forEach(function (itemGT) {
      this[_totalPoints] += parseInt(itemGT.points);
    }.bind(this));
  }

  /** Add points to persons we should carefully use it. */
  [privateAddTotalPoints] (points) {
    if (!isNaN(points)) {
      this[_totalPoints] += points;
      context.getTemplateRanking();
    }
  }

  /** Read person _totalPoints. A private property only modicable inside person instance */
  getTotalPoints() {
    return this[_totalPoints];
  }

  /** Add a gradded task linked to person with its own mark. */
  addGradedTask(taskInstance) {
    this.gradedTasks.push({'task':taskInstance,'points':0});
  }

  /** Add a Attitude task linked to person with its own mark. */
  addAttitudeTask(taskInstance) {
    this.attitudeTasks.push({'task':taskInstance});
    this[privateAddTotalPoints](parseInt(taskInstance.points));
    context.notify('Added ' + taskInstance.description + ' to ' + this.name + ',' + this.surname);
  }

  /** Renders HTML person view Create a table row (tr) with
   *  all name, attitudePoints , add button and one input for 
   * every gradded task binded for that person. */
  getHTMLView() {
    let liEl = document.createElement('tr');
    liEl.className='trTable';

    let aDelete = document.createElement('a');
    aDelete.className = 'btnDelete';
    aDelete.href = '#deleteStudent';
    liEl.appendChild(getElementTd(aDelete));
    
    let aEdit = document.createElement('a');
    aEdit.className = 'btnEditStudent';    
    aEdit.href = '#editStudent';
    liEl.appendChild(getElementTd(aEdit));
    
    /**Delete a student*/
    aDelete.addEventListener('click', () => {
      console.log(context.students);
      var r = confirm('Are you sure you want to delete the user ' + this.name + ' ' + this.surname + '?');
      if (r == true) {
        var removeStudent = context.students.map(function(item) { return item.idPerson; }).indexOf(this.idPerson);
        context.students.splice(removeStudent, 1);
        localStorage.setItem('students',JSON.stringify(context.students));
        context.getTemplateRanking();
      }
    });

    /**Edit a student*/
    aEdit.addEventListener('click', () => {
      let callback = function(responseText) {
        let saveStudent = document.getElementById('newStudent');
        let name = document.getElementById('idFirstName');
        let surnames = document.getElementById('idSurnames');
        name.value = this.name;
        surnames.value = this.surname;

        saveStudent.addEventListener('submit', () => {
          name = document.getElementById('idFirstName').value;
          surnames = document.getElementById('idSurnames').value;
          for (var i in context.students) {
            if (context.students[i].idPerson == this.idPerson) {
              context.students[i].name = name;
              context.students[i].surname = surnames;
              context.students[i].idPerson = hashcode(name+surnames);
              break;
            }
          }
          localStorage.setItem('students',JSON.stringify(context.students));
        });
      }.bind(this);
      
      loadTemplate('templates/addStudent.html',callback);
      
    });
      
    
    let detailsBtn = document.createElement('a');
    detailsBtn.className='btnDetailsStudent';
    detailsBtn.href = '#detailStudent';
    detailsBtn.id = 'details-'+this.idPerson;
    
    let esEL = getElementTd(this.surname + ', ' + this.name);
    esEL.className='celdaNameStudent';
    /**Details of student*/
    esEL.addEventListener('click', () => {
      loadTemplate('templates/detailStudent.html',function(responseText) {
        let STUDENT = this;
        let ATTITUDE_TASKS = '';
        this.attitudeTasks.reverse().forEach(function(atItem) {
          ATTITUDE_TASKS += '<li>' + atItem.task.points + '->' +
                        atItem.task.description + '->' + formatDate(new Date(atItem.task.datetime)) + '</li>';
        });
        let GRADED_TASKS = '';
        this.gradedTasks.forEach(function(gtItem) {
          GRADED_TASKS += '<li>' + gtItem.points + '->' +
                        gtItem.task.name + '->' + formatDate(new Date(gtItem.task.datetime)) + '</li>';
        });
        document.getElementById('content').innerHTML = eval('`' + responseText + '`');
      }.bind(this));
    });
    detailsBtn.appendChild(esEL);
    liEl.appendChild(detailsBtn);

    liEl.appendChild(getElementTd(this[_totalPoints]));

    let addAttitudeTaskEl = document.createElement('button');
    addAttitudeTaskEl.className='button_attitude';    
    let tb = document.createTextNode('+XP');
    addAttitudeTaskEl.appendChild(tb);

    liEl.appendChild(getElementTd(addAttitudeTaskEl));

    /**Open popUp to add Attitude Tasks*/
    addAttitudeTaskEl.addEventListener('click', () => {
          let popUp = popupwindow('templates/listAttitudeTasks.html','XP points to ' +
                                   this.name,300,430);
          let personInstance = this;
          popUp.onload = function() {
            popUp.document.title = personInstance.name + ' ' +
                                  personInstance.surname + ' XP points';
            let xpButtons = popUp.document.getElementsByClassName('xp');
            Array.prototype.forEach.call(xpButtons,function(xpBItem) {
              xpBItem.addEventListener('click', () => {
                popUp.close();
                personInstance.addAttitudeTask(new AttitudeTask('XP task',
                                          xpBItem.innerHTML,xpBItem.value));
              });
            });
            let xpnegButtons = popUp.document.getElementsByClassName('xp-neg');
            Array.prototype.forEach.call(xpnegButtons,function(xpBItem) {
              xpBItem.addEventListener('click', () => {
                popUp.close();
                personInstance.addAttitudeTask(new AttitudeTask('XP task',
                                          xpBItem.innerHTML,xpBItem.value));
              });
            });
          };
        });

    let that = this;

    this.gradedTasks.forEach(function(gTaskItem) {
        let inputEl = document.createElement('input');
        inputEl.type = 'number';
        inputEl.min = 0;
        inputEl.max = 100;
        inputEl.value = gTaskItem['points'];
        inputEl.addEventListener('change', function(event) {
            that[privateAddTotalPoints](parseInt(gTaskItem['points'] * (-1)));
            gTaskItem['points'] = inputEl.value;
            that[privateAddTotalPoints](parseInt(gTaskItem['points']));
          });
        liEl.appendChild(getElementTd(inputEl));
      });

    return liEl;
  }

/** Get the details of the student. Not used because is not working properly*/
  getDetails(){
    let callback = function(responseText) {
      let STUDENT = this;
      let ATTITUDE_TASKS = '';
      this.attitudeTasks.reverse().forEach(function(atItem) {
        ATTITUDE_TASKS += '<li>' + atItem.task.points + '->' +
                      atItem.task.description + '->' + formatDate(new Date(atItem.task.datetime)) + '</li>';
      });
      let GRADED_TASKS = '';
      this.gradedTasks.forEach(function(gtItem) {
        GRADED_TASKS += '<li>' + gtItem.points + '->' +
                      gtItem.task.name + '->' + formatDate(new Date(gtItem.task.datetime)) + '</li>';
      });
      document.getElementById('content').innerHTML = eval('`' + responseText + '`');
    }.bind(this);

    loadTemplate('templates/detailStudent.html',callback);
    
  }
}

export default Person;
