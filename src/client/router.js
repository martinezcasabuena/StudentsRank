import {context} from './context.js'; //Singleton
import {popupwindow,getIdFromURL,setCookie} from './lib/utils.js';
import {logout} from './menu.js';
import AttitudeTask from './classes/attitudetask.js';
import GradedTask from './classes/gradedtask.js';
import Person from './classes/person.js';


/** Primitive routing mechanism based on detecting clicks on links and get the URL */
function initRouter() {
  window.onclick = function(e) {
        e = e || event;
        var isLink = findParent('a',e.target || e.srcElement);
        if (isLink) {
          switch (true) {
            /** View Student information detail */
            case /#student/.test(isLink.href):
              let personInstance = context.getPersonById(getIdFromURL(isLink.href));
              personInstance.getHTMLDetail();
              break;
            /** Modify student information */
            case /#editStudent/.test(isLink.href):
              personInstance = context.getPersonById(getIdFromURL(isLink.href));
              personInstance.getHTMLEdit();
              break;
            /** Delete student with confirmation */
            case /#deleteStudent/.test(isLink.href):
              if (window.confirm('Are you sure?')) {
                context.students.delete(parseInt(getIdFromURL(isLink.href)));
                context.getTemplateRanking();
              }
              break;
            /** Show popup associated to an student in order to assign XP points  */
            case /#addXP/.test(isLink.href):
              personInstance = context.getPersonById(getIdFromURL(isLink.href));
              AttitudeTask.addXP(personInstance);
              break;
            /** Add new student form */
            case /#addStudent/.test(isLink.href):
              Person.addPerson();
              break;
            case /#settings/.test(isLink.href):
              context.settings();
              break;
            /** logout */
            case /#logout/.test(isLink.href):
              logout();
              break;
            /** Button to show a one more graded task on ranking table list */
            case /#MoreGradedTasks/.test(isLink.href):
              $('.tableGradedTasks').toggle();
              $("#iMoreGradedTasks").toggleClass('fa fa-hand-o-right fa-1x fa fa-hand-o-down fa-1x');
              let classNameMoreGradedTasks = $("#iMoreGradedTasks").attr('class');
              setCookie('classNameMoreGradedTasks',classNameMoreGradedTasks);
              break;
            /** Add new Graded Task form */
            case /#addGradedTask/.test(isLink.href):
              GradedTask.addGradedTask();
              break;
            case /#detailGradedTask/.test(isLink.href):
              let gtInstance = context.getGradedTaskById(getIdFromURL(isLink.href));
              gtInstance.getHTMLEdit();
              break;
            default:
              context.isLogged();
          }
        }
    };
}

/** find first parent with tagName [tagname] so nested links <a> are triggered too */
function findParent(tagname,el) {
  while (el) {
    if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()) {
      return el;
    }
    el = el.parentNode;
  }
  return null;
}

export {initRouter};
