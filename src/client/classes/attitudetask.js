import Task from './task.js';
import {saveAttitudeTasks} from '../dataservice.js';
import {context} from '../context.js';
import {template} from '../lib/templator';
import {hashcode} from '../lib/utils.js';

/**
 * AttitudeTask class. Create a attitude task in order to be
 * assigned to an individual or group of students. This could be for
 * example , participative attitude at class. Point a good 
 * question in class. Be the first finishing some exercise ...
 * 
 * @constructor
 * @param {string} name - task name
 * @param {string} description - task description
 * @param {string} points - task points associated to that behaviour
 * @param {number} uses - task number of uses

 * @tutorial pointing-criteria
 */

import {popupwindow,loadTemplate} from '../lib/utils.js';

class AttitudeTask extends Task {
  constructor(name,description,points,uses,id) {
    super(name,description,id);
    this.points = points;
    this.uses = uses;
    this.id = id;
  }

  /** Open window dialog associated to a person instance and let us award him with some XP points */
  static addXP(personInstance) {
    let scope = {};
    let arrayFromMap = [...context.attitudeTasks.entries()];
    arrayFromMap.sort(function(a,b) {
      return (b[1].uses - a[1].uses);
    });

    scope.TPL_ATTITUDE_TASKS = arrayFromMap;
  
    let callback = function(responseText) {
      let out = template(responseText,scope);
      $('#content').html($('#content').html() + eval('`' + out + '`'));
      $('#XPModal').modal('toggle');
      $('.xp').each(function(index) {
        $(this).click(function() {
          $('#XPModal').modal('toggle');
          $('.modal-backdrop').remove();
          //console.log(this.id);
          let atTaskInstance = context.getAttitudeTaskById(this.id);
          atTaskInstance.uses += 1;
          //console.log(atTaskInstance);

          context.attitudeTasks.set(atTaskInstance.getId(),atTaskInstance);
          saveAttitudeTasks(JSON.stringify([...context.attitudeTasks]));
          
          personInstance.addAttitudeTask(new AttitudeTask('XP task',
          $(this).val(),$(this).attr('value')));
          context.getTemplateRanking();
          
        });
      });

      $('#newAttitudeTask').submit(() => {
        addTask(personInstance);
      });
    }
    loadTemplate('templates/listAttitudeTasks.2.html',callback);
  }
}

function getId() {
  return this.id;
}

function addTask(personInstance) {
  let points = $('#points').val();
  let description = $('#text').val();
  let datetime = new Date();
  let id = hashcode(description + datetime);
  
  let attitudetask = new AttitudeTask(description,description,points,1,id);
  if (context) {
    context.attitudeTasks.set(id,attitudetask);
    saveAttitudeTasks(JSON.stringify([...context.attitudeTasks]));
    //personInstance.addAttitudeTask(new AttitudeTask('XP task', description,points));
    personInstance.addAttitudeTask(attitudetask);
    
    context.getTemplateRanking();
  }
  return false; //Avoid form submit*/
}

export default AttitudeTask;
