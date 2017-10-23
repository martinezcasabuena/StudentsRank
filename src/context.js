/**
 * Context class. Devised to control every element involved in the app: students, gradedTasks ...
 *
 * @constructor
 * @tutorial pointing-criteria
 */

import Person from './person.js';
import GradedTask from './gradedtask.js';
import {hashcode,getElementTd,loadTemplate} from './utils.js';

class Context {

  constructor() {
    this.students = [];
    this.gradedTasks = [];
    this.getStudents();
    this.getTasks();

  }

  initContext(){
    let addTask = document.getElementById('addGradedTask');
    addTask.addEventListener('click', () => {
          this.addGradedTask();
    });

    let addStudent = document.getElementById('addStudent');
    addStudent.addEventListener('click',() => {
        this.addNewStudent();
    });
  }

  /** Draw Students rank table in descendent order using points as a criteria */
  getRanking(){
        let that = this;
        this.students.sort(function(a, b) {
            return (b.points - a.points);
        });

        let callback = function(responseText) {
            let studentsEl = document.getElementById('llistat');
            while (studentsEl.firstChild) {
                studentsEl.removeChild(studentsEl.firstChild);
            }

            let headerString = '<tr align=\'center\'><td colspan=\'3\'></td>';
            that.gradedTasks.forEach(function(taskItem) {
                headerString+='<td align=\'center\'>' + taskItem.name + '</td>';
            });
            studentsEl.innerHTML = headerString;
            that.students.forEach(function(studentItem) {
                let liEl = studentItem.getHTMLView();
                studentsEl.appendChild(liEl);
            });
        };
        loadTemplate('templates/ranking.html',callback);
    }

    /** Get the students from the local storage */
    getStudents(){
        let that = this;
        let savedStudents = JSON.parse(localStorage.getItem('students'));

        for (var i in savedStudents) {
            let student = new Person(savedStudents[i].name,savedStudents[i].surname,savedStudents[i].points,savedStudents[i].gradedTasks);
            this.students.push(student);
        }
    }

    /** Get the tasks from the local storage */
    getTasks(){
        let that = this;
        let savedTasks = JSON.parse(localStorage.getItem('tasks'));

        for (var i in savedTasks) {
            let task = new GradedTask(savedTasks[i].name);
            this.gradedTasks.push(task);
        }
    }

    /** Creates a new student and saves it on local storage */
    addNewStudent(){
        let that = this;
        let callback = function(responseText) {
            let saveStudent = document.getElementById('saveStudent');
            let btnCancel = document.getElementById('btnCancel');

            saveStudent.addEventListener('click',() => {
                let studentName = document.getElementById('studentName').value;
                let studentLastName = document.getElementById('studentLastName').value;

                if((studentName !== "") && (studentLastName !== "")){
                    let newStudent = new Person(studentName,studentLastName, 0, []);
                    if (that.gradedTasks.length != 0){
                        that.gradedTasks.forEach(function(taskItem) {
                            newStudent.addGradedTask(taskItem);
                        });
                    }
                    that.students.push(newStudent);
                    localStorage.setItem('students', JSON.stringify(that.students));
                }
            });

            btnCancel.addEventListener('click',() => {
                that.getRanking();
            });
        };
        //Launch the form an execute the callback
        loadTemplate('templates/formUser.html',callback);
    }

    /** Creates a GradedTask and saves it on local storage */
    addGradedTask(){
       let that = this;
       let callback = function(responseText) {
           let addTask = document.getElementById('saveTask');
           let btnCancel = document.getElementById('btnCancel');
           
           addTask.addEventListener('click',() => {
               let taskName = document.getElementById('taskName').value;

               if(taskName !== ""){
                   let newTask = new GradedTask(taskName);
                   that.gradedTasks.push(newTask);
                   that.students.forEach(function(studentItem) {
                       studentItem.addGradedTask(newTask);
                    });
                 localStorage.setItem('students', JSON.stringify(that.students));
                 localStorage.setItem('tasks', JSON.stringify(that.gradedTasks));
                 that.getRanking();
               }
            });

            btnCancel.addEventListener('click',() => {
                that.getRanking();
            });
        };
        //Launch the form an execute the callback
        loadTemplate('templates/formTask.html',callback);
    }
}

export let context = new Context();
