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
    this.students = [
        /*new Person("Paco", "Vañó", 5),
        new Person("Lucia", "Botella", 10),
        new Person("German", "Ojeda", 3),
        new Person("Salva", "Peris", 1),
        new Person("Oscar", "Carrion", 40)*/
    ];
    this.gradedTasks = [];
    this.getStudents();
    this.getTasks();

  }

  initContext(){
    let addTask =document.getElementById('addGradedTask');
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

            let headerString = '<tr><td colspan=\'3\'></td>';
            that.gradedTasks.forEach(function(taskItem) {
                headerString+='<td>' + taskItem.name + '</td>';
            });
            studentsEl.innerHTML = headerString;
            that.students.forEach(function(studentItem) {
                let liEl = studentItem.getHTMLView();
                studentsEl.appendChild(liEl);
            });
        };
        loadTemplate('templates/ranking.html',callback);
    }

    getStudents(){
        let that = this;
        let savedStudents = JSON.parse(localStorage.getItem('students'));

        for (let i in savedStudents) { //for each
            let student = new Person(savedStudents[i].name,savedStudents[i].surname,savedStudents[i].points,savedStudents[i].gradedTasks);
            this.students.push(student);
        }
    }

    getTasks(){
        let that = this;
        let savedTasks = JSON.parse(localStorage.getItem('tasks'));
        //console.log(savedTasks);

        for (let i in savedTasks) { //for each
            let task = new GradedTask(savedTasks[i].name);
            this.gradedTasks.push(task);
        }
    }

    addNewStudent(){
        let that = this;
        let callback = function(responseText) {
            let saveStudent = document.getElementById('saveStudent');
            saveStudent.addEventListener('click',() => {
                let studentName = document.getElementById('studentName').value;
                let studentLastName = document.getElementById('studentLastName').value;
                let newStudent = new Person(studentName,studentLastName, 0, []);
                if (that.gradedTasks.length != 0){
                    that.gradedTasks.forEach(function(taskItem) {
                        newStudent.addGradedTask(taskItem);
                    });
                }
                that.students.push(newStudent);
                localStorage.setItem('students', JSON.stringify(that.students));
            });
        };
        loadTemplate('templates/formUser.html',callback);
    }

/** Create a form to create a GradedTask that will be added to every student */
   addGradedTask(){
       let that = this;
       let callback = function(responseText) {
           let addTask = document.getElementById('saveTask');
           addTask.addEventListener('click',() => {
               let taskName = document.getElementById('taskName').value;
               let newTask = new GradedTask(taskName);
               that.gradedTasks.push(newTask);
               console.log(that.gradedTasks);
               that.students.forEach(function(studentItem) {
                   studentItem.addGradedTask(newTask);
                });
                localStorage.setItem('students', JSON.stringify(that.students));
                localStorage.setItem('tasks', JSON.stringify(that.gradedTasks));
                that.getRanking();
            });
        };
        loadTemplate('templates/formTask.html',callback);
    }
}

export let context = new Context();
